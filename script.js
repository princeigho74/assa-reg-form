class AssaRegistration {
    constructor() {
        this.form = document.getElementById('registration-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        this.init();
    }

    init() {
        this.populateGraduationYears();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    populateGraduationYears() {
        const graduationSelect = document.getElementById('graduationYear');
        const currentYear = new Date().getFullYear();
        const startYear = 1960; // Assuming school started around 1960
        
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            graduationSelect.appendChild(option);
        }
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));

        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('input', (e) => this.validateEmail(e));
    }

    setupFormValidation() {
        // Custom validation messages
        const validationRules = {
            surname: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Surname must contain only letters, spaces, hyphens, and apostrophes'
            },
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'First name must contain only letters, spaces, hyphens, and apostrophes'
            },
            middleName: {
                required: false,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]*$/,
                message: 'Middle name must contain only letters, spaces, hyphens, and apostrophes'
            },
            phoneNumber: {
                required: true,
                pattern: /^(\+234|234|0)?[789][01]\d{8}$/,
                message: 'Please enter a valid Nigerian phone number (e.g., 08012345678, +2348012345678)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            dateOfBirth: {
                required: true,
                custom: (value) => {
                    const date = new Date(value);
                    const minDate = new Date('1900-01-01');
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() - 10); // Minimum age of 10
                    return date >= minDate && date <= maxDate;
                },
                message: 'Please enter a valid date of birth (minimum age: 10 years)'
            },
            graduationYear: {
                required: true,
                custom: (value) => {
                    const year = parseInt(value);
                    return year >= 1960 && year <= new Date().getFullYear();
                },
                message: 'Please select a valid graduation year'
            },
            occupation: {
                required: true,
                minLength: 2,
                maxLength: 100,
                message: 'Occupation must be between 2 and 100 characters'
            },
            homeAddress: {
                required: true,
                minLength: 10,
                maxLength: 200,
                message: 'Home address must be between 10 and 200 characters'
            }
        };

        this.validationRules = validationRules;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (rules.required && !value) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            return true;
        }

        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`);
            return false;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} must not exceed ${rules.maxLength} characters`);
            return false;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Custom validation
        if (rules.custom && !rules.custom(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }

        return true;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Additional cross-field validations
        const email = document.getElementById('email').value;
        const graduationYear = parseInt(document.getElementById('graduationYear').value);
        const dateOfBirth = new Date(document.getElementById('dateOfBirth').value);

        // Check if graduation year makes sense with date of birth
        if (graduationYear && dateOfBirth) {
            const birthYear = dateOfBirth.getFullYear();
            const expectedGradAge = graduationYear - birthYear;
            
            if (expectedGradAge < 15 || expectedGradAge > 25) {
                this.showFieldError(
                    document.getElementById('graduationYear'),
                    'Graduation year seems inconsistent with date of birth'
                );
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorSpan = field.parentNode.querySelector('.error-text');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorSpan = field.parentNode.querySelector('.error-text');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            surname: 'Surname',
            firstName: 'First Name',
            middleName: 'Middle Name',
            phoneNumber: 'Phone Number',
            email: 'Email Address',
            dateOfBirth: 'Date of Birth',
            graduationYear: 'Graduation Year',
            occupation: 'Occupation',
            homeAddress: 'Home Address'
        };
        return labels[fieldName] || fieldName;
    }

    cleanPhoneNumber(phoneInput) {
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
        
        // Return as-is if format is unclear (will be caught by validation)
        return cleaned;
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Handle different Nigerian phone number formats
        if (value.length > 0) {
            // Remove leading zeros for processing
            if (value.startsWith('0') && value.length === 11) {
                // Nigerian format: 08012345678 -> 2348012345678
                value = '234' + value.substring(1);
            } else if (value.startsWith('234') && value.length === 13) {
                // Already in international format
                value = value;
            } else if (value.length === 10 && (value.startsWith('7') || value.startsWith('8') || value.startsWith('9'))) {
                // Missing country code: 8012345678 -> 2348012345678
                value = '234' + value;
            }
            
            // Format display: +234 XXX XXX XXXX
            if (value.startsWith('234') && value.length >= 6) {
                let formatted = '+234';
                if (value.length > 3) formatted += ' ' + value.substring(3, 6);
                if (value.length > 6) formatted += ' ' + value.substring(6, 9);
                if (value.length > 9) formatted += ' ' + value.substring(9, 13);
                e.target.value = formatted;
            } else {
                // For partial input, just add + prefix
                e.target.value = value.length > 0 ? '+' + value : value;
            }
        }
    }

    validateEmail(e) {
        const email = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(e.target, 'Please enter a valid email address');
        } else {
            this.clearFieldError(e.target);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Hide previous messages
        this.hideMessages();
        
        // Validate form
        if (!this.validateForm()) {
            this.showError('Please correct the errors above and try again.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            const formData = new FormData(this.form);
            const registrationData = {
                surname: formData.get('surname').trim(),
                firstName: formData.get('firstName').trim(),
                middleName: formData.get('middleName').trim() || null,
                phoneNumber: this.cleanPhoneNumber(formData.get('phoneNumber')),
                email: formData.get('email').trim().toLowerCase(),
                dateOfBirth: formData.get('dateOfBirth'),
                graduationYear: parseInt(formData.get('graduationYear')),
                occupation: formData.get('occupation').trim(),
                homeAddress: formData.get('homeAddress').trim()
            };

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccess(
                    `Welcome to ASSA, ${result.data.fullName}! Your member ID is: ${result.data.memberId}`
                );
                this.form.reset();
                // Scroll to success message
                this.successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(result.message || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showError(
                error.message || 'Something went wrong. Please try again later.'
            );
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const submitBtn = this.submitBtn;
        const spinner = submitBtn.querySelector('.spinner');
        const text = submitBtn.querySelector('span');
        
        if (loading) {
            submitBtn.disabled = true;
            spinner.style.display = 'block';
            text.textContent = 'Processing...';
            this.loadingOverlay.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            text.textContent = 'Register Now';
            this.loadingOverlay.style.display = 'none';
        }
    }

    showSuccess(message) {
        document.getElementById('success-details').textContent = message;
        this.successMessage.style.display = 'flex';
        this.errorMessage.style.display = 'none';
    }

    showError(message) {
        document.getElementById('error-details').textContent = message;
        this.errorMessage.style.display = 'flex';
        this.successMessage.style.display = 'none';
    }

    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AssaRegistration();
});

// Add some utility functions for enhanced user experience
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static formatCurrency(amount, currency = 'NGN') {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static formatDate(date, locale = 'en-NG') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssaRegistration, Utils };
}
