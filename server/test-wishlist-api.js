const axios = require('axios');

// Test the wishlist API
async function testWishlist() {
  try {
    // First check if server is running
    try {
      await axios.get('http://localhost:5000/api/auth/test');
      console.log('Server is running');
    } catch (serverError) {
      console.log('Server is not running or not accessible');
      return;
    }
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@example.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, got token');
    
    // Test wishlist API
    const wishlistResponse = await axios.get('http://localhost:5000/api/books/wishlist', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Wishlist API Response:', wishlistResponse.data);
    console.log('Response type:', typeof wishlistResponse.data);
    console.log('Is array?', Array.isArray(wishlistResponse.data));
    
  } catch (error) {
    console.error('Error testing wishlist:', error.response?.data || error.message);
  }
}

testWishlist();
