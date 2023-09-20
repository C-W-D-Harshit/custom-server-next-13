import colors from "colors";
import next from "next";
import app from "./backend/app";
import cloudinary from "cloudinary";
import { Request, Response } from "express";
import connectDB from "./backend/config/db";
// import { frontendRouteController } from "./backend/middleware/route";

const dev = process.env.NODE_ENV !== "production";
const serv = next({ dev });
const handle = serv.getRequestHandler();

const Port = process.env.PORT || 9000;

serv.prepare().then(() => {
  // Handling Uncaught Exception
  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });
  // Connecting to database
  connectDB();

  // Connecting Cloudinary
  //   cloudinary.config({
  //     cloud_name: process.env.CLOUDINARY_NAME,
  //     api_key: process.env.CLOUDINARY_API_KEY,
  //     api_secret: process.env.CLOUDINARY_API_SECRET,
  //   });

  // Frontend Route Middleware
  //   app.use(frontendRouteController);

  // Nextjs Server
  app.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
  // Start Server
  const server = app.listen(Port, () => {
    console.log(`Server started on Port: ${Port}`);
  });
  // Unhandled Promise Rejection
  process.on("unhandledRejection", (err: Error) => {
    console.error(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
      process.exit(1);
    });
  });
});
