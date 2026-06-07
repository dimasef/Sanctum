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
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    logout(token: String!): Boolean!
    importBook(googleId: String!): Book!
  }
`;
