import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Update } from "@/lib/types"
import { headers } from 'next/headers'

async function getData() {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  
  const response = await fetch(`${protocol}://${host}/api/data/updates`, { 
    next: { revalidate: 3600 },
    headers: Object.fromEntries(headersList.entries())
  })

  if (!response.ok) {
    throw new Error("Failed to fetch updates")
  }

  const updates = await response.json()
  // Sort updates by date in descending order (most recent first)
  return (updates as Update[]).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default async function UpdatesPage() {
  const updates = await getData()

  return (
    <div className="section-container">
      <h1 className="section-title">Latest Updates</h1>
      <div className="space-y-6">
        {updates.map((update) => (
          <Card key={update.id} className="card-hover cyberpunk-glow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{update.title}</h2>
                  <p className="text-muted-foreground mb-4">{update.content}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="cyberpunk-border">
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

