"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import { projectsData } from "@/lib/data"

// Get unique tags from all projects
const allTags = Array.from(new Set(projectsData.flatMap((project) => project.tags))).sort()

export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Filter projects by selected tag
  const filteredProjects = selectedTag
    ? projectsData.filter((project) => project.tags.includes(selectedTag))
    : projectsData

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                {project.demoUrl && (
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
                  >
                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button size="sm" variant="outline" asChild className="cyberpunk-border p-0 h-9 w-9">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">View on GitHub</span>
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found with the selected tag.</p>
          <Button variant="link" onClick={() => setSelectedTag(null)} className="mt-2">
            View all projects
          </Button>
        </div>
      )}
    </div>
  )
}

