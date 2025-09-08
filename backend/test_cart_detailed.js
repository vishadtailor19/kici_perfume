const fetch = require('node-fetch');

async function testCartAdd() {
  try {
    // 1. Login
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
      const loginError = await loginResponse.text();
      throw new Error(`Login failed: ${loginError}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    
    // 2. Test cart add
    console.log('2. Adding product to cart...');
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
    
    console.log('Response status:', addResponse.status);
    console.log('Response headers:', Object.fromEntries(addResponse.headers));
    
    const responseText = await addResponse.text();
    console.log('Response body:', responseText);
    
    if (addResponse.ok) {
      console.log('✅ Cart add successful');
    } else {
      console.log('❌ Cart add failed');
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Raw error:', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCartAdd();
