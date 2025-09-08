const { Product } = require('./models');

async function checkProducts() {
  try {
    const products = await Product.findAll({ limit: 5 });
    console.log(`Found ${products.length} products in database`);
    
    if (products.length === 0) {
      console.log('No products found. Creating sample product...');
      
      const sampleProduct = await Product.create({
        name: 'Sample Perfume',
        brand_id: 1,
        category_id: 1,
        price: 999.99,
        description: 'A sample perfume for testing',
        stock_quantity: 100,
        concentration: 'eau_de_parfum',
        size_ml: 50,
        sku: 'SAMPLE-001',
        is_active: true
      });
      
      console.log('✅ Sample product created:', sampleProduct.name);
    } else {
      console.log('✅ Products available:');
      products.forEach(p => console.log(`- ${p.name} (ID: ${p.id}, Stock: ${p.stock_quantity})`));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkProducts();
