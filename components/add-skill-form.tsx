"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Skill } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

interface AddSkillFormProps {
  onAddSkill: (skill: Skill) => void
}

const categoryOptions = [
  { id: "language", label: "Programming Language" },
  { id: "framework", label: "Framework/Library" },
  { id: "tool", label: "Tool/Technology" },
  { id: "soft", label: "Soft Skill" },
  { id: "database", label: "Database" },
  { id: "other", label: "Other" },
] as const

export default function AddSkillForm({ onAddSkill }: AddSkillFormProps) {
  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    proficiency: "intermediate",
    categories: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSkill.name.trim() && newSkill.categories.length > 0) {
      onAddSkill(newSkill)
      setNewSkill({
        name: "",
        proficiency: "intermediate",
        categories: [],
      })
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setNewSkill(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId as Skill["categories"][number]]
        : prev.categories.filter(c => c !== categoryId)
    }))
  }

  return (
    <Card className="cyberpunk-glow">
      <CardHeader>
        <CardTitle>Add New Skill</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="e.g., React, Python, UI Design"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Categories (select all that apply)</Label>
            <div className="grid gap-2">
              {categoryOptions.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={newSkill.categories.includes(category.id as Skill["categories"][number])}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skill-proficiency">Proficiency Level</Label>
            <Select
              value={newSkill.proficiency}
              onValueChange={(value) => setNewSkill({ ...newSkill, proficiency: value as Skill["proficiency"] })}
            >
              <SelectTrigger id="skill-proficiency">
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expert">Expert</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground mt-1">
              <p>
                <strong>Expert:</strong> Extensive experience and deep knowledge
              </p>
              <p>
                <strong>Advanced:</strong> Strong working knowledge and regular usage
              </p>
              <p>
                <strong>Intermediate:</strong> Good understanding and practical experience
              </p>
              <p>
                <strong>Beginner:</strong> Basic understanding and some experience
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={newSkill.categories.length === 0}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
          >
            Add Skill
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

