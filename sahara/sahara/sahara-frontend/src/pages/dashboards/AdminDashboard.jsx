import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [creating, setCreating] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/admin/users`, { headers });
            setUsers(res.data);
        } catch {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreate = async (role) => {
        setCreating(role);
        try {
            const endpoint = role === 'doctor' ? 'create-doctor' : 'create-lab';
            await axios.post(`${API}/admin/${endpoint}`, form, { headers });
            toast.success(`${role === 'doctor' ? 'Doctor' : 'Lab Technician'} created successfully!`);
            setForm({ name: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Creation failed');
        }
        setCreating('');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const stats = {
        patients: users.filter(u => u.role === 'patient').length,
        doctors: users.filter(u => u.role === 'doctor').length,
        labs: users.filter(u => u.role === 'lab').length,
    };

    const roleBadge = (role) => {
        const colors = { admin: 'bg-red-100 text-red-700', doctor: 'bg-blue-100 text-blue-700', lab: 'bg-purple-100 text-purple-700', patient: 'bg-green-100 text-green-700' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-xs text-gray-400">Sahara Healthcare Management</p>
                </div>
                <button onClick={logout} className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                    Logout
                </button>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Patients', count: stats.patients, color: '#10b981', bg: 'bg-green-50' },
                        { label: 'Doctors', count: stats.doctors, color: '#5BA4E6', bg: 'bg-blue-50' },
                        { label: 'Lab Techs', count: stats.labs, color: '#8b5cf6', bg: 'bg-purple-50' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-6 shadow-sm`}>
                            <p className="text-sm font-medium text-gray-500">{s.label}</p>
                            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.count}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['users', 'create'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-[#5BA4E6] text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {tab === 'users' ? '👥 All Users' : '➕ Create User'}
                        </button>
                    ))}
                </div>

                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Role</th>
                                    <th className="px-6 py-3 text-left">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">{roleBadge(u.role)}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['doctor', 'lab'].map((role) => (
                            <div key={role} className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    {role === 'doctor' ? '🩺 Create Doctor' : '🔬 Create Lab Technician'}
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BA4E6] focus:border-transparent"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                    <button
                                        onClick={() => handleCreate(role)}
                                        disabled={creating === role}
                                        className="w-full py-2.5 text-white font-medium rounded-lg transition disabled:opacity-50"
                                        style={{ backgroundColor: role === 'doctor' ? '#5BA4E6' : '#8b5cf6' }}
                                    >
                                        {creating === role ? 'Creating...' : `Create ${role === 'doctor' ? 'Doctor' : 'Lab Tech'}`}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
