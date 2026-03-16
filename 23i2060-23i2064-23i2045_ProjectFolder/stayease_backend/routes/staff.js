const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/read', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Staff');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


router.post('/add', async (req, res) => {
    const { name, role, contact_info, shift_timing, password } = req.body;
    try {
        await db.execute(
            'INSERT INTO Staff (name, role, contact_info, shift_timing, password) VALUES (?, ?, ?, ?, ?)',
            [name, role, contact_info, shift_timing, password || 'staff123']
        );
        res.status(201).json({ success: true, message: 'Staff Hired!' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        
        await db.execute('DELETE FROM Staff WHERE staff_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Staff Removed' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;