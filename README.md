# ASSA Registration System

🎓 **Afiesere Secondary School Old Students Association Registration System**

A complete web-based registration system for ASSA alumni with a modern, responsive UI and secure backend.

![ASSA Logo](https://via.placeholder.com/150x150/2196F3/FFFFFF?text=ASSA)

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with ASSA's light blue and white color scheme
- **Real-time Validation**: Instant form validation with helpful error messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Secure Backend**: Express.js server with data validation and rate limiting
- **SQLite Database**: Lightweight, serverless database for easy deployment
- **Member ID Generation**: Automatic unique ID generation for each member
- **Data Export**: API endpoints for member data and statistics
- **Professional Styling**: Modern gradients, animations, and typography

## 📋 Registration Fields

The system captures the following information:

- **Personal Information**
  - Surname (required)
  - First Name (required)
  - Middle Name (optional)
  - Date of Birth (required)

- **Contact Information**
  - Phone Number (required, with Nigerian formatting)
  - Email Address (required, with validation)
  - Home Address (required)

- **Academic & Professional**
  - Year of Graduation (required)
  - Current Occupation (required)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd assa-registration-system
   
   # Or extract the downloaded files
   cd assa-registration-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - The registration form will be displayed

## 📁 Project Structure

```
assa-registration-system/
├── package.json              # Project dependencies
├── server.js                 # Express server
├── database.js               # SQLite database handler
├── README.md                 # This file
├── assa_members.db          # SQLite database (created automatically)
└── public/                   # Frontend files
    ├── index.html            # Main registration form
    ├── styles.css            # Styling with ASSA theme
    └── script.js             # Form validation and API calls
```

## 🔧 API Endpoints

### Registration
- **POST** `/api/register` - Register a new member
- **Body**: JSON with all registration fields
- **Response**: Success message with member ID

### Data Access
- **GET** `/api/members` - Get all registered members
- **GET** `/api/stats` - Get registration statistics

### Example Registration Request
```json
{
  "surname": "Okafor",
  "firstName": "Chika",
  "middleName": "Grace",
  "phoneNumber": "+2348123456789",
  "email": "chika.okafor@email.com",
  "dateOfBirth": "1995-03-15",
  "graduationYear": 2012,
  "occupation": "Software Engineer",
  "homeAddress": "123 Main Street, Warri, Delta State"
}
```

## 🛡️ Security Features

- **Input Validation**: Server-side validation for all fields
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Secure cross-origin requests
- **Helmet.js**: Security headers for protection
- **SQL Injection Prevention**: Parameterized queries
- **Email Validation**: Real-time email format checking
- **Phone Number Formatting**: Automatic Nigerian number formatting

## 🎨 Design Features

- **ASSA Brand Colors**: Light blue (#2196F3) and white theme
- **Modern Typography**: Inter font family for readability
- **Responsive Grid**: Adapts to all screen sizes
- **Smooth Animations**: Loading states and transitions
- **Accessibility**: High contrast mode and reduced motion support
- **Professional Layout**: Clean, organized form sections

## 📱 Responsive Design

The system is fully responsive and optimized for:
- 🖥️ **Desktop** (1200px+)
- 💻 **Laptop** (768px - 1199px)
- 📱 **Tablet** (480px - 767px)
- 📱 **Mobile** (up to 479px)

## 📊 Database Schema

```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT UNIQUE NOT NULL,
  surname TEXT NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  phone_number TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  date_of_birth TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  occupation TEXT NOT NULL,
  home_address TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Development Commands

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server with auto-restart
npm run dev

# View registered members (via API)
curl http://localhost:3000/api/members

# View statistics
curl http://localhost:3000/api/stats
```

## 🚀 Deployment

### Local Development
1. Follow the Quick Start guide above
2. The database file will be created automatically
3. Access at `http://localhost:3000`

### Production Deployment

**For cloud deployment (Heroku, Railway, etc.):**
1. Set environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   ```
2. Ensure SQLite is supported or migrate to PostgreSQL
3. Update CORS settings for your domain

**For VPS/Server deployment:**
1. Install Node.js on your server
2. Copy project files
3. Run `npm install --production`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "assa-registration"
   ```

## 📈 Monitoring & Analytics

View registration statistics:
```bash
# Total members
curl http://localhost:3000/api/stats

# All members data
curl http://localhost:3000/api/members
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions about the ASSA Registration System:

- **Email**: support@assa.edu.ng
- **Website**: www.assa.edu.ng
- **Issues**: Create an issue in the project repository

## 🙏 Acknowledgments

- Afiesere Secondary School Old Students Association
- All alumni who contribute to keeping our community connected
- Modern web technologies that make this system possible

---

**Made with ❤️ for ASSA Alumni**

*Keep the Afiesere spirit alive! 🎓*
