# Student Management API

A comprehensive RESTful API for managing student records using Node.js and Express. This project is designed for learning API development fundamentals, including RESTful principles, bearer token authentication, middleware, file I/O, and API testing with Postman.

## 🎯 Features

- 📊 **8 RESTful Endpoints** - Get API status, read/create/update/delete students, register clients
- 🔐 **Bearer Token Authentication** - Secure protected endpoints with token-based authorization
- 🔍 **Advanced Filtering** - Filter students by course and limit results
- 📈 **Student Statistics** - Automatic ranking and GPA comparisons
- ✅ **Data Validation** - Input validation and duplicate prevention
- 📁 **JSON File Storage** - Simple file-based database (no external DB required)
- 🧪 **Postman Ready** - Complete documentation and workflows for API testing
- 🎓 **Learning Focused** - Perfect for understanding API fundamentals

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- POSTMAN (for testing the API)

## 🔧 Installation

1. **Navigate to the project directory:**
   ```bash
   cd "Student API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ▶️ Running the Server

### Using npm start:
```bash
npm start
```

### Using nodemon (for development with auto-reload):
```bash
npm run dev
```

The API will be available at: `http://localhost:3000`

## � API Documentation

For comprehensive API documentation including all endpoints, request/response examples, and testing workflows, see **[Student-Management-API.md](./Student-Management-API.md)**.

The documentation includes:
- ✅ Detailed endpoint reference (8 endpoints)
- ✅ Authentication and token management
- ✅ Data models and structure
- ✅ Error handling and status codes
- ✅ **Complete Postman setup guide with workflows**
- ✅ cURL examples and Postman collection JSON
- ✅ Pro tips for API testing and automation

## 📊 Database Structure

### students.json
```json
[
  {
    "id": 1,
    "name": "Student Name",
    "email": "student@example.com",
    "course": "Computer Science",
    "gpa": 8.5
  }
]
```

### clients.json
```json
[
  {
    "id": 1,
    "clientName": "Learning Client",
    "email": "learn@example.com",
    "token": "sk_xxxxxxxxxxxxx",
    "createdAt": "2026-05-17T00:00:00Z",
    "active": true
  }
]
```

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

## 🎓 What You'll Learn

- **Express.js Framework** - RESTful API development
- **HTTP Methods** - GET, POST, PUT, PATCH, DELETE
- **Authentication** - Bearer token-based authorization
- **File I/O** - JSON file operations (read/write)
- **Middleware** - Request authentication and processing
- **Query Parameters** - URL query string parsing and filtering
- **Status Codes** - Proper HTTP response codes
- **Error Handling** - Error middleware and validation
- **API Design** - RESTful principles and best practices
- **Data Validation** - Input validation and duplicate prevention
- **Statistics** - Data aggregation and ranking calculations

---

## 🚀 Future Enhancements

- [ ] Add MongoDB/PostgreSQL database integration
- [ ] Implement JWT tokens with expiration
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Add unit and integration tests
- [ ] Add logging system (Winston/Morgan)
- [ ] Implement pagination
- [ ] Add search functionality
- [ ] Add role-based access control (RBAC)
- [ ] Add rate limiting
- [ ] Add request/response caching

## 📝 Common Issues & Solutions

**Issue: "Authorization required" error**
- Solution: Make sure you've registered a client and copied the Bearer token correctly

**Issue: "Student with this email already exists"**
- Solution: Use a unique email that hasn't been registered yet

**Issue: Port 3000 already in use**
- Solution: Change PORT in server.js or kill the process using port 3000

**Issue: Cannot read JSON files**
- Solution: Ensure students.json and clients.json exist in the project root

## 📞 Support

For issues or questions about the API, refer to the endpoint documentation above or test with POSTMAN to understand the request/response format.

