const db = require('./db');

const sql = "SELECT id, name, email, role FROM users";

db.query(sql, (err, result) => {
    if (err) {
        console.error('Error:', err);
        process.exit();
    }
    
    console.log('Current users in database:');
    console.table(result);
    
    if (result.length === 0) {
        console.log('No users found. Please register a user first.');
    } else {
        console.log('\nTo make a user admin, update the email in create-admin.js and run it again.');
    }
    
    process.exit();
});
