"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Skill } from "@/lib/types"

// Category labels
const categoryLabels: Record<string, string> = {
  language: "Programming Languages",
  framework: "Frameworks & Libraries",
  tool: "Tools & Technologies",
  soft: "Soft Skills",
  database: "Databases",
  other: "Other Skills",
}

// Proficiency descriptions
const proficiencyDescriptions: Record<string, string> = {
  expert: "Extensive experience and deep knowledge",
  advanced: "Strong working knowledge and regular usage",
  intermediate: "Good understanding and practical experience",
  beginner: "Basic understanding and some experience",
}

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [skills, setSkills] = useState<Skill[]>([])
  const [groupedSkills, setGroupedSkills] = useState<Record<string, Skill[]>>({})
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchSkills() {
      const response = await fetch('/api/data/skills')
      if (!response.ok) {
        console.error('Failed to fetch skills')
        return
      }
      const data = await response.json()
      setSkills(data)

      // Group skills by category
      const grouped = data.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
        skill.categories.forEach(category => {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(skill)
        })
        return acc
      }, {})

      // Sort skills by proficiency within each category
      Object.keys(grouped).forEach((category) => {
        grouped[category].sort((a: Skill, b: Skill) => {
          const proficiencyOrder = { expert: 0, advanced: 1, intermediate: 2, beginner: 3 } as const
          return proficiencyOrder[a.proficiency] - proficiencyOrder[b.proficiency]
        })
      })

      setGroupedSkills(grouped)
      setCategories(Object.keys(grouped))
    }

    fetchSkills()
  }, [])

  return (
    <div className="section-container">
      <h1 className="section-title">Skills & Proficiencies</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {categoryLabels[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category} className="card-gradient p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">{categoryLabels[category] || category}</h2>

                {/* Group by proficiency level */}
                {["expert", "advanced", "intermediate", "beginner"].map((proficiency) => {
                  const skillsInProficiency = groupedSkills[category]?.filter(
                    (skill) => skill.proficiency === proficiency,
                  ) || []

                  if (skillsInProficiency.length === 0) return null

                  return (
                    <div key={proficiency} className="mb-8 last:mb-0">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold capitalize">{proficiency}</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                        <span className="text-sm text-muted-foreground">{proficiencyDescriptions[proficiency]}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {skillsInProficiency.map((skill) => (
                          <span key={skill.name} className={`skill-tag skill-tag-${skill.proficiency}`}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="card-gradient p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">{categoryLabels[category] || category}</h2>

              {/* Group by proficiency level */}
              {["expert", "advanced", "intermediate", "beginner"].map((proficiency) => {
                const skillsInProficiency = groupedSkills[category]?.filter(
                  (skill) => skill.proficiency === proficiency,
                ) || []

                if (skillsInProficiency.length === 0) return null

                return (
                  <div key={proficiency} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold capitalize">{proficiency}</h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                      <span className="text-sm text-muted-foreground">{proficiencyDescriptions[proficiency]}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {skillsInProficiency.map((skill) => (
                        <span key={skill.name} className={`skill-tag skill-tag-${skill.proficiency}`}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

