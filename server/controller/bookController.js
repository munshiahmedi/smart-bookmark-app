const db = require("../db");

// Dashboard statistics
const getDashboardStats = (req, res) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const queries = [
        "SELECT COUNT(*) as totalBooks FROM books",
        "SELECT COUNT(*) as totalUsers FROM users",
        "SELECT * FROM books ORDER BY created_at DESC LIMIT 5",
        `SELECT COUNT(*) as currentMonthBooks FROM books WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?`,
        `SELECT COUNT(*) as previousMonthBooks FROM books WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?`,
        `SELECT COUNT(*) as currentMonthUsers FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?`,
        `SELECT COUNT(*) as previousMonthUsers FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?`
    ];

    Promise.all(queries.map((query, index) => 
        new Promise((resolve, reject) => {
            let params = [];
            if (index === 3) params = [currentMonth + 1, currentYear]; // MySQL months are 1-based
            if (index === 4) params = [previousMonth + 1, previousYear];
            if (index === 5) params = [currentMonth + 1, currentYear];
            if (index === 6) params = [previousMonth + 1, previousYear];
            
            db.query(query, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    ))
    .then(([booksResult, usersResult, recentBooksResult, currentMonthBooksResult, previousMonthBooksResult, currentMonthUsersResult, previousMonthUsersResult]) => {
        const totalBooks = booksResult[0].totalBooks;
        const totalUsers = usersResult[0].totalUsers;
        const currentMonthBooks = currentMonthBooksResult[0].currentMonthBooks;
        const previousMonthBooks = previousMonthBooksResult[0].previousMonthBooks;
        const currentMonthUsers = currentMonthUsersResult[0].currentMonthUsers;
        const previousMonthUsers = previousMonthUsersResult[0].previousMonthUsers;

        console.log('Stats debug:', {
            currentMonth,
            currentYear,
            previousMonth,
            previousYear,
            currentMonthBooks,
            previousMonthBooks,
            currentMonthUsers,
            previousMonthUsers
        });

        // Calculate growth percentages
        const booksGrowth = previousMonthBooks > 0 
            ? Math.round(((currentMonthBooks - previousMonthBooks) / previousMonthBooks) * 100)
            : (currentMonthBooks > 0 ? 100 : 0);

        const usersGrowth = previousMonthUsers > 0
            ? Math.round(((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100)
            : (currentMonthUsers > 0 ? 100 : 0);

        res.json({
            totalBooks,
            totalUsers,
            currentMonthBooks,
            userBooks: Math.floor(totalBooks * 0.2), // Temporary fallback
            recentBooks: recentBooksResult,
            growth: {
                books: booksGrowth,
                users: usersGrowth
            }
        });
    })
    .catch(err => {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: err.message });
    });
};

const getBooks = (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    
    // Build the base query - only show published books
    let sql = "SELECT * FROM books WHERE status = 'published'";
    let params = [];
    
    // Add search condition if provided
    if (search) {
        sql += " AND (title LIKE ? OR author LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
    
    // Get total count for pagination - only count published books
    let countSql = "SELECT COUNT(*) as total FROM books WHERE status = 'published'";
    let countParams = [];
    if (search) {
        countSql += " AND (title LIKE ? OR author LIKE ?)";
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm);
    }
    
    // Execute both queries
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(countSql, countParams, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].total);
            });
        })
    ])
    .then(([books, total]) => {
        res.json({
            books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBooks: total,
                limit: parseInt(limit)
            }
        });
    })
    .catch(err => {
        console.error('Get books error:', err);
        res.status(500).json({ error: err.message });
    });
};

const getBooksById = (req, res) => {
    console.log("getBooksById called with ID:", req.params.id);
    const sql = "SELECT * FROM books WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.send(result[0]);
        }
    });
};

