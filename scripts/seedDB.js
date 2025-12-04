import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import seedAdmin from '../seed/seedAdmin.js';
import seedCats from '../seed/seedCats.js';
import seedProducts from '../seed/seedProducts.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('\n🌱 Seeding database...\n');
    
    // Seed data (seeders handle checking if data exists)
    await seedAdmin();
    await seedCats();
    await seedProducts();
    
    console.log('\n✅ Database seeded successfully!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();





