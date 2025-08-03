
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/signup', (req, res) => {
    const { name, email, password, confirmPassword, terms } = req.body;

    
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please fill all required fields.' });
    }


    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }


    if (!terms) {
        return res.status(400).json({ message: 'You must agree to the terms and conditions.' });
    }


    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ message: 'Email already exists.' });
            }
            return res.status(500).json({ message: 'Error creating account.' });
        }
        res.status(201).json({ message: 'Account created successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }
        if (!row) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        res.status(200).json({ message: 'Login successful!', user: row });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});