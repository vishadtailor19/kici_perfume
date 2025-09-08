const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function checkUsers() {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'role', 'password'],
      limit: 10 
    });
    
    console.log(`Found ${users.length} users:`);
    
    for (const user of users) {
      console.log(`- ${user.email} (${user.role}) - ID: ${user.id}`);
      
      // Test password for admin user
      if (user.email === 'admin@example.com') {
        const isValidPassword = await bcrypt.compare('admin123', user.password);
        console.log(`  Password 'admin123' valid: ${isValidPassword}`);
      }
    }
    
    // Create a test user if none exist
    if (users.length === 0) {
      console.log('Creating test user...');
      const hashedPassword = await bcrypt.hash('test123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log('✅ Test user created');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkUsers();
