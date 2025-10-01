# JSON Parse Error - Debugging Guide

## Error Analysis
**Error**: `Unexpected token 'T', "The page c"... is not valid JSON`

This error means your frontend is receiving an HTML page instead of JSON data from the server. This typically indicates:

1. **Server not running** - The API endpoint isn't responding
2. **Wrong URL** - The frontend is hitting a non-existent endpoint
3. **Server error** - The server crashed and returned an error page
4. **CORS issue** - Cross-origin request blocked

---

## Immediate Fixes Applied

### 1. Fixed Server Validation Issues
**Problem**: The graduation year and terms validation had type mismatches.

**Fix**: Updated validation to handle different data types:
```javascript
// Fixed graduation year validation
body('graduationYear').custom((value) => {
  const year = parseInt(value);
  if (year !== 2006) {
    throw new Error('Only 2006 graduation set members are eligible for registration');
  }
  return true;
})

// Fixed terms acceptance validation  
body('termsAccepted').custom((value) => {
  if (value !== true && value !== 'true' && value !== 'on') {
    throw new Error('You must accept the terms and conditions to continue');
  }
  return true;
})
```

### 2. Enhanced Error Handling
**Created**: `server-debug.js` with extensive logging to identify issues

### 3. Test Tools Created
- **Test Server**: `test-server.js` - Simple server to verify basic functionality
- **Diagnostic Script**: `diagnose.sh` - System health check
- **Enhanced Test Page**: Updated with better error reporting

---

## Debugging Steps

### Step 1: Check Server Status
```bash
# Start the debug server with enhanced logging
node server-debug.js

# Check if server is running
curl http://localhost:3000/api/health
```

### Step 2: Test with Simple Server
```bash
# Start test server (different port)
node test-server.js

# Test at http://localhost:3001/test
```

### Step 3: Check Browser Network Tab
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try registration
4. Check the `/api/register` request:
   - **Status Code**: Should be 200/201 for success, 400/500 for errors
   - **Response**: Should be JSON, not HTML

### Step 4: Common Issues & Solutions

#### Issue: "ERR_CONNECTION_REFUSED"
**Solution**: Server not running
```bash
# Ensure dependencies are installed
npm install

# Start server
node server.js
```

#### Issue: "404 Not Found"
**Solution**: Wrong API endpoint
- Check if URL is `http://localhost:3000/api/register`
- Ensure server is serving the correct routes

#### Issue: "500 Internal Server Error"
**Solution**: Server crash - check console logs
```bash
# Run with debug logging
node server-debug.js
```

#### Issue: HTML Response Instead of JSON
**Solution**: Server returning error page
- Check server console for error messages
- Verify all dependencies are installed
- Check database permissions

---

## Quick Test Checklist

### ✅ Server Health Check
```bash
# 1. Check dependencies
npm install

# 2. Start server with logging
node server-debug.js

# 3. Test health endpoint
curl http://localhost:3000/api/health
```

### ✅ Registration Test Data
Use this test data in the form:
```json
{
  "surname": "Test",
  "firstName": "User", 
  "middleName": "",
  "phoneNumber": "08012345678",
  "email": "test@example.com",
  "dateOfBirth": "1990-01-01",
  "graduationYear": 2006,
  "occupation": "Software Engineer",
  "homeAddress": "123 Test Street, Test City",
  "termsAccepted": true
}
```

### ✅ Browser Console Check
1. Open Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for request/response details

---

## File Status

### ✅ Updated Files
- `server.js` - Fixed validation issues
- `server-debug.js` - Enhanced logging version  
- `test-server.js` - Simple test server
- `diagnose.sh` - System diagnostic script

### ✅ Test Files  
- `public/test.html` - Updated test form
- `public/index.html` - Main registration form
- `public/script.js` - Frontend validation

---

## Next Steps

1. **Replace your server.js** with the updated version
2. **Run the diagnostic script**: `bash diagnose.sh`
3. **Start with debug server**: `node server-debug.js`
4. **Test registration** and check console logs
5. **If still failing**, use the test server: `node test-server.js`

The enhanced logging will show exactly where the issue occurs, making it easy to identify and fix the problem.

---

## Contact Points for Support

If the issue persists after following these steps:
1. Share the server console logs (from `server-debug.js`)
2. Share the browser console errors (Developer Tools)
3. Share the Network tab response details

This will provide enough information to quickly identify and resolve the specific issue.
