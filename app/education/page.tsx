import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Clock } from "lucide-react"
import { type Education, type Certificate, type OnlineCourse } from "@/lib/types"
import { headers } from 'next/headers'

async function getData() {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const [educationRes, certificatesRes, coursesRes] = await Promise.all([
    fetch(`${protocol}://${host}/api/data/education`, { 
      next: { revalidate: 3600 },
      headers: Object.fromEntries(headersList.entries())
    }),
    fetch(`${protocol}://${host}/api/data/certificates`, { 
      next: { revalidate: 3600 },
      headers: Object.fromEntries(headersList.entries())
    }),
    fetch(`${protocol}://${host}/api/data/courses`, { 
      next: { revalidate: 3600 },
      headers: Object.fromEntries(headersList.entries())
    })
  ])

  if (!educationRes.ok || !certificatesRes.ok || !coursesRes.ok) {
    throw new Error("Failed to fetch data")
  }

  const [education, certificates, courses] = await Promise.all([
    educationRes.json(),
    certificatesRes.json(),
    coursesRes.json()
  ])

  return {
    education: education as Education[],
    certificates: certificates as Certificate[],
    courses: courses as OnlineCourse[]
  }
}

export default async function EducationPage() {
  const { education, certificates, courses } = await getData()

  // Group certificates by platform
  const courseraCertificates = certificates.filter(cert => 
    cert.issuer.toLowerCase().includes('coursera')
  )
  const otherCertificates = certificates.filter(cert => 
    !cert.issuer.toLowerCase().includes('coursera')
  )

  // Group courses by platform
  const platformGroups = courses.reduce((groups, course) => {
    const platform = course.platform
    if (!groups[platform]) {
      groups[platform] = []
    }
    groups[platform].push(course)
    return groups
  }, {} as Record<string, OnlineCourse[]>)

  return (
    <div className="section-container">
      <h1 className="section-title">Education & Certifications</h1>

      {/* Formal Education */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Formal Education</h2>
        <div className="space-y-6">
          {education.map((edu) => (
            <Card key={edu.degree} className="card-hover cyberpunk-glow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-muted-foreground mb-2">{edu.institution}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>{edu.location}</span>
                  <span>•</span>
                  <span>{edu.date}</span>
                  {edu.gpa && (
                    <>
                      <span>•</span>
                      <span>GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
                <p>{edu.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Coursera Certificates */}
      {courseraCertificates.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Professional Certificates</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {courseraCertificates.map((cert) => (
              <Card key={cert.name} className="card-hover cyberpunk-glow">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                      <p className="text-muted-foreground mb-4">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">{cert.date}</p>
                    </div>
                    {cert.url && (
                      <Button asChild variant="outline" size="sm" className="cyberpunk-border mt-4">
                        <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                          View Certificate
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Other Certificates and Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Additional Learning</h2>
        
        {/* Other Certificates */}
        {otherCertificates.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Other Certifications</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherCertificates.map((cert) => (
                <Card key={cert.name} className="card-hover cyberpunk-glow">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground">{cert.date}</p>
                      </div>
                      {cert.url && (
                        <Button asChild variant="outline" size="sm" className="cyberpunk-border mt-2">
                          <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                            View
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Courses by Platform */}
        {Object.entries(platformGroups).map(([platform, platformCourses]) => (
          <div key={platform} className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              {platform === 'DataCamp' ? 'DataCamp Learning Paths' : platform}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformCourses.map((course) => (
                <Card key={course.name} className="card-hover cyberpunk-glow">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{course.name}</h4>
                          {course.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {course.instructor && (
                          <p className="text-sm text-muted-foreground mb-1">{course.instructor}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {course.startDate}
                          {course.endDate && ` - ${course.endDate}`}
                        </p>
                      </div>
                      {course.url && (
                        <Button asChild variant="outline" size="sm" className="cyberpunk-border mt-2">
                          <Link href={course.url} target="_blank" rel="noopener noreferrer">
                            View Course
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

