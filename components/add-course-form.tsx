"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { OnlineCourse } from "@/lib/data"

interface AddCourseFormProps {
  onAddCourse: (course: OnlineCourse) => void
}

export default function AddCourseForm({ onAddCourse }: AddCourseFormProps) {
  const [newCourse, setNewCourse] = useState<OnlineCourse>({
    name: "",
    platform: "",
    instructor: "",
    startDate: "",
    endDate: "",
    description: "",
    url: "",
    completed: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCourse.name.trim() && newCourse.platform.trim() && newCourse.startDate.trim() && newCourse.description.trim()) {
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })
      }
      
      onAddCourse({
        ...newCourse,
        startDate: formatDate(newCourse.startDate),
        endDate: newCourse.endDate ? formatDate(newCourse.endDate) : undefined
      })
      setNewCourse({
        name: "",
        platform: "",
        instructor: "",
        startDate: "",
        endDate: "",
        description: "",
        url: "",
        completed: false,
      })
    }
  }

  return (
    <Card className="cyberpunk-glow">
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course Name</Label>
            <Input
              id="course-name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              placeholder="e.g., Advanced React Patterns"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-platform">Platform</Label>
            <Input
              id="course-platform"
              value={newCourse.platform}
              onChange={(e) => setNewCourse({ ...newCourse, platform: e.target.value })}
              placeholder="e.g., Coursera, Udemy, Frontend Masters"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-instructor">Instructor (Optional)</Label>
            <Input
              id="course-instructor"
              value={newCourse.instructor || ""}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              placeholder="e.g., John Doe, University of Example"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="course-start-date">Start Date</Label>
              <Input
                id="course-start-date"
                type="month"
                value={newCourse.startDate}
                onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                max={new Date().toISOString().split('T')[0].substring(0, 7)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-end-date">End Date (Optional)</Label>
              <Input
                id="course-end-date"
                type="month"
                value={newCourse.endDate}
                onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
                min={newCourse.startDate}
                max={new Date().toISOString().split('T')[0].substring(0, 7)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-description">Description</Label>
            <Textarea
              id="course-description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder="Describe what you learned in this course..."
              rows={3}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-url">Course URL (Optional)</Label>
            <Input
              id="course-url"
              value={newCourse.url || ""}
              onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
              placeholder="https://example.com/course"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="course-completed"
              checked={newCourse.completed}
              onCheckedChange={(checked: boolean | "indeterminate") => setNewCourse({ ...newCourse, completed: checked as boolean })}
            />
            <Label htmlFor="course-completed">Course completed</Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
          >
            Add Course
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

