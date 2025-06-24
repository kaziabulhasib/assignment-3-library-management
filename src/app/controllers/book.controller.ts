import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { handleError, AppError } from "../utils/errorHandleler";

export const booksRoutes = express.Router();

// validate book ID
const validateBookId = (bookId: string): void => {
  if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid book ID format", 400);
  }
};

// Create a new book
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

//   all books with filtering
booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) {
      if (
        ![
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ].includes(filter as string)
      ) {
        throw new AppError("Invalid genre filter", 400);
      }
      query.genre = filter;
    }

    const sortObj: any = {};
    sortObj[sortBy as string] = sort === "asc" ? 1 : -1;

    const books = await Book.find(query).sort(sortObj).limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    handleError(res, error);
  }
});

//  single book 

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const book = await Book.findById(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

//  Update a book

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    handleError(res, error);
  }
});
