import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  ArrowRight, 
  Shield, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Award,
  Layers,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, setIsAuthModalOpen, setAuthModalMode, members, events, projects, settings } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24 lg:py-32">
      {/* Subtle Background Glows & Municipal Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Location & Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 text-sky-300 text-xs font-semibold backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Guimba, Nueva Ecija • Official Youth Portal</span>
            </div>

            {/* Main Organization Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1]">
              <span className="text-white block">PAGASA GUIMBA</span>
              <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-amber-300 bg-clip-text text-transparent">
                YOUTH ORGANIZATION
              </span>
            </h1>

            {/* Subtitle & Mission */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Empowering the Youth of Guimba Through Leadership, Service, and Community. 
              Uniting 64 barangays under one progressive vision: <span className="text-amber-300 font-semibold italic">"Kabataan. Pagkakaisa. Pag-asa."</span>
            </p>

            {/* Three Prompt Mandated Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => setCurrentPage('events')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-950" />
                <span>Join the Organization</span>
              </button>

              <button
                onClick={() => setCurrentPage('projects')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-sm border border-white/15 backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>View Projects</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>64 Barangays Represented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>QR-Enabled MIS Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>LGU Accredited</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Card & Visual Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Featured Visual Card */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="PAGASA Guimba Youth Assembly"
                className="w-full h-72 sm:h-80 object-cover brightness-95 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold">
                  Next Flagship Event
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Guimba Youth Leadership Summit 2026
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  September 15, 2026 • Municipal Gymnasium
                </p>
              </div>
            </div>

            {/* Floating Live Metric 1 */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-3 hidden sm:flex">
              <div className="p-2 bg-blue-600/20 text-sky-400 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">{members.length}+ Active Members</p>
                <p className="text-[10px] text-slate-400">Across Guimba districts</p>
              </div>
            </div>

            {/* Floating Live Metric 2 */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-3 hidden sm:flex">
              <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">92.4% Avg Attendance</p>
                <p className="text-[10px] text-slate-400">QR-Verified System</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
