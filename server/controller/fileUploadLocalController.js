const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/assets/products"); // Uploads will be stored in the specified directory
  },
  filename: function (req, file, cb) {
    // Extract imageName from request body
    const imageName = req.body.imageName;
    console.log("imageName:", imageName); // Log the imageName
    // Generate filename based on imageName and original file extension
    const filename = `${imageName}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

// Initialize multer upload
const upload = multer({ storage });

// POST route to handle file uploads
router.post("/upload", upload.array("files"), (req, res) => {
  // Handle file upload logic here
  // Example: saving file details to database, etc.

  res.status(200).json({ message: "Files uploaded successfully" });
});

module.exports = router;
