const jwt = require('jsonwebtoken');

console.log('=== Debug Frontend Token Issues ===\n');

// Check what JWT secret the server is using
const serverSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
console.log('Server JWT Secret:', serverSecret);

// Test tokens that might be stored in frontend localStorage
console.log('\n=== Common Frontend Token Issues ===');

// Issue 1: Token generated with wrong secret
console.log('\n1. Token generated with WRONG secret:');
const wrongSecretToken = jwt.sign({ id: 2, email: 'admin@example.com' }, 'wrong-secret');
console.log('Token:', wrongSecretToken);
console.log('Verification with server secret:', jwt.verify(wrongSecretToken, serverSecret, (err, decoded) => {
  if (err) {
    console.log('ERROR:', err.message);
    return null;
  }
  return decoded;
}));

// Issue 2: Token generated with old/default secret
console.log('\n2. Token generated with DEFAULT secret:');
const defaultSecretToken = jwt.sign({ id: 2, email: 'admin@example.com' }, 'your-secret-key');
console.log('Token:', defaultSecretToken);
console.log('Verification with server secret:', jwt.verify(defaultSecretToken, serverSecret, (err, decoded) => {
  if (err) {
    console.log('ERROR:', err.message);
    return null;
  }
  return decoded;
}));

// Issue 3: Expired token
console.log('\n3. EXPIRED token:');
const expiredToken = jwt.sign({ id: 2, email: 'admin@example.com' }, serverSecret, { expiresIn: '-1h' }); // Expired 1 hour ago
console.log('Token:', expiredToken);
console.log('Verification:', jwt.verify(expiredToken, serverSecret, (err, decoded) => {
  if (err) {
    console.log('ERROR:', err.message);
    return null;
  }
  return decoded;
}));

// Issue 4: Correct token (should work)
console.log('\n4. CORRECT token:');
const correctToken = jwt.sign({ id: 2, email: 'admin@example.com' }, serverSecret);
console.log('Token:', correctToken);
console.log('Verification:', jwt.verify(correctToken, serverSecret, (err, decoded) => {
  if (err) {
    console.log('ERROR:', err.message);
    return null;
  }
  return decoded;
}));

console.log('\n=== SOLUTIONS ===');
console.log('1. Check frontend localStorage token');
console.log('2. Ensure login generates token with correct JWT_SECRET');
console.log('3. Clear localStorage and re-login if token is invalid');
console.log('4. Check if JWT_SECRET changed after token was generated');

// Test what a frontend developer might do
console.log('\n=== Frontend Debug Steps ===');
console.log('In browser console, run:');
console.log('localStorage.getItem("token")');
console.log('Then copy that token and decode it at jwt.io to check:');
console.log('- Is it expired?');
console.log('- Was it signed with the right secret?');
console.log('- Does it have the correct user ID?');
