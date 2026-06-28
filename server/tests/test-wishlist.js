const db = require('./db');
const jwt = require('jsonwebtoken');

console.log('🚀 Testing Wishlist Functionality...\n');

// Test 1: Check if wishlist table exists and has data
console.log('=== 1. Checking Wishlist Table ===');
db.query('DESCRIBE wishlist', (err, result) => {
    if (err) {
        console.error('❌ Error describing wishlist table:', err);
        return;
    }
    console.log('✅ Wishlist table structure:');
    result.forEach(col => console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`));
    
    // Test 2: Check existing wishlist data
    console.log('\n=== 2. Checking Existing Wishlist Data ===');
    db.query('SELECT * FROM wishlist', (err, result) => {
        if (err) {
            console.error('❌ Error fetching wishlist data:', err);
            return;
        }
        if (result.length === 0) {
            console.log('📝 Wishlist is currently empty');
        } else {
            console.log(`📝 Found ${result.length} wishlist items:`);
            result.forEach(item => {
                console.log(`- User ${item.user_id} saved Book ${item.book_id} at ${item.created_at}`);
            });
        }
        
        // Test 3: Test adding to wishlist
        console.log('\n=== 3. Testing Add to Wishlist ===');
        const testUserId = 1;
        const testBookId = 1;
        
        const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
        db.query(sql, [testUserId, testBookId], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('✅ Duplicate prevention working - book already in wishlist');
                } else {
                    console.error('❌ Error adding to wishlist:', err);
                }
            } else {
                console.log(`✅ Successfully added book ${testBookId} to wishlist for user ${testUserId}`);
            }
            
            // Test 4: Test getting wishlist with JOIN
            console.log('\n=== 4. Testing Wishlist JOIN Query ===');
            const joinSql = `
                SELECT books.*, wishlist.created_at as wishlist_added_at 
                FROM wishlist
                JOIN books ON wishlist.book_id = books.id
                WHERE wishlist.user_id = ?
                ORDER BY wishlist.created_at DESC
            `;
            
            db.query(joinSql, [testUserId], (err, result) => {
                if (err) {
                    console.error('❌ Error with JOIN query:', err);
                } else {
                    console.log(`✅ JOIN query successful - found ${result.length} books in wishlist`);
                    if (result.length > 0) {
                        console.log('Sample result:', {
                            id: result[0].id,
                            title: result[0].title,
                            author: result[0].author,
                            wishlist_added_at: result[0].wishlist_added_at
                        });
                    }
                }
                
                console.log('\n🎉 Wishlist functionality test completed!');
                db.end();
            });
        });
    });
});
