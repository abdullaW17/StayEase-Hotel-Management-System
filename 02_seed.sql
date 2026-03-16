USE stayease_db;

-- ==========================================
-- 1. Insert Room Types (Lookup Table)
-- ==========================================
INSERT INTO RoomType (type_name, capacity, amenities, price_per_night) VALUES
('Standard Single', 1, 'Wi-Fi, TV, AC', 5000.00),
('Deluxe Double', 2, 'Wi-Fi, TV, AC, Mini-bar, Balcony', 8500.00),
('Executive Suite', 4, 'Wi-Fi, 2xTV, AC, Jacuzzi, Lounge', 15000.00),
('Presidential Suite', 6, 'Private Pool, Butler, Gym Access', 45000.00),
('Economy Twin', 2, 'Wi-Fi, AC', 6000.00);

-- ==========================================
-- 2. Insert Rooms (15 Entries)
-- ==========================================
INSERT INTO Room (room_id, room_type_id, status) VALUES
(101, 1, 'Available'), (102, 1, 'Occupied'), (103, 1, 'Maintenance'), (104, 1, 'Available'), (105, 1, 'Cleaning'),
(201, 2, 'Available'), (202, 2, 'Occupied'), (203, 2, 'Cleaning'), (204, 2, 'Available'), (205, 2, 'Occupied'),
(301, 3, 'Available'), (302, 3, 'Occupied'), (303, 3, 'Available'), (304, 3, 'Maintenance'),
(401, 4, 'Occupied'), 
(501, 5, 'Available');

-- ==========================================
-- 3. Insert Staff (15 Entries)
-- ==========================================
INSERT INTO Staff (name, role, contact_info, shift_timing, branch_no, desk_no, languages, assignment_section) VALUES
-- Managers
('Ahsan Khan', 'Manager', '0300-1111111', '09:00-17:00', 'ISB-01', NULL, NULL, NULL),
('Hira Mani', 'Manager', '0300-2222222', '09:00-17:00', 'ISB-01', NULL, NULL, NULL),
-- Receptionists
('Sarah Ahmed', 'Receptionist', '0321-3333333', '08:00-16:00', NULL, 'D-1', 'English, Urdu', NULL),
('Ali Raza', 'Receptionist', '0321-4444444', '16:00-24:00', NULL, 'D-2', 'Urdu, Pashto', NULL),
('Usman Ghani', 'Receptionist', '0321-5555555', '00:00-08:00', NULL, 'D-1', 'English, Urdu', NULL),
('Sana Javed', 'Receptionist', '0321-6666666', '08:00-16:00', NULL, 'D-3', 'Urdu, Punjabi', NULL),
('Minal Khan', 'Receptionist', '0321-7777777', '16:00-24:00', NULL, 'D-2', 'Urdu, Sindhi', NULL),
-- Housekeeping
('Zainab Bibi', 'Housekeeping', '0345-8888888', '08:00-16:00', NULL, NULL, NULL, 'Floor 1'),
('Kamran Akmal', 'Housekeeping', '0345-9999999', '08:00-16:00', NULL, NULL, NULL, 'Floor 2'),
('Bilal Tufail', 'Housekeeping', '0345-1010101', '16:00-24:00', NULL, NULL, NULL, 'Floor 3'),
('Fahad Mustafa', 'Housekeeping', '0345-2020202', '00:00-08:00', NULL, NULL, NULL, 'Lobby'),
('Rafiq Ahmed', 'Housekeeping', '0345-3030303', '16:00-24:00', NULL, NULL, NULL, 'Floor 1'),
('Nasreen Akhtar', 'Housekeeping', '0345-4040404', '08:00-16:00', NULL, NULL, NULL, 'Floor 2'),
('Kashif Mehmood', 'Housekeeping', '0345-5050505', '00:00-08:00', NULL, NULL, NULL, 'Kitchen'),
('Nida Yasir', 'Housekeeping', '0345-6060606', '08:00-16:00', NULL, NULL, NULL, 'Gym');

-- ==========================================
-- 4. Insert Guests (15 Entries)
-- ==========================================
INSERT INTO Guest (first_name, last_name, cnic_passport, phone, email) VALUES
('Omer', 'Malik', '37405-1000001-1', '0300-5551001', 'omer.m@email.com'),
('Hammad', 'Ahmed', '37405-1000002-1', '0300-5551002', 'hammad.a@email.com'),
('Rana', 'Abdullah', '37405-1000003-1', '0300-5551003', 'rana.a@email.com'),
('Ayesha', 'Khan', '37405-1000004-1', '0300-5551004', 'ayesha.k@email.com'),
('John', 'Doe', 'USA-987654321', '0300-5551005', 'john.doe@email.com'),
('Fatima', 'Noor', '37405-1000006-1', '0300-5551006', 'fatima.n@email.com'),
('Bilal', 'Saeed', '37405-1000007-1', '0300-5551007', 'bilal.s@email.com'),
('Zara', 'Sheikh', '37405-1000008-1', '0300-5551008', 'zara.s@email.com'),
('Michael', 'Smith', 'UK-123456789', '0300-5551009', 'm.smith@email.com'),
('Sadia', 'Imam', '37405-1000010-1', '0300-5551010', 'sadia.i@email.com'),
('Ali', 'Zafar', '37405-1000011-1', '0300-5551011', 'ali.z@email.com'),
('Mahira', 'Khan', '37405-1000012-1', '0300-5551012', 'mahira.k@email.com'),
('Fawad', 'Khan', '37405-1000013-1', '0300-5551013', 'fawad.k@email.com'),
('Atif', 'Aslam', '37405-1000014-1', '0300-5551014', 'atif.a@email.com'),
('Momina', 'Mustehsan', '37405-1000015-1', '0300-5551015', 'momina.m@email.com');

