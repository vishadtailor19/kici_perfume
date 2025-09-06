const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@kici.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const sampleProducts = [
  {
    name: 'Midnight Rose',
    description: 'A captivating blend of midnight roses with hints of vanilla and musk. This enchanting fragrance opens with fresh rose petals, evolves into a heart of deep florals, and settles into a warm, sensual base.',
    brand: 'Kici',
    category: 'Floral',
    price: 89.99,
    stock: 15,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        alt: 'Midnight Rose perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Rose Petals', 'Pink Pepper', 'Bergamot'],
      heart: ['Midnight Rose', 'Jasmine', 'Peony'],
      base: ['Vanilla', 'Musk', 'Sandalwood']
    },
    size: '50ml',
    tags: ['romantic', 'evening', 'floral', 'elegant']
  },
  {
    name: 'Ocean Breeze',
    description: 'Fresh oceanic notes with citrus and marine accords. Experience the invigorating sensation of sea spray and coastal winds in this refreshing aquatic fragrance.',
    brand: 'Kici',
    category: 'Fresh',
    price: 79.99,
    stock: 22,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
        alt: 'Ocean Breeze perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Sea Salt', 'Lemon', 'Marine Accord'],
      heart: ['Water Lily', 'Cyclamen', 'Freesia'],
      base: ['Driftwood', 'Ambergris', 'White Musk']
    },
    size: '50ml',
    tags: ['fresh', 'aquatic', 'summer', 'clean']
  },
  {
    name: 'Golden Amber',
    description: 'Rich amber with warm spices and exotic woods. A luxurious oriental fragrance that evokes the warmth of golden sunsets and ancient treasures.',
    brand: 'Kici',
    category: 'Oriental',
    price: 99.99,
    stock: 8,
    images: [
      {
        url: '/images/Amber.jpg',
        alt: 'Golden Amber perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Saffron', 'Cardamom', 'Orange Blossom'],
      heart: ['Golden Amber', 'Rose', 'Oud'],
      base: ['Sandalwood', 'Vanilla', 'Patchouli']
    },
    size: '50ml',
    tags: ['luxury', 'warm', 'oriental', 'evening']
  },
  {
    name: 'Citrus Burst',
    description: 'Energizing citrus blend with bergamot and lemon zest. A vibrant and uplifting fragrance that captures the essence of Mediterranean citrus groves.',
    brand: 'Kici',
    category: 'Citrus',
    price: 69.99,
    stock: 30,
    images: [
      {
        url: '/images/CitrusBurst.jpg',
        alt: 'Citrus Burst perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Bergamot', 'Lemon Zest', 'Grapefruit'],
      heart: ['Orange Blossom', 'Neroli', 'Petitgrain'],
      base: ['Cedar', 'White Musk', 'Vetiver']
    },
    size: '50ml',
    tags: ['energizing', 'citrus', 'fresh', 'daytime']
  },
  {
    name: 'Velvet Orchid',
    description: 'Exotic orchid with creamy vanilla and soft woods. A sophisticated floral fragrance that embodies elegance and femininity.',
    brand: 'Kici',
    category: 'Floral',
    price: 94.99,
    stock: 12,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
        alt: 'Velvet Orchid perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Black Currant', 'Honey', 'Bergamot'],
      heart: ['Orchid', 'Lotus', 'Spiced Rose'],
      base: ['Vanilla', 'Sandalwood', 'Balmy Woods']
    },
    size: '50ml',
    tags: ['sophisticated', 'floral', 'elegant', 'feminine']
  },
  {
    name: 'Mystic Woods',
    description: 'Deep forest notes with cedar and pine. A mysterious and grounding fragrance that captures the essence of ancient woodlands.',
    brand: 'Kici',
    category: 'Woody',
    price: 84.99,
    stock: 18,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
        alt: 'Mystic Woods perfume bottle',
        isPrimary: true
      }
    ],
    fragranceNotes: {
      top: ['Pine Needles', 'Juniper', 'Eucalyptus'],
      heart: ['Cedar', 'Cypress', 'Fir Balsam'],
      base: ['Oakmoss', 'Amber', 'Musk']
    },
    size: '50ml',
    tags: ['woody', 'mysterious', 'grounding', 'unisex']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kici-perfume');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`👥 Created ${users.length} users`);

    // Create products
    const products = await Product.create(sampleProducts);
    console.log(`🛍️  Created ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@kici.com / password123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();