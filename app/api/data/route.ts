import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Validate the data type
    if (!["skills", "projects", "updates", "courses"].includes(type)) {
      console.error("Invalid data type:", type)
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

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
    
    // Sort data if it contains dates
    let sortedData = data
    if (type === "updates") {
      sortedData = data.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } else if (type === "courses") {
      sortedData = data.sort((a: any, b: any) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
    }
    
    // Create the new data string with consistent formatting
    const formatValue = (value: any): string => {
      if (Array.isArray(value)) {
        const items = value.map(formatValue).join(", ")
        return `[${items}]`
      }
      if (typeof value === "string") {
        // Escape quotes and ensure consistent quote usage
        return `"${value.replace(/"/g, '\\"')}"`
      }
      return String(value)
    }

    // Format the data with consistent structure
    const formattedData = sortedData.map((item: any) => {
      const entries = Object.entries(item)
        .map(([key, value]) => `    ${key}: ${formatValue(value)}`)
        .join(",\n")
      return `  {\n${entries}\n  }`
    }).join(",\n")

    const dataString = `[\n${formattedData}\n]`
    
    // Replace the existing data in the file
    const dataVarName = `${type}Data`
    
    // Define type mapping for the actual output (unescaped)
    const typeMap: Record<string, string> = {
      skills: "Skill[]",
      projects: "Project[]",
      courses: "OnlineCourse[]",
      updates: "Update[]"
    }

    // Create escaped versions for the regex pattern
    const escapedType = typeMap[type].replace(/[\[\]]/g, '\\$&')
    
    // More precise regex to match the export statement and array content, allowing for whitespace
    const exportPattern = `export\\s+const\\s+${dataVarName}\\s*:\\s*${escapedType}\\s*=\\s*\\[([\\s\\S]*?)\\]`
    const regex = new RegExp(exportPattern)
    
    console.log('Looking for pattern:', exportPattern)
    
    // First verify the pattern exists in the content
    const match = content.match(regex)
    if (!match) {
      console.error("Could not find the data array in the file")
      // Log a snippet of the content around where we expect the data to be
      const lines = content.split('\n')
      const exportLine = lines.findIndex(line => line.includes(`export const ${dataVarName}`))
      if (exportLine >= 0) {
        console.error("Found export line at:", exportLine)
        console.error("Context:", lines.slice(Math.max(0, exportLine - 2), exportLine + 5).join('\n'))
      } else {
        console.error("Could not find export line for:", dataVarName)
      }
      return NextResponse.json({ error: "Data pattern not found" }, { status: 500 })
    }
    
    // Replace while preserving the export statement and type annotation
    const newContent = content.replace(
      regex,
      `export const ${dataVarName}: ${typeMap[type]} = ${dataString}`
    )
    
    // Log the before and after of the replacement
    if (match.index !== undefined) {
      console.log('Original section:', match[0].slice(0, 100) + '...')
      console.log('New section:', newContent.slice(match.index, match.index + 100) + '...')
    }
    
    // Verify the replacement worked
    if (content === newContent) {
      console.error("Failed to update the file content")
      console.error("Original content length:", content.length)
      console.error("New content length:", newContent.length)
      return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
    }
    
    // Write the updated content back to the file
    try {
      await fs.writeFile(dataFilePath, newContent, "utf8")
      console.log("Successfully wrote to file")
      return NextResponse.json({ success: true })
    } catch (writeError) {
      console.error("Error writing file:", writeError)
      return NextResponse.json({ error: "Failed to write to data file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating data:", error)
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
} 