import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Construct MongoDB URI from environment variables
const MONGO_USER = encodeURIComponent(process.env.MONGO_USER || 'admin');
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_PASSWORD || 'password');
const MONGO_HOST = process.env.MONGO_HOST || 'localhost:27017';
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/`;
const MONGO_DB = process.env.MONGO_DB || 'smartcity';

let db;

// Security: CORS - restrict to frontend origin only
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
async function connectMongo() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(MONGO_DB);
    console.log('✅ Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connexion error:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all cities
app.get('/api/cities', async (req, res) => {
  try {
    const collection = db.collection('villes');
    const cities = await collection.find({}).toArray();
    res.json(cities.map(formatCity));
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get top cities (by rating)
app.get('/api/cities/top', async (req, res) => {
  try {
    const collection = db.collection('villes');
    const topCities = await collection
      .find({})
      .sort({ overall_score: -1 })
      .limit(6)
      .toArray();
    res.json(topCities.map(formatCity));
  } catch (error) {
    console.error('Error fetching top cities:', error);
    res.status(500).json({ error: 'Failed to fetch top cities' });
  }
});

// Get city by ID or name
app.get('/api/cities/:idOrName', async (req, res) => {
  try {
    const { idOrName } = req.params;
    const collection = db.collection('villes');
    
    let city = await collection.findOne({ 
      $or: [
        { _id: idOrName },
        { name: { $regex: idOrName, $options: 'i' } }
      ]
    });
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(formatCity(city));
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

// Add rating for a city
app.post('/api/cities/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { scores, comment } = req.body;

    const collection = db.collection('villes');
    
    // Validate scores
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ error: 'Invalid scores format' });
    }

    // Update city with new rating
    const result = await collection.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          ratings: {
            scores,
            comment,
            date: new Date(),
            ip_hash: generateIpHash()
          }
        },
        $inc: { total_ratings: 1 }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({
      message: 'Rating submitted successfully',
      city: formatCity(result.value)
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Search cities
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const collection = db.collection('villes');
    const results = await collection
      .find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { department: { $regex: q, $options: 'i' } }
        ]
      })
      .limit(10)
      .toArray();

    res.json(results.map(formatCity));
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

// Helper function to format city data
function formatCity(city) {
  return {
    id: city._id || city.id,
    name: city.name,
    department: city.department,
    region: city.region,
    overallScore: city.overall_score || city.overallScore || 0,
    totalRatings: city.total_ratings || city.totalRatings || 0,
    scores: {
      environment: city.scores?.environment || city.scores?.nature || 0,
      transport: city.scores?.transport || 0,
      security: city.scores?.security || 0,
      health: city.scores?.health || 0,
      sports: city.scores?.sports || 0,
      culture: city.scores?.culture || 0,
      education: city.scores?.education || 0,
      shops: city.scores?.shops || 0,
      quality: city.scores?.quality || 0
    },
    image: city.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
  };
}

// Helper function to generate IP hash
function generateIpHash() {
  return Math.random().toString(36).substring(7);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
await connectMongo();
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGO_URL}${MONGO_DB}`);
});
