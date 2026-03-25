import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('reports');
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [booking, setBooking] = useState(false);
    const [apptForm, setApptForm] = useState({ doctorId: '', date: '', timeSlot: '', reason: '' });
    const [expandedPresc, setExpandedPresc] = useState(null);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${API}/reports/my-reports`, { headers });
            setReports(res.data);
        } catch { toast.error('Failed to fetch reports'); }
    };

    const fetchPrescriptions = async () => {
        try {
            const res = await axios.get(`${API}/prescriptions/patient`, { headers });
            setPrescriptions(res.data);
        } catch { toast.error('Failed to fetch prescriptions'); }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API}/appointments/my`, { headers });
            setAppointments(res.data);
        } catch { toast.error('Failed to fetch appointments'); }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API}/appointments/doctors`, { headers });
            setDoctors(res.data);
        } catch { toast.error('Failed to fetch doctors'); }
    };

    useEffect(() => {
        fetchReports();
        fetchPrescriptions();
        fetchAppointments();
        fetchDoctors();
    }, []);

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setBooking(true);
        try {
            await axios.post(`${API}/appointments`, apptForm, { headers });
            toast.success('Appointment booked successfully!');
            setApptForm({ doctorId: '', date: '', timeSlot: '', reason: '' });
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
        setBooking(false);
    };

    const downloadPdf = async (id) => {
        try {
            const res = await axios.get(
                `${API}/prescriptions/${id}/pdf`,
                {
                    headers,
                    responseType: "blob",
                }
            );

            // 🔥 Extract filename from backend header
            const contentDisposition = res.headers["content-disposition"];

            let filename = `prescription_${id}.pdf`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("PDF downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to download PDF");
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

    const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

    const tabs = [
        { key: 'reports', label: '📋 My Reports' },
        { key: 'prescriptions', label: '💊 My Prescriptions' },
        { key: 'book', label: '📅 Book Appointment' },
        { key: 'appointments', label: '🗓 My Appointments' },
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Patient Dashboard</h1>
                    <p className="text-xs text-gray-400">Sahara Healthcare — Your Health Hub</p>
                </div>
                <button onClick={logout} className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">Logout</button>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Reports', count: reports.length, color: '#8b5cf6', bg: 'bg-purple-50' },
                        { label: 'Prescriptions', count: prescriptions.length, color: '#5BA4E6', bg: 'bg-blue-50' },
                        { label: 'Appointments', count: appointments.length, color: '#10b981', bg: 'bg-green-50' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-6 shadow-sm`}>
                            <p className="text-sm font-medium text-gray-500">{s.label}</p>
                            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.count}</p>
                        </div>
                    ))}
                </div>

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

                {/* My Reports */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Report Type</th>
                                    <th className="px-6 py-3 text-left">Uploaded By</th>
                                    <th className="px-6 py-3 text-left">Notes</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{r.reportType}</span></td>
                                        <td className="px-6 py-4 text-gray-500">{r.uploadedBy?.name}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.notes || '—'}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <a href={`http://localhost:5000/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-[#5BA4E6] hover:underline font-medium text-sm">Download</a>
                                        </td>
                                    </tr>
                                ))}
                                {reports.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No reports available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* My Prescriptions */}
                {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                        {prescriptions.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">No prescriptions available</div>
                        )}
                        {prescriptions.map((p) => (
                            <div key={p._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div
                                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setExpandedPresc(expandedPresc === p._id ? null : p._id)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{p.diagnosis}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Dr. {p.doctor?.name} • {new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); downloadPdf(p._id); }}
                                            className="px-4 py-1.5 text-xs bg-[#5BA4E6] text-white rounded-lg hover:bg-[#4a93d5] transition font-medium"
                                        >
                                            📥 Download PDF
                                        </button>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedPresc === p._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {expandedPresc === p._id && (
                                    <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Prescribed Medicines</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Medicine</th>
                                                        <th className="px-4 py-2 text-left">Dosage</th>
                                                        <th className="px-4 py-2 text-left">Duration</th>
                                                        <th className="px-4 py-2 text-left">Instructions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {p.medicines.map((m, i) => (
                                                        <tr key={i}>
                                                            <td className="px-4 py-2 font-medium text-gray-800">{m.name}</td>
                                                            <td className="px-4 py-2 text-gray-500">{m.dosage}</td>
                                                            <td className="px-4 py-2 text-gray-500">{m.duration}</td>
                                                            <td className="px-4 py-2 text-gray-500">{m.instructions || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {p.notes && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                                                <span className="font-medium">Notes: </span>{p.notes}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Book Appointment */}
                {activeTab === 'book' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">Book an Appointment</h3>
                        <form className="space-y-4" onSubmit={handleBookAppointment}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent bg-white"
                                    value={apptForm.doctorId}
                                    onChange={(e) => setApptForm({ ...apptForm, doctorId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map((d) => (
                                        <option key={d._id} value={d._id}>Dr. {d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent"
                                    value={apptForm.date}
                                    onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent bg-white"
                                    value={apptForm.timeSlot}
                                    onChange={(e) => setApptForm({ ...apptForm, timeSlot: e.target.value })}
                                    required
                                >
                                    <option value="">Select a time...</option>
                                    {timeSlots.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Describe your symptoms or reason for visit..."
                                    value={apptForm.reason}
                                    onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={booking}
                                className="w-full py-2.5 bg-[#5BA4E6] text-white font-medium rounded-lg hover:bg-[#4a93d5] transition disabled:opacity-50"
                            >
                                {booking ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </form>
                    </div>
                )}

                {/* My Appointments */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Doctor</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Time</th>
                                    <th className="px-6 py-3 text-left">Reason</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((a) => (
                                    <tr key={a._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">Dr. {a.doctor?.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-500">{a.timeSlot}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{a.reason || '—'}</td>
                                        <td className="px-6 py-4">{statusBadge(a.status)}</td>
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No appointments yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
