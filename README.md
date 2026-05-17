# Student Management API

A simple RESTful API for managing student records using Node.js and Express. This API uses a JSON file as a database and is perfect for learning API development and testing with POSTMAN.

## Features

- ✅ Get all students
- ✅ Get student by ID
- ✅ Add a new student
- ✅ Update student information
- ✅ Delete a student

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- POSTMAN (for testing the API)

## Installation

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

### Using nodemon (for development with auto-reload):
```bash
npm run dev
```

The API will be available at: `http://localhost:3000`

## API Endpoints

### 1. Get All Students
```http
GET /students
```
**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "course": "Computer Science",
      "gpa": 3.8
    }
  ]
}
```

### 2. Get Student By ID
```http
GET /students/1
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Computer Science",
    "gpa": 3.8
  }
}
```

### 3. Add a New Student
```http
POST /students
Content-Type: application/json

{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "course": "Cybersecurity",
  "gpa": 3.95
}
```
**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": 4,
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "course": "Cybersecurity",
    "gpa": 3.95
  }
}
```

### 4. Update Student
```http
PUT /students/1
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "course": "Software Engineering",
  "gpa": 3.9
}
```
**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "course": "Software Engineering",
    "gpa": 3.9
  }
}
```

### 5. Delete Student
```http
DELETE /students/1
```
**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Computer Science",
    "gpa": 3.8
  }
}
```

## Testing with POSTMAN

### Import Sample Requests:

1. **Open POSTMAN**
2. **Create a new request for each endpoint:**

#### GET All Students
- Method: `GET`
- URL: `http://localhost:3000/students`

#### GET Student by ID
- Method: `GET`
- URL: `http://localhost:3000/students/1`

#### Add New Student
- Method: `POST`
- URL: `http://localhost:3000/students`
- Header: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "course": "Artificial Intelligence",
    "gpa": 3.85
  }
  ```

#### Update Student
- Method: `PUT`
- URL: `http://localhost:3000/students/2`
- Header: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "course": "Machine Learning",
    "gpa": 4.0
  }
  ```

#### Delete Student
- Method: `DELETE`
- URL: `http://localhost:3000/students/3`

## Database

The API uses a `students.json` file as the database. Student records are stored in JSON format with the following structure:

```json
{
  "id": 1,
  "name": "Student Name",
  "email": "student@example.com",
  "course": "Course Name",
  "gpa": 3.8
}
```

## Project Structure

```
Student API/
├── server.js           # Main application file
├── students.json       # JSON database
├── package.json        # Project dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Learning Topics Covered

- **Express.js Basics**: Setting up routes and middleware
- **RESTful API Design**: Understanding HTTP methods (GET, POST, PUT, DELETE)
- **File I/O**: Reading and writing JSON files
- **Status Codes**: Using appropriate HTTP status codes (200, 201, 400, 404, 500)
- **Request/Response Handling**: Parsing JSON bodies and sending responses
- **Error Handling**: Middleware and error responses
- **API Testing**: Using POSTMAN for API testing

## Common HTTP Status Codes Used

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Future Enhancements

- Add data validation and sanitization
- Implement authentication (JWT tokens)
- Add database persistence (MongoDB, PostgreSQL)
- Add API documentation with Swagger
- Add unit tests
- Add logging system
- Implement pagination for get all students
- Add search and filter functionality

## License

ISC

## Author

Student Learning Project
