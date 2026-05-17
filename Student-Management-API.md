# Student Management API Documentation

## Overview

The Student Management API is a RESTful API built with Express.js that provides endpoints for managing student records and their academic information. The API supports both public read operations and protected write operations with Bearer token authentication.

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000`

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
   - [Public Endpoints](#public-endpoints)
   - [Protected Endpoints](#protected-endpoints)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- Express.js and Body-Parser packages

### Installation

```bash
npm install
```

### Starting the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

---

## Authentication

### Overview

- **Public Endpoints:** No authentication required for read operations and client registration
- **Protected Endpoints:** Bearer token authentication required for write operations (POST, PUT, PATCH, DELETE)

### Registration Flow

1. Call `POST /register` to register a new API client
2. Receive a Bearer token in the response
3. Use the token in the `Authorization` header for protected endpoints

### Token Format

```
Authorization: Bearer sk_<your_token_here>
```

### Example

```bash
# Register a client
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"clientName": "My App", "email": "myapp@example.com"}'

# Use the token for protected operations
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_YOUR_TOKEN_HERE" \
  -d '{"name": "John Doe", "email": "john@example.com", "course": "Computer Science", "gpa": 8.5}'
```

---

## Data Models

### Student Object

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "gpa": 8.5
}
```

**Fields:**
- `id` (number): Unique identifier for the student (auto-generated)
- `name` (string): Student's full name
- `email` (string): Student's email address (must be unique)
- `course` (string): Course enrollment. Valid values:
  - `Computer Science`
  - `Information Technology`
  - `Data Science`
- `gpa` (number): Grade Point Average (0-10)

### Client Object

```json
{
  "id": 1,
  "clientName": "My Application",
  "email": "myapp@example.com",
  "token": "sk_xxxxxxxxxxxxxxxx",
  "createdAt": "2024-05-17T10:30:00.000Z",
  "active": true
}
```

**Fields:**
- `id` (number): Unique identifier for the client (auto-generated)
- `clientName` (string): Name of the client application
- `email` (string): Contact email for the client
- `token` (string): Bearer token for authentication
- `createdAt` (string): ISO timestamp when client was registered
- `active` (boolean): Whether the client is active

---

## API Endpoints

### Public Endpoints

#### 1. Get API Status

Returns current API status and information about available endpoints.

```
GET /status
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-05-17T10:30:00.000Z",
  "uptime": 1234.56,
  "students": 5,
  "registeredClients": 2,
  "authorization": {
    "required": "Only for write operations (POST, PUT, PATCH, DELETE)",
    "type": "Bearer Token",
    "header": "Authorization",
    "format": "Bearer <token>",
    "tokenFormat": "sk_xxxxxxxxxxxxxxxx"
  },
  "endpoints": {
    "public": {...},
    "protected": {...}
  }
}
```

---

#### 2. Get All Students

Retrieves a list of all students with optional filtering and pagination.

```
GET /students
```

**Query Parameters:**

| Parameter | Type | Description | Valid Values |
|-----------|------|-------------|---------------|
| `course` | string | Filter by course | `Computer Science`, `Information Technology`, `Data Science` |
| `limit` | number | Limit results (max 20) | 1-20 |

**Response:** `200 OK`

```json
{
  "success": true,
  "count": 5,
  "totalAvailable": 10,
  "filters": {
    "course": "Computer Science",
    "limit": 5
  },
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "course": "Computer Science",
      "gpa": 8.5
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request` - Invalid course or limit value
  ```json
  {
    "success": false,
    "message": "Invalid course. Valid options: Computer Science, Information Technology, Data Science"
  }
  ```

---

#### 3. Get Student by ID

Retrieves detailed information about a specific student, including academic statistics.

