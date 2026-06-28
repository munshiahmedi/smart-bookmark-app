const db = require('./db');

const sql = 'ALTER TABLE users ADD COLUMN dob DATE DEFAULT NULL';

db.query(sql, (err, result) => {
  if (err) {
    console.log('Column might already exist or error:', err.message);
  } else {
    console.log('DOB column added successfully');
  }
  db.end();
});
