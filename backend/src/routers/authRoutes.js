import express from "express";
import { logout, signUp, login } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;