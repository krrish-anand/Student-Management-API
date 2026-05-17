const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Path to the students.json file
const studentsFile = path.join(__dirname, 'students.json');

// Path to the clients.json file (for API client registration)
const clientsFile = path.join(__dirname, 'clients.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utility function to read students from JSON file
function readStudents() {
  try {
    const data = fs.readFileSync(studentsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students file:', error);
    return [];
  }
}

// Utility function to write students to JSON file
function writeStudents(students) {
  try {
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing students file:', error);
    return false;
  }
}

// Utility function to read clients from JSON file
function readClients() {
  try {
    const data = fs.readFileSync(clientsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading clients file:', error);
    return [];
  }
}

// Utility function to write clients to JSON file
function writeClients(clients) {
  try {
    fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing clients file:', error);
    return false;
  }
}

// Generate a unique Bearer token
function generateToken() {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
}

// Authorization Middleware
function authorizeRequest(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization required. Please provide Bearer token in Authorization header',
      example: 'Authorization: Bearer <your_token>'
    });
  }

  // Extract token from "Bearer token"
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use Bearer token',
      example: 'Authorization: Bearer <your_token>'
    });
  }

  const token = authHeader.slice(7);

  // Validate token against registered clients
  const clients = readClients();
  const client = clients.find(c => c.token === token && c.active);

  if (!client) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key or client is inactive'
    });
  }

  // Attach client info to request for later use
  req.client = client;

  next();
}

// 1. GET /students - Get all students
app.get('/students', (req, res) => {
  const students = readStudents();
  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

// 1.5. POST /register - Register a new API client
app.post('/register', (req, res) => {
  const { clientName, email } = req.body;

  // Validation
  if (!clientName || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide clientName and email'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  const clients = readClients();

  // Check if client with same email already exists
  const existingClient = clients.find(c => c.email === email);
  if (existingClient) {
    return res.status(409).json({
      success: false,
      message: 'Client with this email already registered',
      clientId: existingClient.id
    });
  }

  // Generate new client ID
  const newClientId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;

  // Generate new bearer token
  const newToken = generateToken();

  const newClient = {
    id: newClientId,
    clientName,
    email,
    token: newToken,
    createdAt: new Date().toISOString(),
    active: true
  };

  clients.push(newClient);

  if (writeClients(clients)) {
    res.status(201).json({
      success: true,
      message: 'API client registered successfully',
      client: {
        id: newClient.id,
        clientName: newClient.clientName,
        email: newClient.email,
        token: newClient.token,
        createdAt: newClient.createdAt
      },
      usage: {
        example: 'Authorization: Bearer ' + newClient.token,
        documentation: 'Use this token in Authorization header for all protected endpoints'
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error registering client'
    });
  }
});

// 2. GET /students/:id - Get student by ID
app.get('/students/:id', (req, res) => {
  const students = readStudents();
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  res.json({
    success: true,
    data: student
  });
});

// 3. POST /students - Add a new student
app.post('/students', authorizeRequest, (req, res) => {
  const { name, email, course, gpa } = req.body;

  // Validation
  if (!name || !email || !course || gpa === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, course, and gpa'
    });
  }

  const students = readStudents();

  // Check if student with same email already exists
  const existingStudent = students.find(s => s.email === email);
  if (existingStudent) {
    return res.status(409).json({
      success: false,
      message: 'Student with this email already exists',
      studentId: existingStudent.id
    });
  }

  // Generate new ID (maximum ID + 1)
  const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

  const newStudent = {
    id: newId,
    name,
    email,
    course,
    gpa: parseFloat(gpa)
  };

  students.push(newStudent);

  if (writeStudents(students)) {
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: newStudent
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error saving student'
    });
  }
});

// 4. PUT /students/:id - Update student
app.put('/students/:id', authorizeRequest, (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, email, course, gpa } = req.body;

  // Validation
  if (!name || !email || !course || gpa === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, course, and gpa'
    });
  }

  const students = readStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  // Update student
  students[studentIndex] = {
    id: studentId,
    name,
    email,
    course,
    gpa: parseFloat(gpa)
  };

  if (writeStudents(students)) {
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: students[studentIndex]
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error updating student'
    });
  }
});

// 4.5. PATCH /students/:id - Partial update (update name only)
app.patch('/students/:id', authorizeRequest, (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name'
    });
  }

  const students = readStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  // Update only the name
  students[studentIndex].name = name;

  if (writeStudents(students)) {
    res.json({
      success: true,
      message: 'Student name updated successfully',
      data: students[studentIndex]
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error updating student'
    });
  }
});

// 5. DELETE /students/:id - Delete student
app.delete('/students/:id', authorizeRequest, (req, res) => {
  const studentId = parseInt(req.params.id);
  const students = readStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1);

  if (writeStudents(students)) {
    res.json({
      success: true,
      message: 'Student deleted successfully',
      data: deletedStudent[0]
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error deleting student'
    });
  }
});

// 6. GET /status - Get API status
app.get('/status', (req, res) => {
  const students = readStudents();
  const clients = readClients();
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    students: students.length,
    registeredClients: clients.length,
    authorization: {
      required: 'Only for write operations (POST, PUT, PATCH, DELETE)',
      type: 'Bearer Token',
      header: 'Authorization',
      format: 'Bearer <token>',
      tokenFormat: 'sk_xxxxxxxxxxxxxxxx'
    },
    endpoints: {
      public: {
        description: 'No registration required',
        endpoints: [
          'GET /students (get all students)',
          'GET /students/:id (get student by ID)',
          'GET /status (get API status)',
          'POST /register (register new client)'
        ]
      },
      protected: {
        description: 'Registration required - use Bearer token obtained from POST /register',
        endpoints: [
          'POST /students (add new student)',
          'PUT /students/:id (update student)',
          'PATCH /students/:id (update student name)',
          'DELETE /students/:id (delete student)'
        ]
      }
    },
    registration: {
      endpoint: 'POST /register',
      description: 'Register a new API client to get a Bearer token for write operations',
      example: {
        url: 'http://localhost:3000/register',
        method: 'POST',
        body: {
          clientName: 'My Application',
          email: 'myapp@example.com'
        },
        response: 'Bearer token (use in Authorization header)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  const clients = readClients();
  console.log(`\n🚀 Student Management API is running on http://localhost:${PORT}`);
  console.log('\n� PUBLIC ENDPOINTS (No registration needed):');
  console.log(`  GET    http://localhost:${PORT}/students`);
  console.log(`  GET    http://localhost:${PORT}/students/:id`);
  console.log(`  GET    http://localhost:${PORT}/status`);
  console.log(`  POST   http://localhost:${PORT}/register (register new client)`);
  console.log('\n🔒 PROTECTED ENDPOINTS (Registration required):');
  console.log(`  POST   http://localhost:${PORT}/students (add student)`);
  console.log(`  PUT    http://localhost:${PORT}/students/:id (update student)`);
  console.log(`  PATCH  http://localhost:${PORT}/students/:id (update name)`);
  console.log(`  DELETE http://localhost:${PORT}/students/:id (delete student)`);
  console.log('\n🔐 Client Registration & Authorization:');
  console.log(`  Registered Clients: ${clients.length}`);
  if (clients.length > 0) {
    console.log(`\n  Quick Start (Learning Client):`);
    console.log(`  Authorization: Bearer ${clients[0].token}`);
  }
  console.log(`\n  To register a new client:`);
  console.log(`  POST http://localhost:${PORT}/register`);
  console.log(`  Body: { "clientName": "My App", "email": "myapp@example.com" }`);
  console.log('\n');
});
