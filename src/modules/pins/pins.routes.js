import express from "express";
const router = express.Router();

// Import controllers
import * as controller from "./pins.controller.js";

// Create a Pin
router.post("/", controller.createPin);

// Get all Pins (Public)
router.get("/", controller.getPins);

// Get a Pin By ID (Public)
router.get("/:id", controller.getPinById);

// Update a Pin
router.put("/", controller.updatePin);

// Delete a Pin
router.delete("/", controller.deletePin);

export default router;
