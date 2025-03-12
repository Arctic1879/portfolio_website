"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddSkillForm from "@/components/add-skill-form"
import AddProjectForm from "@/components/add-project-form"
import AddCourseForm from "@/components/add-course-form"
import {
  type Skill,
  type Project,
  type Update,
  type OnlineCourse,
  skillsData,
  projectsData,
  updatesData,
  onlineCoursesData,
} from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [skills, setSkills] = useState<Skill[]>(skillsData)
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [updates, setUpdates] = useState<Update[]>(updatesData)
  const [courses, setCourses] = useState<OnlineCourse[]>(onlineCoursesData)

  useEffect(() => {
    const checkAuth = () => {
      const isUnlocked = localStorage.getItem("adminUnlocked") === "true"
      if (!isUnlocked) {
        router.push("/")
      } else {
        setIsAuthorized(true)
      }
    }
    checkAuth()
  }, [router])

  if (!isAuthorized) {
    return null // or a loading state
  }

  // Add new skill
  const handleAddSkill = async (skill: Skill) => {
    try {
      const response = await fetch("/api/data/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [...skills, skill] }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save skill")
      }
      
      setSkills([...skills, skill])
      toast({
        title: "Skill added",
        description: `${skill.name} has been added to your skills.`,
      })
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add new project
  const handleAddProject = async (project: Project) => {
    try {
      const response = await fetch("/api/data/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [...projects, project] }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save project")
      }
      
      setProjects([...projects, project])
      toast({
        title: "Project added",
        description: `${project.title} has been added to your projects.`,
      })
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add new course
  const handleAddCourse = async (course: OnlineCourse) => {
    try {
      const response = await fetch("/api/data/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [...courses, course] }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error("Error response:", result)
        throw new Error(result.error || "Failed to save course")
      }
      
      setCourses([...courses, course])
      toast({
        title: "Course added",
        description: `${course.name} has been added to your courses.`,
      })
    } catch (error) {
      console.error("Error adding course:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save course. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add new update
  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // Format the date consistently
    const inputDate = new Date(formData.get("date") as string)
    const formattedDate = inputDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const newUpdate: Update = {
      id: `update-${Date.now()}`,
      title: formData.get("title") as string,
      date: formattedDate,
      content: formData.get("content") as string,
      type: formData.get("type") as Update["type"],
    }

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "updates", data: [newUpdate, ...updates] }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save update")
      }
      
      setUpdates([newUpdate, ...updates])
      form.reset()
      toast({
        title: "Update added",
        description: `${newUpdate.title} has been added to your updates.`,
      })
    } catch (error) {
      console.error("Error adding update:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save update. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add these new functions for handling removals
  const handleRemoveSkill = async (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index)
    try {
      const response = await fetch("/api/data/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newSkills }),
      })
      if (!response.ok) throw new Error("Failed to remove skill")
      setSkills(newSkills)
      toast({
        title: "Skill removed",
        description: `Skill has been removed from your skills.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveProject = async (id: string) => {
    const newProjects = projects.filter(p => p.id !== id)
    try {
      const response = await fetch("/api/data/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newProjects }),
      })
      if (!response.ok) throw new Error("Failed to remove project")
      setProjects(newProjects)
      toast({
        title: "Project removed",
        description: `Project has been removed from your projects.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveCourse = async (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index)
    try {
      const response = await fetch("/api/data/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newCourses }),
      })
      if (!response.ok) throw new Error("Failed to remove course")
      setCourses(newCourses)
      toast({
        title: "Course removed",
        description: `Course has been removed from your courses.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveUpdate = async (id: string) => {
    const newUpdates = updates.filter(u => u.id !== id)
    setUpdates(newUpdates)
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "updates", data: newUpdates }),
      })
      if (!response.ok) throw new Error("Failed to remove update")
      toast({
        title: "Update removed",
        description: `Update has been removed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove update. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="section-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title">Admin Dashboard</h1>
        <Button 
          variant="outline"
          className="cyberpunk-border"
          onClick={() => {
            localStorage.removeItem("adminUnlocked")
            // Dispatch a custom event to notify the navbar
            window.dispatchEvent(new Event("adminLogout"))
            router.push("/")
          }}
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="skills">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <div className="grid gap-8 md:grid-cols-2">
            <AddSkillForm onAddSkill={handleAddSkill} />

            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Current Skills ({skills.length})</CardTitle>
                <CardDescription>Manage your skills and proficiencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{skill.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {skill.categories.join(", ")} • {skill.proficiency}
                          </p>
                        </div>
                        <Button
                          className="cyberpunk-border"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="grid gap-8 md:grid-cols-2">
            <AddProjectForm onAddProject={handleAddProject} />

            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Current Projects ({projects.length})</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.tags.join(", ")}
                            {project.featured && " • Featured"}
                          </p>
                        </div>
                        <Button
                          className="cyberpunk-border"
                          onClick={() => handleRemoveProject(project.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No projects added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid gap-8 md:grid-cols-2">
            <AddCourseForm onAddCourse={handleAddCourse} />

            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Current Courses ({courses.length})</CardTitle>
                <CardDescription>Manage your online courses and continuous learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.length > 0 ? (
                    courses.map((course, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{course.name}</p>
                            {course.completed ? (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center gap-1 text-xs py-0">
                                <CheckCircle className="h-3 w-3" />
                              </Badge>
                            ) : (
                              <Badge
                                className="flex items-center gap-1 border-primary/50 text-xs py-0"
                              >
                                <Clock className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {course.platform} • {course.startDate}{course.endDate ? ` - ${course.endDate}` : ''}
                          </p>
                        </div>
                        <Button
                          className="cyberpunk-border"
                          onClick={() => handleRemoveCourse(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No courses added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Add New Update</CardTitle>
                <CardDescription>Share your latest courses, certificates, or other activities</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUpdate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="update-title">Title</Label>
                    <Input id="update-title" name="title" placeholder="e.g., Started a new course" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="update-date">Date</Label>
                    <Input 
                      id="update-date" 
                      name="date" 
                      type="date" 
                      max={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="update-type">Type</Label>
                    <Select name="type" defaultValue="course">
                      <SelectTrigger id="update-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="update-content">Content</Label>
                    <Textarea
                      id="update-content"
                      name="content"
                      placeholder="Share details about your update..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
                  >
                    Add Update
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Current Updates ({updates.length})</CardTitle>
                <CardDescription>Manage your activity updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {updates.length > 0 ? (
                    updates.map((update) => (
                      <div key={update.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{update.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {update.date} • {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                          </p>
                        </div>
                        <Button
                          className="cyberpunk-border"
                          onClick={() => handleRemoveUpdate(update.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No updates added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

