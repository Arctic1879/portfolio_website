import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { certificateData, educationData, onlineCoursesData } from "@/lib/data"
import Link from "next/link"
import { ExternalLink, CheckCircle, Clock } from "lucide-react"

export default function EducationPage() {
  return (
    <div className="section-container">
      <h1 className="section-title">Education & Learning</h1>

      {/* Formal Education section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Academic Background</h2>
        <div className="grid gap-6">
          {educationData.map((education, index) => (
            <Card key={index} className="card-hover cyberpunk-glow overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h3 className="text-xl font-semibold">{education.degree}</h3>
                    <p className="text-lg text-muted-foreground">{education.institution}</p>
                    <p className="text-sm text-muted-foreground">{education.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{education.date}</p>
                    {education.gpa && <p className="text-sm text-muted-foreground">GPA: {education.gpa}</p>}
                  </div>
                </div>
                <p className="mt-4">{education.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Online Courses section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Online Courses & Continuous Learning</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {onlineCoursesData.map((course, index) => (
            <Card key={index} className="card-hover cyberpunk-glow overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  {course.completed ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/50">
                      <Clock className="h-3 w-3" /> In Progress
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-muted-foreground">{course.platform}</p>
                      {course.instructor && (
                        <p className="text-sm text-muted-foreground">Instructor(s): {course.instructor}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{course.date}</p>
                  </div>
                  <p className="text-sm">{course.description}</p>
                  {course.url && (
                    <div className="pt-2">
                      <Link
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Course <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificates section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Certificates & Credentials</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificateData.map((certificate, index) => (
            <Card key={index} className="card-hover cyberpunk-glow overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{certificate.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <p className="text-muted-foreground">{certificate.issuer}</p>
                  <p className="text-sm text-muted-foreground">{certificate.date}</p>
                </div>
                {certificate.url && (
                  <div className="mt-4">
                    <Link
                      href={certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Certificate <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

