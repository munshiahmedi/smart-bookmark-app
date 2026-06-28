const db = require('./db');

// Update a user to admin role - replace with your actual email
const email = 'adil@gmail.com'; // Change this to your email

const sql = "UPDATE users SET role = 'admin' WHERE email = ?";
const checkSql = "SELECT id, name, email, role FROM users WHERE email = ?";

// First check if user exists
db.query(checkSql, [email], (err, result) => {
    if (err) {
        console.error('Error checking user:', err);
        process.exit();
    }
    
    if (result.length === 0) {
        console.log(`User with email '${email}' not found. Please register first.`);
        process.exit();
    }
    
    const user = result[0];
    console.log('Current user data:', user);
    
    // Update to admin
    db.query(sql, [email], (err, updateResult) => {
        if (err) {
            console.error('Error updating user role:', err);
            process.exit();
        }
        
        if (updateResult.affectedRows === 0) {
            console.log('No changes made.');
            process.exit();
        }
        
        console.log(`Successfully updated ${email} to admin role!`);
        
        // Verify the update
        db.query(checkSql, [email], (err, verifyResult) => {
            if (err) {
                console.error('Error verifying update:', err);
                process.exit();
            }
            
            console.log('Updated user data:', verifyResult[0]);
            process.exit();
        });
    });
});
