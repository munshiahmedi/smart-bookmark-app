# Smart Book App - Server

## Project Structure

This server has been organized to keep the main directory clean and maintainable:

### Core Files
- `server.js` - Main server entry point
- `db.js` - Database connection configuration
- `.env` - Environment variables

### Directories

#### `/controller/`
Contains application logic controllers:
- `authController.js` - Authentication handling
- `bookController.js` - Book operations
- `userController.js` - User management

#### `/middleware/`
Custom middleware functions:
- `authMiddleware.js` - Authentication verification
- `upload.js` - File upload handling

#### `/routes/`
API route definitions:
- `auth.js` - Authentication endpoints
- `books.js` - Book-related endpoints
- `routes.js` - Main route configuration

#### `/migrations/`
Database schema migration files:
- `add-dob-column.js` - Add date of birth column
- `add-image-column.js` - Add image column
- `add-status-column.js` - Add status column
- `add-timestamps.js` - Add timestamp fields
- `add-user-id-column.js` - Add user ID column
- `create-wishlist-table.js` - Create wishlist table

#### `/tests/`
All test and debugging files organized by category:
- **Test files**: `test-*.js` - API endpoint tests
- **Simple tests**: `simple-*.js` - Basic functionality tests
- **Check scripts**: `check-*.js` - Database verification scripts
- **Debug scripts**: `debug-*.js` - Debugging utilities
- **Add scripts**: `add-*.js` - Data addition scripts
- **Direct tests**: `direct-*.js` - Direct API tests
- **Publish scripts**: `publish-*.js` - Publishing utilities

#### `/uploads/`
File upload storage directory

## Running Tests

To run tests, navigate to the appropriate directory:

```bash
# Run specific test
node tests/test-auth-issues.js

# Run database check
node tests/check-db.js

# Run migration
node migrations/add-dob-column.js
```

## Environment Setup

Make sure to configure your `.env` file with:
- Database connection details
- JWT secret
- Other environment-specific variables
