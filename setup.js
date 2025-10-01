#!/usr/bin/env node

/**
 * ASSA Registration System Quick Setup
 * Cross-platform setup script for Node.js environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎓 ASSA Registration System Setup');
console.log('==========================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
    console.error('❌ Node.js version 14 or higher is required.');
    console.error(`Current version: ${nodeVersion}`);
    console.error('Please update Node.js: https://nodejs.org/');
    process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} detected\n`);

// Install dependencies
console.log('📦 Installing dependencies...');

try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    console.error(error.message);
    process.exit(1);
}

// Create directories if needed
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created public directory');
}

console.log('🚀 Setup completed successfully!\n');
console.log('To start the ASSA Registration System:');
console.log('  npm start\n');
console.log('Then open your browser to:');
console.log('  📝 Registration Form: http://localhost:3000');
console.log('  📈 Admin Dashboard: http://localhost:3000/admin\n');
console.log('For development with auto-restart:');
console.log('  npm run dev\n');
console.log('🎓 Happy registering! - ASSA Alumni Team');
