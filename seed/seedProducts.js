import Product from '../models/Product.js';

const products = [
  {
    name: 'Premium Cat Food - Chicken & Rice',
    description: 'High-quality dry cat food with real chicken as the first ingredient. Perfect for adult cats.',
    price: 29.99,
    category: 'food',
    image: 'catfood1.png',
    stock: 50
  },
  {
    name: 'Gourmet Wet Cat Food Variety Pack',
    description: '12 pack of gourmet wet cat food with various flavors including salmon, tuna, and chicken.',
    price: 24.99,
    category: 'food',
    image: 'catfood2.png',
    stock: 40
  },
  {
    name: 'Cozy Cat Bed',
    description: 'Ultra-soft and comfortable cat bed with raised edges for security and warmth.',
    price: 34.99,
    category: 'furniture',
    image: 'bed1.jpg',
    stock: 30
  }
];

const seedProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      await Product.insertMany(products);
      console.log('✅ Products seeded successfully');
    } else {
      console.log('ℹ️  Products already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

export default seedProducts;







