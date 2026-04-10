import express from "express";
const router = express.Router();

// Controller Imports
import { register, login, refresh } from "./auth.controller.js";

// User Register
router.post("/register", register);

// User Login
router.post("/login", login);

// User Logout
// router.post("/logout", logout);

// Refresh Endpoint
router.post("/refresh", refresh);

export default router;
