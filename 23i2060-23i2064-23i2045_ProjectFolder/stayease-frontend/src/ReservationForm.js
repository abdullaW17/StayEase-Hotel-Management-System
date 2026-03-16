import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReservationForm() {
    
    const [guests, setGuests] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);

    
    const [formData, setFormData] = useState({
        guest_id: '',
        room_id: '',
        check_in_date: '',
        check_out_date: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const guestRes = await axios.get('http://localhost:5000/api/guests/read');
                setGuests(guestRes.data);

                
                const roomRes = await axios.get('http://localhost:5000/api/rooms/available');
                setAvailableRooms(roomRes.data);
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Processing...');
        setMessageType('info');

        try {
            const res = await axios.post('http://localhost:5000/api/reservations/add', formData);
            setMessage(`✅ Reservation Confirmed! ID: ${res.data.reservationId}`);
            setMessageType('success');
            
            
            const roomRes = await axios.get('http://localhost:5000/api/rooms/available');
            setAvailableRooms(roomRes.data);
            
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error occurred';
            setMessage('❌ ' + errorMsg);
            setMessageType('danger');
        }
    };

    return (
        <div className="card shadow-sm border-warning h-100">
            <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">📅 Create Reservation</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    {/* Guest Dropdown */}
                    <div className="mb-3">
                        <label className="form-label small text-muted">Select Guest</label>
                        <select 
                            name="guest_id" 
                            className="form-select" 
                            onChange={handleChange} 
                            required
                            value={formData.guest_id}
                        >
                            <option value="">-- Choose a Guest --</option>
                            {guests.map(guest => (
                                <option key={guest.guest_id} value={guest.guest_id}>
                                    ID: {guest.guest_id} | {guest.first_name} {guest.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Room Dropdown */}
                    <div className="mb-3">
                        <label className="form-label small text-muted">Select Room (Available Only)</label>
                        <select 
                            name="room_id" 
                            className="form-select" 
                            onChange={handleChange} 
                            required
                            value={formData.room_id}
                        >
                            <option value="">-- Choose a Room --</option>
                            {availableRooms.length > 0 ? (
                                availableRooms.map(room => (
                                    <option key={room.room_id} value={room.room_id}>
                                        Room {room.room_id} ({room.type_name})
                                    </option>
                                ))
                            ) : (
                                <option disabled>No rooms available</option>
                            )}
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label small text-muted">Check-In</label>
                            <input type="date" name="check_in_date" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col">
                            <label className="form-label small text-muted">Check-Out</label>
                            <input type="date" name="check_out_date" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold">Confirm Booking</button>
                </form>

                {message && (
                    <div className={`alert alert-${messageType} mt-3 p-2 small`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReservationForm;