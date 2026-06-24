export const typeDefs = `#graphql
  enum ReadingState {
    WANT_TO_READ
    READING
    READ
  }

  type User {
    id: ID!
    email: String!
    name: String!
    bio: String
    avatarUrl: String
    createdAt: String!
    readingStatuses: [ReadingStatus!]!
    reviews: [Review!]!
    shelves: [Shelf!]!
  }

  type Shelf {
    id: ID!
    name: String!
    color: String!
    icon: String!
    createdAt: String!
    books: [Book!]!
    bookCount: Int!
  }

  input CreateShelfInput {
    name: String!
    color: String!
    icon: String!
  }

  input UpdateShelfInput {
    name: String
    color: String
    icon: String
  }

  type Book {
    id: ID!
    googleId: String!
    title: String!
    authors: [String!]!
    description: String
    coverUrl: String
    publishedYear: Int
    isbn: String
    reviews: [Review!]!
    hasCustomCover: Boolean!
  }

  type ReadingStatus {
    id: ID!
    status: ReadingState!
    addedAt: String!
    user: User!
    book: Book!
  }

  type Review {
    id: ID!
    rating: Int!
    body: String
    createdAt: String!
    updatedAt: String!
    user: User!
    book: Book!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type UploadUrl {
    uploadUrl: String!
    publicUrl: String!
  }

  input UpdateProfileInput {
    name: String
    bio: String
    avatarUrl: String
  }
  
  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type BookSearchResult {
    googleId: String!
    title: String!
    authors: [String!]!
    description: String
    coverUrl: String
    publishedYear: Int
    isbn: String
  }

  type Query {
    me: User
    books: [Book!]!
    book(id: ID!): Book
    users: [User!]!
    user(id: ID!): User
    searchBooks(query: String!): [BookSearchResult!]!
    shelf(id: ID!): Shelf
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    logout(token: String!): Boolean!
    importBook(googleId: String!): Book!
    setReadingStatus(bookId: ID!, status: ReadingState!): ReadingStatus!
    removeReadingStatus(bookId: ID!): Boolean!
    upsertReview(bookId: ID!, rating: Int!, body: String): Review!
    deleteReview(bookId: ID!): Boolean!
    updateProfile(input: UpdateProfileInput!): User!
    requestAvatarUploadUrl(contentType: String!): UploadUrl!
    requestCoverUploadUrl(bookId: ID!, contentType: String!): UploadUrl!
    setBookCover(bookId: ID!, coverUrl: String!): Book!
    removeBookCover(bookId: ID!): Book!
    createShelf(input: CreateShelfInput!): Shelf!
    updateShelf(id: ID!, input: UpdateShelfInput!): Shelf!
    deleteShelf(id: ID!): Boolean!
    addBookToShelf(shelfId: ID!, bookId: ID!): Shelf!
    removeBookFromShelf(shelfId: ID!, bookId: ID!): Shelf!
  }
`;
