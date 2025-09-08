const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Check if admin user exists
    const existingUser = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (existingUser) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user created:', user.email);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

createTestUser();
