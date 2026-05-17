# Student Management API Documentation

## Overview

The Student Management API is a RESTful API built with Express.js that provides endpoints for managing student records and their academic information. The API supports both public read operations and protected write operations with Bearer token authentication.

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000`

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Testing with Postman](#testing-with-postman)
3. [Authentication](#authentication)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
   - [Public Endpoints](#public-endpoints)
   - [Protected Endpoints](#protected-endpoints)
6. [Error Handling](#error-handling)
7. [Examples](#examples)

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

## Testing with Postman

Postman is a powerful API development and testing tool that makes it easy to test the Student Management API. This section guides you through setting up and using Postman.

### Prerequisites

- Download and install [Postman](https://www.postman.com/downloads/)
- Student Management API running on `http://localhost:3000`

### Setting Up Postman Environment

#### Step 1: Create a New Environment

1. In Postman, click **Environments** (left sidebar)
2. Click **Create New Environment**
3. Name it `Student API Local`
4. Add the following variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `token` | `` | `` |
| `clientName` | `Postman Client` | `Postman Client` |
| `clientEmail` | `postman@example.com` | `postman@example.com` |

5. Click **Save**

#### Step 2: Select the Environment

- In the top-right corner, select **Student API Local** from the environment dropdown

### Setting Up Postman Collection

#### Option A: Manually Create Requests

1. Click **Create New Collection** or **+** to create a new request
2. Organize requests into folders:
   - **Public Endpoints**
   - **Client Registration**
   - **Student Management (Protected)**

#### Option B: Import Collection

You can import the collection using the JSON below:

