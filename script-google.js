/**
 * ASSA Registration Frontend - Google Apps Script Version
 * Updated to work with Google Apps Script backend
 */

class AssaRegistration {
    constructor() {
        this.form = document.getElementById('registration-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.loadingOverlay = document.getElementById('loading-overlay');

        // Updated Google Apps Script Web App URL
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycbwthEaGKl6jmmMuFObM_k1QieVYlrbIAL9kL10nfH3DdC6pyZA0FVzoJ9RzceHwoN0kVw/exec';

        // Initialize photo data storage
        this.photoData = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        console.log('ASSA Registration initialized with Google Apps Script backend');
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear errors on input
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Phone input formatting
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));

        // Photo upload handling
        this.setupPhotoUpload();
    }

    setupPhotoUpload() {
        const photoInput = document.getElementById('photograph');
        if (!photoInput) return;

        const uploadDisplay = photoInput.closest('.file-upload-container').querySelector('.file-upload-display');
        const placeholder = uploadDisplay.querySelector('.file-upload-placeholder');
        const preview = uploadDisplay.querySelector('.file-upload-preview');
        const previewImg = document.getElementById('photo-preview');

        uploadDisplay.addEventListener('click', () => photoInput.click());

        photoInput.addEventListener('change', (e) => this.handlePhotoSelection(e.target.files[0]));

        uploadDisplay.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDisplay.classList.add('dragover');
        });

        uploadDisplay.addEventListener('dragleave', () => uploadDisplay.classList.remove('dragover'));

        uploadDisplay.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDisplay.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) this.handlePhotoSelection(files[0]);
        });
    }

    handlePhotoSelection(file) {
        if (!file) return;
        const photoInput = document.getElementById('photograph');
        const previewImg = document.getElementById('photo-preview');
        const uploadDisplay = document.querySelector('.file-upload-display');
        const placeholder = uploadDisplay.querySelector('.file-upload-placeholder');
        const preview = uploadDisplay.querySelector('.file-upload-preview');

        if (!file.type.startsWith('image/')) {
            this.showFieldError(photoInput, 'Please select a valid image file (JPG, PNG, GIF)');
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            this.showFieldError(photoInput, 'Photo file size must be less than 2MB');
            return;
        }

        this.clearFieldError(photoInput);

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            placeholder.style.display = 'none';
            preview.style.display = 'flex';
            this.photoData = e.target.result; // store base64 photo
        };
        reader.readAsDataURL(file);
    }

    removePhoto() {
        const photoInput = document.getElementById('photograph');
        const uploadDisplay = document.querySelector('.file-upload-display');
        const placeholder = uploadDisplay.querySelector('.file-upload-placeholder');
        const preview = uploadDisplay.querySelector('.file-upload-preview');

        placeholder.style.display = 'flex';
        preview.style.display = 'none';
        photoInput.value = '';
        this.photoData = null;
        this.clearFieldError(photoInput);
    }

    isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
    }

    validateForm() {
        let isValid = true;
        const requiredFields = ['surname', 'firstName', 'phoneNumber', 'email', 'dateOfBirth', 'graduationYear', 'occupation', 'homeAddress'];

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Graduation year check
        const graduationField = document.getElementById('graduationYear');
        if (graduationField.value !== '2006') {
            this.showFieldError(graduationField, 'Only 2006 graduation set members are eligible for registration');
            isValid = false;
        }

        // Phone validation
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField.value && !this.isValidPhone(phoneField.value)) {
            this.showFieldError(phoneField, 'Please enter a valid phone number (10+ digits)');
            isValid = false;
        }

        // Email validation
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailRegex.test(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Terms check
        const termsField = document.getElementById('termsAccepted');
        if (!termsField.checked) {
            this.showFieldError(termsField, 'You must accept the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(field, message) {
        if (field.type === 'checkbox') {
            const label = field.closest('.checkbox-label');
            if (label) label.classList.add('error');
        } else {
            field.classList.add('error');
        }
        const errorSpan = field.closest('.form-group')?.querySelector('.error-text');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    clearFieldError(field) {
        if (field.type === 'checkbox') {
            const label = field.closest('.checkbox-label');
            if (label) label.classList.remove('error');
        } else {
            field.classList.remove('error');
        }
        const errorSpan = field.closest('.form-group')?.querySelector('.error-text');
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

    formatPhoneNumber(e) {
        let value = e.target.value;
        value = value.replace(/[^+\d]/g, '');
        e.target.value = value;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.hideMessages();

        if (!this.validateForm()) {
            this.showError('Please correct the errors above and try again.');
            return;
        }

        this.setLoadingState(true);

        try {
            const formData = new FormData(this.form);
            const data = {
                surname: formData.get('surname').trim(),
                firstName: formData.get('firstName').trim(),
                middleName: formData.get('middleName').trim() || '',
                phoneNumber: formData.get('phoneNumber').trim(),
                email: formData.get('email').trim().toLowerCase(),
                dateOfBirth: formData.get('dateOfBirth'),
                graduationYear: parseInt(formData.get('graduationYear')),
                occupation: formData.get('occupation').trim(),
                homeAddress: formData.get('homeAddress').trim(),
                termsAccepted: formData.get('termsAccepted') === 'on',
                photograph: this.photoData || null
            };

            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(`🎉 Welcome to ASSA, ${result.data.fullName}! Your member ID is: ${result.data.memberId}.`);
                this.form.reset();
                this.successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(result.message || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);
            let msg = error.message.includes('Failed to fetch') ? 
                '❌ Cannot connect to Google Apps Script. Check URL and permissions.' : 
                error.message;
            this.showError(msg);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const spinner = this.submitBtn.querySelector('.spinner');
        const text = this.submitBtn.querySelector('span');

        if (loading) {
            this.submitBtn.disabled = true;
            if (spinner) spinner.style.display = 'block';
            if (text) text.textContent = 'Processing...';
            if (this.loadingOverlay) this.loadingOverlay.style.display = 'flex';
        } else {
            this.submitBtn.disabled = false;
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

document.addEventListener('DOMContentLoaded', () => {
    window.assaApp = new AssaRegistration();
});

function removePhoto() {
    if (window.assaApp) window.assaApp.removePhoto();
}

window.addEventListener('error', (event) => console.error('Global error:', event.error));
window.addEventListener('unhandledrejection', (event) => console.error('Unhandled promise rejection:', event.reason));

