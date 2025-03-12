import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Fetch all collections
    const [education, certificates, onlineCourses, skills, projects, updates] = await Promise.all([
      db.collection('education').find().toArray(),
      db.collection('certificates').find().toArray(),
      db.collection('onlineCourses').find().sort({ startDate: -1 }).toArray(),
      db.collection('skills').find().toArray(),
      db.collection('projects').find().toArray(),
      db.collection('updates').find().sort({ date: -1 }).toArray(),
    ])

    return NextResponse.json({
      education,
      certificates,
      onlineCourses,
      skills,
      projects,
      updates
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Validate the data type
    const validCollections = ["education", "certificates", "onlineCourses", "skills", "projects", "updates"]
    if (!validCollections.includes(type)) {
      console.error("Invalid data type:", type)
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    // Sort data if it contains dates
    let sortedData = [...data]
    if (type === "updates") {
      sortedData.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } else if (type === "onlineCourses") {
      sortedData.sort((a: any, b: any) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
    }

    // Clear existing data and insert new data
    try {
      await db.collection(type).deleteMany({})
      await db.collection(type).insertMany(sortedData)
      console.log(`Successfully updated ${type} collection`)
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error(`Error updating ${type} collection:`, dbError)
      return NextResponse.json({ error: `Failed to update ${type} data` }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating data:", error)
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
} 