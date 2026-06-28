// Test if token exists in localStorage
console.log('=== Testing Token in LocalStorage ===');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

if (localStorage.getItem('token')) {
  console.log('Token exists, user should be logged in');
} else {
  console.log('No token found, user needs to login');
}
