import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const { data } = await req.json()

    // Get the data file path
    const dataFilePath = path.join(process.cwd(), "lib/data.ts")
    console.log("Attempting to write to:", dataFilePath)
    
    // Read the current file content
    let content
    try {
      content = await fs.readFile(dataFilePath, "utf8")
      console.log("Successfully read file")
    } catch (readError) {
      console.error("Error reading file:", readError)
      return NextResponse.json({ error: "Failed to read data file" }, { status: 500 })
    }
    
    // Format values consistently
    const formatValue = (value: any): string => {
      if (typeof value === "string") {
        return `"${value}"`  // Skills don't need quote escaping as they don't contain quotes
      }
      return String(value)
    }

    // Format the data structure with comments for categories
    const formattedData = data.map((item: any) => {
      const entries = Object.entries(item)
        .map(([key, value]) => `    ${key}: ${formatValue(value)}`)
        .join(",\n")
      return `  {\n${entries}\n  }`
    }).join(",\n")

    const dataString = `[\n${formattedData}\n]`
    
    // Create regex pattern for skills
    const exportPattern = `export\\s+const\\s+skillsData\\s*:\\s*Skill\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\]`
    const regex = new RegExp(exportPattern)
    
    // Verify the pattern exists
    const match = content.match(regex)
    if (!match) {
      console.error("Could not find the skills array in the file")
      return NextResponse.json({ error: "Data pattern not found" }, { status: 500 })
    }
    
    // Replace the content
    const newContent = content.replace(
      regex,
      `export const skillsData: Skill[] = ${dataString}`
    )
    
    // Verify the replacement worked
    if (content === newContent) {
      console.error("Failed to update the file content")
      return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
    }
    
    // Write the updated content
    try {
      await fs.writeFile(dataFilePath, newContent, "utf8")
      console.log("Successfully wrote to file")
      return NextResponse.json({ success: true })
    } catch (writeError) {
      console.error("Error writing file:", writeError)
      return NextResponse.json({ error: "Failed to write to data file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating skills:", error)
    return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
  }
} 