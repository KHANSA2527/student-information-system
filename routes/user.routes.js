import { Router } from "express";
import {
  changePassword,
  deleteProfile,
  getUsers,
  myProfile,
  updateProfile,
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../utils/middleware.js";
const router = Router();

router.get("/my-profile", authMiddleware, myProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/get-users", authMiddleware, getUsers);
router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete-profile", authMiddleware, deleteProfile);
export { router };
