const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Ceylon Ginger Cinnamon Chai Tea',
    subtitle: 'A lovely warming Chai tea with ginger cinnamon flavours.',
    description: 'Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.',
    category: 'Chai',
    images: ['/assets/images/products/product-1.png'],
    variants: [
      { size: '50g bag',  price: 3.90, stock: 50 },
      { size: '100g bag', price: 6.85, stock: 40 },
      { size: '175g bag', price: 9.90, stock: 30 },
      { size: '250g bag', price: 12.50, stock: 25 },
      { size: '1kg bag',  price: 38.00, stock: 10 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Spicy', 'Earthy', 'Sweet'],
    qualities: ['Stimulating', 'Warming'],
    caffeine: 'Medium Caffeine',
    allergens: [],
    origin: 'Sri Lanka',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '2 tsp per cup 5g per pot',
      waterTemp: '100°C',
      steepingTime: '3-5 minutes',
      colorAfter: '3 minutes'
    },
    isFeatured: true
  },
  {
    name: 'Earl Grey Classic Black Tea',
    subtitle: 'A timeless bergamot-scented black tea.',
    description: 'Premium black tea leaves from Assam blended with natural bergamot oil for a classic Earl Grey experience.',
    category: 'Black Tea',
    images: ['/assets/images/products/product-2.png'],
    variants: [
      { size: '50g bag',  price: 3.50, stock: 60 },
      { size: '100g bag', price: 6.20, stock: 45 },
      { size: '175g bag', price: 9.00, stock: 30 },
      { size: '250g bag', price: 11.50, stock: 20 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Citrus', 'Floral', 'Earthy'],
    qualities: ['Stimulating', 'Refreshing'],
    caffeine: 'High Caffeine',
    allergens: [],
    origin: 'India',
    isOrganic: false,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1 tsp per cup',
      waterTemp: '100°C',
      steepingTime: '3-4 minutes',
      colorAfter: '2 minutes'
    },
    isFeatured: true
  },
  {
    name: 'Japanese Sencha Green Tea',
    subtitle: 'Fresh, grassy and delicately sweet green tea.',
    description: 'Authentic Japanese Sencha grown in the Shizuoka region. Light, fresh and full of antioxidants.',
    category: 'Green Tea',
    images: ['/assets/images/products/product-3.png'],
    variants: [
      { size: '50g bag',  price: 4.20, stock: 55 },
      { size: '100g bag', price: 7.50, stock: 40 },
      { size: '175g bag', price: 10.50, stock: 25 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Grassy', 'Sweet', 'Umami'],
    qualities: ['Refreshing', 'Antioxidant'],
    caffeine: 'Medium Caffeine',
    allergens: [],
    origin: 'Japan',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1 tsp per cup',
      waterTemp: '75°C',
      steepingTime: '2-3 minutes',
      colorAfter: '1 minute'
    },
    isFeatured: true
  },
  {
    name: 'Silver Needle White Tea',
    subtitle: 'Delicate and rare white tea from Fujian.',
    description: 'The finest white tea made from young tea buds. Exceptionally light with a subtle sweetness.',
    category: 'White Tea',
    images: ['/assets/images/products/product-4.png'],
    variants: [
      { size: '50g bag',  price: 6.50, stock: 30 },
      { size: '100g bag', price: 11.00, stock: 20 },
      { size: 'Sampler',  price: 2.50, stock: 80 }
    ],
    flavor: ['Sweet', 'Floral', 'Honey'],
    qualities: ['Calming', 'Antioxidant'],
    caffeine: 'Low Caffeine',
    allergens: [],
    origin: 'China',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1.5 tsp per cup',
      waterTemp: '75°C',
      steepingTime: '4-5 minutes',
      colorAfter: '3 minutes'
    },
    isFeatured: true
  },
  {
    name: 'Ceremonial Grade Matcha',
    subtitle: 'Vibrant, smooth and creamy ceremonial matcha.',
    description: 'Stone-ground ceremonial grade matcha from Uji, Japan. Perfect for traditional whisking or lattes.',
    category: 'Matcha',
    images: ['/assets/images/products/product-5.png'],
    variants: [
      { size: '50g bag',  price: 12.00, stock: 40 },
      { size: '100g bag', price: 22.00, stock: 25 },
      { size: 'Sampler',  price: 3.50, stock: 60 }
    ],
    flavor: ['Grassy', 'Umami', 'Sweet'],
    qualities: ['Energising', 'Focused'],
    caffeine: 'High Caffeine',
    allergens: [],
    origin: 'Japan',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1 tsp per cup',
      waterTemp: '70°C',
      steepingTime: 'Whisk 30 seconds',
      colorAfter: 'Immediately'
    },
    isFeatured: true
  },
  {
    name: 'Chamomile Lavender Herbal Tea',
    subtitle: 'Soothing blend for relaxation and sleep.',
    description: 'Egyptian chamomile flowers blended with French lavender. Naturally caffeine-free and wonderfully calming.',
    category: 'Herbal Tea',
    images: ['/assets/images/products/product-6.png'],
    variants: [
      { size: '50g bag',  price: 3.80, stock: 70 },
      { size: '100g bag', price: 6.50, stock: 50 },
      { size: '175g bag', price: 9.50, stock: 35 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Floral', 'Sweet', 'Honey'],
    qualities: ['Calming', 'Soothing'],
    caffeine: 'No Caffeine',
    allergens: [],
    origin: 'Egypt',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '2 tsp per cup',
      waterTemp: '100°C',
      steepingTime: '5-7 minutes',
      colorAfter: '3 minutes'
    },
    isFeatured: true
  },
  {
    name: 'Dong Ding Oolong Tea',
    subtitle: 'Lightly oxidised oolong with floral notes.',
    description: 'Traditional Taiwanese Dong Ding oolong. Complex, floral and smooth with a lingering sweetness.',
    category: 'Oolong',
    images: ['/assets/images/products/product-7.png'],
    variants: [
      { size: '50g bag',  price: 5.50, stock: 35 },
      { size: '100g bag', price: 9.80, stock: 25 },
      { size: 'Sampler',  price: 2.50, stock: 80 }
    ],
    flavor: ['Floral', 'Fruity', 'Sweet'],
    qualities: ['Refreshing', 'Digestive'],
    caffeine: 'Medium Caffeine',
    allergens: [],
    origin: 'Taiwan',
    isOrganic: false,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1 tsp per cup',
      waterTemp: '85°C',
      steepingTime: '3-4 minutes',
      colorAfter: '2 minutes'
    },
    isFeatured: true
  },
  {
    name: 'Rooibos Vanilla Dream',
    subtitle: 'Naturally sweet caffeine-free South African rooibos.',
    description: 'Premium red rooibos from the Cederberg mountains blended with natural vanilla. Rich, smooth and naturally sweet.',
    category: 'Rooibos',
    images: ['/assets/images/products/product-8.png'],
    variants: [
      { size: '50g bag',  price: 3.50, stock: 60 },
      { size: '100g bag', price: 6.00, stock: 45 },
      { size: '175g bag', price: 8.50, stock: 30 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Vanilla', 'Sweet', 'Earthy'],
    qualities: ['Calming', 'Antioxidant'],
    caffeine: 'No Caffeine',
    allergens: [],
    origin: 'South Africa',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '2 tsp per cup',
      waterTemp: '100°C',
      steepingTime: '5-7 minutes',
      colorAfter: '3 minutes'
    },
    isFeatured: false
  },
  {
    name: 'Peppermint Refresh Herbal Tea',
    subtitle: 'Pure and invigorating peppermint leaves.',
    description: 'Single-origin peppermint leaves from Morocco. Intensely fresh, naturally sweet and wonderfully cooling.',
    category: 'Herbal Tea',
    images: ['/assets/images/products/product-9.png'],
    variants: [
      { size: '50g bag',  price: 3.20, stock: 80 },
      { size: '100g bag', price: 5.50, stock: 60 },
      { size: 'Sampler',  price: 1.95, stock: 100 }
    ],
    flavor: ['Minty', 'Fresh', 'Cool'],
    qualities: ['Refreshing', 'Digestive'],
    caffeine: 'No Caffeine',
    allergens: [],
    origin: 'Morocco',
    isOrganic: true,
    isVegan: true,
    steepingInstructions: {
      servingSize: '1.5 tsp per cup',
      waterTemp: '100°C',
      steepingTime: '5 minutes',
      colorAfter: '3 minutes'
    },
    isFeatured: false
  }
];

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@tea.com',
    password: 'superadmin123',
    role: 'superadmin'
  },
  {
    name: 'Admin User',
    email: 'admin@tea.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Test User',
    email: 'user@tea.com',
    password: 'user123',
    role: 'user'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Cleared existing data');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    for (const userData of users) {
      await User.create(userData);
    }
    console.log(`✅ Seeded ${users.length} users`);

    console.log('\n🔑 Login credentials:');
    console.log('  Superadmin: superadmin@tea.com / superadmin123');
    console.log('  Admin:      admin@tea.com / admin123');
    console.log('  User:       user@tea.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
