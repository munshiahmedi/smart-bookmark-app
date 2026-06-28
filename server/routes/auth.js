const express = require('express');
const router = express.Router();
const { login,register, changePassword } = require("../controller/authController");
const { getUserStatistics } = require("../controller/userController");

// Endpoint to reset password for testing
router.post('/reset-password', async (req, res) => {
    const db = require('../db');
    const bcrypt = require('bcrypt');
    const { email, newPassword } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.json({ 
                message: 'Password updated successfully',
                email: email,
                newPassword: newPassword,
                affectedRows: result.affectedRows
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint to check specific user
router.post('/check-user', (req, res) => {
    const db = require('../db');
    const { email, password } = req.body;
    
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.length === 0) {
            return res.json({ 
                message: 'User not found',
                email: email,
                userExists: false 
            });
        }
        
        const user = result[0];
        res.json({ 
            message: 'User found',
            email: email,
            userExists: true,
            userId: user.id,
            userName: user.name,
            hasPassword: !!user.password
        });
    });
});

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working' });
});

router.post('/login', (req, res, next) => {
    console.log('Login route hit, body:', req.body);
    next();
}, login);

router.post('/register', register);

// Change password route
router.put('/change-password', (req, res, next) => {
    const { verifyToken } = require('../middleware/authMiddleware');
    verifyToken(req, res, next);
}, changePassword);

// Get user statistics
router.get('/statistics', getUserStatistics);

module.exports = router;
