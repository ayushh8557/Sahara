import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            switch (role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'doctor':
                    navigate('/doctor');
                    break;
                case 'lab':
                    navigate('/lab');
                    break;
                case 'patient':
                    navigate('/patient');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                fontFamily: "'Poppins', sans-serif",
                background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #f0f7ff 70%, #e3f0fc 100%)'
            }}
        >
            <div className="w-full max-w-md">
                {/* Brand Header with Logo */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Sahara Healthcare"
                        className="mx-auto mb-4 h-32 w-auto object-contain"
                        style={{ opacity: 0.9 }}
                    />
                    <p
                        className="text-sm mt-1 font-medium"
                        style={{ color: '#5BA4E6', fontFamily: "'Poppins', sans-serif" }}
                    >
                        Digital Care Platform
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="bg-white rounded-lg shadow-lg p-8"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    <h2
                        className="text-2xl font-semibold text-center mb-6"
                        style={{ color: '#5BA4E6', fontFamily: "'Poppins', sans-serif" }}
                    >
                        Login
                    </h2>

                    {error && (
                        <div
                            className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded border border-red-200"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    '--tw-ring-color': '#5BA4E6'
                                }}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    '--tw-ring-color': '#5BA4E6'
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                backgroundColor: '#5BA4E6',
                                '--tw-ring-color': '#5BA4E6'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4a93d5'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#5BA4E6'}
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span
                            className="text-sm text-gray-500"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Don't have an account?{' '}
                        </span>
                        <Link
                            to="/register"
                            className="text-sm font-medium underline"
                            style={{
                                color: '#5BA4E6',
                                fontFamily: "'Poppins', sans-serif"
                            }}
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p
                    className="text-center text-xs text-gray-400 mt-6"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    © 2026 Sahara Healthcare. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
