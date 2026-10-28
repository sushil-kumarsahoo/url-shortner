import { STATUS_CODES } from "http";

// Custom error class for errors you expect (bad input, not found, etc.)
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Runs when no route matches
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Central error handler (it MUST have 4 parameters)
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || err.status || 500;
  if (statusCode < 400 || statusCode > 599) statusCode = 500;

  let message = err.message || STATUS_CODES[statusCode];

  // Mongoose: validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // Mongoose: invalid value type
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // MongoDB: duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value";
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Hide internal details of server errors
  if (statusCode === 500) {
    console.error(err);
    if (isProduction) message = "Server error";
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};