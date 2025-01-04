const userModel = require("../models/userModel");
const axios = require("axios");

// sms service //
const apiKey = process.env.API_KEY_FAST2SMS;
const sendOtpUrl = process.env.OTPURL;

async function sendOTP(mobileNumber, otp) {
  try {
    const response = await axios.post(
      sendOtpUrl,
      {
        route: "q",
        //`Welcome to BookMyGadi! Your login code is: ${otp}. Keep it secure; don't share. Happy booking!`
        message: `Welcome to MovieDekho. Your Login code is ${otp}.Don't share with anyone.`,
        language: "english",
        flash: 0,
        numbers: mobileNumber,
      },
      {
        headers: {
          authorization: apiKey,
        },
      }
    );

    // console.log("success", response.data);
    // You can handle the response as needed
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
    // console.error("error", error.response.data);
    // Handle errors
  }
}

const createUser = async function (req, res) {
  try {
    const response = await userModel.create(req.body);
    res.status(201).send({ status: true, data: response });
  } catch (error) {
    throw error;
  }
};

const loginUser = async function (req, res) {
  try {
    const { mobile, password, otp } = req.body;

    // Validate required fields
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile number is required." });
    }

    // Find the user by mobile number
    const findUser = await userModel.findOne({ mobile: mobile });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }

    // If OTP is provided
    if (otp) {
      if (otp === findUser.otp) {
        // Update the OTP for the user in the database
        await userModel.updateOne({ mobile: mobile }, { $set: { otp: null } });
        return res.status(200).send({
          status: true,
          message: "Login successful with OTP.",
          data: findUser,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "OTP does not match." });
      }
    }

    // If password is provided
    if (password) {
      if (password === findUser.password) {
        return res.status(200).send({
          status: true,
          message: "Login successful with password.",
          data: findUser,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Password does not match." });
      }
    }

    // If neither OTP nor password is provided
    return res.status(400).send({
      status: false,
      message: "Either OTP or password is required for login.",
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error." });
  }
};

const loginUserWithOtp = async function (req, res) {
  try {
    const { mobile, otp } = req.body;

    // Validate required fields
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile number is required." });
    }
    if (!otp) {
      return res
        .status(400)
        .send({ status: false, message: "OTP is required." });
    }

    // Find the user by mobile number
    const findUser = await userModel.findOne({ mobile: mobile });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }
    // If OTP is provided
    if (otp) {
      if (otp === findUser.otp) {
        // Update the OTP for the user in the database
        await userModel.updateOne({ mobile: mobile }, { $set: { otp: null } });
        return res.status(200).send({
          status: true,
          message: "Login successful with OTP.",
          data: findUser,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "OTP does not match." });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error." });
  }
};

const loginUserWithPassword = async function (req, res) {
  try {
    const { mobile, password } = req.body;

    // Validate required fields
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile number is required." });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required." });
    }

    // Find the user by mobile number
    const findUser = await userModel.findOne({ mobile: mobile });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }
    // If password is provided
    if (password) {
      if (password === findUser.password) {
        return res.status(200).send({
          status: true,
          message: "Login successful with password.",
          data: findUser,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Password does not match." });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error." });
  }
};

const sendOtp = async function (req, res) {
  try {
    const { mobile } = req.body;

    // Validate required field
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile number is required." });
    }

    // Find the user by mobile number
    const findUser = await userModel.findOne({ mobile: mobile });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(100000 + Math.random() * 9000);
    await sendOTP(mobile, otp);
    // Update the OTP for the user in the database
    await userModel.updateOne({ mobile: mobile }, { $set: { otp: otp } });

    // Respond with success
    return res
      .status(200)
      .send({ status: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error." });
  }
};

const getUser = async function (req, res) {
  try {
    const response = await userModel.findOne(req.body);
    res.status(200).send({ status: true, data: response });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  sendOtp,
  getUser,
  loginUserWithPassword,
  loginUserWithOtp,
};
