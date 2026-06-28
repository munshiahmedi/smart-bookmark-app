const db = require('./db');

console.log('📚 Publishing All Books...\n');

db.query('UPDATE books SET status = "published" WHERE status = "draft"', (err, result) => {
    if (err) {
        console.error('❌ Error updating books:', err);
        return;
    }
    
    console.log(`✅ Successfully published ${result.affectedRows} books!`);
    
    // Verify the update
    db.query('SELECT id, title, status FROM books ORDER BY id', (err, books) => {
        if (err) {
            console.error('❌ Error verifying books:', err);
            return;
        }
        
        console.log('\n📋 Updated Book Statuses:');
        books.forEach(book => {
            console.log(`- ID: ${book.id}, Title: "${book.title}", Status: "${book.status}"`);
        });
        
        console.log('\n🎉 All books are now published and will be visible on the frontend!');
        db.end();
    });
});
