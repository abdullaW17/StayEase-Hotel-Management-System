const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/available', async (req, res) => {
    try {
        const sql = `
            SELECT r.room_id, t.type_name, t.price_per_night 
            FROM Room r
            JOIN RoomType t ON r.room_type_id = t.room_type_id
            WHERE r.status = 'Available'
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


router.put('/types/:id', async (req, res) => {
    const { price } = req.body;
    try {
        await db.execute('UPDATE RoomType SET price_per_night = ? WHERE room_type_id = ?', [price, req.params.id]);
        res.json({ success: true, message: 'Price updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/types', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM RoomType');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.execute('UPDATE Room SET status = ? WHERE room_id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Room Status Updated' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


router.get('/all', async (req, res) => {
    try {
        const sql = `
            SELECT r.*, rt.type_name, rt.price_per_night 
            FROM Room r 
            JOIN RoomType rt ON r.room_type_id = rt.room_type_id
            ORDER BY r.room_id ASC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;