1. Click **Import** in Postman
2. Select **Raw text** and paste the collection JSON (see [Postman Collection JSON](#postman-collection-json) section)
3. Click **Import**

### Pre-Request Script for Token Management

For protected endpoints, use this pre-request script to automatically inject the token:

1. Open a **protected endpoint** request
2. Go to the **Pre-request Script** tab
3. Add this script:

```javascript
// Automatically set Bearer token in Authorization header
let token = pm.environment.get('token');
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + token
    });
}
```

### Test Scripts

Add test scripts to validate responses. Example for successful student creation:

1. Go to the **Tests** tab in your request
2. Add this script:

```javascript
// Check for successful response
pm.test("Status code is 201 Created", function () {
    pm.response.to.have.status(201);
});

pm.test("Response is valid JSON", function () {
    pm.response.to.be.json;
});

pm.test("Response has success flag", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Student has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('name');
    pm.expect(jsonData.data).to.have.property('email');
});
```

### Workflow: Register Token and Use in Requests

#### Step 1: Register API Client (GET TOKEN)

1. Create a new request: **POST** `{{base_url}}/register`
2. Go to **Body** tab, select **raw** and **JSON**
3. Paste:
   ```json
   {
     "clientName": "{{clientName}}",
     "email": "{{clientEmail}}"
   }
   ```
4. Go to **Tests** tab and add:
   ```javascript
   // Save token to environment for use in other requests
   if (pm.response.code === 201) {
       var jsonData = pm.response.json();
       pm.environment.set('token', jsonData.client.token);
       console.log('Token saved: ' + jsonData.client.token);
   }
   ```
5. Click **Send**
6. The token is now saved in `{{token}}` and will be used automatically

#### Step 2: Test Protected Endpoints

Once you have a token, all protected endpoints will automatically use it:

1. Create a **POST** request to `{{base_url}}/students`
2. No need to manually add the Authorization header (pre-request script handles it)
3. Add body and send

### Request Examples in Postman

Here are ready-to-use request configurations:

#### Public: Get All Students

```
Method: GET
URL: {{base_url}}/students
Params: course=Computer Science, limit=5
```

#### Public: Get Student by ID

```
Method: GET
URL: {{base_url}}/students/1
```

#### Public: Register New Client

```
Method: POST
URL: {{base_url}}/register
Body (JSON):
{
  "clientName": "My Postman Client",
  "email": "postman.client@example.com"
}
```

#### Protected: Add New Student

```
Method: POST
URL: {{base_url}}/students
Body (JSON):
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "course": "Computer Science",
  "gpa": 8.9
}
```

#### Protected: Update Student (PUT)

```
Method: PUT
URL: {{base_url}}/students/1
Body (JSON):
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "course": "Information Technology",
  "gpa": 9.1
}
```

#### Protected: Update Student Name (PATCH)

```
Method: PATCH
URL: {{base_url}}/students/1
Body (JSON):
{
  "name": "Jane M. Smith"
}
```

#### Protected: Delete Student

```
Method: DELETE
URL: {{base_url}}/students/1
```

### Postman Collection JSON

You can use this JSON to import a complete collection with all endpoints. Save as `.json` file and import into Postman:

```json
{
  "info": {
    "name": "Student Management API",
    "description": "Complete collection for testing Student Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Public Endpoints",
      "item": [
        {
          "name": "Get API Status",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/status",
              "host": ["{{base_url}}"],
              "path": ["status"]
            }
          }
        },
        {
          "name": "Get All Students",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/students?course=Computer Science&limit=10",
              "host": ["{{base_url}}"],
              "path": ["students"],
              "query": [
                {"key": "course", "value": "Computer Science"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Get Student by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/students/1",
              "host": ["{{base_url}}"],
              "path": ["students", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Client Registration",
      "item": [
        {
          "name": "Register New Client",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set('token', jsonData.client.token);",
                  "    console.log('Token saved: ' + jsonData.client.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"clientName\": \"{{clientName}}\",\n  \"email\": \"{{clientEmail}}\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/register",
              "host": ["{{base_url}}"],
              "path": ["register"]
            }
          }
        }
      ]
    },
    {
      "name": "Student Management (Protected)",
      "item": [
        {
          "name": "Add New Student",
          "event": [
            {
              "listen": "prerequest",
              "script": {
                "exec": [
                  "let token = pm.environment.get('token');",
                  "if (token) {",
                  "    pm.request.headers.add({",
                  "        key: 'Authorization',",
                  "        value: 'Bearer ' + token",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"course\": \"Computer Science\",\n  \"gpa\": 8.5\n}"
            },
            "url": {
              "raw": "{{base_url}}/students",
              "host": ["{{base_url}}"],
              "path": ["students"]
            }
          }
        },
        {
          "name": "Update Student (PUT)",
          "event": [
            {
              "listen": "prerequest",
              "script": {
                "exec": [
                  "let token = pm.environment.get('token');",
                  "if (token) {",
                  "    pm.request.headers.add({",
                  "        key: 'Authorization',",
                  "        value: 'Bearer ' + token",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Jane Doe\",\n  \"email\": \"jane@example.com\",\n  \"course\": \"Information Technology\",\n  \"gpa\": 9.0\n}"
            },
            "url": {
              "raw": "{{base_url}}/students/1",
              "host": ["{{base_url}}"],
              "path": ["students", "1"]
            }
          }
        },
        {
          "name": "Update Student Name (PATCH)",
          "event": [
            {
              "listen": "prerequest",
              "script": {
                "exec": [
                  "let token = pm.environment.get('token');",
                  "if (token) {",
                  "    pm.request.headers.add({",
                  "        key: 'Authorization',",
                  "        value: 'Bearer ' + token",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Jane Smith\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/students/1",
              "host": ["{{base_url}}"],
              "path": ["students", "1"]
            }
          }
        },
        {
          "name": "Delete Student",
          "event": [
            {
              "listen": "prerequest",
              "script": {
                "exec": [
                  "let token = pm.environment.get('token');",
                  "if (token) {",
                  "    pm.request.headers.add({",
                  "        key: 'Authorization',",
                  "        value: 'Bearer ' + token",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{base_url}}/students/1",
              "host": ["{{base_url}}"],
              "path": ["students", "1"]
            }
          }
        }
      ]
    }
  ]
}
```

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

## Postman Testing Workflows

### Postman Workflow 1: Complete CRUD Operations

This workflow demonstrates how to perform all operations in Postman:

**Step 1: Set up Environment**
- Create environment: `Student API Local`
- Set variables:
  - `base_url`: `http://localhost:3000`
  - `token`: (empty, will be filled after registration)
  - `clientName`: `Postman Test Client`
  - `clientEmail`: `postman@youremail.com`

**Step 2: Register Client**
1. Create new request: `POST` → `{{base_url}}/register`
2. Body (JSON):
   ```json
   {
     "clientName": "{{clientName}}",
     "email": "{{clientEmail}}"
   }
   ```
3. Tests tab - Add this to save token:
   ```javascript
   if (pm.response.code === 201) {
       var jsonData = pm.response.json();
       pm.environment.set('token', jsonData.client.token);
       pm.environment.set('newStudentId', jsonData.client.id);
   }
   ```
4. Click **Send** - Token is now saved automatically

**Step 3: Create New Student**
1. Create new request: `POST` → `{{base_url}}/students`
2. Pre-request Script tab:
   ```javascript
   let token = pm.environment.get('token');
   if (token) {
       pm.request.headers.add({
           key: 'Authorization',
           value: 'Bearer ' + token
       });
   }
   ```
3. Body (JSON):
   ```json
   {
     "name": "Test Student",
     "email": "test.student@example.com",
     "course": "Computer Science",
     "gpa": 8.7
   }
   ```
4. Tests tab - Save student ID:
   ```javascript
   if (pm.response.code === 201) {
       var jsonData = pm.response.json();
       pm.environment.set('studentId', jsonData.data.id);
   }
   ```
5. Click **Send**

**Step 4: Get Student Details**
1. Create new request: `GET` → `{{base_url}}/students/{{studentId}}`
2. Click **Send** - View statistics

**Step 5: Update Student**
1. Create new request: `PUT` → `{{base_url}}/students/{{studentId}}`
2. Add pre-request script (same as Step 3)
3. Body (JSON):
   ```json
   {
     "name": "Updated Test Student",
     "email": "updated.student@example.com",
     "course": "Data Science",
     "gpa": 9.1
   }
   ```
4. Click **Send**

**Step 6: Delete Student**
1. Create new request: `DELETE` → `{{base_url}}/students/{{studentId}}`
2. Add pre-request script (same as Step 3)
3. Click **Send**

### Postman Workflow 2: Testing with Different Courses

Test filtering by course using query parameters:

1. Create request: `GET` → `{{base_url}}/students`
2. Params tab:
   | Key | Value |
   |-----|-------|
   | `course` | `Computer Science` |
   | `limit` | `5` |
3. Click **Send**

Repeat with different course values:
- `Information Technology`
- `Data Science`

### Postman Workflow 3: Error Testing

Test error responses:

**Test 1: Invalid Student ID**
```
GET {{base_url}}/students/abc
```
Expected: `400 Bad Request`

**Test 2: Non-existent Student**
```
GET {{base_url}}/students/999
```
Expected: `404 Not Found`

**Test 3: Duplicate Email**
```
POST {{base_url}}/students
Body: {"name": "Test", "email": "existingemail@test.com", "course": "CS", "gpa": 8}
```
Expected: `409 Conflict`

**Test 4: Missing Authorization**
```
POST {{base_url}}/students
(without Authorization header)
```
Expected: `401 Unauthorized`

**Test 5: Invalid Token**
```
POST {{base_url}}/students
Authorization: Bearer sk_invalid_token_12345
```
Expected: `403 Forbidden`

---

## Postman Pro Tips

### 1. Use Variables Everywhere
Replace hardcoded values with variables for easy switching:
- `{{base_url}}` for the API base URL
- `{{token}}` for the authentication token
- `{{studentId}}` for student IDs
- `{{course}}` for course names

### 2. Reuse Pre-request Scripts
Create a reusable pre-request script for all protected endpoints. Add this to the collection or folder level:

```javascript
// Auto-inject token for all protected requests
let token = pm.environment.get('token');
if (!pm.request.headers.has('Authorization') && token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + token
    });
}
```

### 3. Collection-Level Tests
Add tests at the collection level to run after each request:

```javascript
// Verify response has success field
pm.test('Response structure is valid', function () {
    pm.response.to.be.json;
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});
```

### 4. Use Postman Console
Monitor requests and responses in detail:
- Click **View** → **Show Postman Console** (bottom-left)
- See request headers, body, and response details
- View console.log() output from scripts

### 5. Run Collections with Newman
Automate your API tests using Newman (Postman's CLI):

```bash
# Install Newman
npm install -g newman

# Run collection
newman run "Student-Management-API.postman_collection.json" \
  -e "Student API Local.postman_environment.json" \
  --reporters cli,json \
  --reporter-json-export "results.json"
```

### 6. Share Collections
Export and share collections with team members:
1. Right-click collection → **Export**
2. Select **Collection v2.1**
3. Share the JSON file

### 7. Document Requests
Use Postman's description feature:
1. Click request name → **Edit** → **Description**
2. Add documentation, examples, or notes
3. Descriptions appear in generated API docs

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

---

## Quick Start Checklist for Postman

Follow these steps to get started testing the API in Postman:

- [ ] Install Postman from [postman.com](https://www.postman.com)
- [ ] Start the Student Management API server (`npm start`)
- [ ] Open Postman and create a new environment named `Student API Local`
- [ ] Add environment variables:
  - [ ] `base_url` = `http://localhost:3000`
  - [ ] `token` = (empty)
  - [ ] `clientName` = `Postman Client`
  - [ ] `clientEmail` = `your-email@example.com`
- [ ] Create a new request: `POST {{base_url}}/register`
- [ ] Add body with clientName and email
- [ ] Add test script to save token
- [ ] Click **Send** to get your token
- [ ] Create requests for other endpoints using `{{base_url}}` and `{{token}}`
- [ ] Test each endpoint (GET, POST, PUT, PATCH, DELETE)
- [ ] Verify responses match expected formats

**Helpful Resources:**
- [Postman Documentation](https://learning.postman.com)
- [Postman Variables Guide](https://learning.postman.com/docs/sending-requests/variables)
- [Postman Pre-request Scripts](https://learning.postman.com/docs/writing-scripts/pre-request-scripts)

