import express, { Application } from "express";
import { booksRoutes } from "./app/controllers/book.controller";
import  borrowRoutes  from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req, res) => {
  res.send("Book management server is running...");
});

export default app;
