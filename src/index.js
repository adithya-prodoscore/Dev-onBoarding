import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

//Module Imports
import auth from "./modules/auth/auth.routes.js";
import pins from "./modules/pins/pins.routes.js";

dotenv.config();
const app = express();

mongoose
  .connect("mongodb://localhost:27017/dev-onboarding-proj")
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Cannot connect to mongodb"));

// Middleware
app.use(express.json());
app.use(morgan("short"));

// Routes
app.use("/api/auth", auth);
app.use("/api/pins", pins);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
