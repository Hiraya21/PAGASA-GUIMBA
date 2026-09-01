import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
  Palette,
  Eye,
  Sparkles,
  Check
} from 'lucide-react';
import { ColorPalette, ThemeMode } from '../../types';

export const AdminSettings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToDefaults, 
    addToast,
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    colorPalette,
    setColorPalette
  } = useApp();

  const [orgName, setOrgName] = useState(settings.orgName);
  const [acronym, setAcronym] = useState(settings.acronym || 'PAGASA');
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [email, setEmail] = useState(settings.email);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber || settings.phone || '');
  const [facebook, setFacebook] = useState(settings.facebookUrl || settings.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(settings.instagramUrl || settings.socialLinks?.instagram || '');
  const [youtube, setYoutube] = useState(settings.youtubeUrl || settings.socialLinks?.youtube || '');

  const palettes: { id: ColorPalette; name: string; hex: string; desc: string }[] = [
    { id: 'default', name: 'Civic Blue', hex: '#2563eb', desc: 'Standard municipal blue scheme' },
    { id: 'emerald', name: 'Emerald Youth', hex: '#059669', desc: 'Environmental & growth theme' },
    { id: 'purple', name: 'Royal Purple', hex: '#7c3aed', desc: 'Leadership & innovation tone' },
    { id: 'sunset', name: 'Sunset Orange', hex: '#ea580c', desc: 'Vibrant civic engagement' },
    { id: 'ocean', name: 'Ocean Cyan', hex: '#0284c7', desc: 'Clean high-readability cyan' },
    { id: 'high-contrast', name: 'High Contrast', hex: '#1d4ed8', desc: 'WCAG AAA enhanced border & text contrast' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      orgName,
      acronym,
      tagline,
      address,
      email,
      contactNumber,
      facebookUrl: facebook,
      instagramUrl: instagram,
      youtubeUrl: youtube,
      defaultTheme: theme,
      defaultPalette: colorPalette
    });
    addToast('System settings and preferences saved successfully!', 'success');
  };

  const handleBackupExport = () => {
    const fullState = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      storageData: { ...localStorage }
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PAGASA_Guimba_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('System database backup downloaded.', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">
          System & Organization Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure municipal organization branding, accessibility display themes, and data management.
        </p>
      </div>

      {/* Theme & Display Accessibility Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 font-display">
                Theme & Accessibility Palette
              </h2>
              <p className="text-xs text-slate-500">
                Switch between Light & Dark modes and dynamically update CSS variables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
              Active: {effectiveTheme.toUpperCase()} MODE
            </span>
          </div>
        </div>

        {/* Display Mode Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Display Theme Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'light'
                  ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Light Theme</p>
                  {theme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">Crisp, clean high-contrast daylight styling</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-blue-500 text-white ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dark Theme</p>
                  {theme === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Eye-comfort deep midnight palette</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'system'
                  ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Laptop className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">System Sync</p>
                  {theme === 'system' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">Auto-match device OS preference</p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Color Palette Preset */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">Dynamic Color Palette (CSS Variables)</label>
            <span className="text-[11px] text-slate-500 font-mono">var(--primary)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {palettes.map((p) => {
              const isSelected = colorPalette === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setColorPalette(p.id)}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shadow-inner flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: p.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-bold text-base text-slate-900 font-display border-b border-slate-100 pb-3">
          Organization Profile & Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Acronym / Code</label>
            <input
              type="text"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secretariat Hotline</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters / Office Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <h2 className="font-bold text-base text-slate-900 font-display border-b border-slate-100 pb-3 pt-2">
          Social Media & Public Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Page</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>

      {/* Supabase Cloud Connection & Database Manager */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 font-display flex items-center gap-2">
                <span>Supabase Cloud Database</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Connect your external Supabase project (Project URL & Anon Key) or execute the full SQL schema.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Full Supabase SQL Schema Included (`supabase-schema.sql`)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const schema = `-- PAGASA Guimba Youth MIS Portal Schema for Supabase
CREATE TABLE IF NOT EXISTS public.members (id TEXT PRIMARY KEY, member_id TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL, email TEXT NOT NULL, contact_number TEXT DEFAULT '', birthdate TEXT DEFAULT '', age INTEGER DEFAULT 18, gender TEXT DEFAULT 'Prefer not to say', address TEXT DEFAULT '', barangay TEXT DEFAULT '', educational_status TEXT DEFAULT 'College / University', occupation TEXT DEFAULT '', profile_picture TEXT DEFAULT '', membership_date TEXT DEFAULT '', membership_status TEXT DEFAULT 'Active', organization_position TEXT, committee TEXT, emergency_contact JSONB, stats JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.events (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, banner_image TEXT DEFAULT '', date TEXT NOT NULL, time TEXT NOT NULL, location TEXT NOT NULL, venue TEXT, organizer TEXT DEFAULT 'PAGASA Guimba', description TEXT DEFAULT '', objectives JSONB, requirements JSONB, max_participants INTEGER DEFAULT 100, max_capacity INTEGER, current_participants INTEGER DEFAULT 0, registered_count INTEGER, registration_deadline TEXT, registration_enabled BOOLEAN DEFAULT true, is_registration_open BOOLEAN DEFAULT true, status TEXT DEFAULT 'Upcoming', is_published BOOLEAN DEFAULT true, qr_code_secret TEXT, speakers JSONB, agenda JSONB, created_at TEXT);
CREATE TABLE IF NOT EXISTS public.registrations (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, member_id TEXT NOT NULL, member_name TEXT NOT NULL, member_email TEXT NOT NULL, registered_at TEXT NOT NULL, status TEXT DEFAULT 'Registered', notes TEXT);
CREATE TABLE IF NOT EXISTS public.attendance_sessions (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, event_title TEXT NOT NULL, date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL, location TEXT NOT NULL, is_open BOOLEAN DEFAULT true, qr_code_value TEXT NOT NULL, total_registered INTEGER DEFAULT 0, present_count INTEGER DEFAULT 0, late_count INTEGER DEFAULT 0, absent_count INTEGER DEFAULT 0, excused_count INTEGER DEFAULT 0, attendance_rate INTEGER DEFAULT 0, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS public.attendance_records (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, event_id TEXT NOT NULL, event_title TEXT NOT NULL, member_id TEXT NOT NULL, member_name TEXT NOT NULL, member_barangay TEXT DEFAULT '', check_in_time TEXT NOT NULL, date TEXT NOT NULL, status TEXT DEFAULT 'Present', method TEXT DEFAULT 'QR_SCAN', recorded_by TEXT DEFAULT 'System', remarks TEXT);
CREATE TABLE IF NOT EXISTS public.projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, image TEXT DEFAULT '', description TEXT DEFAULT '', objectives JSONB, deliverables JSONB, start_date TEXT NOT NULL, end_date TEXT, location TEXT, project_leader TEXT NOT NULL, target_beneficiaries TEXT, budget TEXT, participants_count INTEGER DEFAULT 0, progress INTEGER DEFAULT 0, status TEXT DEFAULT 'Ongoing', results TEXT, gallery JSONB);
CREATE TABLE IF NOT EXISTS public.activities (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, location TEXT NOT NULL, leader TEXT NOT NULL, description TEXT DEFAULT '', target_participants INTEGER DEFAULT 50, status TEXT DEFAULT 'Upcoming', attendance_tracked BOOLEAN DEFAULT true);
CREATE TABLE IF NOT EXISTS public.announcements (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, date TEXT NOT NULL, author TEXT NOT NULL, author_role TEXT DEFAULT 'Youth Executive', featured_image TEXT DEFAULT '', summary TEXT DEFAULT '', content TEXT DEFAULT '', is_published BOOLEAN DEFAULT true, is_pinned BOOLEAN DEFAULT false, views INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS public.officials (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, position TEXT NOT NULL, committee TEXT DEFAULT 'Executive Committee', rank INTEGER DEFAULT 1, "order" INTEGER DEFAULT 1, profile_picture TEXT DEFAULT '', bio TEXT DEFAULT '', term TEXT DEFAULT '2025 - 2027', contact_email TEXT, contact_number TEXT, facebook_url TEXT);
CREATE TABLE IF NOT EXISTS public.certificates (id TEXT PRIMARY KEY, certificate_number TEXT NOT NULL UNIQUE, member_id TEXT NOT NULL, member_name TEXT NOT NULL, event_or_activity_title TEXT NOT NULL, certificate_type TEXT NOT NULL, issue_date TEXT NOT NULL, organization TEXT DEFAULT 'PAGASA Guimba', signatories JSONB, description TEXT DEFAULT '', qr_verification_url TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS public.gallery (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, image_url TEXT NOT NULL, date TEXT NOT NULL, caption TEXT, description TEXT, event_tag TEXT, event_title TEXT);
CREATE TABLE IF NOT EXISTS public.notifications (id TEXT PRIMARY KEY, user_id TEXT, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT DEFAULT 'system', created_at TEXT NOT NULL, is_read BOOLEAN DEFAULT false, link_action TEXT);
CREATE TABLE IF NOT EXISTS public.audit_logs (id TEXT PRIMARY KEY, user_name TEXT NOT NULL, user_role TEXT NOT NULL, action TEXT NOT NULL, module TEXT NOT NULL, details TEXT NOT NULL, timestamp TEXT NOT NULL, ip_address TEXT);
CREATE TABLE IF NOT EXISTS public.settings (id TEXT PRIMARY KEY DEFAULT 'default_settings', data JSONB NOT NULL);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY; CREATE POLICY "p1" ON public.members FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY; CREATE POLICY "p2" ON public.events FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY; CREATE POLICY "p3" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY; CREATE POLICY "p4" ON public.attendance_sessions FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY; CREATE POLICY "p5" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY; CREATE POLICY "p6" ON public.projects FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY; CREATE POLICY "p7" ON public.activities FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY; CREATE POLICY "p8" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY; CREATE POLICY "p9" ON public.officials FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY; CREATE POLICY "p10" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY; CREATE POLICY "p11" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY; CREATE POLICY "p12" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY; CREATE POLICY "p13" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY; CREATE POLICY "p14" ON public.settings FOR ALL USING (true) WITH CHECK (true);`;
                navigator.clipboard.writeText(schema);
                addToast('Supabase SQL Schema copied to clipboard!', 'success');
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Copy SQL Schema
            </button>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            To link your Supabase account: Paste the copied SQL schema into your <strong>Supabase Dashboard &gt; SQL Editor</strong>, then provide your <strong>SUPABASE_URL</strong> and <strong>SUPABASE_ANON_KEY</strong> in Settings or `.env`.
          </p>
        </div>
      </div>

      {/* Database Backup & Disaster Recovery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-bold text-base text-slate-900 font-display">
          Data Management & Reset
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="space-y-0.5">
            <p className="font-bold text-xs text-slate-900">Database JSON Export</p>
            <p className="text-[11px] text-slate-500">Download a full snapshot of all members, attendance logs, and events.</p>
          </div>
          <button
            onClick={handleBackupExport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50/60 rounded-2xl border border-rose-200">
          <div className="space-y-0.5">
            <p className="font-bold text-xs text-rose-900">Factory Reset Demonstration Data</p>
            <p className="text-[11px] text-rose-700">Restore default sample members, events, and records.</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data to default demonstration state?')) {
                resetToDefaults();
                addToast('System database restored to default factory state.', 'info');
              }
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