const createBook = (req, res) => {
    console.log('=== CREATE BOOK DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User ID from token:', req.userid);
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('========================');
    
    // Check if req.body exists and has data
    if (!req.body) {
        console.error('ERROR: req.body is undefined or null');
        return res.status(400).json({ error: 'Request body is missing' });
    }
    
    const { title, author, description, price, status, category } = req.body;
    console.log('Extracted fields:');
    console.log('- title:', title);
    console.log('- author:', author);
    console.log('- description:', description);
    console.log('- price:', price);
    console.log('- category:', category);
    
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('Image path:', image);
    
    const userId = req.userid; // Get user_id from authenticated user
    console.log('User ID:', userId);
    
    const bookStatus = status || 'draft'; // Default to draft if not provided
    console.log('Book status:', bookStatus);
    
    // Validate required fields
    if (!title || !author) {
        console.error('Validation failed: Missing title or author');
        return res.status(400).json({ error: 'Title and author are required' });
    }
    
    if (!userId) {
        console.error('Validation failed: User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const sql = "INSERT INTO books (title, author, description, price, image, user_id, status, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [title, author, description, price, image, userId, bookStatus, category];
    
    console.log('SQL Query:', sql);
    console.log('SQL Params:', params);
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Database error details:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState,
                message: err.message
            });
            return res.status(500).json({ error: err.message });
        }
        
        console.log('SUCCESS: Book created with ID:', result.insertId);
        res.status(201).json({ 
            message: "Book created", 
            bookId: result.insertId,
            image: image 
        });
    });
};

const updateBook = (req, res) => {
    const { id } = req.params;
    
    // Debug logging
    console.log('=== UPDATE BOOK DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Update book ID:', id);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('========================');
    
    // Safety check for req.body
    if (!req.body) {
        console.log('ERROR: req.body is undefined!');
        return res.status(400).json({ 
            error: 'Request body is missing. Please check your form submission.' 
        });
    }
    
    // Handle FormData - fields might be undefined or empty strings
    const title = req.body.title && req.body.title.trim() ? req.body.title.trim() : null;
    const author = req.body.author && req.body.author.trim() ? req.body.author.trim() : null;
    const description = req.body.description ? req.body.description.trim() : '';
    const price = req.body.price ? req.body.price.toString() : '0';
    const category = req.body.category ? req.body.category.trim() : null;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Validate required fields
    if (!title || !author) {
        return res.status(400).json({ 
            error: 'Missing required fields: title and author are required' 
        });
    }
    
    // First, get the current book data to preserve existing image if no new image is uploaded
    const getBookSql = "SELECT * FROM books WHERE id = ?";
    db.query(getBookSql, [id], (err, bookResult) => {
        if (err) {
            console.error('Error fetching book:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (bookResult.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        const currentBook = bookResult[0];
        const finalImage = image || currentBook.image; // Use new image or keep existing
        
        // Build dynamic SQL query
        let sql = "UPDATE books SET title = ?, author = ?, description = ?, price = ?, image = ?, category = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?";
        let params = [title, author, description, price, finalImage, category, id];
        
        console.log('Final SQL:', sql);
        console.log('Final params:', params);
        
        db.query(sql, params, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                console.log('No rows affected, book not found');
                return res.status(404).json({ message: "Book not found" });
            }
            console.log('Update successful:', result);
            res.json({ 
                message: "Book updated", 
                image: finalImage 
            });
        });
    });
};

// Delete a book
const deleteBook = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted" });
    });
};

const getMyBooks = (req, res) => {
    console.log('=== GET MY BOOKS DEBUG ===');
    console.log('req.userid:', req.userid);
    console.log('req.user:', req.user);
    console.log('req headers:', req.headers);
    
    const userId = req.userid;
    console.log('Final userId:', userId);

    const sql = "SELECT * FROM books WHERE user_id = ?";
    console.log('SQL:', sql);
    console.log('SQL params:', [userId]);

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json(err);
        }
        console.log('Query result:', result);
        console.log('Number of books found:', result.length);
        res.json(result);
    });
};

const searchBooks = (req, res) => {
    const { keyword } = req.query;
    
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }
    
    const sql = `
        SELECT * FROM books 
        WHERE status = 'published' 
        AND (title LIKE ? OR author LIKE ?)
    `;
    
    const value = `%${keyword}%`;
    
    db.query(sql, [value, value], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// 🚀 WISHLIST FUNCTIONS
const addToWishlist = (req, res) => {
    const userId = req.userid;
    const { bookId } = req.body;

    // Check if book exists
    const checkBookSql = "SELECT id FROM books WHERE id = ?";
    db.query(checkBookSql, [bookId], (err, bookResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (bookResult.length === 0) return res.status(404).json({ error: 'Book not found' });

        // Check if already in wishlist
        const checkWishlistSql = "SELECT id FROM wishlist WHERE user_id = ? AND book_id = ?";
        db.query(checkWishlistSql, [userId, bookId], (err, wishlistResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (wishlistResult.length > 0) return res.status(400).json({ error: 'Book already in wishlist' });

            // Add to wishlist
            const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
            db.query(sql, [userId, bookId], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Added to wishlist", wishlistId: result.insertId });
            });
        });
    });
};

