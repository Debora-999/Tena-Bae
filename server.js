const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./tenabae.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create contact table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        message TEXT NOT NULL
    )
`);

// Endpoint to handle form submission
app.post("/submit-form", (req, res) => {
    const { first_name, last_name, email, message } = req.body;

    const query = `
        INSERT INTO contact_messages (first_name, last_name, email, message)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [first_name, last_name, email, message], function (err) {
        if (err) {
            console.error("Database insert error:", err.message);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
