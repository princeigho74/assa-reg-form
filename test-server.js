const express = require('express');
const path = require('path');

// Simple test server to check basic functionality
const app = express();
const PORT = 3001; // Different port to avoid conflicts

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test endpoint
app.post('/api/register', (req, res) => {
  console.log('Test registration request received:', req.body);
  
  // Simple test response
  res.json({
    success: true,
    message: 'Test server response - registration would work here',
    data: {
      memberId: 'TEST-001',
      fullName: 'Test User'
    },
    receivedData: req.body
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log(`🧪 Test form: http://localhost:${PORT}/test`);
  console.log(`🧪 Health check: http://localhost:${PORT}/api/health`);
  console.log('This is a simple test server to verify basic functionality');
});

module.exports = app;
