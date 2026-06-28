const db = require('./db');
const jwt = require('jsonwebtoken');

// Check books table structure
console.log('=== Checking books table structure ===');
db.query('DESCRIBE books', (err, result) => {
    if (err) {
        console.error('Error describing books table:', err);
        return;
    }
    console.log('Books table columns:');
    result.forEach(col => console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`));
    
    // Test creating a simple book without image
    console.log('\n=== Testing book creation ===');
    const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        price: '10.99',
        status: 'draft',
        user_id: 1 // Assuming user ID 1 exists
    };
    
    const sql = 'INSERT INTO books (title, author, description, price, status, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [testBook.title, testBook.author, testBook.description, testBook.price, testBook.status, testBook.user_id], (err, result) => {
        if (err) {
            console.error('Error creating test book:', err);
        } else {
            console.log('Test book created successfully with ID:', result.insertId);
        }
        
        // Test JWT token generation
        console.log('\n=== Testing JWT token ===');
        const testToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);
        console.log('Generated test token:', testToken);
        
        db.end();
    });
});
