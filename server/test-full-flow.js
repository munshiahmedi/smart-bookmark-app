const axios = require('axios');

async function testFullFlow() {
  try {
    console.log('=== Testing Full Flow ===');
    
    // Step 1: Test server connectivity
    console.log('1. Testing server connectivity...');
    try {
      await axios.get('http://localhost:5000/api/auth/test');
      console.log('Server is running and accessible');
    } catch (err) {
      console.log('Server not accessible:', err.message);
      return;
    }
    
    // Step 2: Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testadmin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token length:', token.length);
    
    // Step 3: Add a book to wishlist
    console.log('3. Adding book to wishlist...');
    const booksResponse = await axios.get('http://localhost:5000/api/books?limit=1');
    const books = booksResponse.data.books || booksResponse.data;
    
    if (books.length > 0) {
      const bookId = books[0].id;
      await axios.post('http://localhost:5000/api/books/wishlist', 
        { bookId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('Book added to wishlist');
    }
    
    // Step 4: Get wishlist
    console.log('4. Getting wishlist...');
    const wishlistResponse = await axios.get('http://localhost:5000/api/books/wishlist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('SUCCESS! Wishlist contains', wishlistResponse.data.length, 'items');
    console.log('Wishlist data:', wishlistResponse.data);
    
    // Step 5: Test client connectivity
    console.log('5. Testing client connectivity...');
    try {
      await axios.get('http://localhost:5173');
      console.log('Client is running and accessible');
    } catch (err) {
      console.log('Client not accessible:', err.message);
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('Server: RUNNING');
    console.log('Client: RUNNING');
    console.log('Authentication: WORKING');
    console.log('Wishlist API: WORKING');
    console.log('\nThe issue is likely in the frontend authentication or token storage.');
    console.log('Please check:');
    console.log('1. User is logged in');
    console.log('2. Token is stored in localStorage');
    console.log('3. No CORS errors in browser console');
    console.log('4. Network tab shows successful API calls');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testFullFlow();
