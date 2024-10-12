const PropertyDb = require("../model/properties"); // Adjust the path as needed

const propertyController = {
  getAllProperties: async (req, res) => {
    try {
      const cars = await PropertyDb.find();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPropertybyID: async (req, res) => {
    try {
      const car = await PropertyDb.findById(req.params.id);
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProperty: async (req, res) => {
    try {
      const { ...updatedFields } = req.body;
      const newProperty = new PropertyDb(updatedFields);
      const savedProperty = await newProperty.save();
      res.json(savedProperty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProperty: async (req, res) => {
    try {
      const { ...updatedFields } = req.body;

      const updatedCar = await PropertyDb.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProperty: async (req, res) => {
    try {
      const deletedProperty = await PropertyDb.findByIdAndDelete(req.params.id);
      res.json({ message: "Property deleted successfully", deletedProperty });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = propertyController;
