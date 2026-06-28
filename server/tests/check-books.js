const db = require('./db');

console.log('📚 Checking Available Books...\n');

db.query('SELECT id, title, author FROM books ORDER BY id', (err, result) => {
    if (err) {
        console.error('❌ Error fetching books:', err);
        return;
    }
    
    if (result.length === 0) {
        console.log('📝 No books found in database');
    } else {
        console.log(`✅ Found ${result.length} books:`);
        result.forEach(book => {
            console.log(`- ID: ${book.id}, Title: "${book.title}", Author: ${book.author}`);
        });
    }
    
    console.log('\n🎯 You can use these book IDs to test the wishlist functionality!');
    db.end();
});
