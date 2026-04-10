import express from "express";
const router = express.Router();

// Import controllers
import * as controller from "./pins.controller.js";
import { auth } from "../../shared/middleware/auth.js";

// Create a Pin
router.post("/", auth, controller.createPin);

// Get all Pins (Public)
router.get("/", controller.getPins);

// Get a Pin By ID (Public)
router.get("/:id", controller.getPinById);

// Update a Pin
router.put("/:id", auth, controller.updatePin);

// Delete a Pin
router.delete("/:id", auth, controller.deletePin);

export default router;
