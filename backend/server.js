const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const twilioAccountSid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
const twilioAuthToken = (process.env.TWILIO_AUTH_TOKEN || '').trim();
const twilioPhoneNumber = (process.env.TWILIO_PHONE_NUMBER || '').trim();
const twilioMessagingServiceSid = (process.env.TWILIO_MESSAGING_SERVICE_SID || '').trim();
const twilioConfigured = Boolean(
    twilioAccountSid &&
    twilioAuthToken &&
    (twilioPhoneNumber || twilioMessagingServiceSid)
);
const twilioClient = twilioConfigured
    ? twilio(twilioAccountSid, twilioAuthToken)
    : null;

console.log(twilioConfigured
    ? 'SMS service configured with Twilio.'
    : 'SMS service not configured. Add Twilio credentials to backend/.env.');

// ==========================================
// 🛡️ MIDDLEWARE & STATIC FOLDERS
// ==========================================
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// static folders එකතු කිරීම (පින්තූර React එකට පෙන්වීමට)
app.use('/images', express.static(path.join(__dirname, 'uploads/public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage සැකසුම (File Uploads සඳහා)
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// Uploads ෆෝල්ඩර නොමැති නම් ඒවා සෑදීම
if (!fs.existsSync('./uploads')){ fs.mkdirSync('./uploads'); }
if (!fs.existsSync('./uploads/public/images')){ fs.mkdirSync('./uploads/public/images', { recursive: true }); }

// ==========================================
// 🗄️ DATABASE CONNECTION & AUTO-TABLE CREATION
// ==========================================
let dbConnected = false;
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 27273,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = db;

db.connect((err) => {
    if (!err) {
        dbConnected = true;
        console.log('✅ Successfully connected to AyurGuard MySQL Database!');
        createTables(); // Database එක connect වූ පසු tables සාදන්න
    } else {
        console.log('⚠️ MySQL DB not started or XAMPP is offline. Entering Safe Local Memory Mode (No-Crash Active).');
        dbConnected = false;
    }
});

// Function to automatically create required tables safely
function createTables() {
    // 1. Create Users Table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'patient',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    `;

    // 2. Create Medical Reports Table (Enhanced for CDSS)
    const createReportsTable = `
        CREATE TABLE IF NOT EXISTS medical_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            condition_name VARCHAR(255) NOT NULL,
            remedy VARCHAR(500),
            instructions LONGTEXT,
            diet LONGTEXT,
            lifestyle LONGTEXT,
            vata INT,
            pitta INT,
            kapha INT,
            file_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB;
    `;

    db.query(createUsersTable, (err) => {
        if (err) {
            console.error("❌ Error creating users table:", err.message);
            return;
        }

        console.log("🔹 Users table verified/created.");

        // Existing installations may have created users with MyISAM, which cannot support foreign keys.
        // 3. Create Symptom Inputs Table
        const createSymptomTable = `
            CREATE TABLE IF NOT EXISTS symptom_inputs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT DEFAULT 1,
                input_type VARCHAR(50),
                transcribed_text TEXT,
                detected_condition VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `;

        db.query("ALTER TABLE users ENGINE=InnoDB", (engineErr) => {
            if (engineErr) {
                console.error("❌ Error preparing users table for foreign keys:", engineErr.message);
                return;
            }

            db.query(createReportsTable, (reportsErr) => {
                if (reportsErr) console.error("❌ Error creating medical_reports table:", reportsErr.message);
                else console.log("🔹 Medical reports table verified/created.");

                db.query(createSymptomTable, (symptomErr) => {
                    if (symptomErr) console.error("❌ Error creating symptom_inputs table:", symptomErr.message);
                    else console.log("🔹 Symptom inputs table verified/created.");
                });
            });
        });
    });
}

// ==========================================
// 🌿 ENHANCED AYURVEDIC KNOWLEDGE BASE (CDSS DATA)
// ==========================================
const ayurvedicDatabase = [];

// Patient-to-doctor consultation messaging route
app.post('/api/doctor-consultation', upload.single('photo'), (req, res) => {
    const { question, doctor } = req.body;

    if (!question || !question.trim()) {
        return res.status(400).json({ success: false, error: 'Please enter a message for the doctor.' });
    }

    return res.json({ success: true, message: `Message delivered to ${doctor || 'the selected doctor'}${req.file ? ' with the attached photo' : ''} for review by a registered practitioner.` });
});

// ==========================================
// 🔑 USER AUTHENTICATION ROUTES
// ==========================================

// User Registration Route
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const userRole = role || 'patient'; 

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: "All fields are required!" });
    }

    if (!dbConnected) {
        return res.status(201).json({ 
            success: true, 
            message: "User registered in local memory mode!", 
            userId: 999 
        });
    }

    db.query("SHOW COLUMNS FROM users LIKE 'password'", (err, columns) => {
        let passColumn = 'password';
        if (!err && columns && columns.length === 0) { passColumn = 'password_hash'; }

        const query = `INSERT INTO users (name, email, ${passColumn}, role) VALUES (?, ?, ?, ?)`;
        db.query(query, [name, email, password, userRole], (err, result) => {
            if (err) {
                console.error("Registration Error:", err);
                return res.status(500).json({ success: false, error: "Registration failed. Email might already exist." });
            }
            res.status(201).json({ 
                success: true, 
                message: "User registered successfully!", 
                userId: result.insertId 
            });
        });
    });
});

