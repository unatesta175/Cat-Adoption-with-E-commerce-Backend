import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import seedAdmin from '../seed/seedAdmin.js';
import seedCats from '../seed/seedCats.js';
import seedProducts from '../seed/seedProducts.js';

dotenv.config();

const resetDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`\n🗑️  Dropping database: ${dbName}`);
    
    // Drop the entire database
    await db.dropDatabase();
    
    console.log('✅ Database dropped successfully\n');
    
    // Seed fresh data
    console.log('🌱 Seeding fresh data...\n');
    await seedAdmin();
    await seedCats();
    await seedProducts();
    
    console.log('\n✅ Database reset and seeded successfully!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

resetDatabase();