-- ==========================================
-- 5. Insert Reservations (15 Entries)
-- ==========================================
-- FIX: Changed status 'Occupied' to 'Confirmed' to match Schema constraints
INSERT INTO Reservation (guest_id, room_id, check_in_date, check_out_date, status) VALUES
(1, 102, '2025-10-01 14:00:00', '2025-10-05 12:00:00', 'Confirmed'), -- Was Occupied
(2, 202, '2025-10-02 12:00:00', '2025-10-06 12:00:00', 'Confirmed'), -- Was Occupied
(3, 302, '2025-10-03 15:00:00', '2025-10-04 11:00:00', 'CheckedOut'),
(4, 401, '2025-10-04 14:00:00', '2025-10-10 12:00:00', 'Confirmed'), -- Was Occupied
(5, 205, '2025-10-05 14:00:00', '2025-10-12 12:00:00', 'Confirmed'), -- Was Occupied
(6, 101, '2025-11-01 14:00:00', '2025-11-03 12:00:00', 'Pending'),
(7, 301, '2025-11-05 14:00:00', '2025-11-07 12:00:00', 'Confirmed'),
(8, 201, '2025-11-10 14:00:00', '2025-11-15 12:00:00', 'Pending'),
(9, 103, '2025-09-01 10:00:00', '2025-09-02 10:00:00', 'Cancelled'),
(10, 204, '2025-10-20 14:00:00', '2025-10-22 12:00:00', 'Confirmed'),
(11, 104, '2025-10-15 14:00:00', '2025-10-18 12:00:00', 'Confirmed'),
(12, 303, '2025-10-16 14:00:00', '2025-10-19 12:00:00', 'CheckedOut'),
(13, 501, '2025-10-25 14:00:00', '2025-10-28 12:00:00', 'Pending'),
(14, 105, '2025-10-28 14:00:00', '2025-10-30 12:00:00', 'Pending'),
(15, 203, '2025-11-01 14:00:00', '2025-11-05 12:00:00', 'Confirmed');

-- ==========================================
-- 6. Insert Payments (15 Entries - Strict 1:1)
-- ==========================================
INSERT INTO Payment (reservation_id, amount, payment_mode) VALUES
(1, 20000.00, 'Online'),
(2, 34000.00, 'Credit Card'),
(3, 15000.00, 'Cash'),
(4, 270000.00, 'Online'),
(5, 60000.00, 'Cash'),
(6, 10000.00, 'Online'),
(7, 30000.00, 'Credit Card'),
(8, 15000.00, 'Online'),
(9, 500.00, 'Cash'),
(10, 17000.00, 'Online'),
(11, 15000.00, 'Credit Card'),
(12, 45000.00, 'Cash'),
(13, 18000.00, 'Online'),
(14, 10000.00, 'Cash'),
(15, 42500.00, 'Credit Card');

-- ==========================================
-- 7. Insert Services (15 Entries)
-- ==========================================
INSERT INTO Service (reservation_id, staff_id, service_type, cost, status) VALUES
(1, 8, 'Laundry', 500.00, 'Completed'),
(1, 9, 'Room Cleaning', 0.00, 'Completed'),
(2, 10, 'Extra Mattress', 1000.00, 'Completed'),
(2, 14, 'Food - Dinner', 2500.00, 'In Progress'),
(4, 11, 'Airport Pickup', 3000.00, 'Completed'),
(4, 8, 'Laundry', 750.00, 'Requested'),
(5, 12, 'Minibar Refill', 1500.00, 'Completed'),
(3, 13, 'Food - Breakfast', 1200.00, 'Completed'),
(1, 8, 'Ironing', 300.00, 'Requested'),
(4, 11, 'Room Decoration', 5000.00, 'Completed'),
(12, 14, 'Food - Lunch', 1800.00, 'Completed'),
(11, 10, 'Wake-up Call', 0.00, 'Completed'),
(10, 9, 'Extra Towels', 0.00, 'Requested'),
(15, 12, 'Shoe Polish', 200.00, 'Completed'),
(7, 13, 'City Tour Guide', 5000.00, 'In Progress');