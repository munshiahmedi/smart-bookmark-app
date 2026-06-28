const db = require('./db');
const bcrypt = require('bcrypt');

console.log('🔍 Checking Admin User Password...\n');

db.query('SELECT id, name, email, password FROM users WHERE role = "admin"', (err, result) => {
    if (err) {
        console.error('❌ Error:', err);
        return;
    }
    
    console.log(`✅ Found ${result.length} admin users:`);
    result.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
        console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
        
        // Test some common passwords
        const testPasswords = ['123456', 'password', 'admin', '123123', 'admin123'];
        testPasswords.forEach(testPwd => {
            const isMatch = bcrypt.compareSync(testPwd, user.password);
            if (isMatch) {
                console.log(`  ✅ Password matches: "${testPwd}"`);
            }
        });
    });
    
    console.log('\n💡 If no password matched, you may need to:');
    console.log('1. Check the actual password used during registration');
    console.log('2. Or create a new admin user with known password');
    
    db.end();
});
