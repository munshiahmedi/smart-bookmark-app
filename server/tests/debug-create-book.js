const db = require('./db');

console.log('🔍 Comprehensive Create Book Debug...\n');

// Test 1: Check database connection
console.log('1. Testing database connection...');
db.query('SELECT 1 as test', (err, result) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        return;
    }
    console.log('✅ Database connection OK');
    
    // Test 2: Check if books table exists and has correct structure
    console.log('\n2. Checking books table structure...');
    db.query('DESCRIBE books', (err, result) => {
        if (err) {
            console.error('❌ Error describing books table:', err);
            return;
        }
        console.log('✅ Books table structure:');
        result.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
        });
        
        // Test 3: Try to insert a test book directly
        console.log('\n3. Testing direct book insertion...');
        const testBook = {
            title: 'Debug Test Book',
            author: 'Debug Author',
            description: 'Debug Description',
            price: '299',
            status: 'published',
            user_id: 2 // Admin user ID
        };
        
        const insertSql = 'INSERT INTO books (title, author, description, price, status, user_id) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertSql, [testBook.title, testBook.author, testBook.description, testBook.price, testBook.status, testBook.user_id], (err, result) => {
            if (err) {
                console.error('❌ Direct insert error:', err);
                
                // Check for common errors
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('ℹ️ Duplicate entry error (not critical)');
                } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    console.log('❌ Foreign key constraint error - user_id may not exist');
                } else if (err.code === 'ER_BAD_NULL_ERROR') {
                    console.log('❌ NULL constraint error - missing required field');
                } else {
                    console.log('❌ Other database error:', err.code, err.message);
                }
                return;
            }
            
            console.log('✅ Direct insert successful!');
            console.log(`   Book ID: ${result.insertId}`);
            console.log(`   Title: ${testBook.title}`);
            
            // Test 4: Verify the book was inserted
            console.log('\n4. Verifying insertion...');
            db.query('SELECT * FROM books WHERE id = ?', [result.insertId], (err, verifyResult) => {
                if (err) {
                    console.error('❌ Verification error:', err);
                } else {
                    console.log('✅ Book verified in database:');
                    console.log(`   ID: ${verifyResult[0].id}`);
                    console.log(`   Title: ${verifyResult[0].title}`);
                    console.log(`   Author: ${verifyResult[0].author}`);
                }
            });
            
            // Test 5: Check current books count
            console.log('\n5. Checking total books count...');
            db.query('SELECT COUNT(*) as total FROM books', (err, countResult) => {
                if (err) {
                    console.error('❌ Count error:', err);
                } else {
                    console.log(`✅ Total books in database: ${countResult[0].total}`);
                }
            });
            
            console.log('\n🎯 Debug Summary:');
            console.log('- Database Connection: ✅');
            console.log('- Books Table: ✅');
            console.log('- Direct Insert: ✅');
            console.log('- Book Creation: Working');
            
            console.log('\n💡 If frontend shows "Failed to add book", the issue is:');
            console.log('1. Authentication (wrong token/user)');
            console.log('2. Network connectivity');
            console.log('3. Frontend form validation');
            console.log('4. Server-side validation errors');
            
            db.end();
        });
    });
});
