import Cat from '../models/Cat.js';

const sampleCats = [
  {
    name: 'Luna',
    breed: 'Siamese',
    age: 2,
    gender: 'female',
    description: 'Luna is a graceful and vocal Siamese cat who loves attention and conversation. She enjoys interactive play and following her favorite humans around the house.',
    image: 'luna.jpg',
    adoptionFee: 350.00,
    traits: {
      energyLevel: 'high',
      maintenanceLevel: 'moderate',
      goodWithKids: true,
      personality: 'social'
    }
  },
  {
    name: 'Whiskers',
    breed: 'Maine Coon',
    age: 4,
    gender: 'male',
    description: 'Whiskers is a gentle giant with a calm demeanor. He enjoys lounging by the window and occasional play sessions. Perfect for a relaxed home environment.',
    image: 'whiskers.jpg',
    adoptionFee: 450.00,
    traits: {
      energyLevel: 'low',
      maintenanceLevel: 'high',
      goodWithKids: true,
      personality: 'calm'
    }
  },
  {
    name: 'Shadow',
    breed: 'Domestic Shorthair',
    age: 1,
    gender: 'male',
    description: 'Shadow is an energetic and playful kitten who loves chasing toys and climbing. He would thrive in an active household with plenty of entertainment.',
    image: 'shadow.jpg',
    adoptionFee: 250.00,
    traits: {
      energyLevel: 'high',
      maintenanceLevel: 'low',
      goodWithKids: true,
      personality: 'playful'
    }
  },
  {
    name: 'Cleo',
    breed: 'Persian',
    age: 5,
    gender: 'female',
    description: 'Cleo is an elegant Persian who enjoys a quiet life. She requires regular grooming but rewards her family with affectionate purrs and gentle companionship.',
    image: 'cleo.jpg',
    adoptionFee: 400.00,
    traits: {
      energyLevel: 'low',
      maintenanceLevel: 'high',
      goodWithKids: false,
      personality: 'calm'
    }
  },
  {
    name: 'Oliver',
    breed: 'British Shorthair',
    age: 3,
    gender: 'male',
    description: 'Oliver is an independent and easygoing cat. He is content with his own company but also enjoys affection on his terms. Great for first-time owners.',
    image: 'oliver.jpg',
    adoptionFee: 380.00,
    traits: {
      energyLevel: 'moderate',
      maintenanceLevel: 'low',
      goodWithKids: true,
      personality: 'independent'
    }
  },
  {
    name: 'Bella',
    breed: 'Ragdoll',
    age: 2,
    gender: 'female',
    description: 'Bella lives up to her breed name - she goes limp when picked up! She is incredibly social and follows her humans everywhere, seeking constant companionship.',
    image: 'bella.jpg',
    adoptionFee: 420.00,
    traits: {
      energyLevel: 'moderate',
      maintenanceLevel: 'moderate',
      goodWithKids: true,
      personality: 'social'
    }
  },
  {
    name: 'Max',
    breed: 'Tabby',
    age: 6,
    gender: 'male',
    description: 'Max is a wise and independent senior cat who enjoys his routines. He is low-maintenance and perfect for someone looking for a calm companion.',
    image: 'max.jpg',
    adoptionFee: 200.00,
    traits: {
      energyLevel: 'low',
      maintenanceLevel: 'low',
      goodWithKids: false,
      personality: 'independent'
    }
  },
  {
    name: 'Daisy',
    breed: 'Calico',
    age: 1,
    gender: 'female',
    description: 'Daisy is a spirited young cat with a playful personality. She loves toys, treats, and acrobatic feats. She needs an active home to match her energy.',
    image: 'daisy.jpg',
    adoptionFee: 280.00,
    traits: {
      energyLevel: 'high',
      maintenanceLevel: 'low',
      goodWithKids: true,
      personality: 'playful'
    }
  }
];

const seedCats = async () => {
  try {
    // Check if cats already exist
    const count = await Cat.countDocuments();

    if (count === 0) {
      await Cat.insertMany(sampleCats);
      console.log(`✅ ${sampleCats.length} sample cats added to database`);
    } else {
      console.log(`✅ Database already has ${count} cat(s)`);
      
      // Update existing cats that don't have adoption fees or have 0 fee
      const catsWithoutFee = await Cat.find({ 
        $or: [
          { adoptionFee: { $exists: false } },
          { adoptionFee: 0 }
        ]
      });
      
      if (catsWithoutFee.length > 0) {
        const feeMap = {};
        sampleCats.forEach(cat => {
          feeMap[cat.name] = cat.adoptionFee;
        });
        
        for (const cat of catsWithoutFee) {
          const fee = feeMap[cat.name] || 300.00; // Default fee if name not found
          cat.adoptionFee = fee;
          await cat.save();
        }
        console.log(`✅ Updated adoption fees for ${catsWithoutFee.length} existing cat(s)`);
      }
    }
  } catch (error) {
    console.error('Error seeding cats:', error);
  }
};

export default seedCats;




