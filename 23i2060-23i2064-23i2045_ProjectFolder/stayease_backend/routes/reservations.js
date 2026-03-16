const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');


router.post('/add', [
    
    body('guest_id').isInt().withMessage('Guest ID must be a number'),
    body('room_id').isInt().withMessage('Room ID must be a number'),
    body('check_in_date').isISO8601().withMessage('Valid Date required'),
], async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

 
    const { guest_id, room_id, check_in_date, check_out_date } = req.body;

    if (new Date(check_out_date) <= new Date(check_in_date)) {
        return res.status(400).json({ message: 'Check-out must be after Check-in' });
    }

    try {
        
        const sqlInsert = `INSERT INTO Reservation (guest_id, room_id, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, 'Confirmed')`;
        const [result] = await db.execute(sqlInsert, [guest_id, room_id, check_in_date, check_out_date]);

        
        const sqlUpdate = `UPDATE Room SET status = 'Occupied' WHERE room_id = ?`;
        await db.execute(sqlUpdate, [room_id]);

        
        res.status(201).json({ 
            success: true, 
            message: 'Reservation Created!',
            reservationId: result.insertId 
        });

    } catch (err) {
        console.error(err);
        
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

router.get('/read', async (req, res) => {
    try {
        const sql = `
            SELECT r.reservation_id, r.room_id, r.check_in_date, r.check_out_date, r.status, r.guest_id,
                   g.first_name, g.last_name, 
                   rt.type_name, rt.price_per_night -- FETCH PRICE
            FROM Reservation r
            JOIN Guest g ON r.guest_id = g.guest_id
            JOIN Room rm ON r.room_id = rm.room_id
            JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
            ORDER BY r.reservation_id DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/status/:id', async (req, res) => {
    const { status } = req.body;
    const resId = req.params.id;

    try {
        
        await db.execute('UPDATE Reservation SET status=? WHERE reservation_id=?', [status, resId]);

        
        if (status === 'CheckedOut' || status === 'Cancelled') {
            
            const [rows] = await db.query('SELECT room_id FROM Reservation WHERE reservation_id=?', [resId]);
            if (rows.length > 0) {
                await db.execute('UPDATE Room SET status="Available" WHERE room_id=?', [rows[0].room_id]);
            }
        }

        res.json({ success: true, message: `Reservation marked as ${status}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const resId = req.params.id;
    try {
        
        const [rows] = await db.query('SELECT room_id FROM Reservation WHERE reservation_id = ?', [resId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const roomId = rows[0].room_id;

        
        await db.execute('DELETE FROM Reservation WHERE reservation_id = ?', [resId]);

        
        await db.execute('UPDATE Room SET status = "Available" WHERE room_id = ?', [roomId]);

        res.json({ success: true, message: 'Reservation deleted and room freed.' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/unsettled', async (req, res) => {
    try {
        const sql = `
            SELECT 
                r.reservation_id, 
                r.guest_id, 
                r.room_id, 
                r.status, 
                r.check_in_date,   -- CRITICAL: Must be selected for date calc
                r.check_out_date,  -- CRITICAL: Must be selected for date calc
                g.first_name, 
                g.last_name,
                rt.price_per_night, -- CRITICAL: Must be selected for cost calc
                
                (SELECT COALESCE(SUM(cost), 0) FROM Service WHERE reservation_id = r.reservation_id) as service_total,
                (SELECT COALESCE(SUM(amount), 0) FROM Payment WHERE reservation_id = r.reservation_id) as payment_total
            
            FROM Reservation r
            JOIN Guest g ON r.guest_id = g.guest_id
            JOIN Room rm ON r.room_id = rm.room_id
            JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
            WHERE r.status != 'Cancelled'
            ORDER BY r.reservation_id DESC
        `;
        
        const [rows] = await db.query(sql);

        
        const unsettled = rows.filter(row => {
            const checkIn = new Date(row.check_in_date);
            const checkOut = new Date(row.check_out_date);
            
            
            if (isNaN(checkIn) || isNaN(checkOut)) return true; 

            const diffTime = Math.abs(checkOut - checkIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
            
           
            const price = parseFloat(row.price_per_night) || 0;

            const roomCost = diffDays * price;
            const totalBill = roomCost + parseFloat(row.service_total);
            const totalPaid = parseFloat(row.payment_total);
            const balance = totalBill - totalPaid;

            return balance !== 0; 
        });

        res.json(unsettled);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;