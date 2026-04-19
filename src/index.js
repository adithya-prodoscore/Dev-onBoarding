import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import cors from "cors";

// Swagger API Documentation
const file = fs.readFileSync("./src/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(file);

//Module Imports
import auth from "./modules/auth/auth.routes.js";
import pins from "./modules/pins/pins.routes.js";
import { error } from "./shared/middleware/error.js";
import { corsOptions } from "./shared/config/cors.js";
import initCleanupTask from "./shared/utils/cleanup.js";

dotenv.config();
const app = express();

// Start the Cron Job
initCleanupTask();

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(morgan("short"));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", auth);
app.use("/api/pins", pins);

// Error Handling Middleware
app.use(error);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
