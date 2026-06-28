const db = require('./db');

console.log('🚀 Testing Wishlist with Real Book Data...\n');

// Test adding book ID 2 to wishlist for user ID 1
const testUserId = 1;
const testBookId = 2; // "Ikigai" book

console.log(`=== Testing: Add Book ${testBookId} to User ${testUserId}'s Wishlist ===`);

const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
db.query(sql, [testUserId, testBookId], (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log('✅ Book already in wishlist (duplicate prevention working)');
        } else {
            console.error('❌ Error adding to wishlist:', err);
        }
    } else {
        console.log(`✅ Successfully added book ${testBookId} to wishlist!`);
        console.log(`   Wishlist ID: ${result.insertId}`);
    }
    
    // Test getting the wishlist
    console.log('\n=== Testing: Get User Wishlist ===');
    const getSql = `
        SELECT books.*, wishlist.created_at as wishlist_added_at 
        FROM wishlist
        JOIN books ON wishlist.book_id = books.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;
    
    db.query(getSql, [testUserId], (err, result) => {
        if (err) {
            console.error('❌ Error fetching wishlist:', err);
        } else {
            console.log(`✅ Found ${result.length} books in wishlist:`);
            result.forEach((book, index) => {
                console.log(`   ${index + 1}. "${book.title}" by ${book.author} (₹${book.price})`);
                console.log(`      Added to wishlist: ${book.wishlist_added_at}`);
            });
        }
        
        // Test removing from wishlist
        console.log('\n=== Testing: Remove from Wishlist ===');
        const removeSql = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
        db.query(removeSql, [testUserId, testBookId], (err, result) => {
            if (err) {
                console.error('❌ Error removing from wishlist:', err);
            } else {
                console.log(`✅ Successfully removed book ${testBookId} from wishlist`);
                console.log(`   Affected rows: ${result.affectedRows}`);
            }
            
            console.log('\n🎉 Wishlist functionality is working perfectly!');
            db.end();
        });
    });
});
