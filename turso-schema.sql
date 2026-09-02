-- ============================================================================
-- PAGASA GUIMBA YOUTH PORTAL - TURSO / LIBSQL / SQLITE DATABASE SCHEMA & SEED
-- ============================================================================
-- Compatible with Turso Cloud (libSQL), SQLite3, and Cloudflare D1
-- To execute in Turso:
--   turso db shell <your-db-name> < turso-schema.sql
-- Or paste directly into the Turso web shell / SQLite console.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. USERS & MEMBERS
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  member_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contact_number TEXT,
  birthdate TEXT,
  age INTEGER,
  gender TEXT,
  address TEXT,
  barangay TEXT NOT NULL,
  educational_status TEXT,
  occupation TEXT,
  profile_picture TEXT,
  membership_date TEXT NOT NULL,
  membership_status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED, PENDING
  organization_position TEXT,
  committee TEXT,
  emergency_contact TEXT, -- JSON string: { name, relationship, contactNumber }
  stats TEXT, -- JSON string: { eventsAttended, certificatesEarned, volunteerHours, points }
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 2. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Leadership, Civic, Education, Environmental, Sports, Culture
  banner_image TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  venue TEXT,
  organizer TEXT NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT, -- JSON array of strings
  requirements TEXT, -- JSON array of strings
  max_participants INTEGER DEFAULT 0,
  max_capacity INTEGER DEFAULT 0,
  current_participants INTEGER DEFAULT 0,
  registered_count INTEGER DEFAULT 0,
  registration_deadline TEXT,
  registration_enabled INTEGER NOT NULL DEFAULT 1, -- 1: true, 0: false
  is_registration_open INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'UPCOMING', -- UPCOMING, ONGOING, COMPLETED, CANCELLED
  is_published INTEGER NOT NULL DEFAULT 1,
  qr_code_secret TEXT,
  speakers TEXT, -- JSON array of speaker objects
  agenda TEXT, -- JSON array of agenda items
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 3. EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  registered_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  status TEXT NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, ATTENDED
  notes TEXT
);

-- 4. ATTENDANCE SESSIONS
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  location TEXT NOT NULL,
  is_open INTEGER NOT NULL DEFAULT 1,
  qr_code_value TEXT NOT NULL,
  total_registered INTEGER DEFAULT 0,
  present_count INTEGER DEFAULT 0,
  late_count INTEGER DEFAULT 0,
  absent_count INTEGER DEFAULT 0,
  excused_count INTEGER DEFAULT 0,
  attendance_rate REAL DEFAULT 0.0,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 5. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  event_id TEXT,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  barangay TEXT NOT NULL,
  check_in_time TEXT NOT NULL DEFAULT (DATETIME('now')),
  status TEXT NOT NULL DEFAULT 'PRESENT', -- PRESENT, LATE, EXCUSED, ABSENT
  verified_by TEXT,
  method TEXT NOT NULL DEFAULT 'QR_SCAN' -- QR_SCAN, MANUAL, FACIAL_ID
);

-- 6. COMMUNITY PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  description TEXT NOT NULL,
  objectives TEXT, -- JSON array of strings
  deliverables TEXT, -- JSON array of strings
  start_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT NOT NULL,
  project_leader TEXT NOT NULL,
  target_beneficiaries TEXT NOT NULL,
  budget REAL DEFAULT 0.0,
  participants_count INTEGER DEFAULT 0,
  progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ONGOING', -- PROPOSED, ONGOING, COMPLETED, ARCHIVED
  results TEXT,
  gallery TEXT -- JSON array of image URLs
);

-- 7. BARANGAY ACTIVITIES & OUTREACH
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  leader TEXT NOT NULL,
  description TEXT NOT NULL,
  target_participants TEXT,
  status TEXT NOT NULL DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
  attendance_tracked INTEGER NOT NULL DEFAULT 0
);

