import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaHotel, FaUserPlus, FaClipboardList, FaMoneyBillWave, 
    FaUserShield, FaBed, FaUserTie, FaChartLine, FaChartPie 
} from 'react-icons/fa';
import { useAuth } from './AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow sticky-top">
            {/* BRAND */}
            <Link className="navbar-brand fw-bold text-warning" to="/">
                <FaHotel className="me-2" /> StayEase
            </Link>
            
            {/* USER BADGE */}
            {user && (
                <span className="badge bg-secondary ms-2">
                    {user.name} ({user.role})
                </span>
            )}

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto align-items-center">
                    
                    {/* --- COMMON: DASHBOARD --- */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/"><FaChartPie className="me-1"/> Dashboard</Link>
                    </li>

                    {/* --- RECEPTIONIST & MANAGER LINKS --- */}
                    {(user?.role === 'Manager' || user?.role === 'Receptionist') && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/guests"><FaUserPlus className="me-1"/> Guests</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/reservations"><FaClipboardList className="me-1"/> Bookings</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/billing"><FaMoneyBillWave className="me-1"/> Billing</Link>
                            </li>
                        </>
                    )}

                    {/* --- HOUSEKEEPING & MANAGER LINKS --- */}
                    {(user?.role === 'Manager' || user?.role === 'Housekeeping') && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/rooms"><FaBed className="me-1"/> Ops</Link>
                        </li>
                    )}

                    {/* --- MANAGER ONLY LINKS --- */}
                    {user?.role === 'Manager' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/staff"><FaUserTie className="me-1"/> HR</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-info" to="/reports"><FaChartLine className="me-1"/> Reports</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-warning" to="/admin"><FaUserShield className="me-1"/> Admin</Link>
                            </li>
                        </>
                    )}
                </ul>
                
                {/* LOGOUT */}
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;