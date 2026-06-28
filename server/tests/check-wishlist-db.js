const db = require('./db');

console.log('🔍 Checking Wishlist Database...\n');

// Check if wishlist table exists and has data
db.query('DESCRIBE wishlist', (err, result) => {
    if (err) {
        console.error('❌ Error describing wishlist table:', err);
        return;
    }
    
    console.log('✅ Wishlist table structure:');
    result.forEach(col => console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`));
    
    // Check wishlist data
    db.query('SELECT * FROM wishlist', (err, wishlistData) => {
        if (err) {
            console.error('❌ Error fetching wishlist data:', err);
            return;
        }
        
        console.log(`\n📊 Total wishlist items: ${wishlistData.length}`);
        
        if (wishlistData.length === 0) {
            console.log('📝 Wishlist is empty - this is why API returns empty array');
        } else {
            console.log('📋 Wishlist items:');
            wishlistData.forEach((item, index) => {
                console.log(`${index + 1}. User ${item.user_id} -> Book ${item.book_id} (Added: ${item.created_at})`);
            });
        }
        
        // Test the exact query used in getWishlist
        console.log('\n🧪 Testing the exact query from getWishlist controller...');
        const testUserId = 2; // Admin user
        const sql = `
            SELECT books.*, wishlist.created_at as wishlist_added_at 
            FROM wishlist
            JOIN books ON wishlist.book_id = books.id
            WHERE wishlist.user_id = ?
            ORDER BY wishlist.created_at DESC
        `;
        
        db.query(sql, [testUserId], (err, result) => {
            if (err) {
                console.error('❌ Error with wishlist query:', err);
                return;
            }
            
            console.log(`\n✅ Query result for user ${testUserId}:`);
            console.log('Result type:', typeof result);
            console.log('Is array?', Array.isArray(result));
            console.log('Result length:', result.length);
            
            if (result.length === 0) {
                console.log('📝 No wishlist items found for this user - this is normal if user hasn\'t saved any books yet');
            } else {
                result.forEach((item, index) => {
                    console.log(`${index + 1}. "${item.title}" (ID: ${item.id})`);
                });
            }
            
            console.log('\n🎯 Conclusion:');
            if (wishlistData.length === 0) {
                console.log('✅ Wishlist API is working correctly - it returns empty array when no items exist');
                console.log('💡 Frontend error occurs because it tries to call .map() on empty array');
                console.log('🛠️ This should be handled in frontend code');
            } else {
                console.log('✅ Wishlist API should return array of books');
            }
            
            db.end();
        });
    });
});
