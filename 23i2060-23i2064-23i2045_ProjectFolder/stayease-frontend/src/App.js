import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import GuestList from './GuestList';
import ReservationList from './ReservationList';
import Billing from './Billing';
import AdminPanel from './AdminPanel';
import Login from './Login';
import { AuthProvider, useAuth } from './AuthContext';
import Reports from './Reports';
import StaffManager from './StaffManager';
import RoomStatus from './RoomStatus';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { user } = useAuth();
    return (
        <div className="bg-light min-vh-100">
            {user && <Navbar />}
            <div className="py-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/guests" element={<PrivateRoute><div className="container"><GuestList /></div></PrivateRoute>} />
                    <Route path="/reservations" element={<PrivateRoute><div className="container"><ReservationList /></div></PrivateRoute>} />
                    <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                    <Route path="/staff" element={<PrivateRoute><StaffManager /></PrivateRoute>} />
                    <Route path="/rooms" element={<PrivateRoute><RoomStatus /></PrivateRoute>} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;