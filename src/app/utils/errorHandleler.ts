import { Response } from "express";
import { Error as MongooseError } from "mongoose";

// Define a custom error interface
export interface ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, any>;
  code?: number; // For MongoDB error codes
}

// Custom error class
export class AppError extends Error implements ApiError {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handling middleware
export const handleError = (res: Response, error: unknown): void => {
  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorName = 'InternalError';
  let errorDetails: Record<string, any> = {};

  // Handle different error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorName = error.name;
  } 
  else if (error instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errorName = 'ValidationError';
    errorDetails = error.errors;
  } 
  else if (error instanceof Error) {
    // Handle other native Error instances
    message = error.message;
    errorName = error.name;
    
    // Handle duplicate key errors (MongoDB E11000)
    if ('code' in error && error.code === 11000) {
      statusCode = 409;
      message = 'Duplicate key error';
      errorName = 'DuplicateKeyError';
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      name: errorName,
      ...(Object.keys(errorDetails).length > 0 && { errors: errorDetails })
    }
  });
};