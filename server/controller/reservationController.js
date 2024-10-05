const { ReservationDb, CarDb } = require("../model/cars"); // Adjust the path as needed
const Userdb = require("../model/schema");

const reservationController = {
  createReservation: async (req, res) => {
    const {
      rentalStartDate,
      rentalEndDate,
      pickupLocation,
      dropoffLocation,
      rentalPrice,
      reservationNumber,
    } = req.body;

    const userWithFields = await Userdb.findById(req.body.customer).populate(
      "_id",
      "_id fullname email phone_number address avatar"
    );
    const customer = userWithFields;

    const carWithFields = await CarDb.findById(req.body.car).populate(
      "_id",
      "brand model year registrationNumber image_ids isAvailable"
    );
    const car = carWithFields;

    try {
      const newReservation = new ReservationDb({
        car,
        customer,
        rentalStartDate,
        rentalEndDate,
        pickupLocation,
        dropoffLocation,
        rentalPrice,
        reservationNumber,
      });

      const savedReservation = await newReservation.save();
      res.json(savedReservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllReservations: async (req, res) => {
    try {
      const reservations = await ReservationDb.find();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getReservationById: async (req, res) => {
    try {
      const reservation = await ReservationDb.findById(req.params.id);
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateReservation: async (req, res) => {
    const { ...updatedFields } = req.body;
    try {
      const updatedReservation = await ReservationDb.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
      res.json(updatedReservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteReservation: async (req, res) => {
    try {
      const deletedReservation = await ReservationDb.findByIdAndDelete(
        req.params.id
      );
      res.json({
        message: "Reservation deleted successfully",
        deletedReservation,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // /api/reservations?carId=123&startDate=2023-09-01&endDate=2023-09-30 to get reservations for a specific car within a date range.
  // /api/reservations?customerId=456 to get reservations for a specific customer.
  getReservationbyFilter: async (req, res) => {
    try {
      let filter = {};
      const { car, customer, startDate, endDate } = req.query;

      if (car) {
        filter.car = car;
      }

      if (customer) {
        filter.customer = customer;
      }

      if (startDate && endDate) {
        filter.rentalStartDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const reservations = await ReservationDb.find(filter);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Other CRUD operations for reservations can be added here
};

module.exports = reservationController;
