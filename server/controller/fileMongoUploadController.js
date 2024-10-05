const { GridFSBucket, ObjectID } = require("mongodb");
const { Readable } = require("stream");

const mongoose = require("mongoose");
const conn = mongoose.connection;

// Initialize GridFSBucket
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// Controller function to view a file by filename
const viewFile = (req, res) => {
  const filename = req.params.filename; // Get filename from request params

  gfs
    .find({ filename: filename })
    .toArray()
    .then((files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }

      const readstream = gfs.openDownloadStreamByName(filename);
      readstream.pipe(res);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const viewFileById = (req, res) => {
  const obj_id = new mongoose.Types.ObjectId(req.params.id);

  // Check if gfs is initialized
  if (!gfs) {
    return res.status(500).json({ error: "GridFSBucket is not initialized" });
  }

  gfs
    .find({ _id: obj_id })
    .toArray()
    .then((files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }

      const readstream = gfs.openDownloadStream(obj_id);
      readstream.pipe(res);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

// Controller function to upload an array of files
const uploadFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      // const filename = file.originalname; // Get filename from uploaded file
      const filename = req.body.imageName + "_" + file.originalname; // Get filename from uploaded file
      const readstream = new Readable(); // Create a readable stream
      readstream.push(file.buffer); // Push the buffer to the stream
      readstream.push(null); // Signal the end of the stream

      const uploadStream = gfs.openUploadStream(filename);

      // Handle errors during the upload
      uploadStream.on("error", (err) => {
        reject(err);
      });

      // Once upload is complete
      uploadStream.once("finish", () => {
        resolve(uploadStream.id);
      });

      // Pipe the readable stream to the upload stream
      readstream.pipe(uploadStream);
    });
  });

  // Wait for all uploads to complete
  Promise.all(uploadPromises)
    .then((fileIds) => {
      return res.status(200).json({
        message: `${req.files.length} file(s) uploaded successfully`,
        fileIds: fileIds,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const deleteFile = async (req, res) => {
  try {
    const obj_id = new mongoose.Types.ObjectId(req.params.id);
    gfs.delete(obj_id);

    res.json("successfully deleted image!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { viewFile, uploadFiles, viewFileById, deleteFile };
