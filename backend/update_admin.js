const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function updateAdmin() {
  try {
    // Update admin@example.com password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [updatedRows] = await User.update(
      { password: hashedPassword },
      { where: { email: 'admin@example.com' } }
    );
    
    if (updatedRows > 0) {
      console.log('✅ Admin password updated');
      
      // Verify the update
      const admin = await User.findOne({ where: { email: 'admin@example.com' } });
      const isValid = await bcrypt.compare('admin123', admin.password);
      console.log('✅ Password verification:', isValid);
    } else {
      console.log('❌ No admin user found to update');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

updateAdmin();
