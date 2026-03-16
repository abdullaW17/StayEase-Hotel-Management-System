import React, { useState } from 'react';
import axios from 'axios';

function GuestForm() {
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        cnic: '',
        phone: '',
        email: ''
    });

    const [message, setMessage] = useState(''); 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage('Sending...');

        try {
            
            const res = await axios.post('http://localhost:5000/api/guests/add', formData);
            setMessage('✅ ' + res.data.message);
        } catch (error) {
            
            setMessage('❌ ' + (error.response?.data?.message || 'Error occurred'));
        }
    };

    return (
        <div className="card p-4 mb-4 shadow-sm">
            <h3>👤 Register New Guest</h3>
            
            {/* The Form Inputs */}
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="first_name" className="form-control" placeholder="First Name" onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <input type="text" name="last_name" className="form-control" placeholder="Last Name" onChange={handleChange} required />
                    </div>
                </div>
                <div className="mb-3">
                    <input type="text" name="cnic" className="form-control" placeholder="CNIC / Passport (Unique ID)" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="text" name="phone" className="form-control" placeholder="Phone Number" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="email" name="email" className="form-control" placeholder="Email Address" onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary w-100">Register Guest</button>
            </form>

            {/* The Alert Message Area */}
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
}

export default GuestForm;