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
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear errors on input
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Simple phone formatting
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }

    // SIMPLIFIED phone validation - just check if it's a number with 10+ digits
    isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
    }

    validateForm() {
        let isValid = true;
        
        // Check required fields
        const requiredFields = ['surname', 'firstName', 'phoneNumber', 'email', 'dateOfBirth', 'graduationYear', 'occupation', 'homeAddress'];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field.value.trim();
            
            if (!value) {
                this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validate graduation year is 2006
        const graduationField = document.getElementById('graduationYear');
        if (graduationField.value !== '2006') {
            this.showFieldError(graduationField, 'Only 2006 graduation set members are eligible for registration');
            isValid = false;
        }

        // Phone validation
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField.value && !this.isValidPhone(phoneField.value)) {
            this.showFieldError(phoneField, 'Please enter a valid phone number (at least 10 digits)');
            isValid = false;
        }

        // Email validation
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailRegex.test(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Terms and conditions validation
        const termsField = document.getElementById('termsAccepted');
        if (!termsField.checked) {
            this.showFieldError(termsField, 'You must accept the terms and conditions to continue');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(field, message) {
        if (field.type === 'checkbox') {
            // Handle checkbox error styling
            const label = field.closest('.checkbox-label');
            if (label) {
                label.classList.add('error');
            }
        } else {
            field.classList.add('error');
        }
        
        const errorSpan = field.closest('.form-group').querySelector('.error-text');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    clearFieldError(field) {
        if (field.type === 'checkbox') {
            // Handle checkbox error clearing
            const label = field.closest('.checkbox-label');
            if (label) {
                label.classList.remove('error');
            }
        } else {
            field.classList.remove('error');
        }
        
        const errorSpan = field.closest('.form-group').querySelector('.error-text');
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
            homeAddress: 'Home Address',
            termsAccepted: 'Terms and Conditions'
        };
        return labels[fieldName] || fieldName;
    }

    // Simple phone formatting - just clean up non-digits except +
    formatPhoneNumber(e) {
        let value = e.target.value;
        // Allow + at the beginning, then only digits
        value = value.replace(/[^+\d]/g, '');
        e.target.value = value;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        console.log('Form submitted');
        
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
                middleName: formData.get('middleName').trim() || '',
                phoneNumber: formData.get('phoneNumber').trim(),
                email: formData.get('email').trim().toLowerCase(),
                dateOfBirth: formData.get('dateOfBirth'),
                graduationYear: parseInt(formData.get('graduationYear')),
                occupation: formData.get('occupation').trim(),
                homeAddress: formData.get('homeAddress').trim(),
                termsAccepted: formData.get('termsAccepted') === 'on'
            };

            console.log('Submitting data:', registrationData);

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok && result.success) {
                this.showSuccess(
                    `Welcome to ASSA, ${result.data.fullName}! Your member ID is: ${result.data.memberId}. Thank you for confirming your 2006 set membership and responsibility.`
                );
                this.form.reset();
                this.successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Handle errors
                let errorMsg = result.message || 'Registration failed';
                if (result.errors && result.errors.length > 0) {
                    errorMsg = result.errors.map(err => err.msg || err.message).join(', ');
                }
                throw new Error(errorMsg);
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
            if (spinner) spinner.style.display = 'block';
            if (text) text.textContent = 'Processing...';
            if (this.loadingOverlay) this.loadingOverlay.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            if (spinner) spinner.style.display = 'none';
            if (text) text.textContent = 'Register Now';
            if (this.loadingOverlay) this.loadingOverlay.style.display = 'none';
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ASSA Registration');
    new AssaRegistration();
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
