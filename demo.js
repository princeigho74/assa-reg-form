#!/usr/bin/env node

/**
 * ASSA Registration System Demo
 * Demonstrates the registration system with sample data
 */

const http = require('http');
const fs = require('fs');

// Sample demo data
const demoMembers = [
    {
        surname: "Okafor",
        firstName: "Chika",
        middleName: "Grace",
        phoneNumber: "+2348123456789",
        email: "chika.okafor@email.com",
        dateOfBirth: "1995-03-15",
        graduationYear: 2012,
        occupation: "Software Engineer",
        homeAddress: "123 Main Street, Warri, Delta State"
    },
    {
        surname: "Adebayo",
        firstName: "Temitope",
        middleName: "John",
        phoneNumber: "+2349087654321",
        email: "temi.adebayo@gmail.com",
        dateOfBirth: "1992-08-22",
        graduationYear: 2009,
        occupation: "Medical Doctor",
        homeAddress: "456 Hospital Road, Lagos State"
    },
    {
        surname: "Emeka",
        firstName: "Princess",
        middleName: "",
        phoneNumber: "+2347123456789",
        email: "princess.emeka@yahoo.com",
        dateOfBirth: "1998-12-10",
        graduationYear: 2015,
        occupation: "Teacher",
        homeAddress: "789 School Lane, Abuja FCT"
    }
];

console.log('🎓 ASSA Registration System Demo');
console.log('=====================================\n');

async function testRegistration() {
    console.log('📝 Testing registration with demo data...\n');
    
    const baseUrl = 'http://localhost:3000';
    
    for (let i = 0; i < demoMembers.length; i++) {
        const member = demoMembers[i];
        console.log(`Registering: ${member.firstName} ${member.surname}...`);
        
        try {
            const response = await makeRequest('POST', `${baseUrl}/api/register`, member);
            
            if (response.success) {
                console.log(`✅ Success! Member ID: ${response.data.memberId}`);
            } else {
                console.log(`❌ Failed: ${response.message}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('🎯 Demo completed!');
    console.log('\nYou can now:');
    console.log('• View the registration form: http://localhost:3000');
    console.log('• Check the admin dashboard: http://localhost:3000/admin');
    console.log('• View all members via API: http://localhost:3000/api/members');
    console.log('• View statistics via API: http://localhost:3000/api/stats');
}

function makeRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const urlParts = new URL(url);
        const options = {
            hostname: urlParts.hostname,
            port: urlParts.port,
            path: urlParts.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Check if server is running before running demo
async function checkServer() {
    try {
        await makeRequest('GET', 'http://localhost:3000/api/stats');
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    const isServerRunning = await checkServer();
    
    if (!isServerRunning) {
        console.log('❌ ASSA server is not running on http://localhost:3000');
        console.log('\nPlease start the server first:');
        console.log('  npm start');
        console.log('\nThen run this demo again:');
        console.log('  node demo.js');
        process.exit(1);
    }
    
    await testRegistration();
}

if (require.main === module) {
    main();
}

module.exports = { demoMembers, testRegistration };
