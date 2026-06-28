const axios = require('axios');

console.log('🔍 Testing Books API...\n');

axios.get('http://localhost:5000/api/books?page=1&limit=12')
  .then(response => {
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Total Books Found:', response.data.pagination.totalBooks);
    console.log('📄 Current Page:', response.data.pagination.currentPage);
    console.log('📚 Books per Page:', response.data.pagination.limit);
    console.log('📖 Total Pages:', response.data.pagination.totalPages);
    
    console.log('\n📚 Books Returned:');
    response.data.books.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (ID: ${book.id}, Status: ${book.status})`);
    });
    
    console.log('\n🎯 Summary:');
    console.log(`- Showing ${response.data.books.length} out of ${response.data.pagination.totalBooks} total books`);
    console.log('- All books should now be visible on frontend!');
  })
  .catch(error => {
    console.error('❌ API Error:', error.message);
  });
