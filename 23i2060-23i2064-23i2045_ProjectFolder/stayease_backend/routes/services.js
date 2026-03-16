const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');


router.get('/read/:reservation_id', async (req, res) => {
    try {
        const sql = `
            SELECT s.*, st.name as staff_name 
            FROM Service s
            LEFT JOIN Staff st ON s.staff_id = st.staff_id
            WHERE s.reservation_id = ?
        `;
        const [rows] = await db.query(sql, [req.params.reservation_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/add', [
    body('reservation_id').isInt(),
    body('service_type').notEmpty(),
    body('cost').isFloat({ min: 0 })
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { reservation_id, staff_id, service_type, cost } = req.body;
    
    try {
        
        await db.execute(
            'INSERT INTO Service (reservation_id, staff_id, service_type, cost, status) VALUES (?, ?, ?, ?, "Completed")', 
            [reservation_id, staff_id || null, service_type, cost]
        );
        res.status(201).json({ success: true, message: 'Service added to bill' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM Service WHERE service_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Service charge removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;