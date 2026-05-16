import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence for smooth pop-in
import { FiMail, FiLock, FiHeart, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track cursor focus
  
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

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center">
              <FiHeart className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-white">TeleHealth</span>
          </Link>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {['Admin', 'Doctor', 'Nurse', 'Pharmacy'].map((role) => (
                <button 
                  key={role} 
                  type="button" 
                  onClick={() => { setEmail(`${role.toLowerCase()}@telehealth.com`); setPassword('Password123!'); }} 
                  className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-gray-300"
                >
                  {role}
                </button>
              ))}
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="input-field pl-11" 
                  placeholder="you@email.com" 
                  required 
                />
              </div>
            </div>

            <div className="relative">
              <label className="input-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  onFocus={() => setIsFocused(true)} // Jab cursor aye
                  onBlur={() => setIsFocused(false)} // Jab cursor bahar jaye
                  className={`input-field pl-11 pr-11 transition-all ${
                    password.length > 0 && !isPasswordValid ? 'border-red-500/50' : ''
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

              {/* Pop-over Validations */}
              <AnimatePresence>
                {isFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 left-0 right-0 mt-2 p-4 glass-dark rounded-xl border border-white/10 shadow-2xl"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-bold">Password Requirements</p>
                    <div className="space-y-2">
                      <ValidationRule isMet={validations.length} label="8+ Characters Required" />
                      <ValidationRule isMet={validations.firstLetterCap} label="Starts with Capital Letter" />
                      <ValidationRule isMet={validations.hasSymbol} label="Contains a Special Symbol" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit" 
              disabled={loading || !isPasswordValid} 
              className={`btn-accent w-full py-3 mt-4 transition-all ${!isPasswordValid ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">No account? <Link to="/register" className="text-accent-400 font-medium hover:underline">Register</Link></p>
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