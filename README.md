# Student Management API

A comprehensive RESTful API for managing student records using Node.js and Express. This API features JWT-like Bearer token authentication, a JSON file-based database, and is perfect for learning API development and testing with POSTMAN.

## 🎯 Features

### Core Features
- ✅ **API Status Monitoring** - Get real-time API status and statistics
- ✅ **Client Registration System** - Register API clients and obtain Bearer tokens
- ✅ **Get All Students** - Retrieve all students with optional filtering
- ✅ **Get Student by ID** - Get detailed student information with statistics
- ✅ **Add New Student** - Create new student records (requires authorization)
- ✅ **Complete Student Update** - Update all student fields (requires authorization)
- ✅ **Partial Student Update** - Update student name only (requires authorization)
- ✅ **Delete Student** - Remove student records (requires authorization)

### Advanced Features
- 🔐 **Bearer Token Authentication** - Secure API endpoints with token-based auth
- 🔍 **Query Parameters** - Filter students by course and limit results
- 📊 **Student Statistics** - Get ranking and GPA comparisons
- ✔️ **Duplicate Prevention** - Prevent duplicate student and client emails
- 📝 **Input Validation** - Comprehensive request validation
- 🚀 **Error Handling** - Detailed error messages and HTTP status codes

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

## 📡 API Endpoints

### 1. GET /status - API Status
```http
GET http://localhost:3000/status
```

**Description:** Get API status, statistics, and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-05-17T12:34:56.789Z",
  "uptime": 45.234,
  "students": 11,
  "registeredClients": 1,
  "authorization": {
    "required": "Only for write operations (POST, PUT, PATCH, DELETE)",
    "type": "Bearer Token",
    "format": "Bearer <token>"
  },
  "endpoints": {
    "public": [...],
    "protected": [...]
  }
}
```

### 2. GET /students - Get All Students
```http
GET http://localhost:3000/students
```

**Description:** Retrieve all students with optional filtering by course and limit.

**Query Parameters:**
- `course` (optional): Filter by course. Valid values: "Computer Science", "Information Technology", "Data Science"
- `limit` (optional): Limit results (1-20)

**Examples:**
```
GET /students
GET /students?course=Computer Science
GET /students?limit=5
GET /students?course=Information Technology&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "totalAvailable": 11,
  "filters": {
    "course": "all",
    "limit": "unlimited"
  },
  "data": [
    {
      "id": 1,
      "name": "John Doe Updated",
      "email": "john.updated@example.com",
      "course": "Software Engineering",
      "gpa": 9
    }
  ]
}
```

### 3. GET /students/:id - Get Single Student
```http
GET http://localhost:3000/students/1
```

**Description:** Get detailed information about a specific student including ranking statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "course": "Software Engineering",
    "gpa": 9
  },
  "statistics": {
    "courseInfo": {
      "course": "Software Engineering",
      "studentsInCourse": 1,
      "averageGpaInCourse": "9.00",
      "studentRankInCourse": 1
    },
    "overallStats": {
      "totalStudents": 11,
      "overallAverageGpa": "8.52",
      "studentRankOverall": 2
    }
  }
}
```

### 4. POST /register - Register API Client
```http
POST http://localhost:3000/register
Content-Type: application/json

{
  "clientName": "My Application",
  "email": "myapp@example.com"
}
```

**Description:** Register a new API client to obtain a Bearer token for protected endpoints.

**Response:**
```json
{
  "success": true,
  "message": "API client registered successfully",
  "client": {
    "id": 2,
    "clientName": "My Application",
    "email": "myapp@example.com",
    "token": "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "createdAt": "2026-05-17T12:34:56Z"
  },
  "usage": {
    "example": "Authorization: Bearer sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "documentation": "Use this token in Authorization header for all protected endpoints"
  }
}
```

### 5. POST /students - Add a New Student
```http
POST http://localhost:3000/students
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "course": "Computer Science",
  "gpa": 8.95
}
```

