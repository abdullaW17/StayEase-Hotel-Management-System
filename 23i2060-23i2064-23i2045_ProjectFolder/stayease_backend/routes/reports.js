const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/revenue', async (req, res) => {
    try {
        const sqlService = `SELECT COALESCE(SUM(cost), 0) as total FROM Service`;
        const [serviceRes] = await db.query(sqlService);
        
        const sqlRoom = `
            SELECT SUM(DATEDIFF(r.check_out_date, r.check_in_date) * rt.price_per_night) as total
            FROM Reservation r
            JOIN Room rm ON r.room_id = rm.room_id
            JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
            WHERE r.status IN ('CheckedOut', 'Occupied')
        `;
        const [roomRes] = await db.query(sqlRoom);

        res.json({
            serviceRevenue: parseFloat(serviceRes[0].total),
            roomRevenue: parseFloat(roomRes[0].total) || 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/room-stats', async (req, res) => {
    try {
        const sql = `
            SELECT rt.type_name, COUNT(r.reservation_id) as booking_count
            FROM Reservation r
            JOIN Room rm ON r.room_id = rm.room_id
            JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
            GROUP BY rt.type_name
            ORDER BY booking_count DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/monthly', async (req, res) => {
    try {
        const sql = `
            SELECT MONTHNAME(check_in_date) as month, COUNT(*) as count 
            FROM Reservation 
            GROUP BY MONTH(check_in_date), MONTHNAME(check_in_date)
            ORDER BY MONTH(check_in_date)
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/operational', async (req, res) => {
    try {
       
        const sql = `
            SELECT 
                rm.room_id, 
                rm.status as room_status,
                rt.type_name,
                rt.price_per_night,
                
                -- Guest Info (If Reserved)
                res.reservation_id,
                res.status as res_status,
                res.check_in_date,
                g.first_name,
                g.last_name,

                -- Financials (Calculated Subqueries)
                (SELECT COALESCE(SUM(cost), 0) FROM Service WHERE reservation_id = res.reservation_id) as service_total,
                (SELECT COALESCE(SUM(amount), 0) FROM Payment WHERE reservation_id = res.reservation_id) as payment_total

            FROM Room rm
            JOIN RoomType rt ON rm.room_type_id = rt.room_type_id
            -- Left Join fetches current active reservation for this room
            LEFT JOIN Reservation res ON rm.room_id = res.room_id AND res.status IN ('Confirmed', 'Occupied')
            LEFT JOIN Guest g ON res.guest_id = g.guest_id
            ORDER BY rm.room_id ASC
        `;
        
        const [rows] = await db.query(sql);

        
        const report = rows.map(row => {
            let balance = 0;
            let paymentStatus = 'N/A'; 

            if (row.reservation_id) {
                
                const checkIn = new Date(row.check_in_date);
                const now = new Date(); 
                const diffTime = Math.abs(now - checkIn); 
                
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                
                const roomCost = days * parseFloat(row.price_per_night);
                const totalBill = roomCost + parseFloat(row.service_total);
                const totalPaid = parseFloat(row.payment_total);
                balance = totalBill - totalPaid;

                if (balance > 0) paymentStatus = `Due: Rs. ${balance}`;
                else if (balance === 0) paymentStatus = 'Settled';
                else paymentStatus = `Credit: Rs. ${Math.abs(balance)}`;
            }

            return { ...row, balance, paymentStatus };
        });

        res.json(report);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;