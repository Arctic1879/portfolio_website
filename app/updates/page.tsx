import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updatesData } from "@/lib/data"

// Badge variants for different update types
const badgeVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  course: "default",
  certificate: "secondary",
  project: "outline",
  other: "outline",
}

export default function UpdatesPage() {
  // Sort updates by date (newest first)
  const sortedUpdates = [...updatesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="section-container">
      <h1 className="section-title">Updates & Activities</h1>

      <div className="grid gap-6">
        {sortedUpdates.map((update) => (
          <Card key={update.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-xl">{update.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={badgeVariants[update.type]}>
                    {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{update.date}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{update.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedUpdates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No updates available yet.</p>
        </div>
      )}
    </div>
  )
}

