# Node.js Bookstore API

This project is a simple bookstore API built with Node.js. It provides both REST and GraphQL endpoints for listing and creating books, with JWT-based authentication. Both APIs share the same service layer. The project includes automated tests for all layers, Swagger documentation for the REST API.

## Features
- REST API (Express):
  - List all books (`GET /books`)
  - Create a new book (`POST /books`)
  - User registration (`POST /users/register`)
  - User login (`POST /users/login`)
  - Swagger UI documentation (`/api-docs`)
- GraphQL API (Apollo Server):
  - Query all books
  - Mutation to create a new book
  - User registration and login mutations
- JWT authentication for both APIs
- Shared service layer for business logic
- Automated tests (Supertest, Mocha, Chai, Sinon)

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation
```sh
npm install
```

### Running the Server
```sh
npm run start:all
```

### Running Tests
```sh
npm test
```

## Project Structure
- `src/rest/controllers` - REST controllers
- `src/rest/routes` - REST API routes
- `src/rest/swagger.js` & `src/rest/openapi.js` - Swagger/OpenAPI setup
- `src/graphql` - GraphQL schema, resolvers, and server
- `src/services` - Shared business logic
- `src/models` - Data models
- `test` - Automated tests

## Authentication
Most endpoints require a valid JWT token. Use the `/users/register` endpoint to create a user, then `/users/login` to obtain a token. For GraphQL, use the `register` and `login` mutations.

## API Documentation
REST API documentation is available via Swagger UI at [`/api-docs`](http://localhost:3000/api-docs) when the server is running.

## License
MIT
