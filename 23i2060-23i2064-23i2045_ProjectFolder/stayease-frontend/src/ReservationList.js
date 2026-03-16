import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaSignOutAlt, FaTimesCircle, FaTrash, FaPlus, FaThumbsUp, FaSearch } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function ReservationList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 

    
    const [showCreate, setShowCreate] = useState(false);
    const [guests, setGuests] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [newRes, setNewRes] = useState({ guest_id: '', room_id: '', check_in_date: '', check_out_date: '' });

    useEffect(() => {
        loadReservations();
        loadFormData();
    }, []);

    const loadReservations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reservations/read');
            setReservations(res.data);
        } catch (err) { console.error(err); }
    };

    const loadFormData = async () => {
        try {
            const gRes = await axios.get('http://localhost:5000/api/guests/read');
            setGuests(gRes.data);
            const rRes = await axios.get('http://localhost:5000/api/rooms/available');
            setAvailableRooms(rRes.data);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/reservations/add', newRes);
            alert("Reservation Created!");
            setShowCreate(false);
            setNewRes({ guest_id: '', room_id: '', check_in_date: '', check_out_date: '' });
            loadReservations();
            loadFormData(); 
        } catch (err) { alert("Error: " + err.message); }
    };

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;
        try {
            await axios.put(`http://localhost:5000/api/reservations/status/${id}`, { status: newStatus });
            
            
            if (newStatus === 'CheckedOut') {
                navigate('/billing', { state: { reservationId: id } });
            } else {
                loadReservations();
            }
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`⚠️ MANAGER ACTION: Permanently Delete #${id}?`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/reservations/delete/${id}`);
            loadReservations();
        } catch (err) { alert(err.message); }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return 'badge bg-primary';
            case 'Occupied': return 'badge bg-success';
            case 'CheckedOut': return 'badge bg-secondary';
            case 'Cancelled': return 'badge bg-danger';
            case 'Pending': return 'badge bg-warning text-dark';
            default: return 'badge bg-light';
        }
    };

    return (
        <div className="card shadow mt-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">📅 Reservation Management</h5>
                <button className="btn btn-warning btn-sm fw-bold text-dark" onClick={() => setShowCreate(!showCreate)}>
                    <FaPlus className="me-1"/> New Reservation
                </button>
            </div>
            <div className="card-body">
                
                {/* SEARCH BAR */}
                <div className="input-group mb-4">
                    <span className="input-group-text bg-light"><FaSearch /></span>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by Guest Name or Room Number..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* CREATE FORM */}
                {showCreate && (
                    <div className="alert alert-warning border-warning mb-4 shadow-sm">
                        <h6 className="text-dark fw-bold"><FaPlus /> New Booking</h6>
                        <form onSubmit={handleCreate}>
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <select className="form-select" value={newRes.guest_id} onChange={e => setNewRes({...newRes, guest_id: e.target.value})} required>
                                        <option value="">-- Select Guest --</option>
                                        {guests.map(g => <option key={g.guest_id} value={g.guest_id}>{g.first_name} {g.last_name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <select className="form-select" value={newRes.room_id} onChange={e => setNewRes({...newRes, room_id: e.target.value})} required>
                                        <option value="">-- Select Room --</option>
                                        {availableRooms.map(r => <option key={r.room_id} value={r.room_id}>Room {r.room_id} ({r.type_name})</option>)}
                                    </select>
                                </div>
                                <div className="col-md-2"><input type="date" className="form-control" value={newRes.check_in_date} onChange={e => setNewRes({...newRes, check_in_date: e.target.value})} required /></div>
                                <div className="col-md-2"><input type="date" className="form-control" value={newRes.check_out_date} onChange={e => setNewRes({...newRes, check_out_date: e.target.value})} required /></div>
                                <div className="col-12 text-end mt-2"><button className="btn btn-warning btn-sm fw-bold">Confirm</button></div>
                            </div>
                        </form>
                    </div>
                )}

                {/* TABLE with FILTER */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light"><tr><th>ID</th><th>Guest</th><th>Room</th><th>Dates</th><th>Status</th><th className="text-center">Actions</th></tr></thead>
                        <tbody>
                            {reservations.filter(r => 
                                r.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                r.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                r.room_id.toString().includes(searchTerm)
                            ).map(r => (
                                <tr key={r.reservation_id}>
                                    <td><strong>#{r.reservation_id}</strong></td>
                                    <td>{r.first_name} {r.last_name}</td>
                                    <td><span className="text-muted small">{r.type_name}</span><br/><strong>{r.room_id}</strong></td>
                                    <td><div className="small">In: {new Date(r.check_in_date).toLocaleDateString()}<br/>Out: {new Date(r.check_out_date).toLocaleDateString()}</div></td>
                                    <td><span className={getStatusBadge(r.status)}>{r.status}</span></td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            {r.status === 'Pending' && <button className="btn btn-sm btn-primary" title="Confirm" onClick={() => updateStatus(r.reservation_id, 'Confirmed')}><FaThumbsUp/></button>}
                                            {(r.status === 'Pending' || r.status === 'Confirmed') && (
                                                <>
                                                    <button className="btn btn-sm btn-success" title="Check-In" onClick={() => updateStatus(r.reservation_id, 'Occupied')}><FaCheckCircle/></button>
                                                    <button className="btn btn-sm btn-danger" title="Cancel" onClick={() => updateStatus(r.reservation_id, 'Cancelled')}><FaTimesCircle/></button>
                                                </>
                                            )}
                                            {r.status === 'Occupied' && <button className="btn btn-sm btn-secondary" title="Check-Out" onClick={() => updateStatus(r.reservation_id, 'CheckedOut')}><FaSignOutAlt/></button>}
                                            {user.role === 'Manager' && <button className="btn btn-sm btn-dark ms-1" title="Delete" onClick={() => handleDelete(r.reservation_id)}><FaTrash/></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default ReservationList;