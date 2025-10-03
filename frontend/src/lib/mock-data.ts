import { ObjectId } from 'mongodb';
import { IBook, IUser, IReview } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const generateObjectId = () => new ObjectId();

export const mockUsers: IUser[] = [
  { _id: new ObjectId('60d0fe4f5311236168a109ca'), name: 'Alice', email: 'alice@example.com' },
  { _id: new ObjectId('60d0fe4f5311236168a109cb'), name: 'Bob', email: 'bob@example.com' },
];

export let mockBooks: IBook[] = [
  {
    _id: generateObjectId(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    genre: 'Fiction',
    publishedYear: 1925,
    addedBy: mockUsers[0],
    coverImage: PlaceHolderImages.find(p => p.id === 'book-cover-1')?.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
    averageRating: 4.2,
  },
  {
    _id: generateObjectId(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about the serious issues of rape and racial inequality.',
    genre: 'Fiction',
    publishedYear: 1960,
    addedBy: mockUsers[1],
    coverImage: PlaceHolderImages.find(p => p.id === 'book-cover-2')?.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
    averageRating: 4.8,
  },
    {
    _id: generateObjectId(),
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.",
    genre: "Dystopian",
    publishedYear: 1949,
    addedBy: mockUsers[0],
    coverImage: PlaceHolderImages.find(p => p.id === 'book-cover-3')?.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
    averageRating: 4.7
  },
  {
    _id: generateObjectId(),
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners written by Jane Austen in 1813.",
    genre: "Romance",
    publishedYear: 1813,
    addedBy: mockUsers[1],
    coverImage: PlaceHolderImages.find(p => p.id === 'book-cover-4')?.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
    averageRating: 4.5
  },
  {
    _id: generateObjectId(),
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A children's fantasy novel by English author J. R. R. Tolkien.",
    genre: "Fantasy",
    publishedYear: 1937,
    addedBy: mockUsers[0],
    coverImage: PlaceHolderImages.find(p => p.id === 'book-cover-5')?.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
    averageRating: 4.9
  }
];

export let mockReviews: IReview[] = [
  {
    _id: generateObjectId(),
    bookId: mockBooks[0]._id,
    userId: mockUsers[1],
    rating: 5,
    reviewText: 'An absolute masterpiece of American literature.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: generateObjectId(),
    bookId: mockBooks[0]._id,
    userId: mockUsers[0],
    rating: 4,
    reviewText: 'A poignant and beautiful story. A must-read.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: generateObjectId(),
    bookId: mockBooks[1]._id,
    userId: mockUsers[0],
    rating: 5,
    reviewText: 'A powerful and moving story that everyone should read.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

mockBooks[0].reviews = [mockReviews[0], mockReviews[1]];
mockBooks[0].averageRating = 4.5;
mockBooks[1].reviews = [mockReviews[2]];
mockBooks[1].averageRating = 5;
