const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getUserStatistics } = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Debug route
router.get('/debug', (req, res) => {
  console.log('Debug route hit');
  res.json({ message: 'User routes working' });
});

router.get('/profile', verifyToken, (req, res, next) => {
  console.log('Profile route hit, userid:', req.userid);
  next();
}, getProfile);

router.put('/profile', verifyToken, (req, res, next) => {
  const { upload } = require('../controller/authController');
  upload.single('profile_pic')(req, res, next);
}, updateProfile);

router.get('/statistics', verifyToken, (req, res, next) => {
  console.log('Statistics route hit, userid:', req.userid);
  next();
}, getUserStatistics);

module.exports = router;