import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeRole, setActiveRole] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validations = {
    length: password.length >= 8,
    firstLetterCap: /^[A-Z]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      /* error handling */
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { name: 'Admin', icon: '🔑', email: 'admin@telehealth.com', password: 'Password123!' },
    { name: 'Doctor', icon: '👨‍⚕️', email: 'doctor@telehealth.com', password: 'Password123!' },
    { name: 'Nurse', icon: '👩‍⚕️', email: 'nurse@telehealth.com', password: 'Password123!' },
    { name: 'Pharmacy', icon: '💊', email: 'pharmacy@telehealth.com', password: 'Password123!' }
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(10, 37, 64, 0.82), rgba(5, 19, 34, 0.96)), url('/bg-rural.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dynamic Aesthetic Backdrop Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-medical-blue/20 rounded-full blur-3xl animate-float pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding & Tagline Header (Mockup 4 specifications) */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-2 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-400/20">
              <FiHeart className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">TeleHealth</span>
          </Link>
          <p className="text-accent-300 font-extrabold text-sm tracking-wide mt-1">
            "Bringing Healthcare to Every Corner"
          </p>
          <div className="w-24 h-px bg-white/20 mx-auto my-3" />
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400/90">
            Remote Area Healthcare Platform
          </p>
        </div>

        {/* High-Readability Dark Glassmorphism Card (Mockup 3 specifications) */}
        <div className="bg-[#0b1e36]/85 backdrop-blur-[16px] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.01] to-white/[0.03] pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Interactive Role Tabs (Mockup 1 & 2 specifications) */}
            <div>
              <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-2 block">
                Quick Role Preset Select
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => {
                  const isActive = email === preset.email;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setEmail(preset.email);
                        setPassword(preset.password);
                        setActiveRole(preset.name);
                        toast.dismiss();
                      }}
                      className={`flex items-center justify-center gap-2 text-xs py-2.5 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-white font-black border-accent-400 shadow-md shadow-accent-500/25 scale-[1.02]'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm shrink-0">{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Input Field */}
            <div>
              <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Match preset
                    const found = presets.find(p => p.email === e.target.value);
                    setActiveRole(found ? found.name : '');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm focus:shadow-[0_0_12px_rgba(46,204,113,0.15)]"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input Field with validations */}
            <div className="relative">
              <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                Security Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full bg-white/5 border rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm focus:shadow-[0_0_12px_rgba(46,204,113,0.15)] ${
                    password.length > 0 && !isPasswordValid ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Password Requirement pop-over */}
              <AnimatePresence>
                {isFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 left-0 right-0 mt-2.5 p-4 bg-slate-950/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl space-y-2"
                  >
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1 font-bold">
                      Password Requirements
                    </p>
                    <div className="space-y-1.5">
                      <ValidationRule isMet={validations.length} label="8+ Characters Required" />
                      <ValidationRule isMet={validations.firstLetterCap} label="Starts with Capital Letter" />
                      <ValidationRule isMet={validations.hasSymbol} label="Contains a Special Symbol" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gradient Green Sign In Button with hover pulse glow */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className={`w-full py-3.5 mt-4 rounded-xl font-extrabold text-sm tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none cursor-pointer hover:shadow-[0_0_15px_rgba(46,204,113,0.45)] ${
                !isPasswordValid ? 'opacity-50 grayscale cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 font-medium">
            No account?{' '}
            <Link to="/register" className="text-accent-300 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ValidationRule({ isMet, label }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-semibold transition-all duration-300 ${
        isMet ? 'text-green-400 translate-x-0.5' : 'text-gray-500'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
          isMet ? 'bg-green-400/20 border-green-400' : 'border-gray-700'
        }`}
      >
        {isMet ? <FiCheck size={9} className="text-green-400" /> : <FiX size={9} />}
      </div>
      <span>{label}</span>
    </div>
  );
}