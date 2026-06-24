export const typeDefs = `#graphql
  enum ShelfStatus {
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
    shelf: [ShelfItem!]!
    reviews: [Review!]!
    collections: [Collection!]!
  }

  type Collection {
    id: ID!
    name: String!
    color: String!
    icon: String!
    createdAt: String!
    books: [Book!]!
    bookCount: Int!
  }

  input CreateCollectionInput {
    name: String!
    color: String!
    icon: String!
  }

  input UpdateCollectionInput {
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

  type ShelfItem {
    id: ID!
    status: ShelfStatus!
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
    collection(id: ID!): Collection
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    logout(token: String!): Boolean!
    importBook(googleId: String!): Book!
    addToShelf(bookId: ID!, status: ShelfStatus!): ShelfItem!
    moveOnShelf(bookId: ID!, status: ShelfStatus!): ShelfItem!
    removeFromShelf(bookId: ID!): Boolean!
    upsertReview(bookId: ID!, rating: Int!, body: String): Review!
    deleteReview(bookId: ID!): Boolean!
    updateProfile(input: UpdateProfileInput!): User!
    requestAvatarUploadUrl(contentType: String!): UploadUrl!
    requestCoverUploadUrl(bookId: ID!, contentType: String!): UploadUrl!
    setBookCover(bookId: ID!, coverUrl: String!): Book!
    removeBookCover(bookId: ID!): Book!
    createCollection(input: CreateCollectionInput!): Collection!
    updateCollection(id: ID!, input: UpdateCollectionInput!): Collection!
    deleteCollection(id: ID!): Boolean!
    addBookToCollection(collectionId: ID!, bookId: ID!): Collection!
    removeBookFromCollection(collectionId: ID!, bookId: ID!): Collection!
  }
`;
