const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/read/:reservation_id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Payment WHERE reservation_id = ?', [req.params.reservation_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    const { reservation_id, amount, payment_mode } = req.body;
    try {
        await db.execute(
            'INSERT INTO Payment (reservation_id, amount, payment_mode) VALUES (?, ?, ?)', 
            [reservation_id, amount, payment_mode]
        );
        res.status(201).json({ success: true, message: 'Payment recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM Payment WHERE payment_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Payment voided' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;