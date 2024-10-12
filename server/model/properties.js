// eslint-disable-next-line no-undef
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true, // Set a default value
  },
  name: {
    type: String,
    unique: true, // Ensure name are unique
    required: true, // Ensure name is required
    trim: true, // Remove whitespace
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["string", "boolean", "number"], // Example types
    default: "string", // Set a default value
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the lastUpdated field before saving
propertySchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

const PropertyDb = mongoose.model("property", propertySchema);

module.exports = PropertyDb;
