import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiUser, FiPhone, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

const roles = [
  { value: 'nurse', label: 'Nurse/LHW', emoji: '👩‍⚕️' },
  { value: 'doctor', label: 'Doctor', emoji: '👨‍⚕️' },
  { value: 'pharmacy', label: 'Pharmacy', emoji: '💊' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'nurse', phone: '', specialization: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validation Logic
  const validations = {
    length: form.password.length >= 8,
    firstLetterCap: /^[A-Z]/.test(form.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch { 
      /* handled */ 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center">
              <FiHeart className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-white">TeleHealth</span>
          </Link>
          <p className="text-gray-400">Create your account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="input-label">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button 
                    key={r.value} 
                    type="button" 
                    onClick={() => setForm({...form, role: r.value})}
                    className={`p-3 rounded-xl text-center transition-all border-2 ${form.role===r.value ? 'border-accent-400 bg-accent-400/10' : 'border-white/10 hover:border-white/20 text-gray-400'}`}
                  >
                    <span className="text-xl block">{r.emoji}</span>
                    <span className="text-[10px] font-medium mt-1 block uppercase tracking-wider">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.name} onChange={set('name')} className="input-field pl-11" placeholder="John Doe" required />
                </div>
              </div>
              <div>
                <label className="input-label">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.phone} onChange={set('phone')} className="input-field pl-11" placeholder="+92..." />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={set('email')} className="input-field pl-11" placeholder="you@email.com" required />
              </div>
            </div>

            {/* Password with Pop-over Validation */}
            <div className="relative">
              <label className="input-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={set('password')} 
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`input-field pl-11 pr-11 transition-all ${
                    form.password.length > 0 && !isPasswordValid ? 'border-red-500/50' : ''
                  }`} 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <AnimatePresence>
                {isFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 left-0 right-0 mt-2 p-4 glass-dark rounded-xl border border-white/10 shadow-2xl"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-bold">Secure Password Rules</p>
                    <div className="space-y-2">
                      <ValidationRule isMet={validations.length} label="8+ Characters" />
                      <ValidationRule isMet={validations.firstLetterCap} label="Starts with Capital Letter" />
                      <ValidationRule isMet={validations.hasSymbol} label="Includes a Symbol (@, #, !)" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {form.role === 'doctor' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="input-label">Specialization</label>
                <input type="text" value={form.specialization} onChange={set('specialization')} className="input-field" placeholder="e.g. General Physician" />
              </motion.div>
            )}

            {form.role === 'nurse' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="input-label">Assigned Area</label>
                <input type="text" value={form.area} onChange={set('area')} className="input-field" placeholder="e.g. Village Khanpur" />
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading || (form.password.length > 0 && !isPasswordValid)} 
              className={`btn-accent w-full py-3 mt-4 transition-all ${(!isPasswordValid && form.password.length > 0) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"/> : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Already registered? <Link to="/login" className="text-accent-400 font-medium hover:underline">Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  );
}

function ValidationRule({ isMet, label }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${isMet ? 'text-green-400 translate-x-1' : 'text-gray-500'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isMet ? 'bg-green-400/20 border-green-400' : 'border-gray-600'}`}>
        {isMet ? <FiCheck size={10} /> : <FiX size={10} />}
      </div>
      <span>{label}</span>
    </div>
  );
}