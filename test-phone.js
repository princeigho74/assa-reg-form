/**
 * Phone Number Validation Test
 * Run this to test phone number validation patterns
 */

// Backend validation pattern (from server.js)
const backendPattern = /^(\+234|234|0)?[789][01]\d{8}$/;

// Frontend validation pattern (from script.js)
const frontendPattern = /^(\+234|234|0)?[789][01]\d{8}$/;

// Test phone numbers
const testNumbers = [
    '08012345678',      // Standard Nigerian format
    '+2348012345678',   // International format
    '2348012345678',    // Without + prefix
    '07012345678',      // MTN format
    '+2347012345678',   // MTN international
    '09012345678',      // Glo format
    '+2349012345678',   // Glo international
    '08123456789',      // 11 digits (invalid)
    '080123456',        // 9 digits (invalid)
    '+2345012345678',   // Invalid prefix
    '1234567890',       // Invalid format
];

function cleanPhoneNumber(phoneInput) {
    // Remove all non-digits
    let cleaned = phoneInput.replace(/\D/g, '');
    
    // Handle different Nigerian phone formats
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        // Convert 08012345678 to 2348012345678
        return '234' + cleaned.substring(1);
    } else if (cleaned.startsWith('234') && cleaned.length === 13) {
        // Already in correct international format
        return cleaned;
    } else if (cleaned.length === 10 && (cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
        // Add country code: 8012345678 to 2348012345678
        return '234' + cleaned;
    }
    
    // Return as-is if format is unclear
    return cleaned;
}

console.log('🔍 ASSA Phone Number Validation Test');
console.log('=====================================\n');

testNumbers.forEach(number => {
    const cleaned = cleanPhoneNumber(number);
    const backendValid = backendPattern.test(cleaned);
    const frontendValid = frontendPattern.test(cleaned);
    const consistent = backendValid === frontendValid;
    
    console.log(`Input: ${number}`);
    console.log(`Cleaned: ${cleaned}`);
    console.log(`Backend Valid: ${backendValid ? '✅' : '❌'}`);
    console.log(`Frontend Valid: ${frontendValid ? '✅' : '❌'}`);
    console.log(`Consistent: ${consistent ? '✅' : '❌'}`);
    console.log('---');
});

console.log('\n💡 Usage Instructions:');
console.log('1. Users can enter: 08012345678, +2348012345678, or 2348012345678');
console.log('2. The system will clean and validate automatically');
console.log('3. All valid Nigerian mobile numbers should work');

// Export for testing in browser console
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cleanPhoneNumber, backendPattern, frontendPattern };
}
