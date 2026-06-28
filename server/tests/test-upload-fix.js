const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the upload fix with different image types
console.log('=== Testing Upload Fix ===\n');

// Generate valid token
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
const token = jwt.sign({ id: 2, email: 'admin@example.com' }, JWT_SECRET);

const apiUrl = 'http://localhost:5000/api/books';

// Test 1: Valid PNG image
console.log('1. Testing with valid PNG image:');
const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const pngPath = path.join(__dirname, 'test-upload.png');
fs.writeFileSync(pngPath, pngBuffer);

const formData1 = new FormData();
formData1.append('title', 'PNG Upload Test');
formData1.append('author', 'PNG Test Author');
formData1.append('description', 'Testing PNG upload');
formData1.append('price', '199.99');
formData1.append('status', 'draft');
formData1.append('image', fs.createReadStream(pngPath), {
  filename: 'test-upload.png',
  contentType: 'image/png'
});

axios.post(apiUrl, formData1, {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  timeout: 10000
})
.then(response => {
  console.log('   SUCCESS: PNG upload works');
  console.log('   Status:', response.status);
  console.log('   Book ID:', response.data.bookId);
})
.catch(error => {
  if (error.response) {
    console.log('   ERROR:', error.response.status, error.response.data);
  } else {
    console.log('   ERROR:', error.message);
  }
})
.finally(() => {
  try { fs.unlinkSync(pngPath); } catch (e) {}
});

// Test 2: Valid JPEG image
setTimeout(() => {
  console.log('\n2. Testing with valid JPEG image:');
  const jpegBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A', 'base64');
  const jpegPath = path.join(__dirname, 'test-upload.jpg');
  fs.writeFileSync(jpegPath, jpegBuffer);

  const formData2 = new FormData();
  formData2.append('title', 'JPEG Upload Test');
  formData2.append('author', 'JPEG Test Author');
  formData2.append('description', 'Testing JPEG upload');
  formData2.append('price', '299.99');
  formData2.append('status', 'draft');
  formData2.append('image', fs.createReadStream(jpegPath), {
    filename: 'test-upload.JPG', // Uppercase extension
    contentType: 'image/jpeg'
  });

  axios.post(apiUrl, formData2, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 10000
  })
  .then(response => {
    console.log('   SUCCESS: JPEG upload works (case insensitive)');
    console.log('   Status:', response.status);
    console.log('   Book ID:', response.data.bookId);
  })
  .catch(error => {
    if (error.response) {
      console.log('   ERROR:', error.response.status, error.response.data);
    } else {
      console.log('   ERROR:', error.message);
    }
  })
  .finally(() => {
    try { fs.unlinkSync(jpegPath); } catch (e) {}
  });
}, 2000);

// Test 3: Invalid file (should be rejected)
setTimeout(() => {
  console.log('\n3. Testing with invalid file (should be rejected):');
  const txtBuffer = Buffer.from('This is not an image file', 'utf8');
  const txtPath = path.join(__dirname, 'test-upload.txt');
  fs.writeFileSync(txtPath, txtBuffer);

  const formData3 = new FormData();
  formData3.append('title', 'Invalid File Test');
  formData3.append('author', 'Invalid File Author');
  formData3.append('description', 'Testing invalid file rejection');
  formData3.append('price', '399.99');
  formData3.append('status', 'draft');
  formData3.append('image', fs.createReadStream(txtPath), {
    filename: 'test-upload.txt',
    contentType: 'text/plain'
  });

  axios.post(apiUrl, formData3, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 10000
  })
  .then(response => {
    console.log('   UNEXPECTED SUCCESS: Invalid file was accepted!');
  })
  .catch(error => {
    if (error.response) {
      console.log('   EXPECTED ERROR: Invalid file rejected');
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data);
    } else {
      console.log('   ERROR:', error.message);
    }
  })
  .finally(() => {
    try { fs.unlinkSync(txtPath); } catch (e) {}
  });
}, 4000);

// Test 4: No image (should work)
setTimeout(() => {
  console.log('\n4. Testing with no image (should work):');
  const formData4 = new FormData();
  formData4.append('title', 'No Image Test');
  formData4.append('author', 'No Image Author');
  formData4.append('description', 'Testing without image');
  formData4.append('price', '99.99');
  formData4.append('status', 'draft');

  axios.post(apiUrl, formData4, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 10000
  })
  .then(response => {
    console.log('   SUCCESS: No image upload works');
    console.log('   Status:', response.status);
    console.log('   Book ID:', response.data.bookId);
  })
  .catch(error => {
    if (error.response) {
      console.log('   ERROR:', error.response.status, error.response.data);
    } else {
      console.log('   ERROR:', error.message);
    }
  });
}, 6000);
