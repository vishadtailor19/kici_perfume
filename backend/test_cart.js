const fetch = require('node-fetch');

async function testCart() {
  try {
    // 1. Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    
    // 2. Add item to cart
    console.log('2. Adding item to cart...');
    const addResponse = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: 1,
        quantity: 2
      })
    });
    
    if (addResponse.ok) {
      const addData = await addResponse.json();
      console.log('✅ Item added to cart:', addData.message);
    } else {
      const errorData = await addResponse.json();
      console.log('❌ Add to cart failed:', errorData);
    }
    
    // 3. Get cart contents
    console.log('3. Getting cart contents...');
    const cartResponse = await fetch('http://localhost:5000/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (cartResponse.ok) {
      const cartData = await cartResponse.json();
      console.log('✅ Cart contents:', {
        items: cartData.items.length,
        totalItems: cartData.totalItems,
        totalAmount: cartData.totalAmount
      });
    } else {
      console.log('❌ Failed to get cart');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCart();
