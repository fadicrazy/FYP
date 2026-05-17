import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail, FiLock, FiHeart, FiUser, FiPhone, FiEye, FiEyeOff,
  FiCheck, FiX, FiActivity, FiMapPin, FiShield, FiClipboard
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const roles = [
  { value: 'nurse', label: 'Nurse/LHW', emoji: '👩‍⚕️' },
  { value: 'doctor', label: 'Doctor', emoji: '👨‍⚕️' },
  { value: 'pharmacy', label: 'Pharmacy', emoji: '💊' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'nurse',
    phone: '',
    specialization: '',
    area: '',
    licenseNumber: '',
    pharmacyName: '',
    pharmacyAddress: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const passwordsMatch = form.password === confirmPassword;

  // Live Password Strength Calculator (Mockup 2 specifications)
  const getStrength = () => {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/^[A-Z]/.test(form.password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    return score;
  };
  const strengthScore = getStrength();
  const strengthColors = ['bg-gray-700 w-0', 'bg-red-500 w-1/4', 'bg-yellow-500 w-2/4', 'bg-orange-500 w-3/4', 'bg-emerald-500 w-full'];
  const strengthLabels = ['Too Short', 'Weak 🔴', 'Medium 🟡', 'Good 🔵', 'Strong 🟢'];

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error('Please fulfill password safety requirements!');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Confirm password does not match!');
      return;
    }

    setLoading(true);
    // Assemble final payload based on dynamic role fields
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: `+92${form.phone}`,
    };

    if (form.role === 'nurse') {
      payload.area = form.area;
    } else if (form.role === 'doctor') {
      payload.specialization = form.specialization;
      payload.licenseNumber = form.licenseNumber;
    } else if (form.role === 'pharmacy') {
      payload.pharmacyName = form.pharmacyName;
      payload.pharmacyAddress = form.pharmacyAddress;
    }

    try {
      await register(payload);
      toast.success('Professional account created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(10, 37, 64, 0.82), rgba(5, 19, 34, 0.96)), url('/bg-rural.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Decorative Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-medical-blue/20 rounded-full blur-3xl animate-float pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10" // Wider design for comfortable field structures
      >
        {/* Header Branding */}
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
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
            Professional Registration Portal
          </p>
        </div>

        {/* High-Readability Dark Glassmorphism Card (Wider & Taller mockup fix) */}
        <div className="bg-[#0b1e36]/85 backdrop-blur-[16px] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.01] to-white/[0.03] pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Dynamic Interactive Role Tabs (Mockup 3 specifications) */}
            <div>
              <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-2 block">
                I am a Clinical Professional
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => {
                  const isSelected = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`p-4 rounded-2xl text-center transition-all duration-300 border-2 cursor-pointer ${
                        isSelected
                          ? 'border-accent-400 bg-gradient-to-r from-accent-400/10 to-accent-500/10 text-white font-extrabold shadow-md shadow-accent-500/5'
                          : 'border-white/10 hover:border-white/20 text-gray-400'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{r.emoji}</span>
                      <span className="text-[10px] font-bold block uppercase tracking-wider">
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name field */}
              <div>
                <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                    placeholder="Dr. Fahad / Nurse Sara"
                    required
                  />
                </div>
              </div>

              {/* Phone field with country prefix UX (Mockup 6 specifications) */}
              <div>
                <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                  Phone Number
                </label>
                <div className="flex rounded-xl overflow-hidden bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-accent-400 focus-within:border-accent-400 transition-all duration-300">
                  <span className="bg-white/10 px-3.5 py-3 text-gray-300 text-sm flex items-center border-r border-white/10 font-bold shrink-0">
                    +92
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                    placeholder="3001234567"
                    required
                  />
                </div>
              </div>

              {/* Email Address field */}
              <div>
                <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                    placeholder="name@telehealth.com"
                    required
                  />
                </div>
              </div>

              {/* Password field with validation rules & live strength bar */}
              <div className="relative">
                <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                  Security Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full bg-white/5 border rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm ${
                      form.password.length > 0 && !isPasswordValid ? 'border-red-500/50' : 'border-white/10'
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

                {/* Password strength dynamic colored bar (Mockup 2 specifications) */}
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[9px] uppercase font-bold text-gray-400">
                      <span>Password Strength:</span>
                      <span className="font-extrabold text-accent-300">
                        {strengthLabels[strengthScore]}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full transition-all duration-500 ${strengthColors[strengthScore]}`} />
                    </div>
                  </div>
                )}

                {/* Password validation floating banner */}
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

              {/* Confirm Password Field (Mockup issue 7 specifications) */}
              <div>
                <label className="text-white font-extrabold text-[11px] tracking-wider uppercase mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm ${
                      confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <span className="text-[10px] font-bold text-red-400 mt-1 block">
                    ⚠️ Passwords do not match!
                  </span>
                )}
              </div>

              {/* Dynamic Field Blocks per Role selection (Mockup 1 specifications) */}
              
              {/* NURSE: Assigned Area */}
              {form.role === 'nurse' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-white font-extrabold text-[11px] tracking-wider uppercase block">
                    Assigned Clinic Area
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.area}
                      onChange={set('area')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                      placeholder="e.g. Village Khanpur / Kotli"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* DOCTOR: Specialization & License Number */}
              {form.role === 'doctor' && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-white font-extrabold text-[11px] tracking-wider uppercase block">
                      Medical Specialization
                    </label>
                    <div className="relative">
                      <FiActivity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.specialization}
                        onChange={set('specialization')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="e.g. General Physician / Pediatrician"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-white font-extrabold text-[11px] tracking-wider uppercase block">
                      PMC License Number
                    </label>
                    <div className="relative">
                      <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.licenseNumber}
                        onChange={set('licenseNumber')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="e.g. PMC-88291-D"
                        required
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* PHARMACY: Pharmacy Name & Address */}
              {form.role === 'pharmacy' && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-white font-extrabold text-[11px] tracking-wider uppercase block">
                      Pharmacy Store Name
                    </label>
                    <div className="relative">
                      <FiClipboard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.pharmacyName}
                        onChange={set('pharmacyName')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="e.g. Al-Shifa Pharmacy"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-white font-extrabold text-[11px] tracking-wider uppercase block">
                      Pharmacy Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.pharmacyAddress}
                        onChange={set('pharmacyAddress')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="e.g. Sector-G, Kotli"
                        required
                      />
                    </div>
                  </motion.div>
                </>
              )}

            </div>

            {/* Premium Registration Submit Button */}
            <button
              type="submit"
              disabled={loading || (form.password.length > 0 && !isPasswordValid) || !passwordsMatch}
              className={`w-full py-3.5 mt-4 rounded-xl font-extrabold text-sm tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:scale-[1.01] active:scale-[0.99] focus:outline-none cursor-pointer hover:shadow-[0_0_15px_rgba(46,204,113,0.45)] ${
                (!isPasswordValid && form.password.length > 0) || !passwordsMatch ? 'opacity-50 grayscale cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </div>
              ) : (
                'Create Professional Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-accent-300 font-bold hover:underline">
              Sign In
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