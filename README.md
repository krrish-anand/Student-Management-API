# Student Management API

A comprehensive RESTful API for managing student records using Node.js and Express. This project is used for learning API development fundamentals, including RESTful principles, bearer token authentication and API testing with Postman.

## Features

- **8 RESTful Endpoints** - Get API status, read/create/update/delete students, register clients
- **Bearer Token Authentication** - Secure protected endpoints with token-based authorization
- **Advanced Filtering** - Filter students by course and limit results
- **Student Statistics** - Automatic ranking and GPA comparisons
- **Data Validation** - Input validation and duplicate prevention
- **JSON File Storage** - Simple file-based database (no external DB required)
- **Postman Ready** - Complete documentation and workflows for API testing

## 🔧 Installation

1. **Navigate to the project directory:**
   ```bash
   cd "Student API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Server

### Using npm start:
```bash
npm start
```

The API will be available at: `http://localhost:3000` by default if no changes in project is made.

## API Documentation

For comprehensive API documentation including all endpoints, request/response examples, and testing workflows, see **[Student-Management-API.md](./Student-Management-API.md)**.

The documentation includes:
- ✅ Detailed endpoint reference (8 endpoints)
- ✅ Authentication and token management
- ✅ Data models and structure
- ✅ Error handling and status codes
- ✅ **Complete Postman setup guide with workflows**


## 📁 Project Structure

```
Student API/
├── server.js              # Main Express application
├── students.json          # Student records database
├── clients.json           # API client tokens database
├── package.json           # Dependencies and scripts
├── Student-Management-API.md  # Complete API documentation
├── README.md              # This file
└── .gitignore             # Git ignore file
```

## Common Issues & Solutions

**Issue: "Authorization required" error**
- Solution: Make sure you've registered a client and copied the Bearer token correctly

**Issue: "Student with this email already exists"**
- Solution: Use a unique email that hasn't been registered yet

**Issue: Port 3000 already in use**
- Solution: Change PORT in server.js or kill the process using port 3000

**Issue: Cannot read JSON files**
- Solution: Ensure students.json and clients.json exist in the project root

## Support

For issues or questions about the API, refer to the endpoint documentation above or test with POSTMAN to understand the request/response format.

