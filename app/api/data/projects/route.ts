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
    const formatValue = (value: any, key: string): string => {
      if (Array.isArray(value)) {
        // Format tags array on a single line
        return `[${value.map(v => `"${v}"`).join(", ")}]`
      }
      if (typeof value === "string") {
        // Handle empty strings for optional fields
        if (value === "" && (key === "image" || key === "demoUrl" || key === "githubUrl")) {
          return "null"
        }
        return `"${value.replace(/"/g, '\\"')}"`
      }
      if (typeof value === "boolean") {
        return String(value)
      }
      return String(value)
    }

    // Format the data structure with consistent property order
    const formattedData = data.map((item: any) => {
      // Define the order of properties
      const propertyOrder = ["id", "title", "description", "tags", "image", "demoUrl", "githubUrl", "featured"]
      
      const entries = propertyOrder
        .filter(key => key in item) // Only include properties that exist
        .map(key => {
          const value = item[key]
          if (value === undefined) return null // Skip undefined values
          return `    ${key}: ${formatValue(value, key)}`
        })
        .filter(entry => entry !== null) // Remove null entries
        .join(",\n")
      
      return `  {\n${entries}\n  }`
    }).join(",\n")

    const dataString = `[\n${formattedData}\n]`
    
    // Create regex pattern for projects - make it more precise
    const exportPattern = `export\\s+const\\s+projectsData\\s*:\\s*Project\\[\\]\\s*=\\s*\\[(([\\s\\S])*?)\\](?=\\s*\\n)`
    const regex = new RegExp(exportPattern)
    
    // Verify the pattern exists
    const match = content.match(regex)
    if (!match) {
      console.error("Could not find the projects array in the file")
      return NextResponse.json({ error: "Data pattern not found" }, { status: 500 })
    }
    
    // Replace the content
    const newContent = content.replace(
      regex,
      `export const projectsData: Project[] = ${dataString}`
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
    console.error("Error updating projects:", error)
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 })
  }
} 