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

      {/* Certificates */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Certificates</h2>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <Card key={cert.name} className="card-hover cyberpunk-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground mt-1">{cert.date}</p>
                  </div>
                  {cert.url && (
                    <Button asChild variant="outline" size="sm" className="cyberpunk-border">
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

      {/* Online Courses */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Online Courses</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.name} className="card-hover cyberpunk-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      {course.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {course.platform}
                      {course.instructor && ` • ${course.instructor}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.startDate}
                      {course.endDate && ` - ${course.endDate}`}
                    </p>
                    <p className="text-muted-foreground">{course.description}</p>
                  </div>
                  {course.url && (
                    <Button asChild variant="outline" size="sm" className="cyberpunk-border">
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
      </section>
    </div>
  )
}

