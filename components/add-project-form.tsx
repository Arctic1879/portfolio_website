"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Project } from "@/lib/data"
import { X } from "lucide-react"

interface AddProjectFormProps {
  onAddProject: (project: Project) => void
}

export default function AddProjectForm({ onAddProject }: AddProjectFormProps) {
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    tags: [],
    featured: false,
    image: "/placeholder.svg?height=600&width=800",
  })

  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !newProject.tags.includes(tagInput.trim())) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter((t) => t !== tag),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProject.title.trim() && newProject.description.trim()) {
      onAddProject({
        ...newProject,
        id: `project-${Date.now()}`,
      })
      setNewProject({
        title: "",
        description: "",
        tags: [],
        featured: false,
        image: "/placeholder.svg?height=600&width=800",
      })
    }
  }

  return (
    <Card className="cyberpunk-glow">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="e.g., E-commerce Platform"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe your project..."
              rows={4}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-image">Image URL (optional)</Label>
            <Input
              id="project-image"
              value={newProject.image}
              onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-demo">Demo URL (optional)</Label>
            <Input
              id="project-demo"
              value={newProject.demoUrl || ""}
              onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-github">GitHub URL (optional)</Label>
            <Input
              id="project-github"
              value={newProject.githubUrl || ""}
              onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="project-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g., React, TypeScript"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
              >
                Add
              </Button>
            </div>
            {newProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-gradient-to-r from-primary/20 to-accent/20 px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="project-featured"
              checked={newProject.featured}
              onCheckedChange={(checked) => setNewProject({ ...newProject, featured: checked as boolean })}
            />
            <Label htmlFor="project-featured">Featured project</Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
          >
            Add Project
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

