const db = require('./db');

db.query('SELECT email, name, role FROM users', (err, result) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Users in database:');
  result.forEach(user => {
    console.log(`- ${user.email} (${user.name}) - ${user.role}`);
  });
  process.exit(0);
});
