const { 
  sequelize, 
  User, 
  Product, 
  Category, 
  Brand, 
  FragranceNote, 
  ProductFragranceNote,
  ProductImage,
  Review,
  syncDatabase 
} = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Force sync database (recreate tables)
    await syncDatabase(true);
    
    // Create Categories
    const categories = await Category.bulkCreate([
      { name: 'Floral', slug: 'floral', description: 'Floral fragrances featuring flower essences' },
      { name: 'Fresh', slug: 'fresh', description: 'Light, clean, and refreshing scents' },
      { name: 'Oriental', slug: 'oriental', description: 'Warm, spicy, and exotic fragrances' },
      { name: 'Woody', slug: 'woody', description: 'Earthy, warm wood-based scents' },
      { name: 'Citrus', slug: 'citrus', description: 'Bright, zesty citrus-based fragrances' },
      { name: 'Spicy', slug: 'spicy', description: 'Warm spices and aromatic herbs' },
      { name: 'Gourmand', slug: 'gourmand', description: 'Edible, dessert-like fragrances' },
      { name: 'Aquatic', slug: 'aquatic', description: 'Ocean-inspired, marine scents' }
    ]);
    
    // Create Brands
    const brands = await Brand.bulkCreate([
      { 
        name: 'Kici Signature',
        slug: 'kici-signature',
        description: 'Our exclusive signature collection',
        country_of_origin: 'France',
        founded_year: 2020,
        is_featured: true
      },
      { 
        name: 'Maison Lumière',
        slug: 'maison-lumiere',
        description: 'Luxury French perfumery',
        country_of_origin: 'France',
        founded_year: 1985,
        is_featured: true
      },
      { 
        name: 'Essence Royale',
        slug: 'essence-royale',
        description: 'Premium artisanal fragrances',
        country_of_origin: 'Italy',
        founded_year: 1992
      },
      { 
        name: 'Urban Scents',
        slug: 'urban-scents',
        description: 'Modern, contemporary fragrances',
        country_of_origin: 'United States',
        founded_year: 2015
      }
    ]);
    
    // Create Fragrance Notes
    const fragranceNotes = await FragranceNote.bulkCreate([
      // Top Notes
      { name: 'Bergamot', type: 'top', scent_family: 'citrus', intensity: 7, longevity: 3 },
      { name: 'Lemon', type: 'top', scent_family: 'citrus', intensity: 8, longevity: 2 },
      { name: 'Orange Blossom', type: 'top', scent_family: 'floral', intensity: 6, longevity: 4 },
      { name: 'Pink Pepper', type: 'top', scent_family: 'spicy', intensity: 5, longevity: 3 },
      { name: 'Green Apple', type: 'top', scent_family: 'fruity', intensity: 6, longevity: 2 },
      
      // Heart Notes
      { name: 'Rose', type: 'heart', scent_family: 'floral', intensity: 8, longevity: 6, is_natural: true },
      { name: 'Jasmine', type: 'heart', scent_family: 'floral', intensity: 9, longevity: 7, is_natural: true },
      { name: 'Lavender', type: 'heart', scent_family: 'floral', intensity: 5, longevity: 5, is_natural: true },
      { name: 'Geranium', type: 'heart', scent_family: 'floral', intensity: 6, longevity: 5 },
      { name: 'Lily of the Valley', type: 'heart', scent_family: 'floral', intensity: 4, longevity: 4 },
      
      // Base Notes
      { name: 'Sandalwood', type: 'base', scent_family: 'woody', intensity: 7, longevity: 9, is_natural: true },
      { name: 'Vanilla', type: 'base', scent_family: 'gourmand', intensity: 6, longevity: 8 },
      { name: 'Musk', type: 'base', scent_family: 'oriental', intensity: 8, longevity: 10 },
      { name: 'Amber', type: 'base', scent_family: 'oriental', intensity: 7, longevity: 9 },
      { name: 'Cedarwood', type: 'base', scent_family: 'woody', intensity: 6, longevity: 8, is_natural: true }
    ]);
    
    // Create Products
    const products = await Product.bulkCreate([
      {
        name: 'Citrus Burst',
        slug: 'citrus-burst',
        description: 'A vibrant and energizing citrus fragrance that captures the essence of a Mediterranean summer. Perfect for daily wear with its fresh and uplifting character.',
        short_description: 'Vibrant citrus fragrance for daily wear',
        brand_id: brands[0].id,
        category_id: categories[4].id, // Citrus
        price: 89.99,
        compare_price: 109.99,
        stock_quantity: 50,
        sku: 'PRF001',
        concentration: 'eau_de_toilette',
        gender: 'unisex',
        launch_year: 2023,
        perfumer: 'Marie Dubois',
        longevity: 6,
        sillage: 7,
        season: ['spring', 'summer'],
        occasion: ['casual', 'office', 'daytime'],
        is_featured: true,
        is_new_arrival: true,
        tags: ['fresh', 'energizing', 'citrus', 'summer']
      },
      {
        name: 'Oriental Mystique',
        slug: 'oriental-mystique',
        description: 'An enchanting oriental fragrance that weaves together exotic spices and warm amber. A sophisticated scent for evening occasions.',
        short_description: 'Exotic oriental fragrance for evening',
        brand_id: brands[1].id,
        category_id: categories[2].id, // Oriental
        price: 149.99,
        compare_price: 179.99,
        stock_quantity: 30,
        sku: 'PRF002',
        concentration: 'eau_de_parfum',
        gender: 'women',
        launch_year: 2022,
        perfumer: 'Alessandro Romano',
        longevity: 9,
        sillage: 8,
        season: ['autumn', 'winter'],
        occasion: ['evening', 'formal', 'date'],
        is_featured: true,
        is_bestseller: true,
        tags: ['oriental', 'spicy', 'warm', 'evening']
      },
      {
        name: 'Rose Garden Dreams',
        slug: 'rose-garden-dreams',
        description: 'A romantic floral bouquet centered around the queen of flowers - rose. Complemented by soft jasmine and lily of the valley.',
        short_description: 'Romantic rose-centered floral bouquet',
        brand_id: brands[1].id,
        category_id: categories[0].id, // Floral
        price: 119.99,
        stock_quantity: 40,
        sku: 'PRF003',
        concentration: 'eau_de_parfum',
        gender: 'women',
        launch_year: 2023,
        perfumer: 'Sophie Laurent',
        longevity: 8,
        sillage: 6,
        season: ['spring', 'summer'],
        occasion: ['romantic', 'casual', 'daytime'],
        is_new_arrival: true,
        tags: ['floral', 'romantic', 'rose', 'feminine']
      },
      {
        name: 'Woody Essence',
        slug: 'woody-essence',
        description: 'A sophisticated woody fragrance featuring rich sandalwood and cedar. Perfect for the modern gentleman.',
        short_description: 'Sophisticated woody fragrance for men',
        brand_id: brands[2].id,
        category_id: categories[3].id, // Woody
        price: 134.99,
        stock_quantity: 25,
        sku: 'PRF004',
        concentration: 'eau_de_parfum',
        gender: 'men',
        launch_year: 2021,
        perfumer: 'Jean-Claude Moreau',
        longevity: 9,
        sillage: 7,
        season: ['autumn', 'winter'],
        occasion: ['office', 'formal', 'evening'],
        is_bestseller: true,
        tags: ['woody', 'masculine', 'sophisticated', 'cedar']
      },
      {
        name: 'Fresh Breeze',
        slug: 'fresh-breeze',
        description: 'A light and airy fragrance that captures the essence of a cool ocean breeze. Refreshing and perfect for any time of day.',
        short_description: 'Light and refreshing ocean-inspired scent',
        brand_id: brands[3].id,
        category_id: categories[1].id, // Fresh
        price: 79.99,
        stock_quantity: 60,
        sku: 'PRF005',
        concentration: 'eau_de_toilette',
        gender: 'unisex',
        launch_year: 2023,
        perfumer: 'Emma Thompson',
        longevity: 5,
        sillage: 5,
        season: ['spring', 'summer'],
        occasion: ['casual', 'sport', 'daytime'],
        is_new_arrival: true,
        tags: ['fresh', 'aquatic', 'light', 'clean']
      }
    ]);
    
    // Create Product Images
    await ProductImage.bulkCreate([
      // Citrus Burst images
      { product_id: products[0].id, url: '/images/CitrusBurst.jpg', alt_text: 'Citrus Burst Perfume', is_primary: true, sort_order: 1 },
      
      // Oriental Mystique images
      { product_id: products[1].id, url: '/images/OrientalFragrance.jpg', alt_text: 'Oriental Mystique Perfume', is_primary: true, sort_order: 1 },
      
      // Rose Garden Dreams images
      { product_id: products[2].id, url: '/images/rose-garden.jpg', alt_text: 'Rose Garden Dreams Perfume', is_primary: true, sort_order: 1 },
      
      // Woody Essence images
      { product_id: products[3].id, url: '/images/woody-essence.jpg', alt_text: 'Woody Essence Perfume', is_primary: true, sort_order: 1 },
      
      // Fresh Breeze images
      { product_id: products[4].id, url: '/images/fresh-breeze.jpg', alt_text: 'Fresh Breeze Perfume', is_primary: true, sort_order: 1 }
    ]);
    
    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@kici-perfume.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-0123',
      is_active: true,
      email_verified: true
    });
    
    // Create Sample Customer
    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      phone: '+1-555-0456',
      preferred_fragrance_types: ['citrus', 'fresh', 'woody'],
      newsletter_subscribed: true,
      is_active: true,
      email_verified: true
    });
    
    console.log('✅ Database seeded successfully!');
    console.log(`✨ Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${brands.length} brands`);
    console.log(`   - ${fragranceNotes.length} fragrance notes`);
    console.log(`   - ${products.length} products`);
    console.log(`   - 2 users (1 admin, 1 customer)`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;