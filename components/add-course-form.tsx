"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { OnlineCourse } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface AddCourseFormProps {
  onAddCourse: (course: OnlineCourse) => void
  editingCourse: OnlineCourse | null
}

export default function AddCourseForm({ onAddCourse, editingCourse }: AddCourseFormProps) {
  const [newCourse, setNewCourse] = useState<OnlineCourse>(() => {
    if (editingCourse) {
      // Convert dates back to YYYY-MM format for input fields
      return {
        ...editingCourse,
        startDate: new Date(editingCourse.startDate).toISOString().substring(0, 7),
        endDate: editingCourse.endDate 
          ? new Date(editingCourse.endDate).toISOString().substring(0, 7)
          : "",
      }
    }
    return {
      name: "",
      platform: "",
      instructor: "",
      startDate: "",
      endDate: "",
      description: "",
      url: "",
      completed: false,
    }
  })

  // Update form when editingCourse changes
  useEffect(() => {
    if (editingCourse) {
      setNewCourse({
        ...editingCourse,
        startDate: new Date(editingCourse.startDate).toISOString().substring(0, 7),
        endDate: editingCourse.endDate 
          ? new Date(editingCourse.endDate).toISOString().substring(0, 7)
          : "",
      })
    }
  }, [editingCourse])

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

      if (!editingCourse) {
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
  }

  return (
    <Card className="cyberpunk-glow">
      <CardHeader>
        <CardTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</CardTitle>
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
            {editingCourse ? 'Save Changes' : 'Add Course'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

