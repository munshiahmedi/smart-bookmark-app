const db = require('./db');

console.log('🧪 Adding Test Wishlist Data...\n');

// Add the available book (ID: 6) to user 2's wishlist
const userId = 2; // Admin user
const bookId = 6; // "unique story" book

console.log(`Adding book ${bookId} to user ${userId}'s wishlist...`);

const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
db.query(sql, [userId, bookId], (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log('✅ Book already in wishlist (duplicate prevention working)');
        } else {
            console.error('❌ Error adding to wishlist:', err);
        }
    } else {
        console.log(`✅ Successfully added book ${bookId} to wishlist!`);
        console.log(`   Wishlist ID: ${result.insertId}`);
    }
    
    // Verify the wishlist data
    console.log('\n🔍 Verifying wishlist data...');
    const verifySql = `
        SELECT books.*, wishlist.created_at as wishlist_added_at 
        FROM wishlist
        JOIN books ON wishlist.book_id = books.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;
    
    db.query(verifySql, [userId], (err, result) => {
        if (err) {
            console.error('❌ Error verifying wishlist:', err);
            return;
        }
        
        console.log(`✅ Wishlist verification successful - found ${result.length} items:`);
        result.forEach((item, index) => {
            console.log(`${index + 1}. "${item.title}" by ${item.author} (ID: ${item.id})`);
            console.log(`   Added to wishlist: ${item.wishlist_added_at}`);
        });
        
        console.log('\n🎉 Test data added successfully!');
        console.log('💡 Now the frontend should show this book in wishlist');
        console.log('🌐 You can test by logging in and checking the Books page or Wishlist page');
        
        db.end();
    });
});