const getWishlist = (req, res) => {
    const userId = req.userid;

    const sql = `
        SELECT books.*, wishlist.created_at as wishlist_added_at 
        FROM wishlist
        JOIN books ON wishlist.book_id = books.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

const removeFromWishlist = (req, res) => {
    const userId = req.userid;
    const { bookId } = req.params;

    const sql = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found in wishlist' });
        res.json({ message: "Removed from wishlist" });
    });
};

const checkWishlistStatus = (req, res) => {
    const userId = req.userid;
    const { bookId } = req.params;

    const sql = "SELECT id FROM wishlist WHERE user_id = ? AND book_id = ?";
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ isInWishlist: result.length > 0 });
    });
};

const getCategories = (req, res) => {
    const sql = "SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != '' ORDER BY category";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const categories = result.map(row => row.category);
        res.json(categories);
    });
};

// 🚀 REVIEWS FUNCTIONS
const addReview = (req, res) => {
    const userId = req.userid;
    const { bookId, rating, comment } = req.body;

    // Validation
    if (!bookId || !rating) {
        return res.status(400).json({ error: 'Book ID and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const checkBookSql = "SELECT id FROM books WHERE id = ?";
    db.query(checkBookSql, [bookId], (err, bookResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (bookResult.length === 0) return res.status(404).json({ error: 'Book not found' });

        // Check if user already reviewed this book
        const checkReviewSql = "SELECT id FROM reviews WHERE user_id = ? AND book_id = ?";
        db.query(checkReviewSql, [userId, bookId], (err, reviewResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (reviewResult.length > 0) return res.status(400).json({ error: 'You have already reviewed this book' });

            // Add review
            const sql = `
                INSERT INTO reviews (user_id, book_id, rating, comment)
                VALUES (?, ?, ?, ?)
            `;

            db.query(sql, [userId, bookId, rating, comment], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ 
                    message: "Review added successfully",
                    reviewId: result.insertId 
                });
            });
        });
    });
};

const getReviews = (req, res) => {
    const { bookId } = req.params;

    const sql = `
        SELECT reviews.*, users.name 
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE book_id = ?
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, [bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

const getAverageRating = (req, res) => {
    const { bookId } = req.params;

    const sql = `
        SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews
        FROM reviews 
        WHERE book_id = ?
    `;

    db.query(sql, [bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0] || { avgRating: 0, totalReviews: 0 });
    });
};

// 🚀 CART FUNCTIONS
const addToCart = (req, res) => {
    const userId = req.userid;
    const { bookId } = req.body;

    // Check if already exists
    const checkSql = "SELECT * FROM cart WHERE user_id=? AND book_id=?";
    
    db.query(checkSql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length > 0) {
            // Increase quantity
            const updateSql = "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND book_id=?";
            db.query(updateSql, [userId, bookId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Quantity updated" });
            });
        } else {
            // Insert new
            const insertSql = "INSERT INTO cart (user_id, book_id) VALUES (?, ?)";
            db.query(insertSql, [userId, bookId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Added to cart" });
            });
        }
    });
};

const getCart = (req, res) => {
    const userId = req.userid;

    const sql = `
        SELECT cart.*, books.title, books.price, books.image 
        FROM cart
        JOIN books ON cart.book_id = books.id
        WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

const removeFromCart = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM cart WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Removed" });
    });
};

const updateQuantity = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    db.query("UPDATE cart SET quantity=? WHERE id=?", [quantity, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Updated" });
    });
};

module.exports = { 
    getBooks, 
    getBooksById, 
    createBook, 
    updateBook, 
    deleteBook, 
    getDashboardStats, 
    getMyBooks, 
    searchBooks,
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    checkWishlistStatus,
    getCategories,
    addReview,
    getReviews,
    getAverageRating,
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity
};
