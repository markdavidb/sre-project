import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import logger from '../logger.js'; // <-- use log4js logger

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        console.error('[REGISTER ERROR] Missing fields:', { username, email, password });
        return res.status(400).json({ error: 'Missing fields. Please provide username, email and password.' });
    }

    try {
        const hash = await bcrypt.hash(password, 12);
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hash]
        );

        return res.json({ message: 'User registered', user_id: result.insertId });
    } catch (err) {
        console.error('[REGISTER ERROR]', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!usernameOrEmail || !password) {
        console.error('[LOGIN ERROR] Missing fields:', { usernameOrEmail, password });
        return res.status(400).json({ error: 'Missing fields. Please provide username/email and password.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT id, password_hash FROM users WHERE username = ? OR email = ?',
            [usernameOrEmail, usernameOrEmail]
        );

        if (rows.length === 0) {
            console.warn('[LOGIN WARNING] No user found for:', usernameOrEmail);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            console.warn('[LOGIN WARNING] Password mismatch for user ID:', user.id);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        await db.query(
            'INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
            [user.id, token]
        );

        // 🔥 log structured activity to console
        logger.info({
            timestamp: new Date().toISOString(),
            userId: user.id,
            action: 'login',
            ipAddress: ip
        });

        return res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        return res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

export default router;
