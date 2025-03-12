import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Education } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const education = await db.collection('education').find().toArray()
    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each education entry
    for (const edu of data) {
      if (!edu.degree || !edu.institution || !edu.location || !edu.date || !edu.description) {
        return NextResponse.json({ 
          error: "Each education entry must have a degree, institution, location, date, and description" 
        }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all education entries with the new data
      await db.collection('education').deleteMany({})
      await db.collection('education').insertMany(data)
      
      console.log("Successfully updated education")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
  }
} 