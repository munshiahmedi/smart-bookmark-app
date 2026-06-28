const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('=== UPLOAD DEBUG ===');
    console.log('File object:', file);
    console.log('Original name:', file.originalname);
    console.log('Mimetype:', file.mimetype);
    console.log('==================');
    
    // Accept images only, but allow empty files
    if (!file) {
      console.log('No file provided - allowing');
      return cb(null, true); // Allow empty file field
    }
    
    if (!file.originalname) {
      console.log('No original name - allowing');
      return cb(null, true); // Allow file with no name
    }
    
    // Check if it's an image file using both extension and MIME type
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|avif|svg|ico)$/i; // Case insensitive, added webp, bmp, avif, svg, ico
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 
      'image/avif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'
    ];
    
    console.log('Extension check:', allowedExtensions.test(file.originalname));
    console.log('MIME type check:', allowedMimeTypes.includes(file.mimetype));
    
    // Allow if either extension OR MIME type is valid
    const isValidExtension = allowedExtensions.test(file.originalname);
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    
    if (!isValidExtension && !isValidMimeType) {
      console.log('File rejected - not an image');
      return cb(new Error('Only image files are allowed! (JPG, JPEG, PNG, GIF, WebP, BMP, AVIF, SVG, ICO)'), false);
    }
    
    console.log('File accepted as image');
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

module.exports = upload;
