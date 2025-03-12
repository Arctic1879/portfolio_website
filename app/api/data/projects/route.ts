import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Project } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const projects = await db.collection('projects').find().toArray()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each project
    for (const project of data) {
      if (!project.id || !project.title || !project.description) {
        return NextResponse.json({ 
          error: "Each project must have an id, title, and description" 
        }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all projects with the new data
      await db.collection('projects').deleteMany({})
      await db.collection('projects').insertMany(data)
      
      console.log("Successfully updated projects")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update projects" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating projects:", error)
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 })
  }
} 