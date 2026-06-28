const db = require('./db');

const sql = 'ALTER TABLE books ADD COLUMN user_id INT DEFAULT NULL';

db.query(sql, (err, result) => {
  if (err) {
    console.log('Column might already exist or error:', err.message);
  } else {
    console.log('User ID column added successfully');
  }
  db.end();
});
