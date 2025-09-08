// Debug script to check image URLs in products
const { Product } = require('./models');

async function debugImages() {
  console.log('🔍 Debugging Image Display Issue...\n');

  try {
    // Get all products with their image URLs
    const products = await Product.findAll({
      attributes: ['id', 'name', 'image_url', 'sku'],
      limit: 10,
      order: [['id', 'DESC']]
    });

    console.log(`📊 Found ${products.length} products:\n`);

    products.forEach(product => {
      console.log(`Product ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`SKU: ${product.sku}`);
      console.log(`Image URL: ${product.image_url || 'NULL'}`);
      console.log(`Has Image: ${product.image_url ? '✅ YES' : '❌ NO'}`);
      console.log('---');
    });

    // Check if any products have image URLs
    const productsWithImages = products.filter(p => p.image_url);
    console.log(`\n📸 Products with images: ${productsWithImages.length}/${products.length}`);

    if (productsWithImages.length > 0) {
      console.log('\n✅ Products that SHOULD show images:');
      productsWithImages.forEach(p => {
        console.log(`- ${p.name}: ${p.image_url}`);
        console.log(`  Full URL: http://localhost:5000${p.image_url}`);
      });
    } else {
      console.log('\n❌ NO products have image URLs saved!');
      console.log('This is why images are not displaying.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugImages();
