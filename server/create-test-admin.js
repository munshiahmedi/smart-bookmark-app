const db = require('./db');
const bcrypt = require('bcrypt');

console.log('👤 Creating Test Admin User...\n');

const newAdmin = {
  name: 'Test Admin',
  email: 'testadmin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Hash the password
bcrypt.hash(newAdmin.password, 10, (err, hash) => {
  if (err) {
    console.error('❌ Error hashing password:', err);
    return;
  }
  
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [newAdmin.name, newAdmin.email, hash, newAdmin.role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️ Admin user already exists');
      } else {
        console.error('❌ Error creating admin:', err);
      }
      return;
    }
    
    console.log('✅ Test admin user created successfully!');
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Password: ${newAdmin.password}`);
    console.log(`👤 Role: ${newAdmin.role}`);
    console.log(`🆔 User ID: ${result.insertId}`);
    
    console.log('\n🌐 You can now login with these credentials to test wishlist functionality');
    
    db.end();
  });
});
