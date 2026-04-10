import express from "express";
const router = express.Router();

// Import controllers
import * as controller from "./pins.controller.js";

// Create a Pin
router.post("/", controller.createPin);

// Get all Pins (Public)
router.post("/", controller.getPins);

// Get a Pin By ID (Public)
router.post("/", controller.getPinById);

// Update a Pin
router.post("/", controller.updatePin);

// Delete a Pin
router.post("/", controller.deletePin);

export default router;
