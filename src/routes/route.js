const express = require("express");
const router = express.Router();
const authController = require("../controllers/controller");

// router.post("/loginUser", ownerController.loginUser);
// router.post("/requestOtp", ownerController.requestOtp);
// router.post("/verifyOtp", ownerController.verifyOtp);

router.post("/users", authController.createUser);
router.post("/users/login/otp", authController.loginUserWithOtp);
router.post("/users/login/password", authController.loginUserWithPassword);
router.get("/users", authController.getUser);
router.post("/users/send-otp", authController.sendOtp);

module.exports = router;
