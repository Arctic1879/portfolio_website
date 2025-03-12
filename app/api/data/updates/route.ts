import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Update } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const updates = await db.collection('updates')
      .find()
      .sort({ date: -1 })
      .toArray()
    return NextResponse.json(updates)
  } catch (error) {
    console.error("Error fetching updates:", error)
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each update
    for (const update of data) {
      if (!update.id || !update.title || !update.date || !update.content || !update.type) {
        return NextResponse.json({ 
          error: "Each update must have an id, title, date, content, and type" 
        }, { status: 400 })
      }

      // Validate type
      if (!["course", "certificate", "project", "other"].includes(update.type)) {
        return NextResponse.json({ 
          error: "Invalid update type" 
        }, { status: 400 })
      }

      // Validate date format
      if (isNaN(Date.parse(update.date))) {
        return NextResponse.json({ 
          error: "Invalid date format" 
        }, { status: 400 })
      }
    }

    // Sort updates by date
    const sortedData = [...data].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all updates with the new data
      await db.collection('updates').deleteMany({})
      await db.collection('updates').insertMany(sortedData)
      
      console.log("Successfully updated updates")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update updates" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating updates:", error)
    return NextResponse.json({ error: "Failed to update updates" }, { status: 500 })
  }
} 