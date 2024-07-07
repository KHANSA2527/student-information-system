import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { generateOtp } from "../utils/generate-otp.js";
import { sendEmail } from "../utils/sendEmail.js";
import { signToken } from "../utils/signToken.js";
import { signUpSchema } from "../validator/auth-validator.js";
import bcrypt from "bcryptjs";

const userSignUp = async (req, res) => {
  try {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }
    const { name, email, password } = req.body;
    const existingUser = User.findOne({ email });

    if (existingUser && existingUser.is_active == true) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    if (existingUser) {
      if (existingUser.is_active == false) {
        const hashPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ email }, { name: name, password: hashPassword });
        const otp = generateOtp();
        await sendEmail(email, name, otp);

        return res
          .status(201)
          .json({ success: true, massage: " User successfully updated! " });
      }
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    const otp = generateOtp();
    const otpRecord = new OTP({
      email,
      otp,
    });
    await otpRecord.save();
    await sendEmail(email, name, otp);
    return res
      .status(201)
      .json({ success: true, massage: " User successfully created! " });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and otp required" });
    }
    const otpRecord = await OTP.findOne({ email });
    console.log("otp record", otpRecord);
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }
    const currentTime = new Date(); // current time
    const otpTime = new Date(otpRecord.createdAt); // otp send time
    const timeDifference = currentTime - otpTime;
    const otpExpiry = 5 * 60 * 1000;
    if (timeDifference > otpExpiry) {
      return res
        .status(400)
        .json({ success: false, massage: "OTP has expired" });
    }

    if (otpRecord.otp != otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }
    await User.findOneAndUpdate({ email }, { is_active: true });

    return res.status(200).json({ success: true, message: "OTP verified!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email  required" });
    }
    const newOtp = generateOtp();
    const otpRecord = await OTP.findOneAndUpdate({ email }, { otp: newOtp });
    await sendEmail(email, newOtp);
    return res
      .status(200)
      .json({ success: true, massage: "Otp resend successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otp = generateOtp();
    await sendEmail(email, user.name, otp);
    await OTP.findOneAndUpdate({ email }, { otp: otp });
    return res
      .status(200)
      .json({ success: true, message: "Please verify your otp" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const passwordReset = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashPassword }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password successfully updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error " });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, massage: "Email and Password required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, massage: "User not found" });
    }
    if (existingUser.is_active == false) {
      return res
        .status(400)
        .json({ success: false, massage: "complete  your verification " });
    }
    const hashPassword = await bcrypt.compare(password, existingUser.password);
    if (!hashPassword) {
      return res
        .status(400)
        .json({ success: false, massage: "Incorrect password" });
    }
    const token = await signToken(existingUser._id);
    return res
      .status(200)
      .json({ success: true, massage: "Login successfully", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, massage: "Internal server error" });
  }
};


export {
  userSignUp,
  verifyOtp,
  resendOtp,
  login,
  forgetPassword,
  passwordReset,
  
};
