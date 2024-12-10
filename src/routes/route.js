const express = require("express");
const router = express.Router();
const authController = require("../controllers/controller");

// router.post("/loginUser", ownerController.loginUser);
// router.post("/requestOtp", ownerController.requestOtp);
// router.post("/verifyOtp", ownerController.verifyOtp);

router.post("/users", authController.createUser);
router.get("/users/login", authController.loginUser);
router.get("/users", authController.getUser);
router.get("/send-otp", authController.sendOtp);

module.exports = router;
