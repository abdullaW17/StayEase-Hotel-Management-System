const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
    const { staff_id, password } = req.body;
    try {
        
        const [rows] = await db.query(
            'SELECT staff_id, name, role FROM Staff WHERE staff_id = ? AND password = ?', 
            [staff_id, password]
        );

        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid ID or Password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;