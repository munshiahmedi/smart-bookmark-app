const axios = require('axios');

async function testWishlistFull() {
  try {
    console.log('=== Testing Wishlist Full Flow ===');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testadmin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful!');
    
    // Step 2: Get available books
    console.log('2. Getting available books...');
    const booksResponse = await axios.get('http://localhost:5000/api/books?limit=5');
    const books = booksResponse.data.books || booksResponse.data;
    console.log('Found', books.length, 'books');
    
    if (books.length === 0) {
      console.log('No books available to add to wishlist');
      return;
    }
    
    const firstBook = books[0];
    console.log('First book:', firstBook.title, '(ID:', firstBook.id, ')');
    
    // Step 3: Add book to wishlist
    console.log('3. Adding book to wishlist...');
    try {
      const addResponse = await axios.post('http://localhost:5000/api/books/wishlist', 
        { bookId: firstBook.id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('Added to wishlist:', addResponse.data.message);
    } catch (addError) {
      console.log('Add to wishlist error:', addError.response?.data || addError.message);
    }
    
    // Step 4: Get wishlist
    console.log('4. Getting wishlist...');
    const wishlistResponse = await axios.get('http://localhost:5000/api/books/wishlist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Wishlist response type:', typeof wishlistResponse.data);
    console.log('Is array?', Array.isArray(wishlistResponse.data));
    console.log('Wishlist length:', wishlistResponse.data.length || 'N/A');
    console.log('Wishlist items:', wishlistResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testWishlistFull();
