import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHotel } from 'react-icons/fa';

function Login() {
    const [credentials, setCredentials] = useState({ staff_id: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
            if (res.data.success) {
                login(res.data.user);
                navigate('/');
            }
        } catch (err) {
            setError('Invalid Staff ID or Password');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="card p-5 shadow-lg text-center" style={{ width: '400px' }}>
                <FaHotel size={50} className="text-warning mb-3 mx-auto" />
                <h3 className="mb-4">StayEase Staff</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="number" className="form-control mb-3" placeholder="Staff ID"
                        onChange={e => setCredentials({...credentials, staff_id: e.target.value})} required />
                    <input type="password" className="form-control mb-4" placeholder="Password"
                        onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    <button type="submit" className="btn btn-warning w-100 fw-bold">Login</button>
                </form>
            </div>
        </div>
    );
}
export default Login;