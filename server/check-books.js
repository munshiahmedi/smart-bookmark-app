const db = require('./db');

db.query('SELECT COUNT(*) as count FROM books', (err, result) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Total books in database:', result[0].count);
  
  if (result[0].count === 0) {
    console.log('No books found. Adding sample books...');
    
    const sampleBooks = [
      ['The Great Adventure', 'John Smith', 'An exciting adventure story', 299, null, 1, 'published', 'Fiction'],
      ['Mystery of the Lost City', 'Jane Doe', 'A thrilling mystery novel', 399, null, 1, 'published', 'Mystery'],
      ['Cooking Made Easy', 'Chef Master', 'Simple recipes for everyone', 199, null, 1, 'published', 'Cooking']
    ];
    
    const sql = 'INSERT INTO books (title, author, description, price, image, user_id, status, category) VALUES ?';
    db.query(sql, [sampleBooks], (err, result) => {
      if (err) {
        console.error('Error adding books:', err);
      } else {
        console.log('Added', result.affectedRows, 'sample books');
      }
      process.exit(0);
    });
  } else {
    console.log('Books already exist in database');
    process.exit(0);
  }
});
