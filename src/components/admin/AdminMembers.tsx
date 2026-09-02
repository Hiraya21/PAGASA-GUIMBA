import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Member } from '../../types';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  QrCode, 
  Filter, 
  X, 
  Check, 
  Eye,
  EyeOff,
  Shield,
  FileSpreadsheet,
  Camera,
  Key,
  Lock,
  UserCheck,
  Copy,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';

export const AdminMembers: React.FC = () => {
  const { 
    members, 
    addMember, 
    adminAddMemberAccount,
    updateMember, 
    adminUpdateMemberCredentials,
    deleteMember, 
    selectedMemberId, 
    setSelectedMemberId,
    addToast,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [photoTargetMember, setPhotoTargetMember] = useState<Member | null>(null);
  const [credentialsTargetMember, setCredentialsTargetMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(
    selectedMemberId ? members.find(m => m.id === selectedMemberId) || null : null
  );

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('member123');
  const [formHasPortalAccess, setFormHasPortalAccess] = useState(true);
  const [formContact, setFormContact] = useState('');
  const [formBarangay, setFormBarangay] = useState(GUIMBA_BARANGAYS[0]);
  const [formBirthdate, setFormBirthdate] = useState('2004-01-01');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Prefer not to say' | 'Other'>('Male');
  const [formEducation, setFormEducation] = useState<any>('College / University');
  const [formStatus, setFormStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [formPosition, setFormPosition] = useState('Youth Member');
  const [formCommittee, setFormCommittee] = useState('General Youth Volunteer');
  const [formAddress, setFormAddress] = useState('');
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);

  // Credentials Modal State
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credHasPortalAccess, setCredHasPortalAccess] = useState(true);
  const [credStatus, setCredStatus] = useState<'Active' | 'Pending' | 'Inactive' | 'Suspended'>('Active');
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const filteredMembers = members.filter(m => {
    const matchesBarangay = selectedBarangay === 'ALL' || m.barangay === selectedBarangay;
    const matchesStatus = selectedStatus === 'ALL' || m.membershipStatus === selectedStatus;
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.username && m.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          m.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBarangay && matchesStatus && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('member123');
    setFormHasPortalAccess(true);
    setFormContact('');
    setFormBarangay(GUIMBA_BARANGAYS[0]);
    setFormBirthdate('2004-01-01');
    setFormGender('Male');
    setFormEducation('College / University');
    setFormStatus('Active');
    setFormPosition('Youth Member');
    setFormCommittee('General Youth Volunteer');
    setFormAddress('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormName(m.fullName);
    setFormEmail(m.email);
    setFormUsername(m.username || m.email.split('@')[0]);
    setFormPassword(m.password || 'member123');
    setFormHasPortalAccess(m.hasPortalAccess !== false);
    setFormContact(m.contactNumber);
    setFormBarangay(m.barangay);
    setFormBirthdate(m.birthdate);
    setFormGender(m.gender);
    setFormEducation(m.educationalStatus);
    setFormStatus(m.membershipStatus as any);
    setFormPosition(m.organizationPosition);
    setFormCommittee(m.committee);
    setFormAddress(m.address);
    setIsCreateModalOpen(true);
  };

  const handleOpenCredentials = (m: Member) => {
    setCredentialsTargetMember(m);
    setCredUsername(m.username || m.email.split('@')[0]);
    setCredPassword(m.password || 'member123');
    setCredHasPortalAccess(m.hasPortalAccess !== false);
    setCredStatus(m.membershipStatus);
    setShowCredPassword(false);
    setCopiedNotification(false);
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = 'pagasa-';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCredPassword(res);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialsTargetMember) return;

    adminUpdateMemberCredentials(credentialsTargetMember.id, {
      username: credUsername.trim(),
      password: credPassword.trim(),
      hasPortalAccess: credHasPortalAccess,
      membershipStatus: credStatus
    });

    setCredentialsTargetMember(null);
  };

  const handleCopyCredentials = () => {
    if (!credentialsTargetMember) return;
    const info = `PAGASA GUIMBA YOUTH MEMBER PORTAL ACCESS
Member Name: ${credentialsTargetMember.fullName}
Member ID: ${credentialsTargetMember.memberId}
Portal Username: ${credUsername}
Portal Password: ${credPassword}
Status: ${credStatus} (Portal Access: ${credHasPortalAccess ? 'Enabled' : 'Disabled'})
URL: https://pagasaguimba.org (Click "Member Portal Login")`;

    navigator.clipboard.writeText(info).then(() => {
      setCopiedNotification(true);
      showToast('success', 'Copied to Clipboard', `Login credentials for ${credentialsTargetMember.fullName} copied.`);
      setTimeout(() => setCopiedNotification(false), 3000);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const birthYear = new Date(formBirthdate).getFullYear();
    const age = Math.max(15, 2026 - birthYear);

    if (editingMember) {
      updateMember(editingMember.id, {
        fullName: formName,
        email: formEmail,
        username: formUsername || formEmail.split('@')[0],
        password: formPassword || 'member123',
        hasPortalAccess: formHasPortalAccess,
        contactNumber: formContact,
        barangay: formBarangay,
        birthdate: formBirthdate,
        age,
        gender: formGender,
        educationalStatus: formEducation,
        membershipStatus: formStatus,
        organizationPosition: formPosition,
        committee: formCommittee,
        address: formAddress
      });
      addToast(`Member ${formName} updated.`, 'success');
    } else {
      adminAddMemberAccount({
        fullName: formName,
        email: formEmail,
        contactNumber: formContact,
        birthdate: formBirthdate,
        age,
        gender: formGender,
        address: formAddress || `Purok 1, Brgy. ${formBarangay}`,
        barangay: formBarangay,
        educationalStatus: formEducation,
        occupation: 'Student / Youth',
        profilePicture: formGender === 'Female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        membershipStatus: formStatus,
        organizationPosition: formPosition,
        committee: formCommittee,
        emergencyContact: {
          name: 'Family Contact',
          relationship: 'Parent',
          contactNumber: formContact
        }
      }, {
        username: formUsername || formEmail.split('@')[0],
        password: formPassword || 'member123',
        hasPortalAccess: formHasPortalAccess
      });
    }

    setIsCreateModalOpen(false);
  };

  const handleQuickApprove = (m: Member) => {
    updateMember(m.id, { membershipStatus: 'Active', hasPortalAccess: true });
    addToast(`Approved member: ${m.fullName} (${m.memberId})`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Member ID', 'Full Name', 'Username', 'Email', 'Barangay', 'Age', 'Gender', 'Education', 'Status', 'Portal Access', 'Committee', 'Date Joined'];
    const rows = filteredMembers.map(m => [
      `"${m.memberId}"`,
      `"${m.fullName}"`,
      `"${m.username || ''}"`,
      `"${m.email}"`,
      `"${m.barangay}"`,
      m.age,
      `"${m.gender}"`,
      `"${m.educationalStatus}"`,
      `"${m.membershipStatus}"`,
      `"${m.hasPortalAccess !== false ? 'Enabled' : 'Disabled'}"`,
      `"${m.committee}"`,
      `"${m.dateJoined || m.membershipDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAGASA_Guimba_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Member directory exported to CSV.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Youth Member Directory & Portal Access
            </h1>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              Admin Managed Credentials
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add authorized members, set portal usernames and passwords, manage access rights, and verify QR identities ({filteredMembers.length} records).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member & Credentials</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, username, Member ID, barangay..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Barangay Dropdown */}
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Barangays</option>
            {GUIMBA_BARANGAYS.map((b) => (
              <option key={b} value={b}>Brgy. {b}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Review</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Portal Username</th>
                <th className="py-3 px-4">Barangay</th>
                <th className="py-3 px-4">Status & Access</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No members match the query.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="relative group cursor-pointer flex-shrink-0"
                          onClick={() => setPhotoTargetMember(m)}
                          title="Click to change member photo"
                        >
                          <img
                            src={m.profilePicture}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:brightness-90 transition-all"
                          />
                          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{m.fullName}</p>
                          <p className="text-[11px] text-slate-500">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {m.memberId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {m.username || m.email.split('@')[0]}
                        </span>
                        {m.hasPortalAccess === false ? (
                          <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                            Locked
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                            Portal Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      Brgy. {m.barangay}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.membershipStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        m.membershipStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {m.membershipStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.membershipStatus === 'Pending' && (
                          <button
                            onClick={() => handleQuickApprove(m)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Approve Member & Enable Portal"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenCredentials(m)}
                          className="px-2 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Manage Member Username & Password"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-600" />
                          <span>Credentials</span>
                        </button>
                        <button
                          onClick={() => setViewingMember(m)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                          title="View Digital QR Pass & Account Details"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Edit Member Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove member record for ${m.fullName}?`)) {
                              deleteMember(m.id);
                              addToast(`Member ${m.fullName} deleted.`, 'info');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Member Credentials Modal */}
      {credentialsTargetMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Member Portal Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    {credentialsTargetMember.fullName} ({credentialsTargetMember.memberId})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setCredentialsTargetMember(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3.5">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-blue-900">
                <p className="font-semibold mb-0.5">Admin-Assigned Login Info</p>
                The member will use this <strong>Username</strong> and <strong>Password</strong> to sign in to their Member Portal account.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portal Username *
                </label>
                <input
                  type="text"
                  required
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value)}
                  placeholder="e.g. juan.delacruz"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Portal Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showCredPassword ? 'text' : 'password'}
                    required
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="Enter login password"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredPassword(!showCredPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Membership Status
                  </label>
                  <select
                    value={credStatus}
                    onChange={(e) => setCredStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={credHasPortalAccess}
                      onChange={(e) => setCredHasPortalAccess(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800 text-[11px]">Portal Enabled</span>
                  </label>
                </div>
              </div>

              {/* Copy Credentials Quick Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedNotification ? '✓ Credentials Copied!' : 'Copy Login Details to Clipboard'}</span>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCredentialsTargetMember(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member QR / Detail Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            <button
              onClick={() => setViewingMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={viewingMember.profilePicture}
              alt=""
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-blue-600 shadow-md"
            />
            <div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {viewingMember.memberId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-1">{viewingMember.fullName}</h3>
              <p className="text-xs text-slate-500">Brgy. {viewingMember.barangay}, Guimba</p>
            </div>

            {/* Portal Credentials Summary Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Username:</span>
                <span className="font-mono font-bold text-slate-800">{viewingMember.username || viewingMember.email.split('@')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="font-mono font-bold text-slate-800">{viewingMember.password || 'member123'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Portal Access:</span>
                <span className={`font-bold ${viewingMember.hasPortalAccess !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {viewingMember.hasPortalAccess !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              <QRCodeSVG value={viewingMember.qrCode} size={130} />
            </div>

            <p className="text-xs text-slate-500">
              Registered Phone: {viewingMember.contactNumber}
            </p>

            <button
              onClick={() => setViewingMember(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Member Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingMember ? 'Edit Member Record' : 'Register Member & Portal Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingMember ? 'Update details and login credentials' : 'Create profile with assigned username and password'}
                </p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Juan Santos Dela Cruz"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. juan@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Admin-Managed Login Credentials Block */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>Member Portal Login Credentials (Admin Controlled)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                      Portal Username
                    </label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="e.g. juan.delacruz"
                      className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                      Portal Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordInForm ? 'text' : 'password'}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="member123"
                        className="w-full pl-3 pr-8 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswordInForm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={formHasPortalAccess}
                    onChange={(e) => setFormHasPortalAccess(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-[11px]">Grant Member Portal Sign In Access</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Barangay (Guimba) *</label>
                  <select
                    value={formBarangay}
                    onChange={(e) => setFormBarangay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {GUIMBA_BARANGAYS.map((b) => (
                      <option key={b} value={b}>Brgy. {b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="0917-xxx-xxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Birthdate</label>
                  <input
                    type="date"
                    value={formBirthdate}
                    onChange={(e) => setFormBirthdate(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    placeholder="Youth Member"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Committee</label>
                  <input
                    type="text"
                    value={formCommittee}
                    onChange={(e) => setFormCommittee(e.target.value)}
                    placeholder="General Youth Volunteer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Address / Purok</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Purok 2, Brgy. ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2 cursor-pointer shadow-xs"
              >
                {editingMember ? 'Save Member Updates' : 'Complete Registration & Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Member Profile Picture Modal */}
      {photoTargetMember && (
        <ChangeProfilePictureModal
          isOpen={!!photoTargetMember}
          onClose={() => setPhotoTargetMember(null)}
          userType="member"
          targetMemberId={photoTargetMember.id}
          initialAvatar={photoTargetMember.profilePicture}
          title={`Change ${photoTargetMember.fullName}'s Profile Picture`}
        />
      )}
    </div>
  );
};
