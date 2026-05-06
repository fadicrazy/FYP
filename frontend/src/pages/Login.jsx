import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center"><FiHeart className="text-white text-2xl" /></div>
            <span className="text-2xl font-bold text-white">TeleHealth</span>
          </Link>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { role: 'Admin', email: 'admin@telehealth.com' },
              { role: 'Doctor', email: 'doctor@telehealth.com' },
              { role: 'Nurse', email: 'nurse@telehealth.com' },
              { role: 'Pharmacy', email: 'pharmacy@telehealth.com' },
            ].map((acc) => (
              <button key={acc.email} type="button" onClick={() => { setEmail(acc.email); setPassword('password123'); }} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-gray-300 mr-2">
                {acc.role}
              </button>
            ))}
            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field pl-11" placeholder="you@email.com" required />
              </div>
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" required />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPw?<FiEyeOff/>:<FiEye/>}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-accent w-full py-3">
              {loading?<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"/>:'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">No account? <Link to="/register" className="text-accent-400 font-medium hover:underline">Register</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
