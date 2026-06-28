const db = require('./db');

const createWishlistTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS wishlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      book_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_book (user_id, book_id)
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating wishlist table:', err);
      return;
    }
    console.log('✅ Wishlist table created successfully!');
    console.log('📋 Table structure:');
    console.log('- id: INT AUTO_INCREMENT PRIMARY KEY');
    console.log('- user_id: INT (Foreign Key to users)');
    console.log('- book_id: INT (Foreign Key to books)');
    console.log('- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    console.log('- UNIQUE KEY: unique_user_book (user_id, book_id)');
    
    db.end();
  });
};

createWishlistTable();
