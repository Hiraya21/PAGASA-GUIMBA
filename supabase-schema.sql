-- PAGASA Guimba Youth MIS Portal Schema for Supabase / PostgreSQL
-- You can copy and paste this directly into your Supabase Dashboard -> SQL Editor and click 'Run'

-- 1. Members Table
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT DEFAULT '',
    birthdate TEXT DEFAULT '',
    age INTEGER DEFAULT 18,
    gender TEXT DEFAULT 'Prefer not to say',
    address TEXT DEFAULT '',
    barangay TEXT DEFAULT '',
    educational_status TEXT DEFAULT 'College / University',
    occupation TEXT DEFAULT '',
    profile_picture TEXT DEFAULT '',
    membership_date TEXT DEFAULT '',
    membership_status TEXT DEFAULT 'Active',
    organization_position TEXT,
    committee TEXT,
    emergency_contact JSONB,
    stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    banner_image TEXT DEFAULT '',
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    venue TEXT,
    organizer TEXT DEFAULT 'PAGASA Guimba',
    description TEXT DEFAULT '',
    objectives JSONB,
    requirements JSONB,
    max_participants INTEGER DEFAULT 100,
    max_capacity INTEGER,
    current_participants INTEGER DEFAULT 0,
    registered_count INTEGER,
    registration_deadline TEXT,
    registration_enabled BOOLEAN DEFAULT true,
    is_registration_open BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'Upcoming',
    is_published BOOLEAN DEFAULT true,
    qr_code_secret TEXT,
    speakers JSONB,
    agenda JSONB,
    created_at TEXT
);

-- 3. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    member_email TEXT NOT NULL,
    registered_at TEXT NOT NULL,
    status TEXT DEFAULT 'Registered',
    notes TEXT
);

-- 4. Attendance Sessions Table
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    event_title TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT NOT NULL,
    is_open BOOLEAN DEFAULT true,
    qr_code_value TEXT NOT NULL,
    total_registered INTEGER DEFAULT 0,
    present_count INTEGER DEFAULT 0,
    late_count INTEGER DEFAULT 0,
    absent_count INTEGER DEFAULT 0,
    excused_count INTEGER DEFAULT 0,
    attendance_rate INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    event_title TEXT NOT NULL,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    member_barangay TEXT DEFAULT '',
    check_in_time TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Present',
    method TEXT DEFAULT 'QR_SCAN',
    recorded_by TEXT DEFAULT 'System',
    remarks TEXT
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT DEFAULT '',
    description TEXT DEFAULT '',
    objectives JSONB,
    deliverables JSONB,
    start_date TEXT NOT NULL,
    end_date TEXT,
    location TEXT,
    project_leader TEXT NOT NULL,
    target_beneficiaries TEXT,
    budget TEXT,
    participants_count INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Ongoing',
    results TEXT,
    gallery JSONB
);

-- 7. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    leader TEXT NOT NULL,
    description TEXT DEFAULT '',
    target_participants INTEGER DEFAULT 50,
    status TEXT DEFAULT 'Upcoming',
    attendance_tracked BOOLEAN DEFAULT true
);

-- 8. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT DEFAULT 'Youth Executive',
    featured_image TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    content TEXT DEFAULT '',
    is_published BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0
);

-- 9. Officials Table
CREATE TABLE IF NOT EXISTS public.officials (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    committee TEXT DEFAULT 'Executive Committee',
    rank INTEGER DEFAULT 1,
    "order" INTEGER DEFAULT 1,
    profile_picture TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    term TEXT DEFAULT '2025 - 2027',
    contact_email TEXT,
    contact_number TEXT,
    facebook_url TEXT
);

-- 10. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT NOT NULL UNIQUE,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    event_or_activity_title TEXT NOT NULL,
    certificate_type TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    organization TEXT DEFAULT 'PAGASA Guimba',
    signatories JSONB,
    description TEXT DEFAULT '',
    qr_verification_url TEXT DEFAULT ''
);

-- 11. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    date TEXT NOT NULL,
    caption TEXT,
    description TEXT,
    event_tag TEXT,
    event_title TEXT
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system',
    created_at TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link_action TEXT
);

-- 13. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    ip_address TEXT
);

-- 14. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    data JSONB NOT NULL
);

-- Enable Row Level Security (RLS) and public read/write policies for public portal usage
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for registrations" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for attendance_sessions" ON public.attendance_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for officials" ON public.officials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
