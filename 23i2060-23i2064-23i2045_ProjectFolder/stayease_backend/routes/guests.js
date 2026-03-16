const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');

router.post('/add', [
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('last_name').notEmpty().withMessage('Last Name is required'),
    body('cnic').isLength({ min: 5 }).withMessage('CNIC/Passport is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid Email format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, cnic, phone, email } = req.body;
    try {
        const sql = `INSERT INTO Guest (first_name, last_name, cnic_passport, phone, email) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [first_name, last_name, cnic, phone, email]);
        res.status(201).json({ success: true, message: 'Guest Registered!', guestId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Guest with this CNIC already exists.' });
        }
        res.status(500).json({ message: err.message });
    }
});

router.get('/read', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Guest ORDER BY guest_id ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', [
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('last_name').notEmpty().withMessage('Last Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid Email format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, email } = req.body;
    const guestId = req.params.id;

    try {
        const sql = `UPDATE Guest SET first_name=?, last_name=?, phone=?, email=? WHERE guest_id=?`;
        await db.execute(sql, [first_name, last_name, phone, email, guestId]);
        res.json({ success: true, message: 'Guest Details Updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const guestId = req.params.id;

    try {
        const sqlActive = `
            SELECT reservation_id, status 
            FROM Reservation 
            WHERE guest_id = ? 
            AND status IN ('Pending', 'Confirmed', 'Occupied')
        `;
        const [activeRes] = await db.query(sqlActive, [guestId]);

        if (activeRes.length > 0) {
            return res.status(400).json({ 
                message: `Cannot delete! Guest has active bookings (Status: ${activeRes[0].status}). Check Out or Cancel first.` 
            });
        }

        const sqlBalance = `
            SELECT 
                (SELECT COALESCE(SUM(cost), 0) FROM Service s 
                 JOIN Reservation r ON s.reservation_id = r.reservation_id 
                 WHERE r.guest_id = ?) 
                +
                (SELECT COALESCE(SUM(
                    DATEDIFF(r.check_out_date, r.check_in_date) * rt.price_per_night
                 ), 0) 
                 FROM Reservation r
                 JOIN Room rm ON r.room_id = rm.room_id
                 JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
                 WHERE r.guest_id = ?) 
                AS total_charges,
                
                (SELECT COALESCE(SUM(amount), 0) FROM Payment p
                 JOIN Reservation r ON p.reservation_id = r.reservation_id
                 WHERE r.guest_id = ?) 
                AS total_paid
        `;

        const [financials] = await db.query(sqlBalance, [guestId, guestId, guestId]);
        
        const charges = parseFloat(financials[0].total_charges || 0);
        const paid = parseFloat(financials[0].total_paid || 0);
        const balance = charges - paid;

        if (balance !== 0) {
            return res.status(400).json({ 
                message: `Cannot delete! Guest has an unsettled balance of Rs. ${balance}. Please settle payments first.` 
            });
        }

        await db.execute('DELETE FROM Guest WHERE guest_id = ?', [guestId]);
        res.json({ success: true, message: 'Guest deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;