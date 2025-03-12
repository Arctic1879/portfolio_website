import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { Skill } from "@/lib/types"

interface SkillCardProps {
  skill: Skill
  onRemove: (skill: Skill) => void
}

const categoryLabels: Record<string, string> = {
  language: "Programming Language",
  framework: "Framework/Library",
  tool: "Tool/Technology",
  soft: "Soft Skill",
  database: "Database",
  other: "Other",
}

export default function SkillCard({ skill, onRemove }: SkillCardProps) {
  return (
    <Card className="relative group cyberpunk-glow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{skill.name}</h3>
            <div className="flex flex-wrap gap-2">
              {skill.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {categoryLabels[category]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {skill.proficiency}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(skill)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 