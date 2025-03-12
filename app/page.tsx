import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { projectsData, skillsData } from "@/lib/data"

export default function Home() {
  // Get featured projects
  const featuredProjects = projectsData.filter((project) => project.featured)

  // Get expert skills
  const expertSkills = skillsData.filter((skill) => skill.proficiency === "expert")

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero section */}
      <section className="relative pt-16 md:pt-24 lg:pt-32 hero-gradient">
        <div className="container flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.15),transparent_50%)]" />

          <Image
            src="face.png"
            alt="Profile"
            width={150}
            height={150}
            className="aspect-square rounded-full border-4 border-background bg-background shadow-xl object-cover"
            priority
          />

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="gradient-text">Noah Andersen-Kiel</span>
          </h1>

          <p className="mt-4 text-xl text-muted-foreground md:w-3/4 lg:w-2/3">
            Recent Computer Science graduate with a broad interest in IT systems and data technologies, driven by a passion for
            solving complex technical challenges and continuous learning.
          </p>

          <div className="mt-8 flex gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-primary via-accent to-pink-500 hover:from-primary/90 hover:to-pink-500/90 border-none"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild className="cyberpunk-border border">
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Link href="https://github.com/Arctic1879" target="_blank" rel="noopener noreferrer">
              <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://www.linkedin.com/in/noah-andersen-kiel-034585221/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="mailto:aknoah0@gmail.com">
              <Mail className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="section-container">
        <h2 className="section-title">About Me</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p>
              I discovered my passion for Computer Science during my junior year after experiencing R programming in a Biostatistics course. This pivotal moment led me to switch majors, diving headfirst into the world of programming, AI, and data analysis. Since then, I've embraced every opportunity to learn new languages, frameworks, and technologies.
            </p>
            <p>
              My academic journey has been diverse and impactful. Beyond my coursework, I've taken on leadership roles that have shaped my professional development. As a Python course teaching assistant, I helped fellow students grasp programming fundamentals. I also authored research on AI in education that was accepted to the FIE 2024 conference. My leadership experience extends to serving as president of Butler University Esports, where I managed large-scale operations, overseeing finances and coordinating communications across a network of hundreds of students, faculty, and partner organizations.
            </p>
            <p>
              I'm particularly passionate about artificial intelligence and its implications for the future of technology. I was invited to lead a discussion with Butler University's leadership about generative AI's impact on education, sharing insights from my hands-on experience with these emerging technologies. I thrive on exploring new challenges and contributing to meaningful technological advancement.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top Skills</h3>
            <div className="flex flex-wrap gap-3">
              {expertSkills.map((skill) => (
                <span key={skill.name} className="skill-tag skill-tag-expert">
                  {skill.name}
                </span>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button asChild>
                <Link href="/skills" className="flex items-center gap-1 text-primary hover:text-primary/90">
                  View all skills <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects section */}
      <section className="section-container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden card-hover cyberpunk-glow">
              <div className="aspect-video relative">
                <Image
                  src={project.image || "/placeholder.svg?height=600&width=800"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="bg-gradient-to-r from-primary/20 to-accent/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.demoUrl && (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none h-8 text-sm px-3"
                    >
                      <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </Link>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild className="cyberpunk-border border h-8 text-sm px-3">
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            asChild
            className="bg-gradient-to-r from-primary via-accent to-pink-500 hover:from-primary/90 hover:to-pink-500/90 border-none"
          >
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

