const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test book creation with image upload
console.log('=== Testing Book Creation with Image Upload ===\n');

// Create a test image file (simple 1x1 pixel PNG)
const testImagePath = path.join(__dirname, 'test-image.png');
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('1. Created test image file');

// Generate JWT token for testing
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
const testUser = { id: 2, email: 'admin@example.com' }; // Assuming user ID 2 exists
const token = jwt.sign(testUser, JWT_SECRET);
console.log('JWT Secret being used:', JWT_SECRET);

console.log('2. Generated JWT token for user ID:', testUser.id);

// Prepare form data
const form = new FormData();
form.append('title', 'Test Book with Image');
form.append('author', 'Test Author');
form.append('description', 'This is a test book with image upload');
form.append('price', '299.99');
form.append('status', 'published');

// Append the image file
form.append('image', fs.createReadStream(testImagePath), {
  filename: 'test-image.png',
  contentType: 'image/png'
});

console.log('3. Prepared form data with image');

// Make the API call
const apiUrl = 'http://localhost:5000/api/books';

console.log('4. Making API call to:', apiUrl);
console.log('   Token:', token.substring(0, 20) + '...');

axios.post(apiUrl, form, {
  headers: {
    'Authorization': `Bearer ${token}`,
    ...form.getHeaders()
  },
  timeout: 10000
})
.then(response => {
  console.log('5. SUCCESS! Book created:');
  console.log('   Status:', response.status);
  console.log('   Response:', response.data);
  
  // Clean up test image
  fs.unlinkSync(testImagePath);
  console.log('6. Cleaned up test image');
})
.catch(error => {
  console.error('5. ERROR! Failed to create book:');
  
  if (error.response) {
    // Server responded with error status
    console.error('   Status:', error.response.status);
    console.error('   Response:', error.response.data);
    console.error('   Headers:', error.response.headers);
  } else if (error.request) {
    // Request was made but no response received
    console.error('   No response received:', error.message);
    console.error('   Request details:', error.request);
  } else {
    // Something else happened
    console.error('   Error message:', error.message);
  }
  
  // Check common issues
  console.log('\n6. TROUBLESHOOTING:');
  
  if (error.code === 'ECONNREFUSED') {
    console.log('   - Server is not running on localhost:5000');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('   - Request timed out (server may be slow)');
  } else if (error.response && error.response.status === 401) {
    console.log('   - Authentication failed (invalid token)');
  } else if (error.response && error.response.status === 400) {
    console.log('   - Bad request (missing required fields)');
  } else if (error.response && error.response.status === 500) {
    console.log('   - Server error (check server logs)');
  }
  
  // Clean up test image
  try {
    fs.unlinkSync(testImagePath);
    console.log('7. Cleaned up test image');
  } catch (cleanupError) {
    console.error('   Failed to clean up test image:', cleanupError.message);
  }
});
