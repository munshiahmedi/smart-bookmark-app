const http = require('http');

console.log('🔍 Testing Books API...\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/books?page=1&limit=12',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ API Response Status:', res.statusCode);
      console.log('📊 Total Books Found:', response.pagination.totalBooks);
      console.log('📄 Current Page:', response.pagination.currentPage);
      console.log('📚 Books per Page:', response.pagination.limit);
      console.log('📖 Total Pages:', response.pagination.totalPages);
      
      console.log('\n📚 Books Returned:');
      response.books.forEach((book, index) => {
        console.log(`${index + 1}. "${book.title}" by ${book.author} (ID: ${book.id}, Status: ${book.status})`);
      });
      
      console.log('\n🎯 Summary:');
      console.log(`- Showing ${response.books.length} out of ${response.pagination.totalBooks} total books`);
      console.log('- All books should now be visible on frontend!');
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.end();
