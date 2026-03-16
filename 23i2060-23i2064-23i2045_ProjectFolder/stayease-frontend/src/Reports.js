import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChartLine, FaMoneyCheckAlt, FaBed, FaListAlt, FaCircle } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function Reports() {
    const { user } = useAuth();
    
    
    const [revenue, setRevenue] = useState({ roomRevenue: 0, serviceRevenue: 0 });
    const [roomStats, setRoomStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    
    
    const [masterReport, setMasterReport] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const revRes = await axios.get('http://localhost:5000/api/reports/revenue');
            setRevenue(revRes.data);

            const roomRes = await axios.get('http://localhost:5000/api/reports/room-stats');
            setRoomStats(roomRes.data);

            const monthRes = await axios.get('http://localhost:5000/api/reports/monthly');
            setMonthlyStats(monthRes.data);

            const masterRes = await axios.get('http://localhost:5000/api/reports/operational');
            setMasterReport(masterRes.data);
        } catch (err) { console.error(err); }
    };

    if (user.role !== 'Manager') return <div className="alert alert-danger m-5">⛔ Authorized Personnel Only</div>;

    const totalRevenue = revenue.roomRevenue + revenue.serviceRevenue;
    const roomPct = totalRevenue ? (revenue.roomRevenue / totalRevenue) * 100 : 0;
    const servPct = totalRevenue ? (revenue.serviceRevenue / totalRevenue) * 100 : 0;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary"><FaChartLine /> Manager Analytics & Reports</h2>

            {/* 1. TOP ROW: FINANCIALS & POPULARITY */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-success text-white">
                            <FaMoneyCheckAlt className="me-2"/> Revenue Breakdown
                        </div>
                        <div className="card-body">
                            <h3 className="text-center fw-bold text-success mb-4">Total: Rs. {totalRevenue.toLocaleString()}</h3>
                            <label className="small fw-bold">Room Bookings</label>
                            <div className="progress mb-3" style={{height: '20px'}}>
                                <div className="progress-bar bg-primary" style={{width: `${roomPct}%`}}>{Math.round(roomPct)}%</div>
                            </div>
                            <label className="small fw-bold">Services/Extras</label>
                            <div className="progress mb-3" style={{height: '20px'}}>
                                <div className="progress-bar bg-info" style={{width: `${servPct}%`}}>{Math.round(servPct)}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-warning text-dark">
                            <FaBed className="me-2"/> Popular Room Types
                        </div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <thead><tr><th>Room Type</th><th>Bookings</th><th>Trend</th></tr></thead>
                                <tbody>
                                    {roomStats.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.type_name}</td>
                                            <td className="fw-bold">{item.booking_count}</td>
                                            <td>
                                                <div className="progress" style={{height: '10px'}}>
                                                    <div className="progress-bar bg-warning" style={{width: `${(item.booking_count / (roomStats[0]?.booking_count || 1)) * 100}%`}}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MASTER OPERATIONAL REPORT (New Feature) */}
            <div className="card shadow mb-5">
                <div className="card-header bg-dark text-white">
                    <FaListAlt className="me-2"/> Live Operations & Payment Status
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Room</th>
                                    <th>Type</th>
                                    <th>Room Status</th>
                                    <th>Current Guest</th>
                                    <th>Reservation Status</th>
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {masterReport.map(row => (
                                    <tr key={row.room_id}>
                                        <td className="fw-bold">{row.room_id}</td>
                                        <td className="small">{row.type_name}</td>
                                        
                                        {/* Room Status Badge */}
                                        <td>
                                            {row.room_status === 'Available' && <span className="badge bg-success">Free</span>}
                                            {row.room_status === 'Occupied' && <span className="badge bg-danger">Occupied</span>}
                                            {row.room_status === 'Cleaning' && <span className="badge bg-warning text-dark">Cleaning</span>}
                                            {row.room_status === 'Maintenance' && <span className="badge bg-secondary">Maint.</span>}
                                        </td>

                                        {/* Guest Info */}
                                        <td>
                                            {row.first_name ? (
                                                <span className="fw-bold text-primary">{row.first_name} {row.last_name}</span>
                                            ) : (
                                                <span className="text-muted small">-</span>
                                            )}
                                        </td>

                                        {/* Reservation Status */}
                                        <td>
                                            {row.res_status ? (
                                                <span className="small">{row.res_status}</span>
                                            ) : (
                                                <span className="text-muted small">-</span>
                                            )}
                                        </td>

                                        {/* Payment Status (The Traffic Light) */}
                                        <td>
                                            {!row.reservation_id ? (
                                                <span className="text-muted small">-</span>
                                            ) : (
                                                <>
                                                    {row.balance > 0 && <span className="text-danger fw-bold"><FaCircle size={10}/> {row.paymentStatus}</span>}
                                                    {row.balance === 0 && <span className="text-success fw-bold"><FaCircle size={10}/> Settled</span>}
                                                    {row.balance < 0 && <span className="text-warning fw-bold text-dark"><FaCircle size={10}/> Overpaid</span>}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Reports;