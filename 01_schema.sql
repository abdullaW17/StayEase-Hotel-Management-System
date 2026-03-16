-- 01_schema.sql
-- Project: StayEase Hotel Management System
-- Deliverable: D3 (Final Implementation)

DROP DATABASE IF EXISTS stayease_db;
CREATE DATABASE stayease_db;
USE stayease_db;

-- 1. RoomType (Lookup Table)
CREATE TABLE RoomType (
    room_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    amenities TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL
);

-- 2. Room (Physical Rooms)
CREATE TABLE Room (
    room_id INT PRIMARY KEY, -- Manual Room Numbers (e.g., 101, 102)
    room_type_id INT,
    status ENUM('Available', 'Occupied', 'Cleaning', 'Maintenance') DEFAULT 'Available',
    FOREIGN KEY (room_type_id) REFERENCES RoomType(room_type_id) ON UPDATE CASCADE
);

-- 3. Staff (Updated with Password for RBAC)
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role ENUM('Manager', 'Receptionist', 'Housekeeping') NOT NULL,
    contact_info VARCHAR(50),
    shift_timing VARCHAR(50),
    password VARCHAR(50) DEFAULT 'user123', -- NEW: Added for Login
    branch_no VARCHAR(50),      -- Nullable (Manager specific)
    desk_no VARCHAR(20),        -- Nullable (Receptionist specific)
    languages VARCHAR(100),     -- Nullable (Receptionist specific)
    assignment_section VARCHAR(50) -- Nullable (Housekeeping specific)
);

-- 4. Guest
CREATE TABLE Guest (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cnic_passport VARCHAR(50) UNIQUE NOT NULL, 
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100)
);

-- 5. Reservation
CREATE TABLE Reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATETIME NOT NULL,
    check_out_date DATETIME NOT NULL,
    -- Expanded Statuses for Workflow
    status ENUM('Pending', 'Confirmed', 'CheckedOut', 'Cancelled', 'Occupied') DEFAULT 'Pending',
    
    -- Constraint: Deleting a Guest automatically deletes their reservations
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON UPDATE CASCADE,
    CHECK (check_out_date > check_in_date)
);

-- 6. Service (Charges)
CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    staff_id INT, -- Who performed the service (Optional)
    service_type VARCHAR(50) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    status ENUM('Requested', 'In Progress', 'Completed') DEFAULT 'Completed',
    
    -- Constraint: Deleting a Reservation removes its service charges
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON UPDATE CASCADE
);

-- 7. Payment (Updated: 1:N Relationship)
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL, -- NO UNIQUE CONSTRAINT (Allows split payments)
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_mode ENUM('Cash', 'Credit Card', 'Online') NOT NULL,
    
    -- Constraint: Deleting a Reservation removes its payment records
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);