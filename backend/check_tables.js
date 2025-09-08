const { Brand, Category, sequelize } = require('./models');

async function checkTables() {
  try {
    // Check if Brand table exists and has data
    const brands = await Brand.findAll({ limit: 3 });
    console.log(`✅ Brands table: ${brands.length} records`);
    
    // Check if Category table exists and has data
    const categories = await Category.findAll({ limit: 3 });
    console.log(`✅ Categories table: ${categories.length} records`);
    
    // Create default brand and category if they don't exist
    if (brands.length === 0) {
      await Brand.create({
        name: 'Kici',
        description: 'Kici Perfume Brand',
        is_active: true
      });
      console.log('✅ Default brand created');
    }
    
    if (categories.length === 0) {
      await Category.create({
        name: 'Perfume',
        description: 'Perfume Category',
        is_active: true
      });
      console.log('✅ Default category created');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkTables();
