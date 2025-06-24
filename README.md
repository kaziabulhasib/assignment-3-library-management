# Library Management API

A RESTful API for managing a library system using Express, TypeScript, and MongoDB (Mongoose).

## Features

- Book CRUD (Create, Read, Update, Delete)
- Filtering, sorting, and pagination for books
- Borrow books with business logic (availability, quantity)
- Aggregated summary of borrowed books
- Proper schema validation and error handling
- Mongoose static/instance methods and middleware

## Technologies

- Node.js, Express 5, TypeScript
- MongoDB, Mongoose

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
URI=mongodb://localhost:27017/library
```

### Running the Server

```bash
npm run dev
```

## API Endpoints

### Books

- **POST /api/books** — Create a new book
- **GET /api/books** — Get all books (supports `filter`, `sortBy`, `sort`, `limit`)
- **GET /api/books/:bookId** — Get a book by ID
- **PUT /api/books/:bookId** — Update a book
- **DELETE /api/books/:bookId** — Delete a book

#### Example: Filtering & Sorting

```
GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

### Borrow

- **POST /api/borrow** — Borrow a book (checks availability, updates copies)
- **GET /api/borrow** — Get summary of borrowed books (aggregation)

## Error Handling

All error responses follow this format:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": { ... }
}
```

## Project Structure

```
src/
  app/
    controllers/
    interfaces/
    models/
    utils/
  app.ts
  server.ts
```


## Author

- kazi abul hasib

---

