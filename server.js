const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// API Key for authorization
const API_KEY = 'student-api-key-123';

// Path to the students.json file
const studentsFile = path.join(__dirname, 'students.json');

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

// Authorization Middleware
function authorizeRequest(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization required. Please provide Bearer token in Authorization header',
      example: 'Authorization: Bearer student-api-key-123'
    });
  }

  // Extract token from "Bearer token"
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use Bearer token',
      example: 'Authorization: Bearer student-api-key-123'
    });
  }

  const token = authHeader.slice(7);

  if (token !== API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }

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
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    students: students.length,
    authorization: {
      required: true,
      type: 'Bearer Token',
      header: 'Authorization',
      format: 'Bearer <token>',
      example: 'Authorization: Bearer student-api-key-123',
      apiKey: API_KEY,
      protectedEndpoints: ['POST /students', 'PUT /students/:id', 'PATCH /students/:id', 'DELETE /students/:id']
    },
    endpoints: {
      getAllStudents: 'GET /students',
      getStudentById: 'GET /students/:id',
      addStudent: 'POST /students (requires Bearer token)',
      updateStudent: 'PUT /students/:id (requires Bearer token)',
      updateStudentName: 'PATCH /students/:id (requires Bearer token)',
      deleteStudent: 'DELETE /students/:id (requires Bearer token)',
      apiStatus: 'GET /status'
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
  console.log(`\n🚀 Student Management API is running on http://localhost:${PORT}`);
  console.log('\n📋 API Endpoints:');
  console.log(`  GET    http://localhost:${PORT}/students`);
  console.log(`  GET    http://localhost:${PORT}/students/:id`);
  console.log(`  POST   http://localhost:${PORT}/students (requires Bearer token)`);
  console.log(`  PUT    http://localhost:${PORT}/students/:id (requires Bearer token)`);
  console.log(`  PATCH  http://localhost:${PORT}/students/:id (requires Bearer token)`);
  console.log(`  DELETE http://localhost:${PORT}/students/:id (requires Bearer token)`);
  console.log(`  GET    http://localhost:${PORT}/status`);
  console.log('\n🔐 Authorization (Bearer Token):');
  console.log(`  API Key: ${API_KEY}`);
  console.log(`  Format: Authorization: Bearer ${API_KEY}`);
  console.log('\n');
});
