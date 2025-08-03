const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SQLite DB
const db = new sqlite3.Database('database.db');

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        message TEXT NOT NULL
    )
`);

// Route to receive contact data
app.post('/submit-form', (req, res) => {
    const { first_name, last_name, email, message } = req.body;
    db.run(
        `INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)`,
        [first_name, last_name, email, message],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).send({ success: false });
            } else {
                res.send({ success: true });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
