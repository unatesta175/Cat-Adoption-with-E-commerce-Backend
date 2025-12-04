import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Connection URI:', process.env.MONGODB_URI);
    console.log('📍 Current Database:', mongoose.connection.db.databaseName);
    
    const databases = await mongoose.connection.db.admin().listDatabases();
    console.log('\n📊 All Databases on Server:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📦 Collections in "${mongoose.connection.db.databaseName}":`);
    if (collections.length === 0) {
      console.log('  ⚠️ No collections found!');
    } else {
      for (const coll of collections) {
        const count = await mongoose.connection.db.collection(coll.name).countDocuments();
        console.log(`  - ${coll.name}: ${count} documents`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();

