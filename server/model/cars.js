const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reservationSchema = new mongoose.Schema({
  car: {
    _id: {
      type: ObjectId,
      ref: "Car",
    },
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    registrationNumber: { type: String },
    image_ids: [{ type: String }],
    isAvailable: { type: Boolean },
  },

  customer: {
    _id: {
      type: ObjectId,
      ref: "user",
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      // eslint-disable-next-line no-undef
      data: Buffer,
    },
  },
  rentalStartDate: { type: Date, required: true },
  rentalEndDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  rentalPrice: { type: Number },
  reservationNumber: { type: String },
  // Additional reservation details can be added here
});

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  registrationNumber: { type: String, required: true },
  image_ids: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rentalDetails: {
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    ],
  },
});

const CarDb = mongoose.model("Car", carSchema);
const ReservationDb = mongoose.model("Reservation", reservationSchema);

module.exports = { ReservationDb, CarDb };