-- 8. ANNOUNCEMENTS & ADVISORIES
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- General, Urgent, Event, Project, Policy
  author TEXT NOT NULL,
  author_position TEXT,
  publish_date TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  tags TEXT, -- JSON array of strings
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 9. OFFICIALS & LEADERSHIP ROSTER
CREATE TABLE IF NOT EXISTS officials (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  committee TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 1,
  profile_picture TEXT,
  bio TEXT,
  term TEXT NOT NULL,
  contact_email TEXT,
  contact_number TEXT,
  facebook_url TEXT
);

-- 10. DIGITAL CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  recipient_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  title TEXT NOT NULL,
  event_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  signatory_name TEXT NOT NULL,
  signatory_title TEXT NOT NULL,
  organization_name TEXT NOT NULL DEFAULT 'PAGASA Guimba Youth Organization',
  template_type TEXT NOT NULL DEFAULT 'LEADERSHIP', -- PARTICIPATION, LEADERSHIP, APPRECIATION, EXCELLENCE
  qr_verification_code TEXT UNIQUE NOT NULL,
  qr_code_url TEXT,
  metadata TEXT
);

-- 11. MUNICIPAL PHOTO GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 12. AUDIT LOGS & ACTIVITY TRACKER
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (DATETIME('now')),
  ip_address TEXT
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO', -- INFO, SUCCESS, WARNING, ALERT
  is_read INTEGER NOT NULL DEFAULT 0,
  action_url TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 14. PORTAL SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL -- Full JSON configuration payload
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_barangay ON members(barangay);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_certificates_qr ON certificates(qr_verification_code);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);

-- ============================================================================
-- SEED DATA (INITIAL PORTAL SYSTEM RECORDS)
-- ============================================================================

INSERT OR REPLACE INTO officials (id, full_name, position, committee, rank, "order", bio, term, contact_email, contact_number)
VALUES
  ('off-1', 'Gian Carlo Magat', 'Executive President / Founder', 'Executive Committee', 1, 1, 'Championing youth empowerment, municipal leadership, and digital civic governance across Guimba.', '2025-2027', 'giancarlomagat19@gmail.com', '+63 912 345 6789'),
  ('off-2', 'Mark Angelo Bautista', 'Vice President for Internal Affairs', 'Internal Governance', 2, 2, 'Overseeing barangay youth coordinators and internal council affairs.', '2025-2027', 'internal@pagasaguimba.org', '+63 922 456 7890'),
  ('off-3', 'Patricia Anne Reyes', 'Vice President for External Affairs', 'Partnerships & LGU Relations', 2, 3, 'Facilitating municipal government linkages, corporate sponsorships, and NGO tie-ups.', '2025-2027', 'external@pagasaguimba.org', '+63 933 567 8901');

INSERT OR REPLACE INTO events (id, title, category, date, time, location, venue, organizer, description, max_participants, current_participants, registered_count, status, is_published)
VALUES
  ('ev-1', 'PAGASA Guimba Youth Leadership Summit 2025', 'Leadership', '2025-04-15', '08:00 AM - 05:00 PM', 'Guimba, Nueva Ecija', 'Guimba Municipal Gymnasium', 'PAGASA Executive Board & LGU Guimba', 'A municipal gathering of youth leaders across all 64 barangays designed to build leadership competencies and civic stewardship.', 500, 240, 240, 'UPCOMING', 1),
  ('ev-2', 'Digital Literacy & AI Skills Workshop', 'Education', '2025-05-10', '01:00 PM - 05:00 PM', 'Guimba Community E-Center', 'Municipal Tech Hub', 'Committee on Youth & Technology', 'Hands-on training introducing modern digital tools, productivity workflows, and practical technology for Guimba students.', 150, 85, 85, 'UPCOMING', 1);

INSERT OR REPLACE INTO announcements (id, title, category, author, author_position, publish_date, content, is_pinned)
VALUES
  ('ann-1', 'Welcome to the Official PAGASA Guimba Portal', 'General', 'Gian Carlo Magat', 'Executive President', '2025-03-01', 'We are thrilled to launch the official digital portal for the PAGASA Guimba Youth Organization. Register, explore events, and track your volunteer journey.', 1);
