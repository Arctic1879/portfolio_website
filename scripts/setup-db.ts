import clientPromise from '../lib/mongodb'
import { educationData, certificateData, onlineCoursesData, skillsData, projectsData, updatesData } from '../lib/data'

async function setup() {
  try {
    const client = await clientPromise
    const db = client.db('PortfolioDB')

    // Create collections
    const collections = [
      'education',
      'certificates',
      'onlineCourses',
      'skills',
      'projects',
      'updates'
    ]

    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).hasNext()
      if (!exists) {
        await db.createCollection(collection)
        console.log(`Created collection: ${collection}`)
      }
    }

    // Insert data
    await db.collection('education').insertMany(educationData)
    await db.collection('certificates').insertMany(certificateData)
    await db.collection('onlineCourses').insertMany(onlineCoursesData)
    await db.collection('skills').insertMany(skillsData)
    await db.collection('projects').insertMany(projectsData)
    await db.collection('updates').insertMany(updatesData)

    console.log('Data migration completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    process.exit()
  }
}

setup() 