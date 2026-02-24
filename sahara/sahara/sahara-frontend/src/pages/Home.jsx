import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import doctorBg from '../assets/doctor.jpg';

const Home = () => {
    const navigate = useNavigate();
    const fadeRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );
        fadeRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const addFadeRef = (el) => {
        if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
    };

    const features = [
        {
            title: 'Smart Appointment Booking',
            description:
                'Schedule appointments with doctors seamlessly. Get reminders and manage your healthcare calendar effortlessly.',
            icon: (
                <svg className="w-10 h-10 text-[#5ba3f8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            title: 'Digital Prescriptions',
            description:
                'Access your prescriptions digitally. No more paper hassles — everything stored securely in one place.',
            icon: (
                <svg className="w-10 h-10 text-[#5ba3f8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            title: 'Integrated Lab Reports',
            description:
                'View and share lab reports instantly. Seamless integration between labs, doctors, and patients.',
            icon: (
                <svg className="w-10 h-10 text-[#5ba3f8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Navbar />

            {/* ── Hero Section ── */}
            <section
                id="hero"
                className="relative h-screen pt-40 pb-20 px-6 overflow-hidden"
                ref={addFadeRef}
            >
                {/* Background image — full screen below navbar */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{ backgroundImage: `url(${doctorBg})` }}
                />
                {/* Light overlay for readability */}
                <div className="absolute inset-0 bg-white/40" />
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 12rem)' }}>
                    <div ref={addFadeRef} className="fade-in-section">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Digital Healthcare,{' '}
                            <span className="text-[#5ba3f8]">Simplified.</span>
                        </h1>
                        <p className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                            A modern care platform built for Patients, Doctors, and Labs — making every step of
                            your medical journey seamless and secure.
                        </p>
                        <div className="flex gap-5 mt-10 justify-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3.5 bg-[#5ba3f8] hover:bg-[#4a8fe0] text-white font-medium rounded-lg shadow transition-all duration-200"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-3.5 border border-[#5ba3f8] text-[#5ba3f8] hover:bg-[#5ba3f8]/10 font-medium rounded-lg transition-all duration-200"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About Section ── */}
            <section id="about" className="py-20 px-6 bg-gray-50">
                <div
                    ref={addFadeRef}
                    className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center fade-in-section"
                >
                    {/* Image left */}
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                            alt="Doctor holding stethoscope"
                            className="w-full h-80 object-cover"
                        />
                    </div>

                    {/* Text right */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            About <span className="text-[#5ba3f8]">Sahara</span>
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            Sahara is a comprehensive healthcare platform that bridges the gap between patients, doctors,
                            and diagnostic labs. We believe that quality healthcare should be accessible, transparent, and
                            effortless.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Our mission is to digitize every touchpoint in the patient journey — from booking an
                            appointment and receiving a digital prescription to viewing lab results — all in one secure
                            platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Services Section ── */}
            <section
                id="services"
                className="relative py-24 px-6"
            >
                {/* Background image + overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1551190822-a9ce113ac100?auto=format&fit=crop&w=1600&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-gray-900/75" />

                <div ref={addFadeRef} className="relative z-10 max-w-6xl mx-auto text-center fade-in-section">
                    <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
                    <p className="text-gray-300 mb-14 max-w-2xl mx-auto">
                        A complete digital healthcare ecosystem designed to make your medical journey seamless.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/95 backdrop-blur rounded-2xl p-7 text-left shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-20 px-6 bg-white">
                <div
                    ref={addFadeRef}
                    className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center fade-in-section"
                >
                    {/* Image left */}
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80"
                            alt="Doctor consulting patient"
                            className="w-full h-80 object-cover"
                        />
                    </div>

                    {/* Text right */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            Join thousands of patients, doctors, and labs already using Sahara to streamline consultations,
                            prescriptions, and diagnostics — all from one platform.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-8 py-3 bg-[#5ba3f8] hover:bg-[#4a8fe0] text-white font-medium rounded-lg shadow transition-all duration-200"
                        >
                            Sign Up Now
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-50 py-8 px-6">
                <p className="text-center text-xs text-gray-400">
                    © 2026 Sahara Healthcare. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
