const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'assa_members.db'), (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('📊 Connected to SQLite database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS members (
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
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('✅ Database table initialized successfully');
      }
    });
  }

  async generateMemberId() {
    return new Promise((resolve, reject) => {
      const currentYear = new Date().getFullYear();
      const query = 'SELECT COUNT(*) as count FROM members';
      
      this.db.get(query, (err, row) => {
        if (err) {
          reject(err);
        } else {
          const memberNumber = (row.count + 1).toString().padStart(4, '0');
          const memberId = `ASSA${currentYear}${memberNumber}`;
          resolve(memberId);
        }
      });
    });
  }

  async createMember(memberData) {
    return new Promise((resolve, reject) => {
      const {
        memberId,
        surname,
        firstName,
        middleName,
        phoneNumber,
        email,
        dateOfBirth,
        graduationYear,
        occupation,
        homeAddress
      } = memberData;

      const query = `
        INSERT INTO members (
          member_id, surname, first_name, middle_name, phone_number,
          email, date_of_birth, graduation_year, occupation, home_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        memberId, surname, firstName, middleName, phoneNumber,
        email, dateOfBirth, graduationYear, occupation, homeAddress
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, memberId });
        }
      });
    });
  }

  async getMemberByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM members WHERE email = ?';
      
      this.db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getAllMembers() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          member_id, surname, first_name, middle_name, phone_number,
          email, date_of_birth, graduation_year, occupation, home_address,
          created_at
        FROM members 
        ORDER BY created_at DESC
      `;
      
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getStatistics() {
    return new Promise((resolve, reject) => {
      const queries = {
        totalMembers: 'SELECT COUNT(*) as count FROM members',
        membersByYear: `
          SELECT graduation_year, COUNT(*) as count 
          FROM members 
          GROUP BY graduation_year 
          ORDER BY graduation_year DESC
        `,
        recentRegistrations: `
          SELECT COUNT(*) as count 
          FROM members 
          WHERE created_at >= datetime('now', '-30 days')
        `
      };

      const stats = {};
      let completed = 0;
      const total = Object.keys(queries).length;

      Object.entries(queries).forEach(([key, query]) => {
        this.db.all(query, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (key === 'totalMembers' || key === 'recentRegistrations') {
            stats[key] = rows[0].count;
          } else {
            stats[key] = rows;
          }
          
          completed++;
          if (completed === total) {
            resolve(stats);
          }
        });
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = Database;
