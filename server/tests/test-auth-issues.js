const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test various authentication scenarios
console.log('=== Testing Authentication Issues ===\n');

// Create a test image file
const testImagePath = path.join(__dirname, 'test-auth-image.png');
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(testImagePath, testImageBuffer);

const apiUrl = 'http://localhost:5000/api/books';

// Test 1: No token
console.log('1. Testing with NO token:');
const formData1 = new FormData();
formData1.append('title', 'No Token Test');
formData1.append('author', 'No Token Author');
formData1.append('description', 'Testing without token');
formData1.append('price', '99.99');
formData1.append('status', 'draft');

axios.post(apiUrl, formData1, { timeout: 5000 })
.catch(error => {
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Response:', error.response.data);
  }
});

// Test 2: Invalid token format
console.log('\n2. Testing with INVALID token format:');
const formData2 = new FormData();
formData2.append('title', 'Invalid Token Test');
formData2.append('author', 'Invalid Token Author');
formData2.append('description', 'Testing with invalid token');
formData2.append('price', '199.99');
formData2.append('status', 'draft');

axios.post(apiUrl, formData2, {
  headers: {
    'Authorization': 'invalid-token-format'
  },
  timeout: 5000
})
.catch(error => {
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Response:', error.response.data);
  }
});

// Test 3: Expired/invalid JWT token
console.log('\n3. Testing with EXPIRED/invalid JWT token:');
const formData3 = new FormData();
formData3.append('title', 'Expired Token Test');
formData3.append('author', 'Expired Token Author');
formData3.append('description', 'Testing with expired token');
formData3.append('price', '299.99');
formData3.append('status', 'draft');

// Create a token with wrong secret
const wrongToken = jwt.sign({ id: 2, email: 'test@example.com' }, 'wrong-secret');

axios.post(apiUrl, formData3, {
  headers: {
    'Authorization': `Bearer ${wrongToken}`
  },
  timeout: 5000
})
.catch(error => {
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Response:', error.response.data);
  }
});

// Test 4: Valid token but non-existent user
console.log('\n4. Testing with valid token but NON-EXISTENT user:');
const formData4 = new FormData();
formData4.append('title', 'Non-existent User Test');
formData4.append('author', 'Non-existent User Author');
formData4.append('description', 'Testing with non-existent user');
formData4.append('price', '399.99');
formData4.append('status', 'draft');

// Create a token with non-existent user ID
const nonExistentUserToken = jwt.sign({ id: 999, email: 'nonexistent@example.com' }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');

axios.post(apiUrl, formData4, {
  headers: {
    'Authorization': `Bearer ${nonExistentUserToken}`
  },
  timeout: 5000
})
.catch(error => {
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Response:', error.response.data);
  }
});

// Test 5: Valid token (should work)
console.log('\n5. Testing with VALID token:');
const formData5 = new FormData();
formData5.append('title', 'Valid Token Test');
formData5.append('author', 'Valid Token Author');
formData5.append('description', 'Testing with valid token');
formData5.append('price', '499.99');
formData5.append('status', 'draft');
formData5.append('image', fs.createReadStream(testImagePath), {
  filename: 'test-auth-image.png',
  contentType: 'image/png'
});

const validToken = jwt.sign({ id: 2, email: 'admin@example.com' }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');

axios.post(apiUrl, formData5, {
  headers: {
    'Authorization': `Bearer ${validToken}`
  },
  timeout: 5000
})
.then(response => {
  console.log('   Status:', response.status);
  console.log('   Response:', response.data);
})
.catch(error => {
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Response:', error.response.data);
  }
});

// Clean up
setTimeout(() => {
  try {
    fs.unlinkSync(testImagePath);
    console.log('\n6. Cleaned up test image');
  } catch (error) {
    console.error('Failed to clean up:', error.message);
  }
}, 2000);
