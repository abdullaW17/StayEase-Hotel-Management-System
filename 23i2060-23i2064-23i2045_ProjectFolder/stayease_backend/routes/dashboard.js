const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
    try {
        
        const [guestCount] = await db.query('SELECT COUNT(*) as total FROM Guest');
        const [roomCount] = await db.query('SELECT COUNT(*) as total FROM Room WHERE status = "Available"');
        const [resCount] = await db.query('SELECT COUNT(*) as total FROM Reservation WHERE status = "Confirmed"');

        res.json({
            totalGuests: guestCount[0].total,
            availableRooms: roomCount[0].total,
            activeReservations: resCount[0].total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;