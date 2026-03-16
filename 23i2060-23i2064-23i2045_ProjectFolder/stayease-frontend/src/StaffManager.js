import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserTie, FaTrash, FaPlus, FaUserShield } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function StaffManager() {
    const { user } = useAuth();
    const [staff, setStaff] = useState([]);
    const [newStaff, setNewStaff] = useState({ name: '', role: 'Receptionist', contact_info: '', shift_timing: 'Day', password: '' });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        const res = await axios.get('http://localhost:5000/api/staff/read');
        setStaff(res.data);
    };

    const handleHire = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/staff/add', newStaff);
            alert("Staff Added Successfully!");
            setNewStaff({ name: '', role: 'Receptionist', contact_info: '', shift_timing: 'Day', password: '' });
            loadStaff();
        } catch (err) { alert(err.message); }
    };

    const handleFire = async (id) => {
        if (!window.confirm("Are you sure you want to remove this staff member?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/staff/delete/${id}`);
            loadStaff();
        } catch (err) { alert(err.message); }
    };

    
    if (user.role !== 'Manager') return <div className="alert alert-danger m-4">⛔ Authorized Personnel Only</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary"><FaUserShield /> HR & Staff Management</h2>
            
            <div className="row">
                {/* HIRE FORM */}
                <div className="col-md-4">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-primary text-white"><FaPlus /> Hire New Staff</div>
                        <div className="card-body">
                            <form onSubmit={handleHire}>
                                <div className="mb-2">
                                    <label>Name</label>
                                    <input type="text" className="form-control" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                                </div>
                                <div className="mb-2">
                                    <label>Role</label>
                                    <select className="form-select" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                                        <option>Manager</option>
                                        <option>Receptionist</option>
                                        <option>Housekeeping</option>
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label>Phone</label>
                                    <input type="text" className="form-control" required value={newStaff.contact_info} onChange={e => setNewStaff({...newStaff, contact_info: e.target.value})} />
                                </div>
                                <div className="mb-2">
                                    <label>Shift</label>
                                    <select className="form-select" value={newStaff.shift_timing} onChange={e => setNewStaff({...newStaff, shift_timing: e.target.value})}>
                                        <option>Day</option>
                                        <option>Night</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Login Password</label>
                                    <input type="text" className="form-control" required value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
                                </div>
                                <button className="btn btn-primary w-100">Add Employee</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* STAFF LIST */}
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-dark text-white">Current Staff Roster</div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Shift</th><th>Action</th></tr></thead>
                                <tbody>
                                    {staff.map(s => (
                                        <tr key={s.staff_id}>
                                            <td>{s.staff_id}</td>
                                            <td>{s.name}</td>
                                            <td><span className={`badge ${s.role === 'Manager' ? 'bg-danger' : 'bg-info'}`}>{s.role}</span></td>
                                            <td>{s.shift_timing}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleFire(s.staff_id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffManager;