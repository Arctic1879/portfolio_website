import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Skill } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const skills = await db.collection('skills').find().toArray()
    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each skill
    for (const skill of data) {
      if (!skill.name || !skill.proficiency || !skill.categories) {
        return NextResponse.json({ 
          error: "Each skill must have a name, proficiency, and categories" 
        }, { status: 400 })
      }
      
      // Validate proficiency
      if (!["expert", "advanced", "intermediate", "beginner"].includes(skill.proficiency)) {
        return NextResponse.json({ 
          error: "Invalid proficiency level" 
        }, { status: 400 })
      }

      // Validate categories
      const validCategories = ["language", "framework", "tool", "soft", "database", "other"] as const
      if (!Array.isArray(skill.categories) || 
          !skill.categories.every((cat: string) => validCategories.includes(cat as any))) {
        return NextResponse.json({ 
          error: "Invalid categories" 
        }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all skills with the new data
      await db.collection('skills').deleteMany({})
      await db.collection('skills').insertMany(data)
      
      console.log("Successfully updated skills")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating skills:", error)
    return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
  }
} 