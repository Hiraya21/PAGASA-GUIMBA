import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Member,
  EventItem,
  EventRegistration,
  AttendanceSession,
  AttendanceRecord,
  ProjectItem,
  ActivityItem,
  AnnouncementItem,
  OfficialItem,
  CertificateItem,
  GalleryPhoto,
  OrganizationSettings,
  NotificationItem,
  AuditLogItem,
  AttendanceStatus,
  MembershipStatus,
  ThemeMode,
  ColorPalette
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_OFFICIALS,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

export type ActivePage = 
  | 'home'
  | 'about'
  | 'officials'
  | 'events'
  | 'event-detail'
  | 'projects'
  | 'activities'
  | 'announcements'
  | 'gallery'
  | 'join'
  | 'member-dashboard'
  | 'member-profile'
  | 'member-qr'
  | 'member-events'
  | 'member-attendance'
  | 'member-certificates'
  | 'admin-dashboard'
  | 'admin-members'
  | 'admin-attendance'
  | 'admin-events'
  | 'admin-projects'
  | 'admin-activities'
  | 'admin-announcements'
  | 'admin-gallery'
  | 'admin-officials'
  | 'admin-certificates'
  | 'admin-reports'
  | 'admin-audit'
  | 'admin-audit-logs'
  | 'admin-settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & User State
  currentUser: User | null;
  currentRole: UserRole;
  currentPage: ActivePage;
  selectedEventId: string | null;
  selectedMemberId: string | null;
  activeCertificate: CertificateItem | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'admin-login';
  isGlobalSearchOpen: boolean;
  toasts: ToastMessage[];

  // Theme & Accessibility State
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  colorPalette: ColorPalette;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setColorPalette: (palette: ColorPalette) => void;

  // Setters
  setCurrentPage: (page: ActivePage) => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedMemberId: (id: string | null) => void;
  setActiveCertificate: (cert: CertificateItem | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register' | 'admin-login') => void;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Role & Auth functions
  switchRole: (role: UserRole, userPayload?: User) => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  logoutUser: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateUserProfilePicture: (avatarUrl: string) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Data Collections
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => void;
  
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  updateMemberStatus: (id: string, status: MembershipStatus) => void;
  deleteMember: (id: string) => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'currentParticipants' | 'createdAt'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, memberInfo: { memberId: string; name: string; email: string }) => { success: boolean; message: string };
  cancelEventRegistration: (eventId: string, memberId: string) => void;
  isMemberRegisteredForEvent: (eventId: string, memberId: string) => boolean;

  registrations: EventRegistration[];

  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  createAttendanceSession: (eventId: string, startTime: string, endTime: string, location: string) => AttendanceSession;
  toggleAttendanceSession: (sessionId: string, isOpen: boolean) => void;
  recordAttendance: (
    sessionId: string, 
    memberId: string, 
    method: 'QR_SCAN' | 'MANUAL' | 'SEARCH',
    statusOverride?: AttendanceStatus,
    remarks?: string
  ) => { success: boolean; message: string; record?: AttendanceRecord; isDuplicate?: boolean };
  updateAttendanceRecordStatus: (recordId: string, status: AttendanceStatus, remarks?: string) => void;
  deleteAttendanceRecord: (recordId: string) => void;

  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<ActivityItem>) => void;
  deleteActivity: (id: string) => void;

  announcements: AnnouncementItem[];
  addAnnouncement: (announcement: Omit<AnnouncementItem, 'id' | 'views'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;

  officials: OfficialItem[];
  addOfficial: (official: Omit<OfficialItem, 'id'>) => void;
  updateOfficial: (id: string, updates: Partial<OfficialItem>) => void;
  deleteOfficial: (id: string) => void;

  certificates: CertificateItem[];
  issueCertificate: (cert: Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrVerificationUrl'>) => CertificateItem;
  deleteCertificate: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;

  auditLogs: AuditLogItem[];
  logAuditEvent: (action: string, module: AuditLogItem['module'], details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pagasa_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Super Admin for immediate rich preview
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('pagasa_role');
    return (saved as UserRole) || 'SUPER_ADMIN';
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<CertificateItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin-login'>('login');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme & Accessibility State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pagasa_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('pagasa_palette');
    return (saved as ColorPalette) || 'default';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Synchronize Theme & CSS variables dynamically
  useEffect(() => {
    let resolvedTheme: 'light' | 'dark' = 'light';
    if (theme === 'system') {
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = isSystemDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }
    setEffectiveTheme(resolvedTheme);

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    root.setAttribute('data-palette', colorPalette);
    localStorage.setItem('pagasa_theme', theme);
    localStorage.setItem('pagasa_palette', colorPalette);
  }, [theme, colorPalette]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    showToast('info', 'Display Mode', `Theme changed to ${newTheme === 'system' ? 'System Default' : newTheme.toUpperCase() + ' Mode'}`);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorPalette = (newPalette: ColorPalette) => {
    setColorPaletteState(newPalette);
    const paletteNames: Record<ColorPalette, string> = {
      default: 'Civic Blue',
      emerald: 'Emerald Youth',
      purple: 'Royal Purple',
      sunset: 'Sunset Orange',
      ocean: 'Ocean Cyan',
      'high-contrast': 'High Contrast'
    };
    showToast('success', 'Color Palette', `Active palette updated to ${paletteNames[newPalette] || newPalette}`);
  };

  // Persistent Collections with fallback
  const [settings, setSettings] = useState<OrganizationSettings>(() => {
    const saved = localStorage.getItem('pagasa_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('pagasa_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('pagasa_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('pagasa_registrations');
    if (saved) return JSON.parse(saved);
    // initial sample registrations
    return [
      {
        id: 'reg-1',
        eventId: 'evt-1',
        memberId: 'PAGASA-2026-0042',
        memberName: 'Juan Dela Cruz',
        memberEmail: 'juan.delacruz@gmail.com',
        registeredAt: '2026-08-10 10:00 AM',
        status: 'Registered'
      },
      {
        id: 'reg-2',
        eventId: 'evt-1',
        memberId: 'PAGASA-2026-0043',
        memberName: 'Maria Santos',
        memberEmail: 'maria.santos@gmail.com',
        registeredAt: '2026-08-11 02:30 PM',
        status: 'Registered'
      }
    ];
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('pagasa_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('pagasa_attendance_records');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('pagasa_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('pagasa_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('pagasa_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('pagasa_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [officials, setOfficials] = useState<OfficialItem[]>(() => {
    const saved = localStorage.getItem('pagasa_officials');
    return saved ? JSON.parse(saved) : INITIAL_OFFICIALS;
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const saved = localStorage.getItem('pagasa_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pagasa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('pagasa_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('pagasa_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pagasa_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('pagasa_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pagasa_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('pagasa_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('pagasa_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('pagasa_sessions', JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem('pagasa_attendance_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('pagasa_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pagasa_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('pagasa_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('pagasa_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('pagasa_officials', JSON.stringify(officials));
  }, [officials]);

  useEffect(() => {
    localStorage.setItem('pagasa_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('pagasa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pagasa_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Helpers
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Notice' : type === 'warning' ? 'Warning' : 'System';
    showToast(type, title, message);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audit Logger
  const logAuditEvent = (action: string, module: AuditLogItem['module'], details: string) => {
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      userName: currentUser ? currentUser.name : 'System Administrator',
      userRole: currentRole,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ipAddress: '192.168.1.45 (PAGASA MIS Portal)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notifications
  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('info', 'Notifications', 'All notifications marked as read.');
  };

  // Switch Role
  const switchRole = (role: UserRole, userPayload?: User) => {
    setCurrentRole(role);
    if (userPayload) {
      setCurrentUser(userPayload);
    } else {
      if (role === 'SUPER_ADMIN') {
        setCurrentUser(INITIAL_USERS[0]);
      } else if (role === 'ADMIN') {
        setCurrentUser({ ...INITIAL_USERS[0], role: 'ADMIN' });
      } else if (role === 'MEMBER') {
        setCurrentUser(INITIAL_USERS[1]); // Juan Dela Cruz
      } else {
        setCurrentUser(null);
      }
    }
    
    // Auto navigate to relevant dashboard
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
      showToast('success', 'Role Switched', `Logged in as Administrator (${role})`);
    } else if (role === 'MEMBER') {
      setCurrentPage('member-dashboard');
      showToast('success', 'Welcome Back!', `Logged in as Member (${userPayload?.name || 'Juan Dela Cruz'})`);
    } else {
      setCurrentPage('home');
      showToast('info', 'Guest View', 'Browsing as Guest / Public Visitor');
    }
  };

  const loginUser = (email: string, targetRole?: UserRole) => {
    // Find in INITIAL_USERS or members
    const matchedUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    const matchedMember = members.find(m => m.email.toLowerCase() === email.toLowerCase());

    if (matchedUser) {
      switchRole(targetRole || matchedUser.role, matchedUser);
      return true;
    } else if (matchedMember) {
      if (matchedMember.membershipStatus === 'Pending') {
        showToast('warning', 'Application Pending', 'Your membership registration is still pending approval by an administrator.');
        return false;
      }
      if (matchedMember.membershipStatus === 'Suspended' || matchedMember.membershipStatus === 'Inactive') {
        showToast('error', 'Account Inactive', 'This account is currently inactive or suspended. Please contact organization officers.');
        return false;
      }
      const userObj: User = {
        id: matchedMember.id,
        name: matchedMember.fullName,
        email: matchedMember.email,
        role: 'MEMBER',
        avatar: matchedMember.profilePicture,
        memberId: matchedMember.memberId
      };
      switchRole('MEMBER', userObj);
      return true;
    } else {
      // Allow demo login
      if (targetRole === 'SUPER_ADMIN' || targetRole === 'ADMIN') {
        switchRole('SUPER_ADMIN', INITIAL_USERS[0]);
        return true;
      }
      // Demo member
      switchRole('MEMBER', INITIAL_USERS[1]);
      return true;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentRole('GUEST');
    setCurrentPage('home');
    showToast('info', 'Logged Out', 'You have been signed out successfully.');
  };

  // Profile & Avatar Updates
  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('pagasa_user', JSON.stringify(updated));
      return updated;
    });

    if (updates.avatar || updates.name) {
      setMembers(prev => prev.map(m => {
        if (m.id === currentUser?.id || m.memberId === currentUser?.memberId || (currentUser?.email && m.email.toLowerCase() === currentUser.email.toLowerCase())) {
          return {
            ...m,
            ...(updates.avatar ? { profilePicture: updates.avatar } : {}),
            ...(updates.name ? { fullName: updates.name } : {})
          };
        }
        return m;
      }));
    }

    logAuditEvent('Updated User Profile', 'Settings', `User ${updates.name || currentUser?.name || 'Account'} updated profile details.`);
  };

  const updateUserProfilePicture = (avatarUrl: string) => {
    updateCurrentUser({ avatar: avatarUrl });
  };

  // Settings
  const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAuditEvent('Updated System Settings', 'Settings', 'Modified organization information or system policies.');
    showToast('success', 'Settings Saved', 'Organization and system settings updated.');
  };

  // Member Management
  const addMember = (data: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>): Member => {
    const nextNum = members.length + 43;
    const memberId = `PAGASA-2026-${String(nextNum).padStart(4, '0')}`;
    const newMember: Member = {
      ...data,
      id: 'mem-' + Date.now(),
      memberId,
      membershipDate: new Date().toISOString().split('T')[0],
      membershipStatus: settings.registrationAutoApproval ? 'Active' : 'Pending',
      stats: {
        eventsJoined: 0,
        totalAttendance: 0,
        attendanceRate: 100,
        volunteerHours: 0,
        projectsParticipated: 0,
        certificatesEarned: 0
      }
    };
    setMembers(prev => [newMember, ...prev]);
    logAuditEvent('Registered New Member', 'Members', `Added member: ${newMember.fullName} (${memberId}).`);
    addNotification('New Member Application', `${newMember.fullName} from Brgy. ${newMember.barangay} registered.`, 'system');
    showToast('success', 'Registration Submitted', `Member profile created with ID ${memberId}.`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (currentUser && (currentUser.id === id || currentUser.memberId === updates.memberId || (updates.email && currentUser.email.toLowerCase() === updates.email.toLowerCase()))) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const updatedUser = {
          ...prev,
          ...(updates.fullName ? { name: updates.fullName } : {}),
          ...(updates.profilePicture ? { avatar: updates.profilePicture } : {})
        };
        localStorage.setItem('pagasa_user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    }
    const target = members.find(m => m.id === id);
    logAuditEvent('Updated Member Profile', 'Members', `Updated profile of ${target?.fullName || id}.`);
    showToast('success', 'Member Updated', 'Member details saved successfully.');
  };

  const updateMemberStatus = (id: string, status: MembershipStatus) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, membershipStatus: status } : m));
    const target = members.find(m => m.id === id);
    logAuditEvent(`Changed Member Status to ${status}`, 'Members', `Set status of ${target?.fullName} (${target?.memberId}) to ${status}.`);
    showToast('success', 'Status Updated', `${target?.fullName || 'Member'} status is now ${status}.`);
  };

  const deleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    logAuditEvent('Deleted Member Record', 'Members', `Removed member ${target?.fullName} (${target?.memberId}).`);
    showToast('info', 'Member Deleted', 'Member has been removed from registry.');
  };

  // Event Management
  const addEvent = (eventData: Omit<EventItem, 'id' | 'currentParticipants' | 'createdAt'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: 'evt-' + Date.now(),
      currentParticipants: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEvents(prev => [newEvent, ...prev]);
    logAuditEvent('Created Event', 'Events', `Created new event: "${newEvent.title}".`);
    addNotification('New Event Posted', `Check out the newly announced event: ${newEvent.title}`, 'event');
    showToast('success', 'Event Created', `"${newEvent.title}" has been created.`);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    const target = events.find(e => e.id === id);
    logAuditEvent('Updated Event Details', 'Events', `Modified event: "${target?.title || id}".`);
    showToast('success', 'Event Updated', 'Event changes have been saved.');
  };

  const deleteEvent = (id: string) => {
    const target = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logAuditEvent('Deleted Event', 'Events', `Removed event: "${target?.title}".`);
    showToast('info', 'Event Removed', 'Event has been deleted.');
  };

  const isMemberRegisteredForEvent = (eventId: string, memberId: string) => {
    return registrations.some(r => r.eventId === eventId && r.memberId === memberId && r.status === 'Registered');
  };

  const registerForEvent = (eventId: string, memberInfo: { memberId: string; name: string; email: string }) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Event not found.' };

    if (!targetEvent.registrationEnabled) {
      return { success: false, message: 'Registration is currently disabled for this event.' };
    }

    if (targetEvent.currentParticipants >= targetEvent.maxParticipants) {
      return { success: false, message: 'Event has reached maximum participant capacity.' };
    }

    // Check duplicate
    const exists = registrations.some(r => r.eventId === eventId && r.memberId === memberInfo.memberId && r.status === 'Registered');
    if (exists) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    const newReg: EventRegistration = {
      id: 'reg-' + Date.now(),
      eventId,
      memberId: memberInfo.memberId,
      memberName: memberInfo.name,
      memberEmail: memberInfo.email,
      registeredAt: new Date().toLocaleString(),
      status: 'Registered'
    };

    setRegistrations(prev => [...prev, newReg]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, currentParticipants: e.currentParticipants + 1 } : e));
    
    // Update member stats
    setMembers(prev => prev.map(m => m.memberId === memberInfo.memberId ? {
      ...m,
      stats: { ...m.stats, eventsJoined: m.stats.eventsJoined + 1 }
    } : m));

    addNotification('Registration Confirmed', `You successfully registered for "${targetEvent.title}".`, 'event');
    showToast('success', 'Registration Confirmed', `You are registered for "${targetEvent.title}".`);
    return { success: true, message: 'Successfully registered for event!' };
  };

  const cancelEventRegistration = (eventId: string, memberId: string) => {
    setRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.memberId === memberId)));
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, currentParticipants: Math.max(0, e.currentParticipants - 1) } : e));
    showToast('info', 'Registration Cancelled', 'Your registration has been cancelled.');
  };

  // Attendance Engine & Sessions
  const createAttendanceSession = (eventId: string, startTime: string, endTime: string, location: string): AttendanceSession => {
    const event = events.find(e => e.id === eventId);
    const newSession: AttendanceSession = {
      id: 'ses-' + Date.now(),
      eventId,
      eventTitle: event ? event.title : 'Organization Activity',
      date: event ? event.date : new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      location,
      isOpen: true,
      qrCodeValue: `PAGASA-ATTEND-${eventId}-${Date.now().toString(36).toUpperCase()}`,
      totalRegistered: event ? event.currentParticipants || 1 : 1,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      excusedCount: 0,
      attendanceRate: 0,
      createdAt: new Date().toISOString()
    };
    setAttendanceSessions(prev => [newSession, ...prev]);
    logAuditEvent('Opened Attendance Session', 'Attendance', `Created live attendance session for "${newSession.eventTitle}".`);
    showToast('success', 'Session Created', `Live attendance session opened for ${newSession.eventTitle}.`);
    return newSession;
  };

  const toggleAttendanceSession = (sessionId: string, isOpen: boolean) => {
    setAttendanceSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isOpen } : s));
    const target = attendanceSessions.find(s => s.id === sessionId);
    logAuditEvent(`${isOpen ? 'Opened' : 'Closed'} Attendance Session`, 'Attendance', `Session for "${target?.eventTitle}" is now ${isOpen ? 'OPEN' : 'CLOSED'}.`);
    showToast('info', 'Session Updated', `Attendance session is now ${isOpen ? 'OPEN' : 'CLOSED'}.`);
  };

  const recordAttendance = (
    sessionId: string,
    memberIdentifier: string, // could be memberId or name or scanned QR payload
    method: 'QR_SCAN' | 'MANUAL' | 'SEARCH',
    statusOverride?: AttendanceStatus,
    remarks?: string
  ): { success: boolean; message: string; record?: AttendanceRecord; isDuplicate?: boolean } => {
    const session = attendanceSessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Attendance session not found.' };
    if (!session.isOpen) return { success: false, message: 'This attendance session is currently closed.' };

    // Find member by ID or MemberId
    const member = members.find(m => 
      m.memberId.toLowerCase() === memberIdentifier.trim().toLowerCase() ||
      m.id === memberIdentifier ||
      m.fullName.toLowerCase() === memberIdentifier.trim().toLowerCase() ||
      memberIdentifier.includes(m.memberId)
    );

    if (!member) {
      return { success: false, message: `Member not found for "${memberIdentifier}". Please verify Member ID.` };
    }

    // Check duplicate check-in
    const existingRecord = attendanceRecords.find(r => r.sessionId === sessionId && r.memberId === member.memberId);
    if (existingRecord) {
      return {
        success: false,
        isDuplicate: true,
        message: `⚠ Already Checked In at ${existingRecord.checkInTime} (Status: ${existingRecord.status})`,
        record: existingRecord
      };
    }

    // Determine status (Present vs Late based on grace period if not overridden)
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalStatus: AttendanceStatus = statusOverride || 'Present';

    const newRecord: AttendanceRecord = {
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sessionId,
      eventId: session.eventId,
      eventTitle: session.eventTitle,
      memberId: member.memberId,
      memberName: member.fullName,
      memberBarangay: member.barangay,
      checkInTime: timeString,
      date: session.date,
      status: finalStatus,
      method,
      recordedBy: currentUser ? currentUser.name : 'System QR Scanner',
      remarks
    };

    const updatedRecords = [newRecord, ...attendanceRecords];
    setAttendanceRecords(updatedRecords);

    // Recalculate session metrics
    const sessionRecords = updatedRecords.filter(r => r.sessionId === sessionId);
    const present = sessionRecords.filter(r => r.status === 'Present').length;
    const late = sessionRecords.filter(r => r.status === 'Late').length;
    const absent = sessionRecords.filter(r => r.status === 'Absent').length;
    const excused = sessionRecords.filter(r => r.status === 'Excused').length;
    const totalAttended = present + late;
    const rate = session.totalRegistered > 0 ? Number(((totalAttended / session.totalRegistered) * 100).toFixed(1)) : 100;

    setAttendanceSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s,
      presentCount: present,
      lateCount: late,
      absentCount: absent,
      excusedCount: excused,
      attendanceRate: rate
    } : s));

    // Update member stats
    setMembers(prev => prev.map(m => m.memberId === member.memberId ? {
      ...m,
      stats: {
        ...m.stats,
        totalAttendance: m.stats.totalAttendance + 1,
        volunteerHours: m.stats.volunteerHours + 4,
        attendanceRate: Number((((m.stats.totalAttendance + 1) / Math.max(1, m.stats.eventsJoined || 1)) * 100).toFixed(1))
      }
    } : m));

    logAuditEvent('Recorded Attendance', 'Attendance', `Marked ${member.fullName} (${member.memberId}) as ${finalStatus} for "${session.eventTitle}".`);
    addNotification('Attendance Recorded', `Your attendance for "${session.eventTitle}" was logged at ${timeString} (${finalStatus}).`, 'attendance');

    return {
      success: true,
      message: `✓ Attendance Recorded Successfully (${timeString})`,
      record: newRecord
    };
  };

  const updateAttendanceRecordStatus = (recordId: string, status: AttendanceStatus, remarks?: string) => {
    setAttendanceRecords(prev => prev.map(r => r.id === recordId ? { ...r, status, remarks: remarks !== undefined ? remarks : r.remarks } : r));
    logAuditEvent('Corrected Attendance Record', 'Attendance', `Updated attendance record #${recordId} to ${status}.`);
    showToast('success', 'Attendance Updated', `Record updated to ${status}.`);
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    logAuditEvent('Deleted Attendance Record', 'Attendance', `Removed attendance record #${recordId}.`);
    showToast('info', 'Record Removed', 'Attendance entry removed.');
  };

  // Projects
  const addProject = (data: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = { ...data, id: 'prj-' + Date.now() };
    setProjects(prev => [newProject, ...prev]);
    logAuditEvent('Added New Project', 'Projects', `Created project: "${newProject.title}".`);
    showToast('success', 'Project Added', `"${newProject.title}" has been added.`);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('success', 'Project Updated', 'Project changes saved.');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('info', 'Project Deleted', 'Project has been removed.');
  };

  // Activities
  const addActivity = (data: Omit<ActivityItem, 'id'>) => {
    const newAct: ActivityItem = { ...data, id: 'act-' + Date.now() };
    setActivities(prev => [newAct, ...prev]);
    logAuditEvent('Created Activity', 'Activities', `Added activity: "${newAct.title}".`);
    showToast('success', 'Activity Created', `"${newAct.title}" added to schedule.`);
  };

  const updateActivity = (id: string, updates: Partial<ActivityItem>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast('success', 'Activity Updated', 'Activity saved.');
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Activity Removed', 'Activity deleted.');
  };

  // Announcements
  const addAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'views'>) => {
    const newAnn: AnnouncementItem = { ...data, id: 'ann-' + Date.now(), views: 1 };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAuditEvent('Published Announcement', 'Announcements', `Created announcement: "${newAnn.title}".`);
    addNotification('New Announcement', newAnn.title, 'announcement');
    showToast('success', 'Announcement Published', `"${newAnn.title}" is now live.`);
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast('success', 'Announcement Updated', 'Announcement saved.');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Announcement Deleted', 'Announcement removed.');
  };

  // Gallery
  const addGalleryPhoto = (data: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = { ...data, id: 'gal-' + Date.now() };
    setGallery(prev => [newPhoto, ...prev]);
    logAuditEvent('Uploaded Gallery Photo', 'Gallery', `Added image: "${newPhoto.title}".`);
    showToast('success', 'Photo Added', 'Image uploaded to photo gallery.');
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('info', 'Photo Removed', 'Gallery item deleted.');
  };

  // Officials
  const addOfficial = (data: Omit<OfficialItem, 'id'>) => {
    const newOfficial: OfficialItem = { ...data, id: 'off-' + Date.now() };
    setOfficials(prev => [...prev, newOfficial].sort((a, b) => a.rank - b.rank));
    logAuditEvent('Added Organization Official', 'Officials', `Added ${newOfficial.fullName} (${newOfficial.position}).`);
    showToast('success', 'Official Added', `${newOfficial.fullName} added to officials roster.`);
  };

  const updateOfficial = (id: string, updates: Partial<OfficialItem>) => {
    setOfficials(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o).sort((a, b) => a.rank - b.rank));
    showToast('success', 'Official Updated', 'Official information saved.');
  };

  const deleteOfficial = (id: string) => {
    setOfficials(prev => prev.filter(o => o.id !== id));
    showToast('info', 'Official Removed', 'Official removed from roster.');
  };

  // Certificates
  const issueCertificate = (data: Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrVerificationUrl'>): CertificateItem => {
    const certNum = `CERT-PAGASA-2026-${String(certificates.length + 1).padStart(4, '0')}`;
    const newCert: CertificateItem = {
      ...data,
      id: 'cert-' + Date.now(),
      certificateNumber: certNum,
      qrVerificationUrl: `https://pagasaguimba.org/verify/${certNum}`
    };
    setCertificates(prev => [newCert, ...prev]);
    
    // Update member certificate count
    setMembers(prev => prev.map(m => m.memberId === data.memberId ? {
      ...m,
      stats: { ...m.stats, certificatesEarned: m.stats.certificatesEarned + 1 }
    } : m));

    logAuditEvent('Issued Official Certificate', 'Certificates', `Issued certificate ${certNum} to ${data.memberName} for "${data.eventOrActivityTitle}".`);
    addNotification('Certificate Generated', `Your certificate for "${data.eventOrActivityTitle}" is ready to view & download.`, 'certificate');
    showToast('success', 'Certificate Issued', `Certificate ${certNum} generated for ${data.memberName}.`);
    return newCert;
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
    showToast('info', 'Certificate Deleted', 'Certificate record deleted.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentPage,
        selectedEventId,
        selectedMemberId,
        activeCertificate,
        isAuthModalOpen,
        authModalMode,
        isGlobalSearchOpen,
        toasts,
        theme,
        effectiveTheme,
        colorPalette,
        setTheme,
        toggleTheme,
        setColorPalette,
        setCurrentPage,
        setSelectedEventId,
        setSelectedMemberId,
        setActiveCertificate,
        setIsAuthModalOpen,
        setAuthModalMode,
        setIsGlobalSearchOpen,
        switchRole,
        loginUser,
        logoutUser,
        updateCurrentUser,
        updateUserProfilePicture,
        showToast,
        addToast,
        removeToast,
        settings,
        updateSettings,
        members,
        addMember,
        updateMember,
        updateMemberStatus,
        deleteMember,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelEventRegistration,
        isMemberRegisteredForEvent,
        registrations,
        attendanceSessions,
        attendanceRecords,
        createAttendanceSession,
        toggleAttendanceSession,
        recordAttendance,
        updateAttendanceRecordStatus,
        deleteAttendanceRecord,
        projects,
        addProject,
        updateProject,
        deleteProject,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        gallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        officials,
        addOfficial,
        updateOfficial,
        deleteOfficial,
        certificates,
        issueCertificate,
        deleteCertificate,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        auditLogs,
        logAuditEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
