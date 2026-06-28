const axios = require('axios');

// Test direct API call without auth (should fail)
async function testDirectWishlist() {
  try {
    console.log('=== Testing Direct Wishlist API (No Auth) ===');
    
    const response = await axios.get('http://localhost:5000/api/books/wishlist');
    console.log('Unexpected success:', response.data);
    
  } catch (error) {
    console.log('Expected error:', error.response?.status, error.response?.data);
  }
}

testDirectWishlist();
