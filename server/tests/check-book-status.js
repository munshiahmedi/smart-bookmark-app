const db = require('./db');

console.log('📚 Checking Book Statuses...\n');

db.query('SELECT id, title, status FROM books ORDER BY id', (err, result) => {
    if (err) {
        console.error('❌ Error fetching books:', err);
        return;
    }
    
    if (result.length === 0) {
        console.log('📝 No books found in database');
    } else {
        console.log(`✅ Found ${result.length} books with their statuses:`);
        
        const statusCounts = {};
        result.forEach(book => {
            console.log(`- ID: ${book.id}, Title: "${book.title}", Status: "${book.status}"`);
            
            // Count statuses
            statusCounts[book.status] = (statusCounts[book.status] || 0) + 1;
        });
        
        console.log('\n📊 Status Summary:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`- ${status}: ${count} books`);
        });
        
        console.log('\n🔍 Books with status = "published":');
        const publishedBooks = result.filter(book => book.status === 'published');
        if (publishedBooks.length === 0) {
            console.log('❌ No books with "published" status found!');
            console.log('💡 This is why you\'re not seeing books on the frontend.');
            console.log('🛠️ The frontend only shows books with status = "published"');
        } else {
            console.log(`✅ Found ${publishedBooks.length} published books:`);
            publishedBooks.forEach(book => {
                console.log(`   - ${book.title} (ID: ${book.id})`);
            });
        }
    }
    
    db.end();
});
