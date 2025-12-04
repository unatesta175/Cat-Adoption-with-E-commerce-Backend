// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import catRoutes from './routes/cats.js';
import adoptionRoutes from './routes/adoptions.js';
import recommendationRoutes from './routes/recommendations.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import seedAdmin from './seed/seedAdmin.js';
import seedUsers from './seed/seedUsers.js';
import seedCats from './seed/seedCats.js';
import seedProducts from './seed/seedProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start server
    app.listen(PORT, async () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}\n`);
      
      // Seed database after connection is established
      console.log('🌱 Seeding database...');
      try {
        await seedAdmin();
        await seedUsers();
        await seedCats();
        await seedProducts();
        console.log('\n✅ Server ready!\n');
      } catch (seedError) {
        console.error('⚠️  Seeding errors (non-critical):', seedError.message);
        console.log('\n✅ Server ready (seeding skipped)\n');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();