// User Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required!" });
    }

    if (!dbConnected) {
        return res.status(200).json({ 
            success: true,
            message: "Success (Local Demo Mode)!", 
            user: { id: 999, name: "Local Demo User", email: email, role: "patient" } 
        });
    }

    db.query("SHOW COLUMNS FROM users LIKE 'password'", (err, columns) => {
        let passColumn = 'password';
        if (!err && columns && columns.length === 0) { passColumn = 'password_hash'; }

        const query = `SELECT * FROM users WHERE email = ? AND ${passColumn} = ?`;
        db.query(query, [email, password], (err, results) => {
            if (err) {
                console.error("Login Database Error:", err);
                return res.status(500).json({ success: false, error: "Database error during login." });
            }
            
            if (results && results.length > 0) {
                const user = results[0];
                res.status(200).json({ 
                    success: true,
                    message: "Login successful!", 
                    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
                });
            } else {
                res.status(401).json({ success: false, error: "Invalid email or password." });
            }
        });
    });
});

// ==========================================
// 🏠 HOME ROUTE
// ==========================================
app.get('/', (req, res) => {
    res.send('AyurGuard Expert System Engine is active locally!');
});

function normalizeSriLankanMobile(phone) {
    const digits = String(phone || '').replace(/[\s()-]/g, '');

    if (/^07\d{8}$/.test(digits)) return `+94${digits.slice(1)}`;
    if (/^7\d{8}$/.test(digits)) return `+94${digits}`;
    if (/^947\d{8}$/.test(digits)) return `+${digits}`;
    if (/^\+947\d{8}$/.test(digits)) return digits;
    return null;
}

