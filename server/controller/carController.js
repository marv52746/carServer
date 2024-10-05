const { CarDb } = require("../model/cars"); // Adjust the path as needed

const carController = {
  getAllCars: async (req, res) => {
    try {
      const cars = await CarDb.find();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCarById: async (req, res) => {
    try {
      const car = await CarDb.findById(req.params.id);
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCar: async (req, res) => {
    try {
      const { ...updatedFields } = req.body;
      const newCar = new CarDb(updatedFields);
      const savedCar = await newCar.save();
      res.json(savedCar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCar: async (req, res) => {
    try {
      const { image_url, ...updatedFields } = req.body;
      if (image_url) {
        updatedFields.image_url = image_url; // Update image_url field if it is provided in the request
      }

      const updatedCar = await CarDb.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCar: async (req, res) => {
    try {
      const deletedCar = await CarDb.findByIdAndDelete(req.params.id);
      res.json({ message: "Car deleted successfully", deletedCar });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // /api/cars?brand=Toyota&year=2020 to get cars of a specific brand and year.
  // /api/cars?model=Civic to get cars of a specific model.
  getCarByFilter: async (req, res) => {
    try {
      let filter = {};
      const { brand, model, year, registrationNumber, isAvailable } = req.query;

      if (brand) {
        filter.brand = brand;
      }

      if (model) {
        filter.model = model;
      }

      if (year) {
        filter.year = year;
      }

      if (isAvailable) {
        filter.isAvailable = isAvailable;
      }

      if (registrationNumber) {
        filter.registrationNumber = registrationNumber;
      }

      const cars = await CarDb.find(filter);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = carController;
