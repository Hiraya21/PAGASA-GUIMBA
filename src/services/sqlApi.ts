// API client that connects frontend to PostgreSQL backend (REST / Drizzle ORM)
import {
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
  AuditLogItem
} from '../types';

export const sqlApi = {
  // Settings
  async getSettings(): Promise<OrganizationSettings | null> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async saveSettings(data: OrganizationSettings): Promise<void> {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Members
  async getMembers(): Promise<Member[]> {
    try {
      const res = await fetch('/api/members');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveMember(m: Member): Promise<void> {
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(m)
    });
  },
  async deleteMember(id: string): Promise<void> {
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
  },

  // Events
  async getEvents(): Promise<EventItem[]> {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveEvent(e: EventItem): Promise<void> {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e)
    });
  },
  async deleteEvent(id: string): Promise<void> {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
  },

  // Registrations
  async getRegistrations(): Promise<EventRegistration[]> {
    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveRegistration(r: EventRegistration): Promise<void> {
    await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r)
    });
  },
  async deleteRegistration(id: string): Promise<void> {
    await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
  },

  // Attendance Sessions
  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    try {
      const res = await fetch('/api/attendance-sessions');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveAttendanceSession(s: AttendanceSession): Promise<void> {
    await fetch('/api/attendance-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
  },

  // Attendance Records
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const res = await fetch('/api/attendance-records');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveAttendanceRecord(r: AttendanceRecord): Promise<void> {
    await fetch('/api/attendance-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r)
    });
  },
  async deleteAttendanceRecord(id: string): Promise<void> {
    await fetch(`/api/attendance-records/${id}`, { method: 'DELETE' });
  },

  // Projects
  async getProjects(): Promise<ProjectItem[]> {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveProject(p: ProjectItem): Promise<void> {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  },
  async deleteProject(id: string): Promise<void> {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  },

  // Activities
  async getActivities(): Promise<ActivityItem[]> {
    try {
      const res = await fetch('/api/activities');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveActivity(a: ActivityItem): Promise<void> {
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(a)
    });
  },
  async deleteActivity(id: string): Promise<void> {
    await fetch(`/api/activities/${id}`, { method: 'DELETE' });
  },

  // Announcements
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    try {
      const res = await fetch('/api/announcements');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveAnnouncement(ann: AnnouncementItem): Promise<void> {
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann)
    });
  },
  async deleteAnnouncement(id: string): Promise<void> {
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
  },

  // Officials
  async getOfficials(): Promise<OfficialItem[]> {
    try {
      const res = await fetch('/api/officials');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveOfficial(o: OfficialItem): Promise<void> {
    await fetch('/api/officials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(o)
    });
  },
  async deleteOfficial(id: string): Promise<void> {
    await fetch(`/api/officials/${id}`, { method: 'DELETE' });
  },

  // Certificates
  async getCertificates(): Promise<CertificateItem[]> {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveCertificate(c: CertificateItem): Promise<void> {
    await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c)
    });
  },
  async deleteCertificate(id: string): Promise<void> {
    await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
  },

  // Gallery
  async getGallery(): Promise<GalleryPhoto[]> {
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveGalleryPhoto(g: GalleryPhoto): Promise<void> {
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(g)
    });
  },
  async deleteGalleryPhoto(id: string): Promise<void> {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveNotification(n: NotificationItem): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n)
    });
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogItem[]> {
    try {
      const res = await fetch('/api/audit-logs');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async saveAuditLog(l: AuditLogItem): Promise<void> {
    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(l)
    });
  }
};
