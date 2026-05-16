import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import API from '../api';
import { FiHeart, FiVideo, FiShield, FiSmartphone, FiArrowRight, FiActivity, FiUsers, FiGlobe } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const features = [
  { icon: FiVideo, title: 'Video Consultations', desc: 'Connect patients with city doctors via secure HD video calls in real-time.', color: 'bg-blue-500' },
  { icon: FiActivity, title: 'Vital Monitoring', desc: 'Record and track patient vitals — BP, temperature, sugar, pulse and more.', color: 'bg-accent-400' },
  { icon: FiShield, title: 'Secure Records', desc: 'Military-grade encryption for all medical data with role-based access.', color: 'bg-purple-500' },
  { icon: FiSmartphone, title: 'Remote Access', desc: 'Works on any device. Designed for low-bandwidth rural connectivity.', color: 'bg-orange-500' },
];

const steps = [
  { num: '01', title: 'Nurse Visits Patient', desc: 'Lady Health Worker visits the patient in a remote area' },
  { num: '02', title: 'Collect Medical Data', desc: 'Records vitals, symptoms, and uploads medical reports' },
  { num: '03', title: 'Doctor Consultation', desc: 'City doctor reviews data and starts video consultation' },
  { num: '04', title: 'E-Prescription & Delivery', desc: 'Doctor prescribes medicine, pharmacy delivers to doorstep' },
];

export default function Landing() {
  const [liveStats, setLiveStats] = useState({
    patientsServed: 0,
    doctorsOnline: 0,
    remoteAreas: 0,
    patientsToday: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats');
        setLiveStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsDisplay = [
    { value: liveStats.patientsServed.toLocaleString() + '+', label: 'Patients Served', icon: FiUsers },
    { value: liveStats.doctorsOnline.toLocaleString() + '+', label: 'Doctors Online', icon: FiHeart },
    { value: liveStats.remoteAreas.toLocaleString() + '+', label: 'Remote Areas', icon: FiGlobe },
    { value: '99.9%', label: 'Uptime', icon: FiShield },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-400 rounded-xl flex items-center justify-center">
              <FiHeart className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-primary-500">TeleHealth</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm py-2">Log In</Link>
            <Link to="/register" className="btn-accent text-sm py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('/bg-rural.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-medical-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-medical-purple/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-accent-400/10 border border-accent-400/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                <span className="text-accent-400 text-sm font-medium">Healthcare for Everyone</span>
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Bringing <span className="text-accent-400">Healthcare</span> to Remote Areas
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-300 mb-8 max-w-lg">
                A telecommunication-based platform connecting rural patients with city doctors through Lady Health Workers. Quality healthcare, no matter the distance.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-accent text-base px-8 py-3 flex items-center gap-2">
                  Start Now <FiArrowRight />
                </Link>
                <a href="#how-it-works" className="btn-ghost text-white border border-white/20 hover:bg-white/10 text-base px-8 py-3">
                  Learn More
                </a>
              </motion.div>
            </motion.div>

            {/* Hero illustration */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <div className="relative">
                <div className="w-full aspect-square bg-gradient-to-br from-accent-400/20 to-medical-blue/20 rounded-3xl border border-white/10 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { icon: '🩺', label: 'Diagnostics', val: 'Real-time' },
                      { icon: '💊', label: 'Prescriptions', val: 'Digital' },
                      { icon: '📹', label: 'Video Call', val: 'HD Quality' },
                      { icon: '🚚', label: 'Delivery', val: 'Tracked' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                        className="glass-dark rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default"
                      >
                        <span className="text-3xl mb-2 block">{item.icon}</span>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-accent-400 text-xs mt-1">{item.val}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Floating badges */}
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-sm font-bold text-primary-500">🟢 Live Now</p>
                  <p className="text-xs text-gray-500">{liveStats.doctorsOnline} Doctors Online</p>
                </motion.div>
                <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-sm font-bold text-accent-500">✅ Today</p>
                  <p className="text-xs text-gray-500">{liveStats.patientsToday} Patients Treated</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsDisplay.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="text-accent-500 text-2xl" />
                </div>
                <p className="text-3xl font-extrabold text-primary-500">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-extrabold text-primary-500 mb-4">
              Powerful Features
            </motion.h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to deliver quality healthcare to patients in remote and underserved areas.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card group cursor-default">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-primary-500 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-extrabold text-primary-500 mb-4">
              How It Works
            </motion.h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A seamless workflow from patient visit to medicine delivery.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                <div className="text-6xl font-extrabold text-accent-400/10 mb-2">{s.num}</div>
                <h3 className="font-bold text-primary-500 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-accent-400/30">
                    <FiArrowRight className="text-2xl" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('/bg-rural.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-extrabold text-white mb-6">
            Ready to Transform Healthcare?
          </motion.h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Join our platform and help bridge the healthcare gap for millions in remote areas.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-accent text-base px-10 py-3.5">Create Account</Link>
            <Link to="/login" className="text-white border border-white/20 hover:bg-white/10 px-10 py-3.5 rounded-xl font-medium transition-all">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center">
                <FiHeart className="text-white text-sm" />
              </div>
              <span className="text-white font-bold">TeleHealth</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 TeleHealth System. Final Year Project — Telecommunication-Based Healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
