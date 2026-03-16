import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function GuestList() {
    const { user } = useAuth();
    const [guests, setGuests] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    
    
    const [newGuest, setNewGuest] = useState({ first_name: '', last_name: '', cnic: '', phone: '', email: '' });
    const [editFormData, setEditFormData] = useState({ first_name: '', last_name: '', phone: '', email: '' });

    useEffect(() => { loadGuests(); }, []);

    const loadGuests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/guests/read');
            setGuests(res.data);
        } catch (err) { console.error(err); }
    };

    // HANDLERS
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/guests/add', newGuest);
            alert("Guest Registered!");
            setShowAddForm(false);
            setNewGuest({ first_name: '', last_name: '', cnic: '', phone: '', email: '' });
            loadGuests();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/guests/update/${editingId}`, editFormData);
            alert("Guest Updated!");
            setEditingId(null);
            loadGuests();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("⚠️ MANAGER ACTION: Delete this guest?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/guests/delete/${id}`);
            loadGuests();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    // Helper for Edit Mode
    const startEdit = (guest) => {
        setEditingId(guest.guest_id);
        setEditFormData({ first_name: guest.first_name, last_name: guest.last_name, phone: guest.phone, email: guest.email });
        setShowAddForm(false);
    };

    return (
        <div className="card shadow mt-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Guest Database</h5>
                <button className="btn btn-success btn-sm fw-bold" onClick={() => setShowAddForm(!showAddForm)}>
                    <FaPlus className="me-1"/> Register New Guest
                </button>
            </div>
            <div className="card-body">
                
                {/* SEARCH BAR */}
                <div className="input-group mb-4">
                    <span className="input-group-text bg-light"><FaSearch /></span>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by Name, Phone, or CNIC..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* ADD FORM */}
                {showAddForm && (
                    <div className="alert alert-success border-success mb-4 shadow-sm">
                        <h6 className="text-success fw-bold"><FaPlus /> New Registration</h6>
                        <form onSubmit={handleCreate} className="row g-2">
                            <div className="col-md-3"><input className="form-control" placeholder="First Name" required value={newGuest.first_name} onChange={e => setNewGuest({...newGuest, first_name: e.target.value})} /></div>
                            <div className="col-md-3"><input className="form-control" placeholder="Last Name" required value={newGuest.last_name} onChange={e => setNewGuest({...newGuest, last_name: e.target.value})} /></div>
                            <div className="col-md-2"><input className="form-control" placeholder="CNIC" required value={newGuest.cnic} onChange={e => setNewGuest({...newGuest, cnic: e.target.value})} /></div>
                            <div className="col-md-2"><input className="form-control" placeholder="Phone" required value={newGuest.phone} onChange={e => setNewGuest({...newGuest, phone: e.target.value})} /></div>
                            <div className="col-md-2"><input className="form-control" placeholder="Email" required value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} /></div>
                            <div className="col-12 text-end"><button className="btn btn-success btn-sm">Save</button></div>
                        </form>
                    </div>
                )}

                {/* EDIT FORM */}
                {editingId && (
                    <div className="alert alert-warning border-warning mb-4">
                        <h6 className="text-dark fw-bold"><FaEdit /> Editing Guest #{editingId}</h6>
                        <form onSubmit={handleUpdate} className="row g-2">
                            <div className="col-md-3"><input className="form-control" value={editFormData.first_name} onChange={e => setEditFormData({...editFormData, first_name: e.target.value})} required /></div>
                            <div className="col-md-3"><input className="form-control" value={editFormData.last_name} onChange={e => setEditFormData({...editFormData, last_name: e.target.value})} required /></div>
                            <div className="col-md-3"><input className="form-control" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} required /></div>
                            <div className="col-md-3"><input className="form-control" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required /></div>
                            <div className="col-12 text-end">
                                <button type="button" className="btn btn-secondary btn-sm me-2" onClick={() => setEditingId(null)}>Cancel</button>
                                <button className="btn btn-warning btn-sm">Update</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TABLE with FILTER */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light"><tr><th>ID</th><th>Name</th><th>CNIC</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
                        <tbody>
                            {guests.filter(g => 
                                g.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                g.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                g.phone.includes(searchTerm) ||
                                g.cnic_passport.includes(searchTerm)
                            ).map(g => (
                                <tr key={g.guest_id} className={editingId === g.guest_id ? "table-warning" : ""}>
                                    <td>{g.guest_id}</td>
                                    <td>{g.first_name} {g.last_name}</td>
                                    <td>{g.cnic_passport}</td>
                                    <td>{g.phone}</td>
                                    <td>{g.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(g)}><FaEdit /></button>
                                        {user.role === 'Manager' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(g.guest_id)}><FaTrash /></button>
                                        )}
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
export default GuestList;