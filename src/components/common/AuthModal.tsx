import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { X, Lock, Mail, User, Phone, MapPin, Calendar, BookOpen, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    addMember,
    switchRole
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regBirthdate, setRegBirthdate] = useState('2004-01-01');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Prefer not to say' | 'Other'>('Male');
  const [regAddress, setRegAddress] = useState('');
  const [regBarangay, setRegBarangay] = useState(GUIMBA_BARANGAYS[0]);
  const [regEducation, setRegEducation] = useState<'High School' | 'Senior High' | 'College / University' | 'Vocational / TVET' | 'Out of School Youth' | 'Employed Professional' | 'Other'>('College / University');
  const [regOccupation, setRegOccupation] = useState('');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyRel, setRegEmergencyRel] = useState('Parent');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regSuccessMemberId, setRegSuccessMemberId] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    if (authModalMode === 'admin-login') {
      const ok = loginUser(loginEmail, 'SUPER_ADMIN');
      if (ok) setIsAuthModalOpen(false);
    } else {
      const ok = loginUser(loginEmail, 'MEMBER');
      if (ok) setIsAuthModalOpen(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regContact.trim()) return;

    // Calculate approximate age
    const birthYear = new Date(regBirthdate).getFullYear();
    const currentYear = 2026;
    const calculatedAge = Math.max(15, currentYear - birthYear);

    const created = addMember({
      fullName: regFullName,
      email: regEmail,
      contactNumber: regContact,
      birthdate: regBirthdate,
      age: calculatedAge,
      gender: regGender,
      address: regAddress || `Purok 2, Brgy. ${regBarangay}`,
      barangay: regBarangay,
      educationalStatus: regEducation,
      occupation: regOccupation || 'Student',
      profilePicture: regGender === 'Female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      membershipStatus: 'Pending',
      organizationPosition: 'Youth Member',
      committee: 'General Youth Volunteer',
      emergencyContact: {
        name: regEmergencyName || 'Family Member',
        relationship: regEmergencyRel || 'Parent',
        contactNumber: regEmergencyContact || regContact
      }
    });

    setRegSuccessMemberId(created.memberId);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  const quickDemoLogin = (role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER') => {
    switchRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-800 p-6 text-white relative">
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setRegSuccessMemberId(null);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                PAGASA Guimba MIS
              </span>
              <h2 className="text-xl font-display font-bold">
                {regSuccessMemberId ? 'Registration Received!' : 
                  authModalMode === 'admin-login' ? 'Administrator Portal Access' :
                  authModalMode === 'login' ? 'Member Portal Sign In' : 'Youth Membership Application'}
              </h2>
            </div>
          </div>
        </div>

        {/* Success Screen after registration */}
        {regSuccessMemberId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Mabuhay! Your youth membership registration has been received and assigned Member ID:
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl inline-block font-mono font-bold text-blue-800 text-lg">
              {regSuccessMemberId}
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left max-w-md mx-auto">
              <p className="font-semibold mb-0.5">Status: Pending Verification</p>
              Your account will be activated once verified by PAGASA Guimba administrators. You can log in using your registered email address.
            </div>
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => {
                  setRegSuccessMemberId(null);
                  setAuthModalMode('login');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
              >
                Proceed to Login
              </button>
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setRegSuccessMemberId(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setAuthModalMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authModalMode === 'login'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Member Login
              </button>
              <button
                onClick={() => setAuthModalMode('admin-login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authModalMode === 'admin-login'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Login
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authModalMode === 'register'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Join Organization
              </button>
            </div>

            {/* Login Form (Member or Admin) */}
            {(authModalMode === 'login' || authModalMode === 'admin-login') && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {authModalMode === 'admin-login' ? 'Admin Official Email' : 'Member Registered Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={authModalMode === 'admin-login' ? 'admin@pagasaguimba.org' : 'juan.delacruz@gmail.com'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Remember me on this device
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Fast Demo Logins */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center mb-2.5 font-medium">
                    ⚡ Quick 1-Click Role Sandbox Access:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => quickDemoLogin('SUPER_ADMIN')}
                      className="p-2 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-semibold transition-colors text-left"
                    >
                      👑 Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => quickDemoLogin('ADMIN')}
                      className="p-2 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-semibold transition-colors text-left"
                    >
                      🛠️ Officer Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => quickDemoLogin('MEMBER')}
                      className="p-2 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-semibold transition-colors text-left"
                    >
                      👤 Member Portal
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Registration Form */}
            {authModalMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Juan Dela Cruz"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="juan.delacruz@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile / Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="0917-000-0000"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Barangay (Guimba) *
                    </label>
                    <select
                      value={regBarangay}
                      onChange={(e) => setRegBarangay(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {GUIMBA_BARANGAYS.map((b) => (
                        <option key={b} value={b}>Brgy. {b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Birthdate *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={regBirthdate}
                        onChange={(e) => setRegBirthdate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Educational / Youth Status
                    </label>
                    <select
                      value={regEducation}
                      onChange={(e) => setRegEducation(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="College / University">College / University</option>
                      <option value="Senior High">Senior High</option>
                      <option value="High School">High School</option>
                      <option value="Vocational / TVET">Vocational / TVET</option>
                      <option value="Employed Professional">Employed Professional</option>
                      <option value="Out of School Youth">Out of School Youth</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address / Purok
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Purok / Zone, Sitio, Landmark"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Emergency Contact Person
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={regEmergencyName}
                      onChange={(e) => setRegEmergencyName(e.target.value)}
                      placeholder="Contact Name"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={regEmergencyRel}
                      onChange={(e) => setRegEmergencyRel(e.target.value)}
                      placeholder="Relationship (e.g. Mother)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="tel"
                      value={regEmergencyContact}
                      onChange={(e) => setRegEmergencyContact(e.target.value)}
                      placeholder="Emergency Phone"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  By registering, you agree to abide by the Constitution and By-Laws of PAGASA Guimba Youth Organization.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Membership Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