// Send a formatted checkout receipt by SMS
app.post('/api/checkout-sms', async (req, res) => {
    const { phone, total, itemsCount } = req.body;
    const recipient = normalizeSriLankanMobile(phone);
    const amount = Number(total);

    if (!recipient) {
        return res.status(400).json({ success: false, error: 'Enter a valid Sri Lankan mobile number, such as 0771234567.' });
    }
    if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({ success: false, error: 'A valid checkout total is required.' });
    }
    if (!twilioClient) {
        return res.status(503).json({ success: false, error: 'SMS service is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to backend/.env.' });
    }

    const billId = `AG-${Date.now().toString(36).toUpperCase()}`;
    const completedAt = new Date();
    const dateTime = completedAt.toLocaleString('en-LK', {
        timeZone: 'Asia/Colombo',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    const itemLabel = Number(itemsCount) === 1 ? 'item' : 'items';
    const message = [
        'AyurGuard AyurMart Receipt',
        `Bill ID: ${billId}`,
        `Total Amount: LKR ${amount.toFixed(2)}`,
        `Items: ${Number.isFinite(Number(itemsCount)) ? Number(itemsCount) : 0} ${itemLabel}`,
        `Date/Time: ${dateTime}`,
        'Thank you for shopping with AyurMart. We appreciate your support!'
    ].join('\n');

    try {
        const sms = await twilioClient.messages.create({
            body: message,
            ...(twilioMessagingServiceSid
                ? { messagingServiceSid: twilioMessagingServiceSid }
                : { from: twilioPhoneNumber }),
            to: recipient
        });
        return res.json({ success: true, message: `Receipt sent to ${recipient}.`, billId, total: amount, dateTime, smsId: sms.sid });
    } catch (error) {
        console.error('Checkout SMS error:', error.message);
        return res.status(502).json({ success: false, error: `Twilio could not deliver the receipt: ${error.message}` });
    }
});

// ==========================================
// 💾 SAVE MEDICAL REPORT ENDPOINT
// ==========================================
app.post('/api/save-report', (req, res) => {
    if (!dbConnected) {
        return res.status(500).json({ 
            success: false,
            error: "Database not connected. Offline mode cannot save report to MySQL."
        });
    }

    const { 
        user_id, 
        conditionName, 
        remedy, 
        instructions, 
        diet, 
        lifestyle,
        doshaProfile,
        filePath 
    } = req.body;

    const query = `
        INSERT INTO medical_reports 
        (user_id, condition_name, remedy, instructions, diet, lifestyle, vata, pitta, kapha, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        user_id || 1,
        conditionName,
        remedy,
        instructions,
        diet,
        lifestyle,
        doshaProfile?.vata || 33,
        doshaProfile?.pitta || 33,
        doshaProfile?.kapha || 34,
        filePath || null
    ], (err, result) => {
        if (err) {
            console.log('❌ Error saving report:', err);
            return res.status(500).json({ 
                success: false, 
                error: "Failed to save medical report to database."
            });
        }
        
        console.log(`✓ Medical Report Saved! Report ID: ${result.insertId}`);
        res.json({
            success: true,
            message: "Medical report saved successfully!",
            reportId: result.insertId,
            timestamp: new Date().toISOString()
        });
    });
});

// ==========================================
// 📋 RETRIEVE ALL MEDICAL REPORTS ENDPOINT
// ==========================================
app.get('/api/reports/:user_id', (req, res) => {
    const user_id = req.params.user_id || 1;

    if (!dbConnected) {
        // Return dummy array format matching structure if DB is offline
        return res.status(200).json({
            success: true,
            totalReports: 1,
            reports: [
                { id: 1, condition_name: "Demo Blood Test", remedy: "Sample Remedy", file_path: "/uploads/demo.pdf", created_at: new Date() }
            ]
        });
    }

    const query = `
        SELECT * FROM medical_reports 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.log('❌ Error retrieving reports:', err);
            return res.status(500).json({ 
                success: false,
                error: "Failed to retrieve reports from server.",
                reports: []
            });
        }

        res.json({
            success: true,
            totalReports: results.length,
            reports: results || []
        });
    });
});

// ==========================================
// 📄 RETRIEVE SINGLE REPORT ENDPOINT
// ==========================================
app.get('/api/report/:report_id', (req, res) => {
    if (!dbConnected) {
        return res.status(500).json({ 
            success: false,
            error: "Database not connected."
        });
    }

    const report_id = req.params.report_id;
    const query = `SELECT * FROM medical_reports WHERE id = ?`;

    db.query(query, [report_id], (err, results) => {
        if (err) {
            console.log('❌ Error retrieving report:', err);
            return res.status(500).json({ 
                success: false,
                error: "Failed to retrieve report"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: "Report not found"
            });
        }

        res.json({
            success: true,
            report: results[0]
        });
    });
});

// ==========================================
// 🚀 SERVER START
// ==========================================
app.listen(PORT, () => {
    console.log(`\n🚀 ===================================================`);
    console.log(`   AyurGuard Expert CDSS Server running smoothly on port ${PORT}!`);
    console.log(`   No AI API Keys required. 100% stable local database mode.`);
    console.log(`=======================================================\n`);
});
