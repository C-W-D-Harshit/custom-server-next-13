import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorhander";

const errorHandlerMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err = err as ErrorHandler; // Type assertion to ensure err is of type ErrorHandler

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${(err as any).path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const message = `Duplicate ${(
      Object.keys((err as any).keyValue) as string[]
    ).join(", ")} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again";
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is Expired, Try again";
    err = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default errorHandlerMiddleware;
