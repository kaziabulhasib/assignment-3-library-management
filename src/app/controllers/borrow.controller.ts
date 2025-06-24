import express, { Request, Response, RequestHandler } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { handleError } from "../utils/errorHandleler";

const borrowRoutes = express.Router();
export default borrowRoutes;

// POST /api/borrow
const borrowHandler: RequestHandler = async (req, res) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // Validate input
    if (!bookId || !quantity || !dueDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: book, quantity, dueDate",
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
      return;
    }

    // Check book availability
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    if (book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: "Not enough copies available",
      });
      return;
    }

    // Update book availability
    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save();

    // Create borrow record
    const borrow = await Borrow.create({
      book: bookId,
      quantity,
      dueDate: new Date(dueDate),
    });

    // Get complete borrow record
    const result = await Borrow.findById(borrow._id).lean().exec();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

borrowRoutes.post("/", borrowHandler);

// GET /api/borrow - Borrowed Books Summary (Aggregation)
const borrowSummaryHandler: RequestHandler = async (req, res) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookInfo.title",
            isbn: "$bookInfo.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    handleError(res, error);
  }
};

borrowRoutes.get("/", borrowSummaryHandler);
