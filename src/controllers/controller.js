const userModel = require("../models/userModel");
// const cloudinary = require("cloudinary").v2;
// const axios = require("axios");

// sms service //
// const apiKey = process.env.API_KEY_FAST2SMS;
// const sendOtpUrl = process.env.OTPURL;
// Configuration  of "Cloudinary" //
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

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
        return res
          .status(200)
          .send({
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
        return res
          .status(200)
          .send({ status: true, message: "Login successful with password.",data: findUser });
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

    // Update the OTP for the user in the database
    await userModel.updateOne({ mobile: mobile }, { $set: { otp: otp } });

    // Respond with success
    return res
      .status(200)
      .send({ status: true, message: "OTP sent successfully.", data: otp });
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
// const storeOwner = async function (req, res) {
//   try {
//     const cloudinaryUploadPromises = req.files.map(async (file) => {
//       if (!file) {
//         return null;
//       }

//       const cloudinaryUploadResult = await cloudinary.uploader.upload(
//         `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
//         {
//           folder: "roomDekho/owners/property/photos",
//           public_id: `propertyImg_${Date.now()}`,
//         }
//       );

//       return cloudinaryUploadResult;
//     });

//     const cloudinaryResponses = await Promise.all(cloudinaryUploadPromises);
//     // console.log("Cloudinary responses:", cloudinaryResponses);

//     const cloudinaryUrls = cloudinaryResponses.map(
//       (response) => response.secure_url
//     );

//     const userData = req.body;
//     userData.selectedImages = cloudinaryUrls;
//     const savedData = await ownerModel.create(userData);

//     res.status(201).send({ status: true, data: savedData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ status: false, error: error.message });
//   }
// };

// const getOwners = async function (req, res) {
//   try {
//     let findData = await ownerModel.find();
//     if (findData.length == 0) {
//       return res.status(404).send({ status: false, error: "No data found" });
//     }
//     return res.status(200).send({ status: true, data: findData });
//   } catch (error) {
//     res.status(500).send({ status: false, error: error.message });
//   }
// };

// const getOwner = async function (req, res) {
//   try {
//     let findData = await ownerModel.findOne({ _id: req.params.id });
//     if (Object.keys(findData).length === 0) {
//       return res.status(404).send({ status: false, error: "No data found" });
//     }
//     return res.status(200).send({ status: true, data: findData });
//   } catch (error) {
//     res.status(500).send({ status: false, error: error.message });
//   }
// };

module.exports = {
  createUser,
  loginUser,
  sendOtp,
  getUser,
};
// module.exports.storeOwner = storeOwner;
// module.exports.getOwners = getOwners;
// module.exports.getOwner = getOwner;
