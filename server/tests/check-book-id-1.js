const db = require('./db');

console.log('🔍 Checking for Book ID 1...\n');

db.query('SELECT id, title, author FROM books WHERE id = 1', (err, result) => {
    if (err) {
        console.error('❌ Error checking book ID 1:', err);
        return;
    }
    
    console.log(`📊 Found ${result.length} books with ID 1:`);
    
    if (result.length === 0) {
        console.log('❌ No book found with ID 1');
        console.log('💡 This is why you get 500 error when accessing /books/1');
        console.log('🔍 Available books:');
        
        // Show all available books
        db.query('SELECT id, title FROM books ORDER BY id', (err, allBooks) => {
            if (err) {
                console.error('❌ Error fetching all books:', err);
                return;
            }
            
            console.log(`📚 Total books in database: ${allBooks.length}`);
            allBooks.forEach((book, index) => {
                console.log(`  ${index + 1}. ID: ${book.id}, Title: "${book.title}"`);
            });
            
            console.log('\n💡 Solutions:');
            console.log('1. Try accessing a different book ID that exists');
            console.log('2. Add a new book with ID 1');
            console.log('3. Check if book was deleted');
        });
    } else {
        result.forEach(book => {
            console.log(`✅ Found: ID: ${book.id}, Title: "${book.title}", Author: ${book.author}`);
        });
        
        console.log('\n🌐 Try accessing: http://localhost:3000/books/1');
        console.log('📱 Or check the book Details page from Books list');
    }
    
    db.end();
});
