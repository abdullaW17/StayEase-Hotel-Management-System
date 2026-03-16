import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaBed, FaClipboardList, FaUserPlus, FaCalendarCheck, FaMoneyBillWave, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import Auth

function Dashboard() {
    const { user } = useAuth(); 
    const [stats, setStats] = useState({ totalGuests: 0, availableRooms: 0, activeReservations: 0 });

    useEffect(() => {
        
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary">
                👋 Welcome, {user?.name} <span className="badge bg-secondary fs-6 align-middle">{user?.role}</span>
            </h2>
            
            {/* 1. STATS CARDS */}
            <div className="row mb-5">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3 shadow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="card-title">Total Guests</h5>
                                <h2 className="display-4 fw-bold">{stats.totalGuests}</h2>
                            </div>
                            <FaUsers size={50} className="opacity-50"/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3 shadow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="card-title">Available Rooms</h5>
                                <h2 className="display-4 fw-bold">{stats.availableRooms}</h2>
                            </div>
                            <FaBed size={50} className="opacity-50"/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3 shadow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="card-title">Active Bookings</h5>
                                <h2 className="display-4 fw-bold text-dark">{stats.activeReservations}</h2>
                            </div>
                            <FaClipboardList size={50} className="opacity-50 text-dark"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. QUICK ACTIONS (Role Based) */}
            <h4 className="mb-3 text-secondary border-bottom pb-2">Quick Actions</h4>
            <div className="row g-3">
                {/* Standard Actions - Visible to Everyone */}
                <div className="col-md-3">
                    <Link to="/guests" className="btn btn-outline-primary w-100 p-4 fw-bold h-100 d-flex flex-column align-items-center justify-content-center">
                        <FaUserPlus size={30} className="mb-2"/> 
                        Manage Guests
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/reservations" className="btn btn-outline-warning text-dark w-100 p-4 fw-bold h-100 d-flex flex-column align-items-center justify-content-center">
                        <FaCalendarCheck size={30} className="mb-2"/> 
                        Manage Bookings
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/billing" className="btn btn-outline-success w-100 p-4 fw-bold h-100 d-flex flex-column align-items-center justify-content-center">
                        <FaMoneyBillWave size={30} className="mb-2"/> 
                        Billing & Payments
                    </Link>
                </div>

                {/* MANAGER ONLY ACTION */}
                {user.role === 'Manager' && (
                    <div className="col-md-3">
                        <Link to="/admin" className="btn btn-outline-danger w-100 p-4 fw-bold h-100 d-flex flex-column align-items-center justify-content-center">
                            <FaUserShield size={30} className="mb-2"/> 
                            Admin Panel
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;