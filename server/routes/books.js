const express = require("express");
const multer = require("multer");
const router = express.Router();
const { getBooks, getBooksById, createBook, updateBook, deleteBook, getDashboardStats, getMyBooks, searchBooks, addToWishlist, getWishlist, removeFromWishlist, checkWishlistStatus, getCategories, addReview, getReviews, getAverageRating, addToCart, getCart, removeFromCart, updateQuantity } = require("../controller/bookController");
const upload = require("../middleware/upload"); // Get upload middleware
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

console.log("Books routes loaded");

router.get("/stats", getDashboardStats);
router.get("/", getBooks);
router.get("/categories", getCategories);
router.get("/my-books", verifyToken, getMyBooks);
router.get("/search", searchBooks);

// WISHLIST ROUTES (must come before /:id)
router.post("/wishlist", verifyToken, addToWishlist);
router.get("/wishlist", verifyToken, getWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);
router.get("/wishlist/check/:bookId", verifyToken, checkWishlistStatus);

// REVIEWS ROUTES (must come before /:id)
router.post("/reviews", verifyToken, addReview);
router.get("/reviews/:bookId", getReviews);
router.get("/reviews/avg/:bookId", getAverageRating);

// CART ROUTES (must come before /:id)
router.post('/cart', verifyToken, addToCart);
router.get('/cart', verifyToken, getCart);
router.delete('/cart/:id', verifyToken, removeFromCart);
router.put('/cart/:id', verifyToken, updateQuantity);

// CRUD ROUTES
router.post("/", verifyToken, (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // Multer error (file size, etc.)
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors (file type validation, etc.)
      return res.status(400).json({ error: err.message });
    }
    // No error, continue to createBook
    next();
  });
}, createBook);

router.put("/:id", verifyToken, verifyAdmin, (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, updateBook);
router.delete("/:id", verifyToken, verifyAdmin, deleteBook);

// PARAMETERIZED ROUTES (must come after specific routes)
router.get("/:id", getBooksById);

console.log("Books routes registered:");
console.log("- GET /stats", getDashboardStats.name);
console.log("- GET /", getBooks.name);
console.log("- GET /categories", getCategories.name);
console.log("- GET /:id", getBooksById.name);
console.log("- POST /", createBook.name);
console.log("- PUT /:id", updateBook.name);
console.log("- DELETE /:id", deleteBook.name);

module.exports = router;