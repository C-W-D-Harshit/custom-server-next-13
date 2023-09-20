import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// Main App
const app = express();
// Error Handler Import
import errorMiddleware from "./middleware/error";

// Rate Limit
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: "To many request from this IP! Please try again in one hour",
});

// Middlewares for Prod
// app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// -- data sanitization
app.use(mongoSanitize());

// -- prevent parameter polution
app.use(hpp());

app.use(cookieParser());
app.use(fileUpload());
app.use(compression());

// Cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Middleware for Errors
app.use(errorMiddleware);

// Export App
export default app;
