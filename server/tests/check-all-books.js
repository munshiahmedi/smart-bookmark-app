const db = require('./db');

console.log('🔍 Checking ALL Books in Database...\n');

// Check all books regardless of status
db.query('SELECT id, title, author, status, created_at FROM books ORDER BY id', (err, result) => {
    if (err) {
        console.error('❌ Error fetching books:', err);
        return;
    }
    
    console.log(`📊 Total books in database: ${result.length}`);
    
    if (result.length === 0) {
        console.log('📝 No books found in database');
        return;
    }
    
    console.log('\n📚 All Books:');
    result.forEach((book, index) => {
        console.log(`${index + 1}. ID: ${book.id}`);
        console.log(`   Title: "${book.title}"`);
        console.log(`   Author: ${book.author}`);
        console.log(`   Status: ${book.status}`);
        console.log(`   Created: ${book.created_at}`);
        console.log('');
    });
    
    // Count by status
    const statusCounts = {};
    result.forEach(book => {
        statusCounts[book.status] = (statusCounts[book.status] || 0) + 1;
    });
    
    console.log('📈 Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`- ${status}: ${count} books`);
    });
    
    console.log('\n💡 If you expected more books, they may have been deleted.');
    console.log('🛠️ You can add new books through the Add Book page (admin only).');
    
    db.end();
});