```
GET /students/:id
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Student ID |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Computer Science",
    "gpa": 8.5
  },
  "statistics": {
    "courseInfo": {
      "course": "Computer Science",
      "studentsInCourse": 3,
      "averageGpaInCourse": "8.50",
      "studentRankInCourse": 1
    },
    "overallStats": {
      "totalStudents": 10,
      "overallAverageGpa": "8.30",
      "studentRankOverall": 2
    }
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid ID format
  ```json
  {
    "success": false,
    "message": "Invalid student ID. ID must be a positive number"
  }
  ```

- `404 Not Found` - Student not found
  ```json
  {
    "success": false,
    "message": "Student with ID 999 not found",
    "hint": "Use GET /students to see all available students"
  }
  ```

---

#### 4. Register API Client

Registers a new API client and returns a Bearer token for authentication.

```
POST /register
```

**Request Body:**

```json
{
  "clientName": "My Application",
  "email": "myapp@example.com"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "API client registered successfully",
  "client": {
    "id": 1,
    "clientName": "My Application",
    "email": "myapp@example.com",
    "token": "sk_abcdef123456789...",
    "createdAt": "2024-05-17T10:30:00.000Z"
  },
  "usage": {
    "example": "Authorization: Bearer sk_abcdef123456789...",
    "documentation": "Use this token in Authorization header for all protected endpoints"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
  ```json
  {
    "success": false,
    "message": "Please provide clientName and email"
  }
  ```

- `400 Bad Request` - Invalid email format
  ```json
  {
    "success": false,
    "message": "Please provide a valid email address"
  }
  ```

- `409 Conflict` - Email already registered
  ```json
  {
    "success": false,
    "message": "Client with this email already registered",
    "clientId": 1
  }
  ```

---

### Protected Endpoints

All protected endpoints require the following header:

```
Authorization: Bearer <your_token>
```

---

#### 5. Add New Student

Creates a new student record.

```
POST /students
```

**Request Header:**

```
Authorization: Bearer sk_<your_token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "gpa": 8.5
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": 6,
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Computer Science",
    "gpa": 8.5
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
  ```json
  {
    "success": false,
    "message": "Please provide name, email, course, and gpa"
  }
  ```

- `401 Unauthorized` - Missing authorization header
  ```json
  {
    "success": false,
    "message": "Authorization required. Please provide Bearer token in Authorization header",
    "example": "Authorization: Bearer <your_token>"
  }
  ```

- `403 Forbidden` - Invalid or inactive token
  ```json
  {
    "success": false,
    "message": "Invalid API key or client is inactive"
  }
  ```

- `409 Conflict` - Email already exists
  ```json
  {
    "success": false,
    "message": "Student with this email already exists",
    "studentId": 2
  }
  ```

---

#### 6. Update Student (Complete)

Updates all fields of a student record.

```
PUT /students/:id
```

**Request Header:**

```
Authorization: Bearer sk_<your_token>
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Student ID |

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "course": "Information Technology",
  "gpa": 9.0
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "course": "Information Technology",
    "gpa": 9.0
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Missing authorization
- `403 Forbidden` - Invalid token
- `404 Not Found` - Student not found

---

#### 7. Update Student (Partial)

Updates only the student's name (partial update).

```
PATCH /students/:id
```

**Request Header:**

```
Authorization: Bearer sk_<your_token>
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Student ID |

**Request Body:**

```json
{
  "name": "Jane Smith"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Student name updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "course": "Information Technology",
    "gpa": 9.0
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing name field
- `401 Unauthorized` - Missing authorization
- `403 Forbidden` - Invalid token
- `404 Not Found` - Student not found

---

#### 8. Delete Student

Deletes a student record.

```
DELETE /students/:id
```

**Request Header:**

```
Authorization: Bearer sk_<your_token>
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Student ID |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "course": "Information Technology",
    "gpa": 9.0
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing authorization
- `403 Forbidden` - Invalid token
- `404 Not Found` - Student not found

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successful GET/PUT/PATCH/DELETE |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Missing authorization header |
| 403 | Forbidden | Invalid or inactive token |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate email) |
| 500 | Internal Server Error | Server error |

---

## Examples

### Example 1: Basic Workflow

**Step 1: Register a new client**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Student Portal",
    "email": "portal@example.com"
  }'
```

Response:
```json
{
  "success": true,
  "client": {
    "token": "sk_abc123def456..."
  }
}
```

**Step 2: View all students**

```bash
curl http://localhost:3000/students
```

**Step 3: Add a new student**

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_abc123def456..." \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "course": "Data Science",
    "gpa": 8.8
  }'
```

**Step 4: Get student details**

```bash
curl http://localhost:3000/students/6
```

---

### Example 2: Filter Students by Course

```bash
curl "http://localhost:3000/students?course=Computer%20Science&limit=5"
```

---

### Example 3: Update Student Information

```bash
curl -X PUT http://localhost:3000/students/6 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_abc123def456..." \
  -d '{
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "course": "Computer Science",
    "gpa": 9.0
  }'
```

---

### Example 4: Update Only Student Name

```bash
curl -X PATCH http://localhost:3000/students/6 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_abc123def456..." \
  -d '{
    "name": "Alice M. Smith"
  }'
```

---

### Example 5: Delete a Student

```bash
curl -X DELETE http://localhost:3000/students/6 \
  -H "Authorization: Bearer sk_abc123def456..."
```

---

## Quick Reference

| Operation | Method | Endpoint | Auth Required |
|-----------|--------|----------|---------------|
| Get API status | GET | `/status` | ❌ |
| List all students | GET | `/students` | ❌ |
| Get student details | GET | `/students/:id` | ❌ |
| Register new client | POST | `/register` | ❌ |
| Add new student | POST | `/students` | ✅ |
| Update student (full) | PUT | `/students/:id` | ✅ |
| Update student (name only) | PATCH | `/students/:id` | ✅ |
| Delete student | DELETE | `/students/:id` | ✅ |

---

## Support & Notes

- All timestamps are in ISO 8601 format
- GPA values should be between 0 and 10
- Email addresses must be unique for both students and clients
- The API stores all data in JSON files (`students.json` and `clients.json`)
- Maximum query limit for `/students` endpoint is 20 results