**Description:** Create a new student record. Requires authentication.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": 12,
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "course": "Computer Science",
    "gpa": 8.95
  }
}
```

### 6. PUT /students/:id - Complete Student Update
```http
PUT http://localhost:3000/students/1
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "course": "Computer Science",
  "gpa": 9.2
}
```

**Description:** Update all fields of a student. Requires authentication.

**Required Fields:** name, email, course, gpa

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "course": "Computer Science",
    "gpa": 9.2
  }
}
```

### 7. PATCH /students/:id - Partial Student Update
```http
PATCH http://localhost:3000/students/1
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "John Doe"
}
```

**Description:** Update only the student name. Requires authentication.

**Required Fields:** name only

**Response:**
```json
{
  "success": true,
  "message": "Student name updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.smith@example.com",
    "course": "Computer Science",
    "gpa": 9.2
  }
}
```

### 8. DELETE /students/:id - Delete an Student
```http
DELETE http://localhost:3000/students/1
Authorization: Bearer <your_token>
```

**Description:** Delete a student record. Requires authentication.

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.smith@example.com",
    "course": "Computer Science",
    "gpa": 9.2
  }
}
```

## 🔐 Authorization

### Public Endpoints (No authentication required)
- `GET /status` - Get API status
- `GET /students` - List all students
- `GET /students/:id` - Get student by ID
- `POST /register` - Register API client

### Protected Endpoints (Bearer token required)
- `POST /students` - Add new student
- `PUT /students/:id` - Update student
- `PATCH /students/:id` - Update student name
- `DELETE /students/:id` - Delete student

### How to Get Bearer Token

1. **Register a Client:**
```http
POST http://localhost:3000/register
{
  "clientName": "My App",
  "email": "myapp@example.com"
}
```

2. **Copy the token from response**
3. **Use in protected endpoints:**
```
Authorization: Bearer sk_xxxxxxxxxxxxx
```

## 🧪 Testing with POSTMAN

### Step-by-Step Guide

#### Step 1: Register a Client (Get Bearer Token)
```
Method: POST
URL: http://localhost:3000/register
Headers:
  Content-Type: application/json
Body:
{
  "clientName": "My Test Client",
  "email": "testclient@example.com"
}
```
**Copy the token from the response. You'll use this for protected endpoints.**

#### Step 2: Test Public Endpoints

**Get API Status:**
```
Method: GET
URL: http://localhost:3000/status
```

**Get All Students:**
```
Method: GET
URL: http://localhost:3000/students
```

**Get All Students with Filters:**
```
Method: GET
URL: http://localhost:3000/students?course=Computer Science&limit=5
```

**Get Single Student:**
```
Method: GET
URL: http://localhost:3000/students/1
```

#### Step 3: Test Protected Endpoints (Requires Bearer Token)

**Add New Student:**
```
Method: POST
URL: http://localhost:3000/students
Headers:
  Authorization: Bearer <your_token_from_registration>
  Content-Type: application/json
Body:
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "course": "Computer Science",
  "gpa": 8.85
}
```

**Update Complete Student:**
```
Method: PUT
URL: http://localhost:3000/students/1
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body:
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "course": "Information Technology",
  "gpa": 9.0
}
```

**Update Student Name Only:**
```
Method: PATCH
URL: http://localhost:3000/students/1
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body:
{
  "name": "New Name"
}
```

**Delete Student:**
```
Method: DELETE
URL: http://localhost:3000/students/1
Headers:
  Authorization: Bearer <your_token>
```

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
├── server.js           # Main Express application
├── students.json       # Student records database
├── clients.json        # API client tokens database
├── package.json        # Dependencies and scripts
├── .gitignore          # Git ignore file
└── README.md           # This documentation
```

## 🎓 Learning Topics Covered

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

## 📈 HTTP Status Codes Reference

| Code | Description | Example |
|------|-------------|---------|
| `200` | OK | GET request successful |
| `201` | Created | Student created successfully |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing authorization header |
| `403` | Forbidden | Invalid API token |
| `404` | Not Found | Student not found |
| `409` | Conflict | Duplicate email address |
| `500` | Server Error | Internal server error |

## ✅ Course Options

The API supports the following course types:
- Computer Science
- Information Technology
- Data Science

## 📊 GPA Scale

GPA values should be between **0 and 10**.

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

## 📄 License

ISC

## 👤 Author

Student Learning Project
