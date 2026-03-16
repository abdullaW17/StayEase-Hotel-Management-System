import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function AdminPanel() {
    const { user } = useAuth();
    const [roomTypes, setRoomTypes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    useEffect(() => { loadRoomTypes(); }, []);

    const loadRoomTypes = async () => {
        const res = await axios.get('http://localhost:5000/api/rooms/types'); 
        setRoomTypes(res.data);
    };

    const updatePrice = async (id) => {
        await axios.put(`http://localhost:5000/api/rooms/types/${id}`, { price: newPrice });
        setEditingId(null);
        loadRoomTypes();
    };

    if (user.role !== 'Manager') return <div className="alert alert-danger m-5">⛔ Access Denied: Managers Only</div>;

    return (
        <div className="container mt-4">
            <h2 className="text-danger">🔐 Admin Control Panel</h2>
            <div className="card shadow mt-4">
                <div className="card-header bg-danger text-white">Manage Room Pricing</div>
                <div className="card-body">
                    <table className="table">
                        <thead><tr><th>Type</th><th>Current Price</th><th>Action</th></tr></thead>
                        <tbody>
                            {roomTypes.map(rt => (
                                <tr key={rt.room_type_id}>
                                    <td>{rt.type_name}</td>
                                    <td>
                                        {editingId === rt.room_type_id ? 
                                            <input type="number" className="form-control" value={newPrice} onChange={e => setNewPrice(e.target.value)} /> 
                                            : `Rs. ${rt.price_per_night}`}
                                    </td>
                                    <td>
                                        {editingId === rt.room_type_id ? 
                                            <button className="btn btn-success btn-sm" onClick={() => updatePrice(rt.room_type_id)}><FaSave /> Save</button> 
                                            : <button className="btn btn-outline-dark btn-sm" onClick={() => { setEditingId(rt.room_type_id); setNewPrice(rt.price_per_night); }}><FaEdit /> Edit</button>
                                        }
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
export default AdminPanel;