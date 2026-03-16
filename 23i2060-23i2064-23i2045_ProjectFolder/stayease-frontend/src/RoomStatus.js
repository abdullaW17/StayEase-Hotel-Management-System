import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBroom, FaTools, FaCheck, FaBed } from 'react-icons/fa';

function RoomStatus() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        const res = await axios.get('http://localhost:5000/api/rooms/all');
        setRooms(res.data);
    };

    const changeStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/rooms/status/${id}`, { status: newStatus });
            loadRooms();
        } catch (err) { alert(err.message); }
    };

    const getCardColor = (status) => {
        switch(status) {
            case 'Available': return 'bg-success text-white';
            case 'Occupied': return 'bg-danger text-white'; 
            case 'Cleaning': return 'bg-warning text-dark';
            case 'Maintenance': return 'bg-secondary text-white';
            default: return 'bg-light';
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary"><FaBed /> Room Operations & Housekeeping</h2>
            
            <div className="row g-3">
                {rooms.map(room => (
                    <div className="col-md-3" key={room.room_id}>
                        <div className={`card shadow h-100 ${getCardColor(room.status)}`}>
                            <div className="card-body text-center">
                                <h3>{room.room_id}</h3>
                                <p className="mb-1">{room.type_name}</p>
                                <div className="fw-bold mb-3">{room.status}</div>

                                {/* ACTION BUTTONS */}
                                {room.status !== 'Occupied' ? (
                                    <div className="btn-group w-100">
                                        <button className="btn btn-sm btn-light" title="Mark Available" onClick={() => changeStatus(room.room_id, 'Available')}>
                                            <FaCheck />
                                        </button>
                                        <button className="btn btn-sm btn-warning" title="Mark for Cleaning" onClick={() => changeStatus(room.room_id, 'Cleaning')}>
                                            <FaBroom />
                                        </button>
                                        <button className="btn btn-sm btn-secondary" title="Mark for Maintenance" onClick={() => changeStatus(room.room_id, 'Maintenance')}>
                                            <FaTools />
                                        </button>
                                    </div>
                                ) : (
                                    <small className="text-white-50">(Guest In-House)</small>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomStatus;