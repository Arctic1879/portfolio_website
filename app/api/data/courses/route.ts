import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { OnlineCourse } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    const courses = await db.collection('onlineCourses')
      .find()
      .sort({ startDate: -1 })
      .toArray()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Validate each course
    for (const course of data) {
      if (!course.name || !course.platform || !course.startDate || !course.description) {
        return NextResponse.json({ 
          error: "Each course must have a name, platform, startDate, and description" 
        }, { status: 400 })
      }

      // Validate date formats
      if (isNaN(Date.parse(course.startDate))) {
        return NextResponse.json({ 
          error: "Invalid startDate format" 
        }, { status: 400 })
      }
      if (course.endDate && isNaN(Date.parse(course.endDate))) {
        return NextResponse.json({ 
          error: "Invalid endDate format" 
        }, { status: 400 })
      }

      // Validate completed flag
      if (typeof course.completed !== 'boolean') {
        return NextResponse.json({ 
          error: "completed must be a boolean" 
        }, { status: 400 })
      }
    }

    // Sort courses by startDate
    const sortedData = [...data].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    try {
      // Replace all courses with the new data
      await db.collection('onlineCourses').deleteMany({})
      await db.collection('onlineCourses').insertMany(sortedData)
      
      console.log("Successfully updated courses")
      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update courses" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating courses:", error)
    return NextResponse.json({ error: "Failed to update courses" }, { status: 500 })
  }
}