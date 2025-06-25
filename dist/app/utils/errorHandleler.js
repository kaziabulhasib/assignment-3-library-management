"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
const mongoose_1 = require("mongoose");
// Custom error class
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
// Error handling middleware
const handleError = (res, error) => {
    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorName = 'InternalError';
    let errorDetails = {};
    // Handle different error types
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errorName = error.name;
    }
    else if (error instanceof mongoose_1.Error.ValidationError) {
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
        error: Object.assign({ name: errorName }, (Object.keys(errorDetails).length > 0 && { errors: errorDetails }))
    });
};
exports.handleError = handleError;
