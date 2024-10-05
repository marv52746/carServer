const fs = require("fs");
const path = require("path");
const multer = require("multer");

exports.uploadFile = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Process each uploaded file
    const uploadedFiles = [];
    req.files.forEach((file) => {
      // Extract the file extension
      const fileExtension = path.extname(file.originalname);
      // Get the current datetime
      // const currentDatetime = new Date()
      //   .toISOString()
      //   .replace(/[-:]/g, "")
      //   .replace("T", "_")
      //   .replace(/\..*/, "");

      const uniqueFilename = req.body.imageName + fileExtension;

      console.log(uniqueFilename);
      // Construct the path where the file will be saved
      const uploadPath = path.join(
        "../client/public/assets/img/product",
        uniqueFilename
      );

      // Write the file data to the specified path
      fs.writeFile(uploadPath, file.buffer, (err) => {
        if (err) {
          console.error("Error saving file:", err);
          return res
            .status(500)
            .json({ error: "An error occurred while saving the file." });
        }

        // File saved successfully
        console.log("File saved successfully:", uniqueFilename);
        uploadedFiles.push(uniqueFilename);

        // If all files are processed, send response
        if (uploadedFiles.length === req.files.length) {
          res.status(200).json({
            message: "Files uploaded successfully",
            filenames: uploadedFiles,
          });
        }
      });
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the files." });
  }
};
