const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cors = require("cors");
// const Grid = require('gridfs-stream')
// const mongoose = require('mongoose')

require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 8080;

// create express instance
const app = express();

// let gfs;

// Use bodyParser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
//app.use(cors)
app.use(
  cors({
    origin: "*",
  })
);

// Increase the payload size limit (e.g., 10MB)
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// CORS middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// database connection
connect();

// connect.once("open", function(){
//   gfs = Grid()
// })

// routes
app.use("/api", require("./router/router"));

// Import and use the file upload controller
// app.use("/upload", require("./controller/fileUploadLocalController"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:4000`);
});
