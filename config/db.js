import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('📍 Please set MONGODB_URI in Railway environment variables');
      process.exit(1);
    }

    // Log connection attempt (without exposing password)
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.log(`🔌 Attempting to connect to MongoDB...`);
    console.log(`📍 Connection URI: ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 60000, // 60 seconds (Railway needs more time)
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      retryWrites: true,
      w: 'majority',
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    const uri = process.env.MONGODB_URI || '';
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.error(`📍 Connection URI: ${maskedUri}`);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MongoDB service is running in Railway');
    console.error('   2. Verify MONGODB_URI is set correctly');
    console.error('   3. For Railway MongoDB: Copy MONGO_URL from MongoDB service variables');
    console.error('   4. For Atlas: Use mongodb+srv:// format with correct credentials');
    process.exit(1);
  }
};

export default connectDB;




