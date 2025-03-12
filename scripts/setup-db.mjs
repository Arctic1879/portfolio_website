import { MongoClient } from 'mongodb'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function importData() {
  const dataPath = join(__dirname, '..', 'lib', 'seed-data.json')
  const content = await readFile(dataPath, 'utf-8')
  return JSON.parse(content)
}

async function setup() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://aknoah0:xu3icd0ahiVk3JuC@portfolio.hhidh.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('PortfolioDB')
    const data = await importData()

    // Create collections and insert data
    const collections = {
      education: data.education,
      certificates: data.certificates,
      courses: data.onlineCourses,
      skills: data.skills,
      projects: data.projects,
      updates: data.updates
    }
    
    for (const [collection, items] of Object.entries(collections)) {
      // Delete existing data
      await db.collection(collection).deleteMany({})
      console.log(`Cleared collection: ${collection}`)
      
      // Insert new data
      if (items && items.length > 0) {
        await db.collection(collection).insertMany(items)
        console.log(`Inserted ${items.length} items into ${collection}`)
      }
    }

    console.log('Data migration completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await client.close()
    process.exit()
  }
}

setup() 