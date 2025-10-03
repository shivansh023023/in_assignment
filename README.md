# BookWise: A Comprehensive Book Review Platform

BookWise is a full-stack web application built to serve as a collaborative platform for book lovers. It allows users to manage a collection of books, share their opinions through reviews, and engage with a community of readers. The application features a robust backend, a responsive frontend, and secure user authentication.

## Features Implemented

### Core Functionality
- **User Authentication**: Secure user registration and login system using JWT for session management. Passwords are encrypted using bcrypt.
- **Protected Routes**: Middleware ensures that only authenticated users can access specific parts of the application, such as adding or editing books.
- **Book Management (CRUD)**: Authenticated users can create, read, update, and delete book listings.
- **Ownership**: Books can only be edited or deleted by the user who originally added them.
- **Review System**: Users can submit text reviews and a star rating (1-5) for any book. Users have the ability to delete their own reviews.
- **Average Rating**: The system automatically calculates and displays the average star rating for each book based on all submitted reviews.
- **Book Listings & Pagination**: The main book exploration page displays all books in a paginated list, showing 5 books per page for organized browsing.

### Bonus Features
- **Search & Filter**: The book list page includes functionality to search for books by title or author and filter the results by genre.
- **Profile Page**: A dedicated user profile page that displays user information.
- **Responsive Design**: The UI is fully responsive and provides a seamless experience on devices of all sizes.

## Technical Stack

- **Frontend**: Next.js (React), Tailwind CSS, ShadCN UI
- **Backend**: Node.js (via Next.js Server Actions and Route Handlers)
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js
- **Deployment**: The frontend is built with Next.js and is suitable for deployment on platforms like Vercel or AWS Amplify. The backend logic is handled by Next.js server-side capabilities, connecting to a MongoDB Atlas cluster.

## Project Structure

The repository is organized into a monorepo structure with two main directories:

```
/
├── backend/         # Contains the MongoDB data models (schemas)
├── frontend/        # Contains the complete Next.js application
└── package.json     # Root package file to manage workspaces
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A MongoDB Atlas account and a connection string

### Local Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**
   This command will install dependencies for both the frontend and the root of the project.
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Navigate to the `frontend` directory and create a file named `.env`. Add your MongoDB Atlas connection string to this file.

   ```
   cd frontend
   touch .env
   ```

   Open the `.env` file and add the following line, replacing `<username>`, `<password>`, and `<cluster-details>` with your actual MongoDB credentials:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-details>
   JWT_SECRET=your-super-secret-jwt-key
   ```
   Replace `your-super-secret-jwt-key` with a long, random, and secret string.

4. **Configure MongoDB Atlas Network Access:**
   - Log in to your MongoDB Atlas account.
   - Navigate to the **Network Access** tab.
   - Add your current IP address to the IP Access List. For local development, you can allow access from anywhere by entering `0.0.0.0/0`.

5. **Run the development server:**
   From the root directory of the project, run the following command:
   ```sh
   npm run dev
   ```
   This will start the Next.js development server, typically on `http://localhost:9002`.

## API Documentation

The application uses Next.js Server Actions, which act as secure, server-side functions callable directly from React components. This modern approach co-locates backend logic with the frontend, removing the need for traditional REST API endpoints for many CRUD operations.

### Main Actions

- **Authentication Actions (`/frontend/src/lib/actions/auth.actions.ts`)**
  - `signup(formData)`: Registers a new user.
  - `login(formData)`: Authenticates a user and creates a session cookie.
  - `logout()`: Clears the session cookie and logs the user out.

- **Book Actions (`/frontend/src/lib/actions/book.actions.ts`)**
  - `addBook(formData)`: Creates a new book entry.
  - `updateBook(id, formData)`: Updates an existing book.
  - `deleteBook(id)`: Deletes a book and its associated reviews.
  - `getBooks(page, query, genre)`: Fetches a paginated and filtered list of books.
  - `getBookById(id)`: Fetches a single book with all its reviews.

- **Review Actions (`/frontend/src/lib/actions/review.actions.ts`)**
  - `addReview(formData)`: Adds a new review for a book.
  - `deleteReview(reviewId, bookId)`: Deletes a user's own review.
