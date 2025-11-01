# 🐛 Bug Tracker - MERN Testing & Debugging Project

A comprehensive MERN stack application designed for learning and implementing testing strategies and debugging techniques. This project serves as a bug tracking system while demonstrating best practices for unit testing, integration testing, end-to-end testing, and debugging in a full-stack JavaScript environment.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project is part of Week 6 assignment focusing on ensuring MERN application reliability through comprehensive testing and debugging. It implements a bug tracking system with full CRUD operations, demonstrating various testing methodologies and debugging techniques.

## ✨ Features

- **Bug Management**: Create, read, update, and delete bug reports
- **User-Friendly Interface**: Clean React-based UI with Tailwind CSS
- **RESTful API**: Express.js backend with MongoDB
- **Comprehensive Testing**: Unit, integration, and end-to-end tests
- **Debugging Tools**: Built-in logging and error handling
- **Code Coverage**: Detailed test coverage reports

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Testing Library** - Testing utilities
- **Jest** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Supertest** - API testing
- **Jest** - Testing framework

### Testing & Debugging
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **Supertest** - HTTP endpoint testing
- **MongoDB Memory Server** - In-memory database for testing
- **Cypress/Playwright** - End-to-end testing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd testing-and-debugging-ensuring-mern-app-reliability-Breezy-Reese
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (client and server)
   npm run install-all

   # Or install separately:
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files if needed
   cp server/.env.example server/.env
   # Add your MongoDB connection string
   ```

4. **Setup Test Database**
   ```bash
   cd server
   npm run setup-test-db
   ```

## 💻 Usage

1. **Start the development servers**
   ```bash
   # Start both client and server
   npm run dev

   # Or start separately:
   # Server (from server directory)
   npm run dev

   # Client (from client directory)
   npm run dev
   ```

2. **Access the application**
   - Frontend: http://localhost:5173 (Vite default)
   - Backend API: http://localhost:5000

3. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # End-to-end tests only

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API endpoints and component interactions
- **End-to-End Tests**: Test complete user workflows

### Coverage Requirements

- Minimum 70% code coverage for unit tests
- Coverage reports generated in `coverage/` directory

## 📁 Project Structure

```
testing-and-debugging-ensuring-mern-app-reliability-Breezy-Reese/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── BugForm.jsx         # Bug creation form
│   │   │   ├── BugItem.jsx         # Individual bug display
│   │   │   ├── BugList.jsx         # Bug list component
│   │   │   └── Button.jsx          # Custom button component
│   │   ├── tests/                  # Client tests
│   │   │   ├── unit/               # Unit tests
│   │   │   └── integration/        # Integration tests
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/             # Route controllers
│   │   ├── models/                  # Mongoose models
│   │   ├── routes/                  # API routes
│   │   ├── middleware/              # Custom middleware
│   │   ├── utils/                   # Utility functions
│   │   └── app.js                   # Express app setup
│   ├── tests/                       # Server tests
│   │   ├── unit/                    # Unit tests
│   │   └── integration/             # Integration tests
│   ├── package.json
│   └── jest.config.js
├── coverage/                        # Test coverage reports
├── jest.config.js                   # Root Jest config
├── README.md                        # This file
├── TODO.md                          # Task tracking
└── Week6-Assignment.md              # Assignment details
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Bugs
- `GET /api/bugs` - Get all bugs
- `GET /api/bugs/:id` - Get bug by ID
- `POST /api/bugs` - Create new bug
- `PUT /api/bugs/:id` - Update bug
- `DELETE /api/bugs/:id` - Delete bug

#### Request/Response Examples

**Create Bug**
```json
POST /api/bugs
{
  "title": "Login button not working",
  "description": "Users cannot log in after recent update",
  "priority": "high",
  "status": "open"
}
```

## 🔧 Debugging

### Server-Side Debugging
- Logging implemented in `server/src/middleware/error.js`
- Use `console.log` strategically in development
- Error boundaries in React components

### Client-Side Debugging
- React Developer Tools for component inspection
- Browser console for JavaScript errors
- Network tab for API call debugging

### Common Debugging Commands
```bash
# Check server logs
cd server && npm run logs

# Run tests with verbose output
npm run test -- --verbose

# Debug specific test
npm run test -- --testNamePattern="BugForm"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Assignment Details

For detailed assignment requirements, see [Week6-Assignment.md](./Week6-Assignment.md)

## 📄 License

This project is for educational purposes as part of a course assignment.

## 📞 Support

If you encounter issues:
1. Check the [Assignment Document](./Week6-Assignment.md)
2. Review existing tests for examples
3. Check the coverage reports for untested code
4. Use debugging tools mentioned above

## 🔗 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MERN Stack Tutorial](https://www.mongodb.com/languages/mern-stack-tutorial)
