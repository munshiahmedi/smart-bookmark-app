const axios = require('axios');

async function testFrontendAuth() {
  try {
    console.log('=== Testing Frontend Auth Flow ===');
    
    // Step 1: Login exactly like frontend does
    console.log('1. Logging in like frontend...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testadmin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('Login successful!');
    console.log('Token:', token.substring(0, 50) + '...');
    console.log('User:', user);
    
    // Step 2: Store token and user like frontend does
    const localStorageMock = {
      token: token,
      user: JSON.stringify(user)
    };
    console.log('Stored in localStorage mock');
    
    // Step 3: Make wishlist request exactly like frontend
    console.log('2. Making wishlist request like frontend...');
    
    const config = {
      headers: { 
        'Authorization': `Bearer ${localStorageMock.token}` 
      }
    };
    
    console.log('Request config:', config);
    
    const wishlistResponse = await axios.get('http://localhost:5000/api/books/wishlist', config);
    
    console.log('SUCCESS! Wishlist response:');
    console.log('- Type:', typeof wishlistResponse.data);
    console.log('- Is array:', Array.isArray(wishlistResponse.data));
    console.log('- Length:', wishlistResponse.data.length);
    console.log('- Data:', wishlistResponse.data);
    
  } catch (error) {
    console.error('ERROR:', error.response?.status, error.response?.data || error.message);
    if (error.response) {
      console.log('Response headers:', error.response.headers);
    }
  }
}

testFrontendAuth();
