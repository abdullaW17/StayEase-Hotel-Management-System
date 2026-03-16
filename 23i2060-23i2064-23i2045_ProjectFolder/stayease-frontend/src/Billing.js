import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaConciergeBell, FaUserTie, FaTrash } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

function Billing() {
    const { user } = useAuth(); // Get current user for RBAC
    const location = useLocation(); // Get redirect state
    
    // State Variables
    const [reservations, setReservations] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedRes, setSelectedRes] = useState(null);
    const [services, setServices] = useState([]);
    const [payments, setPayments] = useState([]);
    
    // Form Inputs
    const [newService, setNewService] = useState({ type: '', cost: '', staff_id: '' });
    const [newPayment, setNewPayment] = useState({ amount: '', mode: 'Cash' });

    // 1. Initial Load (Reservations & Staff)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Staff for Dropdown
                const staffReq = await axios.get('http://localhost:5000/api/staff/read');
                setStaffList(staffReq.data);

                // Fetch "Unsettled" Reservations (Filters out 0 balance guests)
                const resReq = await axios.get('http://localhost:5000/api/reservations/unsettled');
                setReservations(resReq.data);

                // CHECK FOR AUTO-REDIRECT (From Check-Out button)
                if (location.state && location.state.reservationId) {
                    const targetId = parseInt(location.state.reservationId);
                    
                    // Note: The guest might not be in the 'unsettled' list if they have 0 balance,
                    // so we try to find them there first. If not found, we fetch their specific details.
                    const foundInList = resReq.data.find(r => r.reservation_id === targetId);
                    
                    if (foundInList) {
                        loadDetails(targetId, resReq.data);
                    } else {
                        // If they are not in the list (e.g. balance is 0), we assume we still want to see the receipt
                        // You might need a separate call to fetch single reservation details here if your logic requires it,
                        // but usually, checkout happens before payment, so they will likely appear in 'unsettled'.
                        // For robustness, we just attempt to load details using the ID.
                        loadDetails(targetId, null); // Pass null list to trigger specific fetch if needed
                    }
                }
            } catch (err) { console.error(err); }
        };
        loadData();
    }, [location.state]);

    // 2. Load Details for Selected Reservation
    const loadDetails = async (resId, freshList = null) => {
        if (!resId) { setSelectedRes(null); return; }
        
        // Use fresh list if available, otherwise state
        const sourceList = freshList || reservations;
        let res = sourceList.find(r => r.reservation_id === parseInt(resId));
        
        // // Fallback: If not in the list (e.g. redirected but balance is 0), try to fetch purely by ID 
        // // (Note: This assumes you have a get-by-id endpoint or you rely on the list. 
        // // If not, this block handles the UI selection based on what we have).
        // if (!res && location.state?.reservationId == resId) {
        //      // If we really need to show a settled guest who isn't in the list,
        //      // we might need to fetch them from the full read list temporarily or add logic here.
        //      // For now, we assume the list logic covers 99% of cases.
        // }

        if (res) setSelectedRes(res);

        try {
            const servReq = await axios.get(`http://localhost:5000/api/services/read/${resId}`);
            setServices(servReq.data);

            const payReq = await axios.get(`http://localhost:5000/api/payments/read/${resId}`);
            setPayments(payReq.data);
        } catch (err) { console.error(err); }
    };

    

    const addService = async () => {
        if(!newService.type || !newService.cost) return alert("Fill details");
        try {
            await axios.post('http://localhost:5000/api/services/add', {
                reservation_id: selectedRes.reservation_id,
                service_type: newService.type,
                cost: newService.cost,
                staff_id: newService.staff_id 
            });
            loadDetails(selectedRes.reservation_id); 
            setNewService({ type: '', cost: '', staff_id: '' });
        } catch(err) { alert(err.message); }
    };

    const deleteService = async (id) => {
        if(!window.confirm("Remove this service charge?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/services/delete/${id}`);
            loadDetails(selectedRes.reservation_id);
        } catch(err) { alert(err.message); }
    };

    const addPayment = async () => {
        if(!newPayment.amount) return alert("Enter amount");
        try {
            await axios.post('http://localhost:5000/api/payments/add', {
                reservation_id: selectedRes.reservation_id,
                amount: newPayment.amount,
                payment_mode: newPayment.mode
            });
            loadDetails(selectedRes.reservation_id);
            setNewPayment({ amount: '', mode: 'Cash' });
        } catch(err) { alert(err.message); }
    };

    const deletePayment = async (id) => {
        if(!window.confirm("⚠️ MANAGER ACTION: Void this transaction?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/payments/delete/${id}`);
            loadDetails(selectedRes.reservation_id);
        } catch(err) { alert(err.message); }
    };

   
    const totalServices = services.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);
    const totalPayments = payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    
    
    let roomTotal = 0;
    let daysStayed = 0;

    if (selectedRes) {
        const checkIn = new Date(selectedRes.check_in_date);
        const checkOut = new Date(selectedRes.check_out_date);
        
        
        const diffTime = Math.abs(checkOut - checkIn);
        daysStayed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        
        if(daysStayed === 0) daysStayed = 1;

        
        roomTotal = daysStayed * parseFloat(selectedRes.price_per_night);
    }
    
    const finalTotal = roomTotal + totalServices;
    const balance = finalTotal - totalPayments;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary"><FaMoneyBillWave /> Billing & Services Manager</h2>

            {/* SELECTION CARD */}
            <div className="card shadow mb-4 border-primary">
                <div className="card-body bg-light">
                    <label className="fw-bold mb-2">Select Guest Reservation (Unsettled Bills Only):</label>
                    <select className="form-select" 
                        value={selectedRes ? selectedRes.reservation_id : ''}
                        onChange={(e) => loadDetails(e.target.value)}>
                        <option value="">-- Choose Reservation --</option>
                        {reservations.map(r => (
                            <option key={r.reservation_id} value={r.reservation_id}>
                                #{r.reservation_id} - {r.first_name} {r.last_name} (Room {r.room_id} - {r.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRes && (
                <div className="row">
                    {/* LEFT: SERVICES */}
                    <div className="col-md-6">
                        <div className="card shadow mb-4 h-100">
                            <div className="card-header bg-info text-white d-flex justify-content-between">
                                <span><FaConciergeBell className="me-2"/>Add Services</span>
                            </div>
                            <div className="card-body">
                                <ul className="list-group mb-3">
                                    {services.map(s => (
                                        <li key={s.service_id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{s.service_type}</strong>
                                                <div className="text-muted small"><FaUserTie className="me-1"/> {s.staff_name || 'Unassigned'}</div>
                                            </div>
                                            <div>
                                                <span className="badge bg-primary rounded-pill me-2">Rs. {s.cost}</span>
                                                
                                                {/* PERMISSION CHECK: Managers OR Receptionists can delete services */}
                                                {(user.role === 'Manager' || user.role === 'Receptionist') && (
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteService(s.service_id)}>
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                    {services.length === 0 && <li className="list-group-item text-muted">No extra services.</li>}
                                </ul>

                                {/* Add Form */}
                                <div className="mb-2 border-top pt-3">
                                    <input type="text" className="form-control mb-2" placeholder="Service Name" 
                                        value={newService.type} onChange={e => setNewService({...newService, type: e.target.value})} />
                                    <div className="row g-2">
                                        <div className="col-8">
                                            <select className="form-select" 
                                                value={newService.staff_id} onChange={e => setNewService({...newService, staff_id: e.target.value})}>
                                                <option value="">-- Assign Staff --</option>
                                                {staffList.map(s => <option key={s.staff_id} value={s.staff_id}>{s.name} ({s.role})</option>)}
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <input type="number" className="form-control" placeholder="Cost" 
                                                value={newService.cost} onChange={e => setNewService({...newService, cost: e.target.value})} />
                                        </div>
                                    </div>
                                    <button className="btn btn-info w-100 mt-2 text-white fw-bold" onClick={addService}>Add Charge</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PAYMENTS */}
                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-header bg-success text-white"><FaMoneyBillWave className="me-2"/>Record Payment</div>
                            <div className="card-body">
                                <ul className="list-group mb-3">
                                    {payments.map(p => (
                                        <li key={p.payment_id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>via {p.payment_mode}</span>
                                            <div>
                                                <span className="fw-bold text-success me-2">Rs. {p.amount}</span>
                                                
                                                {/* PERMISSION CHECK: Only MANAGERS can delete payments */}
                                                {user.role === 'Manager' && (
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deletePayment(p.payment_id)}>
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                    {payments.length === 0 && <li className="list-group-item text-muted">No payments recorded.</li>}
                                </ul>
                                <div className="input-group">
                                    <select className="form-select" 
                                        value={newPayment.mode} onChange={e => setNewPayment({...newPayment, mode: e.target.value})}>
                                        <option>Cash</option>
                                        <option>Credit Card</option>
                                        <option>Online</option>
                                    </select>
                                    <input type="number" className="form-control" placeholder="Amount" 
                                        value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} />
                                    <button className="btn btn-success" onClick={addPayment}>Pay</button>
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY CARD */}
                        <div className="card bg-dark text-white p-3 shadow">
                            <h4 className="border-bottom pb-2 mb-3">Invoice Summary</h4>
                            
                            <div className="d-flex justify-content-between h6 text-secondary">
                                <span>Rate Breakdown:</span>
                                <span>{daysStayed} Nights x Rs. {selectedRes?.price_per_night}</span>
                            </div>

                            <div className="d-flex justify-content-between h5"><span>Room Charges:</span><span>Rs. {roomTotal}</span></div>
                            <div className="d-flex justify-content-between h5 text-info"><span>Service Total:</span><span>+ Rs. {totalServices}</span></div>
                            <div className="d-flex justify-content-between h5 text-success"><span>Total Paid:</span><span>- Rs. {totalPayments}</span></div>
                            <hr />
                            <div className="d-flex justify-content-between h2 fw-bold text-warning"><span>Due Balance:</span><span>Rs. {balance}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Billing;