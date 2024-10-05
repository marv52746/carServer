const router = require("express").Router();
const userController = require("../controller/userController");
const fileUploadController = require("../controller/fileUploadController");
const fileMongoUploadController = require("../controller/fileMongoUploadController");

const carController = require("../controller/carController");
const reservationController = require("../controller/reservationController");

const auth = require("../middleware/auth");

const multer = require("multer");
const upload = multer(); // Initialize multer without any configuration

// user
router.post("/register", upload.none(), userController.registerUser);
router.post("/login", upload.none(), userController.login);
router.post("/googlelogin", upload.none(), userController.googlelogin);
router.post("/update/:id", upload.none(), userController.updateUser);
router.get("/users", userController.users);
router.get("/user/:id", userController.user);
router.delete("/delete/:id", userController.delete);
// router.delete('/delete/:id', auth, userController.delete)
router.get("/user-filter", userController.loadUserByFilter);

// cars
router.post("/car-register", upload.none(), carController.createCar);
router.get("/cars", carController.getAllCars);
router.get("/car/:id", carController.getCarById);
router.get("/car-filter", carController.getCarByFilter);
router.post("/car-update/:id", upload.none(), carController.updateCar);
router.delete("/car-delete/:id", carController.deleteCar);

// reservation
router.post(
  "/reservation-register",
  upload.none(),
  reservationController.createReservation
);
router.get("/reservations", reservationController.getAllReservations);
router.get("/reservation/:id", reservationController.getReservationById);
router.get("/reservation-filter", reservationController.getReservationbyFilter);
router.post(
  "/reservation-update/:id",
  upload.none(),
  reservationController.updateReservation
);
router.delete(
  "/reservation-delete/:id",
  reservationController.deleteReservation
);

//file local upload controller
router.post(
  "/filelocalupload",
  upload.array("localFileData"),
  fileUploadController.uploadFile
);

// MongoDB file controller
router.get("/view-filename/:filename", fileMongoUploadController.viewFile);
router.get("/view-id/:id", fileMongoUploadController.viewFileById);
router.delete("/file-delete/:id", fileMongoUploadController.deleteFile);
router.post(
  "/mongoUpload",
  upload.array("fileData"),
  fileMongoUploadController.uploadFiles
);

module.exports = router;
