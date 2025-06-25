"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const errorHandleler_1 = require("../utils/errorHandleler");
exports.booksRoutes = express_1.default.Router();
// validate book ID
const validateBookId = (bookId) => {
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new errorHandleler_1.AppError("Invalid book ID format", 400);
    }
};
// Create a new book
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
}));
//   all books with filtering
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        const query = {};
        if (filter) {
            if (![
                "FICTION",
                "NON_FICTION",
                "SCIENCE",
                "HISTORY",
                "BIOGRAPHY",
                "FANTASY",
            ].includes(filter)) {
                throw new errorHandleler_1.AppError("Invalid genre filter", 400);
            }
            query.genre = filter;
        }
        const sortObj = {};
        sortObj[sortBy] = sort === "asc" ? 1 : -1;
        const books = yield book_model_1.Book.find(query).sort(sortObj).limit(Number(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
}));
//  single book 
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
}));
//  Update a book
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const updatedBody = req.body;
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
}));
// Delete a book
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const book = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
}));
