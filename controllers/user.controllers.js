import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'

const myProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await User.findById(user_id).select("name email profile_img");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, massage: "Internal server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, profile_img } = req.body;

    const user = await User.findById(user_id);
    if (name) {
      user.name = name;
    }
    if (profile_img) {
      user.profile_img = profile_img;
    }
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, massage: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ is_active: true }).select(
      "name email createdAt"
    );
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: " Current password is required " });
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
    const user = await User.findById(user_id);
    
    const isMatch = await bcrypt.compare( currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }
    const newPass = await bcrypt.hash(newPassword, 10);
  
    await User.findByIdAndUpdate( user_id , { password : newPass });

    return res
      .status(200)
      .json({ success: true, message: "Password successfully changed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    await User.findByIdAndDelete(user_id);
    return res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};
export { myProfile, updateProfile, getUsers, deleteProfile, changePassword };
