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
  Check,
  Camera,
  UserCheck
} from 'lucide-react';
import { ColorPalette, ThemeMode } from '../../types';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';

export const AdminSettings: React.FC = () => {
  const { 
    currentUser,
    updateCurrentUser,
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

  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [adminName, setAdminName] = useState(currentUser?.name || 'Administrator');
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
          Configure municipal organization branding, accessibility display themes, and administrative accounts.
        </p>
      </div>

      {/* Administrator Profile & Avatar Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 font-display">
                Administrator Profile & Avatar
              </h2>
              <p className="text-xs text-slate-500">
                Manage your administrative identity, profile photo, and official display name.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            {currentUser?.role || 'Admin'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsChangeAvatarOpen(true)}>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser?.name || 'Administrator'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:brightness-90 transition-all"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-lg text-white shadow-xs border border-white">
                <Camera className="w-3 h-3" />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-display">
                {currentUser?.name || 'Municipal Administrator'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentUser?.email || 'admin@pagasa-youth.gov.ph'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200 font-semibold">
                  ID: {currentUser?.id || 'admin-01'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active Session
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsChangeAvatarOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Change Profile Picture</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator Display Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white transition-colors"
              placeholder="e.g. Maria Santos (Super Admin)"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                updateCurrentUser({ name: adminName.trim() });
                addToast('Administrator name saved successfully.', 'success');
              }}
              className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Display Name</span>
            </button>
          </div>
        </div>
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

      {/* Change Administrator Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isChangeAvatarOpen}
        onClose={() => setIsChangeAvatarOpen(false)}
        userType="admin"
        initialAvatar={currentUser?.avatar}
        title="Change Administrator Profile Picture"
      />
    </div>
  );
};
