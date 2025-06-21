import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const booksRoutes = express.Router();

// post a book
booksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  const book = await Book.create(body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    book,
  });
});

// get all books with filtering, sorting, and limiting
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
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error,
    });
  }
});

//  get single  book by book id

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);

  res.status(201).json({
    success: true,
    message: "single book",
    book,
  });
});

// update a book

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedBody = req.body;
  const book = await Book.findByIdAndUpdate(bookId, updatedBody, { new: true });

  res.status(201).json({
    success: true,
    message: "note updated",
    book,
  });
});

// delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const book = await Book.findByIdAndDelete(bookId);

  res.status(201).json({
    success: true,
    message: "book deleted",
    book,
  });
});
