const db = require("../db");
const bcrypt = require("bcrypt");

// Get user statistics including books data
const getUserStatistics = (req, res) => {
  const userId = req.userid;
  
  const queries = [
    // Get user basic info
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    // Get user's books count
    "SELECT COUNT(*) as totalBooks FROM books WHERE user_id = ?",
    // Get user's recent books
    "SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
    // Get user's books by month for growth stats
    `SELECT COUNT(*) as currentMonthBooks FROM books WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
    `SELECT COUNT(*) as previousMonthBooks FROM books WHERE user_id = ? AND MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))`
  ];

  Promise.all(queries.map((query, index) => 
    new Promise((resolve, reject) => {
      const params = index < 3 ? [userId] : [userId, userId];
      db.query(query, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  ))
  .then(([userResult, booksCountResult, recentBooksResult, currentMonthResult, previousMonthResult]) => {
    const userData = userResult[0];
    const totalBooks = booksCountResult[0].totalBooks;
    const currentMonthBooks = currentMonthResult[0].currentMonthBooks;
    const previousMonthBooks = previousMonthResult[0].previousMonthBooks;
    
    // Calculate growth
    const booksGrowth = previousMonthBooks > 0 
      ? Math.round(((currentMonthBooks - previousMonthBooks) / previousMonthBooks) * 100)
      : (currentMonthBooks > 0 ? 100 : 0);

    res.json({
      ...userData,
      statistics: {
        totalBooks,
        currentMonthBooks,
        booksGrowth,
        recentBooks: recentBooksResult,
        joinDate: userData.created_at
      }
    });
  })
  .catch(err => {
    console.error('User statistics error:', err);
    res.status(500).json({ error: err.message });
  });
};

const getProfile = async (req, res) => {
  console.log('req.userid:', req.userid);
  const userid = req.userid;
  
  const queries = [
    // Get user basic info including DOB
    "SELECT id, name, email, dob, created_at FROM users WHERE id = ?",
    // Get user's books count
    "SELECT COUNT(*) as totalBooks FROM books WHERE user_id = ?",
    // Get user's all books
    "SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC",
    // Get user's books by month for growth stats
    `SELECT COUNT(*) as currentMonthBooks FROM books WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
    `SELECT COUNT(*) as previousMonthBooks FROM books WHERE user_id = ? AND MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))`
  ];

  Promise.all(queries.map((query, index) => 
    new Promise((resolve, reject) => {
      const params = index < 3 ? [userid] : [userid, userid];
      db.query(query, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  ))
  .then(([userResult, booksCountResult, userBooksResult, currentMonthResult, previousMonthResult]) => {
    if(userResult.length == 0) return res.status(404).json({message: "User Not Found"});
    
    const userData = userResult[0];
    const totalBooks = booksCountResult[0].totalBooks;
    const currentMonthBooks = currentMonthResult[0].currentMonthBooks;
    const previousMonthBooks = previousMonthResult[0].previousMonthBooks;
    
    // Calculate growth
    const booksGrowth = previousMonthBooks > 0 
      ? Math.round(((currentMonthBooks - previousMonthBooks) / previousMonthBooks) * 100)
      : (currentMonthBooks > 0 ? 100 : 0);

    // Calculate age from DOB if available
    let age = null;
    if (userData.dob) {
      const today = new Date();
      const birthDate = new Date(userData.dob);
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    res.json({
      ...userData,
      age,
      statistics: {
        totalBooks,
        currentMonthBooks,
        booksGrowth,
        books: userBooksResult,
        joinDate: userData.created_at
      }
    });
  })
  .catch(err => {
    console.error('Profile error:', err);
    res.status(500).json({ error: err.message });
  });
};

// Update user profile
const updateProfile = async (req, res) => {
  const userId = req.userid;
  const { name, email, password, dob } = req.body;
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const sql = `
    UPDATE users SET 
      name = ?, 
      email = ?, 
      dob = ?${password ? ", password = ?" : ""}
    WHERE id = ?
  `;

  const params = password ? [name, email, dob, hashedPassword, userId] : [name, email, dob, userId];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profile updated successfully" });
  });
};

module.exports = { getProfile, updateProfile, getUserStatistics };