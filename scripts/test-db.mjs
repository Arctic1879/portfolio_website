import { MongoClient } from 'mongodb'

async function test() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://aknoah0:xu3icd0ahiVk3JuC@portfolio.hhidh.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('PortfolioDB')
    
    // List all collections
    const collections = await db.listCollections().toArray()
    console.log('\nCollections:', collections.map(c => c.name))

    // Check education collection
    const education = await db.collection('education').find().toArray()
    console.log('\nEducation:', education)

    // Check updates collection
    const updates = await db.collection('updates').find().toArray()
    console.log('\nUpdates:', updates)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    process.exit()
  }
}

test() 