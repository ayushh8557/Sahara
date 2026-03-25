import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patientReports, setPatientReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [prescForm, setPrescForm] = useState({
        patientId: '', reportId: '', diagnosis: '', notes: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    });

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API}/appointments/my`, { headers });
            setAppointments(res.data);
        } catch { toast.error('Failed to fetch appointments'); }
    };

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API}/reports/patients`, { headers });
            setPatients(res.data);
        } catch { toast.error('Failed to fetch patients'); }
    };

    const fetchPrescriptions = async () => {
        try {
            const res = await axios.get(`${API}/prescriptions/doctor`, { headers });
            setPrescriptions(res.data);
        } catch { toast.error('Failed to fetch prescriptions'); }
    };

    const fetchPatientReports = async (patientId) => {
        try {
            const res = await axios.get(`${API}/reports/patient/${patientId}`, { headers });
            setPatientReports(res.data);
        } catch { setPatientReports([]); }
    };

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
        fetchPrescriptions();
    }, []);

    const handlePatientSelect = (id) => {
        setSelectedPatient(id);
        if (id) fetchPatientReports(id);
        else setPatientReports([]);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`${API}/appointments/${id}/status`, { status }, { headers });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch { toast.error('Failed to update'); }
    };

    const addMedicine = () => {
        setPrescForm({ ...prescForm, medicines: [...prescForm.medicines, { name: '', dosage: '', duration: '', instructions: '' }] });
    };

    const removeMedicine = (idx) => {
        const updated = prescForm.medicines.filter((_, i) => i !== idx);
        setPrescForm({ ...prescForm, medicines: updated });
    };

    const updateMedicine = (idx, field, value) => {
        const updated = [...prescForm.medicines];
        updated[idx][field] = value;
        setPrescForm({ ...prescForm, medicines: updated });
    };

    const handleCreatePrescription = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/prescriptions`, {
                patientId: prescForm.patientId,
                reportId: prescForm.reportId || undefined,
                diagnosis: prescForm.diagnosis,
                medicines: prescForm.medicines,
                notes: prescForm.notes,
            }, { headers });
            toast.success('Prescription created!');
            setPrescForm({ patientId: '', reportId: '', diagnosis: '', notes: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }] });
            fetchPrescriptions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create prescription');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const statusBadge = (s) => {
        const c = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-700'}`}>{s}</span>;
    };

    const tabs = [
        { key: 'appointments', label: '📅 Appointments' },
        { key: 'reports', label: '📋 Patient Reports' },
        { key: 'prescribe', label: '💊 Write Prescription' },
        { key: 'myprescriptions', label: '📝 My Prescriptions' },
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <p className="text-xs text-gray-400">Sahara Healthcare — Patient Care</p>
                </div>
                <button onClick={logout} className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">Logout</button>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? 'bg-[#5BA4E6] text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Appointments */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Patient</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Time</th>
                                    <th className="px-6 py-3 text-left">Reason</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((a) => (
                                    <tr key={a._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{a.patient?.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-500">{a.timeSlot}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[150px] truncate">{a.reason || '—'}</td>
                                        <td className="px-6 py-4">{statusBadge(a.status)}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            {a.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(a._id, 'confirmed')} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">Confirm</button>
                                                    <button onClick={() => handleStatusUpdate(a._id, 'cancelled')} className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium">Cancel</button>
                                                </>
                                            )}
                                            {a.status === 'confirmed' && (
                                                <button onClick={() => handleStatusUpdate(a._id, 'completed')} className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">Complete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No appointments yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Patient Reports */}
                {activeTab === 'reports' && (
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent bg-white"
                                value={selectedPatient}
                                onChange={(e) => handlePatientSelect(e.target.value)}
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                ))}
                            </select>
                        </div>

                        {selectedPatient && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Type</th>
                                            <th className="px-6 py-3 text-left">Uploaded By</th>
                                            <th className="px-6 py-3 text-left">Notes</th>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">File</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {patientReports.map((r) => (
                                            <tr key={r._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{r.reportType}</span></td>
                                                <td className="px-6 py-4 text-gray-500">{r.uploadedBy?.name}</td>
                                                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.notes || '—'}</td>
                                                <td className="px-6 py-4 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <a href={`http://localhost:5000/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-[#5BA4E6] hover:underline text-sm font-medium">View</a>
                                                </td>
                                            </tr>
                                        ))}
                                        {patientReports.length === 0 && (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No reports for this patient</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Write Prescription */}
                {activeTab === 'prescribe' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">Write Prescription</h3>
                        <form className="space-y-4" onSubmit={handleCreatePrescription}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent bg-white"
                                        value={prescForm.patientId}
                                        onChange={(e) => {
                                            setPrescForm({ ...prescForm, patientId: e.target.value, reportId: '' });
                                            if (e.target.value) fetchPatientReports(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked Report (optional)</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent bg-white"
                                        value={prescForm.reportId}
                                        onChange={(e) => setPrescForm({ ...prescForm, reportId: e.target.value })}
                                    >
                                        <option value="">None</option>
                                        {patientReports.map((r) => <option key={r._id} value={r._id}>{r.reportType} — {new Date(r.createdAt).toLocaleDateString()}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent"
                                    placeholder="e.g. Upper Respiratory Tract Infection"
                                    value={prescForm.diagnosis}
                                    onChange={(e) => setPrescForm({ ...prescForm, diagnosis: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Medicines */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Medicines</label>
                                    <button type="button" onClick={addMedicine} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">+ Add Medicine</button>
                                </div>
                                {prescForm.medicines.map((med, idx) => (
                                    <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded-lg">
                                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6]" placeholder="Medicine" value={med.name} onChange={(e) => updateMedicine(idx, 'name', e.target.value)} required />
                                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6]" placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} required />
                                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6]" placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} required />
                                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6]" placeholder="Instructions" value={med.instructions} onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)} />
                                        {prescForm.medicines.length > 1 && (
                                            <button type="button" onClick={() => removeMedicine(idx)} className="text-red-500 hover:text-red-700 text-sm font-medium">✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Additional instructions for the patient..."
                                    value={prescForm.notes}
                                    onChange={(e) => setPrescForm({ ...prescForm, notes: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-[#5BA4E6] text-white font-medium rounded-lg hover:bg-[#4a93d5] transition">
                                Create Prescription
                            </button>
                        </form>
                    </div>
                )}

                {/* My Prescriptions */}
                {activeTab === 'myprescriptions' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Patient</th>
                                    <th className="px-6 py-3 text-left">Diagnosis</th>
                                    <th className="px-6 py-3 text-left">Medicines</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {prescriptions.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{p.patient?.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{p.diagnosis}</td>
                                        <td className="px-6 py-4 text-gray-500">{p.medicines.map(m => m.name).join(', ')}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {prescriptions.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No prescriptions written yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
