import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Certificate } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const certificates = await db.collection('certificates').find().toArray()
    return NextResponse.json(certificates)
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each certificate
    for (const cert of data) {
      if (!cert.name || !cert.issuer || !cert.date) {
        return NextResponse.json({ 
          error: "Each certificate must have a name, issuer, and date" 
        }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all certificates with the new data
      await db.collection('certificates').deleteMany({})
      await db.collection('certificates').insertMany(data)
      
      console.log("Successfully updated certificates")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update certificates" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating certificates:", error)
    return NextResponse.json({ error: "Failed to update certificates" }, { status: 500 })
  }
} 