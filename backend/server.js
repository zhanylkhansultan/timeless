import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '5tci9Gmn+',
    database: 'timeless_elegance',
});

const saltRounds = 10;

// Register Route
app.post('/register', (req, res) => {
    const sql = 'INSERT INTO people (`username`, `email`, `password`) VALUES (?)';
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Password hashing failed' });

        const values = [req.body.username, req.body.email, hash];
        db.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'User registered successfully' });
        });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM people WHERE email = ?';
    db.query(sql, [req.body.email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'User not found' });

        const hashedPassword = results[0].password;
        bcrypt.compare(req.body.password, hashedPassword, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Password comparison failed' });
            if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

            res.json({ message: 'Login successful', user: results[0] });
        });
    });
});

app.listen(8081, () => {
    console.log('Server running on http://localhost:8081');
});
