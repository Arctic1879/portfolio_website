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
import AddCertificateForm from "@/components/add-certificate-form"
import { type Skill, type Project, type Update, type OnlineCourse, type Certificate } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [courses, setCourses] = useState<OnlineCourse[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingCourse, setEditingCourse] = useState<OnlineCourse | null>(null)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, projectsRes, updatesRes, coursesRes, certificatesRes] = await Promise.all([
          fetch("/api/data/skills"),
          fetch("/api/data/projects"),
          fetch("/api/data/updates"),
          fetch("/api/data/courses"),
          fetch("/api/data/certificates")
        ])

        const [skillsData, projectsData, updatesData, coursesData, certificatesData] = await Promise.all([
          skillsRes.json(),
          projectsRes.json(),
          updatesRes.json(),
          coursesRes.json(),
          certificatesRes.json()
        ])

        setSkills(skillsData)
        setProjects(projectsData)
        setUpdates(updatesData.sort((a: Update, b: Update) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
        setCourses(coursesData)
        setCertificates(certificatesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

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

  if (!isAuthorized || isLoading) {
    return null // or a loading state
  }

  // Add or edit skill
  const handleAddSkill = async (skill: Skill) => {
    try {
      const newSkills = editingSkill
        ? skills.map(s => s.name === editingSkill.name ? skill : s)
        : [...skills, skill]

      const response = await fetch("/api/data/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newSkills }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save skill")
      }
      
      setSkills(newSkills)
      setEditingSkill(null)
      toast({
        title: editingSkill ? "Skill updated" : "Skill added",
        description: `${skill.name} has been ${editingSkill ? 'updated' : 'added'} to your skills.`,
      })
    } catch (error) {
      console.error("Error saving skill:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add or edit project
  const handleAddProject = async (project: Project) => {
    try {
      const newProjects = editingProject
        ? projects.map(p => p.id === editingProject.id ? project : p)
        : [...projects, project]

      const response = await fetch("/api/data/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newProjects }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save project")
      }
      
      setProjects(newProjects)
      setEditingProject(null)
      toast({
        title: editingProject ? "Project updated" : "Project added",
        description: `${project.title} has been ${editingProject ? 'updated' : 'added'} to your projects.`,
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add or edit course
  const handleAddCourse = async (course: OnlineCourse) => {
    try {
      const newCourses = editingCourse
        ? courses.map((c, i) => i === courses.findIndex(ec => ec.name === editingCourse.name) ? course : c)
        : [...courses, course]

      const response = await fetch("/api/data/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newCourses }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error("Error response:", result)
        throw new Error(result.error || "Failed to save course")
      }
      
      setCourses(newCourses)
      setEditingCourse(null)
      toast({
        title: editingCourse ? "Course updated" : "Course added",
        description: `${course.name} has been ${editingCourse ? 'updated' : 'added'} to your courses.`,
      })
    } catch (error) {
      console.error("Error saving course:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save course. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add or edit certificate
  const handleAddCertificate = async (certificate: Certificate) => {
    try {
      const newCertificates = editingCertificate
        ? certificates.map(c => c.name === editingCertificate.name ? certificate : c)
        : [...certificates, certificate]

      const response = await fetch("/api/data/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newCertificates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save certificate")
      }
      
      setCertificates(newCertificates)
      setEditingCertificate(null)
      toast({
        title: editingCertificate ? "Certificate updated" : "Certificate added",
        description: `${certificate.name} has been ${editingCertificate ? 'updated' : 'added'} to your certificates.`,
      })
    } catch (error) {
      console.error("Error saving certificate:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save certificate. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add new update or save edited update
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

    const updateData: Update = {
      id: editingUpdate?.id || `update-${Date.now()}`,
      title: formData.get("title") as string,
      date: formattedDate,
      content: formData.get("content") as string,
      type: formData.get("type") as Update["type"],
    }

    try {
      // If editing, replace the old update with the new one
      const newUpdates = editingUpdate 
        ? updates.map(u => u.id === editingUpdate.id ? updateData : u)
        : [...updates, updateData]

      // Sort the updates
      const sortedUpdates = newUpdates.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "updates", data: sortedUpdates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to save update")
      }
      
      setUpdates(sortedUpdates)
      setEditingUpdate(null)
      form.reset()
      toast({
        title: editingUpdate ? "Update edited" : "Update added",
        description: `${updateData.title} has been ${editingUpdate ? 'updated' : 'added'}.`,
      })
    } catch (error) {
      console.error("Error saving update:", error)
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

  const handleRemoveCertificate = async (name: string) => {
    const newCertificates = certificates.filter(c => c.name !== name)
    try {
      const response = await fetch("/api/data/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newCertificates }),
      })
      if (!response.ok) throw new Error("Failed to remove certificate")
      setCertificates(newCertificates)
      toast({
        title: "Certificate removed",
        description: `Certificate has been removed from your certificates.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove certificate. Please try again.",
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
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <div className="grid gap-8 md:grid-cols-2">
            <AddSkillForm onAddSkill={handleAddSkill} editingSkill={editingSkill} />

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
                        <div className="flex gap-2">
                          <Button
                            className="cyberpunk-border"
                            onClick={() => setEditingSkill(skill)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="cyberpunk-border"
                            onClick={() => handleRemoveSkill(index)}
                          >
                            Remove
                          </Button>
                        </div>
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
            <AddProjectForm onAddProject={handleAddProject} editingProject={editingProject} />

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
                        <div className="flex gap-2">
                          <Button
                            className="cyberpunk-border"
                            onClick={() => setEditingProject(project)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="cyberpunk-border"
                            onClick={() => handleRemoveProject(project.id)}
                          >
                            Remove
                          </Button>
                        </div>
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

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <div className="grid gap-8 md:grid-cols-2">
            <AddCertificateForm onAddCertificate={handleAddCertificate} editingCertificate={editingCertificate} />

            <Card className="cyberpunk-glow">
              <CardHeader>
                <CardTitle>Current Certificates ({certificates.length})</CardTitle>
                <CardDescription>Manage your professional certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.length > 0 ? (
                    certificates.map((certificate) => (
                      <div key={certificate.name} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{certificate.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {certificate.issuer} • {certificate.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="cyberpunk-border"
                            onClick={() => setEditingCertificate(certificate)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="cyberpunk-border"
                            onClick={() => handleRemoveCertificate(certificate.name)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No certificates added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid gap-8 md:grid-cols-2">
            <AddCourseForm onAddCourse={handleAddCourse} editingCourse={editingCourse} />

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
                        <div className="flex gap-2">
                          <Button
                            className="cyberpunk-border"
                            onClick={() => setEditingCourse(course)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="cyberpunk-border"
                            onClick={() => handleRemoveCourse(index)}
                          >
                            Remove
                          </Button>
                        </div>
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
                <CardTitle>{editingUpdate ? 'Edit Update' : 'Add New Update'}</CardTitle>
                <CardDescription>
                  {editingUpdate 
                    ? 'Edit your existing update'
                    : 'Share your latest courses, certificates, or other activities'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUpdate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="update-title">Title</Label>
                    <Input 
                      id="update-title" 
                      name="title" 
                      placeholder="e.g., Started a new course" 
                      defaultValue={editingUpdate?.title || ''}
                      required 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="update-date">Date</Label>
                    <Input 
                      id="update-date" 
                      name="date" 
                      type="date" 
                      max={new Date().toISOString().split('T')[0]}
                      defaultValue={editingUpdate ? new Date(editingUpdate.date).toISOString().split('T')[0] : ''}
                      required 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="update-type">Type</Label>
                    <Select name="type" defaultValue={editingUpdate?.type || "course"}>
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
                      defaultValue={editingUpdate?.content || ''}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
                    >
                      {editingUpdate ? 'Save Changes' : 'Add Update'}
                    </Button>
                    {editingUpdate && (
                      <Button
                        type="button"
                        variant="outline"
                        className="cyberpunk-border"
                        onClick={() => {
                          setEditingUpdate(null)
                          const form = document.querySelector('form')
                          if (form) form.reset()
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
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
                        <div className="flex gap-2">
                          <Button
                            className="cyberpunk-border"
                            onClick={() => setEditingUpdate(update)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="cyberpunk-border"
                            onClick={() => handleRemoveUpdate(update.id)}
                          >
                            Remove
                          </Button>
                        </div>
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

