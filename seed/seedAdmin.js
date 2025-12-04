import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const admin = await User.create({
        name: 'Shelter Admin',
        email: 'admin@purrfect.com',
        password: 'admin123',
        role: 'admin'
      });

      console.log('✅ Admin account created');
      console.log('   Email: admin@purrfect.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin account already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

export default seedAdmin;




