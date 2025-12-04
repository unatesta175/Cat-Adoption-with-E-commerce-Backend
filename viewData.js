import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Cat from './models/Cat.js';
import Adoption from './models/Adoption.js';

dotenv.config();

const viewData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to: purrfect-match database\n');

    // View Users
    console.log('👥 USERS:');
    console.log('─'.repeat(80));
    const users = await User.find().select('-password');
    users.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      if (user.preferences?.homeType) {
        console.log(`   Preferences: ${user.preferences.homeType}, ${user.preferences.activityLevel}, Kids: ${user.preferences.hasKids}`);
      }
      console.log('');
    });

    // View Cats
    console.log('\n🐱 CATS:');
    console.log('─'.repeat(80));
    const cats = await Cat.find();
    cats.forEach(cat => {
      console.log(`🐈 ${cat.name} (${cat.breed})`);
      console.log(`   Age: ${cat.age} years | Gender: ${cat.gender}`);
      console.log(`   Energy: ${cat.traits.energyLevel} | Personality: ${cat.traits.personality}`);
      console.log(`   Good with kids: ${cat.traits.goodWithKids ? 'Yes' : 'No'}`);
      console.log(`   Status: ${cat.isAdopted ? '❌ Adopted' : '✅ Available'}`);
      console.log('');
    });

    // View Adoptions
    console.log('\n💝 ADOPTION REQUESTS:');
    console.log('─'.repeat(80));
    const adoptions = await Adoption.find()
      .populate('userId', 'name email')
      .populate('catId', 'name breed');
    
    if (adoptions.length === 0) {
      console.log('   No adoption requests yet\n');
    } else {
      adoptions.forEach(adoption => {
        console.log(`📋 Request ID: ${adoption._id}`);
        console.log(`   User: ${adoption.userId.name} (${adoption.userId.email})`);
        console.log(`   Cat: ${adoption.catId.name} (${adoption.catId.breed})`);
        console.log(`   Status: ${adoption.status.toUpperCase()}`);
        console.log(`   Date: ${adoption.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('─'.repeat(80));
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Cats: ${cats.length}`);
    console.log(`   Available Cats: ${cats.filter(c => !c.isAdopted).length}`);
    console.log(`   Adoption Requests: ${adoptions.length}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

viewData();




