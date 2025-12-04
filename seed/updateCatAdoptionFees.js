import dotenv from 'dotenv';
dotenv.config();

import Cat from '../models/Cat.js';
import connectDB from '../config/db.js';

const adoptionFees = {
  'Luna': 350.00,
  'Whiskers': 450.00,
  'Shadow': 250.00,
  'Cleo': 400.00,
  'Oliver': 380.00,
  'Bella': 420.00,
  'Max': 200.00,
  'Daisy': 280.00
};

const updateCatAdoptionFees = async () => {
  try {
    await connectDB();
    
    const cats = await Cat.find({ adoptionFee: { $exists: false } });
    
    if (cats.length === 0) {
      console.log('✅ All cats already have adoption fees set');
      return;
    }

    let updated = 0;
    for (const cat of cats) {
      const fee = adoptionFees[cat.name] || 300.00; // Default fee if name not found
      cat.adoptionFee = fee;
      await cat.save();
      updated++;
    }

    console.log(`✅ Updated adoption fees for ${updated} cat(s)`);
    
    // Also update cats with adoptionFee = 0
    const catsWithZeroFee = await Cat.find({ adoptionFee: 0 });
    for (const cat of catsWithZeroFee) {
      const fee = adoptionFees[cat.name] || 300.00;
      cat.adoptionFee = fee;
      await cat.save();
      updated++;
    }

    if (catsWithZeroFee.length > 0) {
      console.log(`✅ Updated ${catsWithZeroFee.length} cat(s) with zero adoption fee`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating adoption fees:', error);
    process.exit(1);
  }
};

updateCatAdoptionFees();

