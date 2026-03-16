
---

# 🏨 StayEase – Hotel Management System

> **DB Lab Project** | Deliverable D3 – Final Implementation
> **Team:** 23i-2060 · 23i-2064 · 23i-2045

A full-stack hotel management system built with a **React** frontend, **Node.js/Express** REST API backend, and a **MySQL** relational database. The system provides role-based staff access to manage rooms, guests, reservations, billing, services, payments, and business reports.

---

## 📁 Project Structure

```text
DB Lab Project/
├── 01_schema.sql                          # MySQL database schema (DDL)
├── 02_seed.sql                            # Sample/seed data (DML)
└── 23i2060-23i2064-23i2045_ProjectFolder/
    ├── stayease_backend/                  # Node.js + Express REST API
    │   ├── app.js                         # Entry point, route mounting
    │   ├── db.js                          # MySQL connection pool
    │   └── routes/                        # API route handlers
    │       ├── auth.js
    │       ├── dashboard.js
    │       ├── guests.js
    │       ├── reservations.js
    │       ├── rooms.js
    │       ├── services.js
    │       ├── payments.js
    │       ├── reports.js
    │       └── staff.js
    └── stayease-frontend/                 # React.js SPA
        └── src/
            ├── App.js                     # Routing & layout
            ├── AuthContext.js             # Global auth state
            ├── Login.js                   # Staff login page
            ├── Dashboard.js               # Overview stats
            ├── GuestList.js               # Guest management
            ├── GuestForm.js               # Add / edit guest
            ├── ReservationList.js         # Reservations view
            ├── ReservationForm.js         # New reservation form
            ├── RoomStatus.js              # Live room status board
            ├── Billing.js                 # Bill generation & checkout
            ├── StaffManager.js            # Staff CRUD (Manager only)
            ├── Reports.js                 # Analytics & reports
            └── AdminPanel.js              # Admin controls
```

---

## 🗄️ Database Schema

The database (`stayease_db`) contains **7 interrelated tables**:

| Table         | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `RoomType`    | Lookup table for room categories (Standard, Deluxe, Suite, etc.) with pricing |
| `Room`        | Physical hotel rooms (101–501) with real-time status                          |
| `Staff`       | Hotel employees with roles: **Manager**, **Receptionist**, **Housekeeping**   |
| `Guest`       | Guest profiles identified by CNIC/Passport                                    |
| `Reservation` | Bookings linking guests to rooms with check-in/out dates                      |
| `Service`     | Extra charges per reservation (laundry, food, airport pickup, etc.)           |
| `Payment`     | Payment records per reservation (supports split payments)                     |

### Room Statuses

`Available` · `Occupied` · `Cleaning` · `Maintenance`

### Reservation Statuses

`Pending` · `Confirmed` · `Occupied` · `CheckedOut` · `Cancelled`

### Room Types & Pricing (Seed Data)

| Type               | Capacity | Price/Night (Rs.) |
| ------------------ | -------- | ----------------- |
| Standard Single    | 1        | 5,000             |
| Economy Twin       | 2        | 6,000             |
| Deluxe Double      | 2        | 8,500             |
| Executive Suite    | 4        | 15,000            |
| Presidential Suite | 6        | 45,000            |

---

## ⚙️ Backend – REST API

**Tech Stack:** Node.js · Express.js 5 · mysql2 · dotenv · express-validator
**Port:** `5000`

### API Endpoints

| Module       | Base Route          | Key Operations                                            |
| ------------ | ------------------- | --------------------------------------------------------- |
| Auth         | `/api/auth`         | `POST /login` – Staff login by ID & password              |
| Dashboard    | `/api/dashboard`    | `GET /` – Summary stats (occupancy, revenue, etc.)        |
| Guests       | `/api/guests`       | Full CRUD – list, add, update, delete guests              |
| Reservations | `/api/reservations` | Full CRUD – create, update status, checkout flow          |
| Rooms        | `/api/rooms`        | `GET /` – Room list; `PATCH /:id/status` – Update status  |
| Services     | `/api/services`     | Add & list extra services per reservation                 |
| Payments     | `/api/payments`     | Record payments per reservation                           |
| Reports      | `/api/reports`      | Revenue, room stats, monthly bookings, operational report |
| Staff        | `/api/staff`        | View and manage staff members                             |

### Reports Available

* **Revenue Report** – Total room revenue + service charges
* **Room Statistics** – Booking count by room type
* **Monthly Bookings** – Booking trends by month
* **Operational Report** – Live room-by-room status with financials (bill vs. paid, balance due)

---

## 🖥️ Frontend – React SPA

**Tech Stack:** React 19 · React Router 7 · Axios · Bootstrap 5 · React Icons
**Port:** `3000`

### Pages & Features

| Component         | Role                                                           |
| ----------------- | -------------------------------------------------------------- |
| `Login`           | Staff login with ID & password; role stored in context         |
| `Dashboard`       | Key metrics: rooms available, active guests, revenue           |
| `GuestList`       | Search, view, edit, delete guests                              |
| `GuestForm`       | Add or edit guest profile (CNIC validation)                    |
| `ReservationList` | View all reservations, filter by status, confirm/cancel        |
| `ReservationForm` | Create new reservation with room & guest selection             |
| `RoomStatus`      | Visual color-coded board of all rooms and their statuses       |
| `Billing`         | Generate itemized bill, add services, record payment, checkout |
| `StaffManager`    | Manager-only: add/remove/view staff                            |
| `Reports`         | Charts and tables for revenue, occupancy, monthly trends       |
| `AdminPanel`      | Admin-level controls                                           |

### Role-Based Access Control (RBAC)

* **Manager** – Full access including staff management and reports
* **Receptionist** – Guest, reservation, billing, and room operations
* **Housekeeping** – View room status and update cleaning assignments

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v18+
* [MySQL](https://www.mysql.com/) 8.0+

### 1. Set Up the Database

Open MySQL and run the SQL scripts in order:

```sql
SOURCE path/to/01_schema.sql;
SOURCE path/to/02_seed.sql;
```

This creates the `stayease_db` database with all tables and populates it with **sample data**.

### 2. Configure the Backend

```js
// stayease_backend/db.js
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dbpassword123',   // ← Change to your MySQL password
    database: 'stayease_db',
});
```

### 3. Start the Backend

```bash
cd 23i2060-23i2064-23i2045_ProjectFolder/stayease_backend
npm install
node app.js
# Server runs at http://localhost:5000
```

### 4. Start the Frontend

```bash
cd 23i2060-23i2064-23i2045_ProjectFolder/stayease-frontend
npm install
npm start
# App opens at http://localhost:3000
```

### 5. Login

Use any staff record from the seed data. Default password for all staff: `user123`

| Staff ID | Name        | Role         |
| -------- | ----------- | ------------ |
| 1        | Ahsan Khan  | Manager      |
| 3        | Sarah Ahmed | Receptionist |
| 8        | Zainab Bibi | Housekeeping |

---

## 🧩 Key Design Decisions

* **RBAC via Role field** – Role returned from login is stored in React Context and used for conditional UI rendering.
* **Cascade Deletes** – Deleting a Guest cascades to Reservations → Services & Payments.
* **Split Payments** – `Payment` table allows multiple installments.
* **Operational Report** – Calculates balance due per room by comparing room + service costs vs payments.

---

## 👥 Team Members

| Student ID | Role                   |
| ---------- | ---------------------- |
| 23i-2060   | Full-Stack Development |
| 23i-2064   | Full-Stack Development |
| 23i-2045   | Full-Stack Development |

---

