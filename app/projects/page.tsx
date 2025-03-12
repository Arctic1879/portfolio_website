"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import { type Project } from "@/lib/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags))).sort()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/data/projects")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects by selected tag
  const filteredProjects = selectedTag
    ? projects.filter((project) => project.tags.includes(selectedTag))
    : projects

  if (isLoading) {
    return <div className="section-container">Loading...</div>
  }

  return (
    <div className="section-container">
      <h1 className="section-title">Projects</h1>

      {/* Filter by tags */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
            className={
              selectedTag === null ? "bg-gradient-to-r from-primary to-accent border-none" : "cyberpunk-border"
            }
          >
            All Projects
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className={
                selectedTag === tag ? "bg-gradient-to-r from-primary to-accent border-none" : "cyberpunk-border"
              }
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project) => (
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
                  <Badge key={tag} variant="outline" className="cyberpunk-border">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {project.demoUrl && (
                  <Button asChild variant="default" size="sm" className="bg-gradient-to-r from-primary to-accent border-none">
                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      View Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button size="sm" variant="outline" asChild className="cyberpunk-border p-0 h-8 w-8">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">View on GitHub</span>
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

