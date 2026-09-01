import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number").notNull().default(""),
  birthdate: text("birthdate").notNull().default(""),
  age: integer("age").notNull().default(18),
  gender: text("gender").notNull().default("Prefer not to say"),
  address: text("address").notNull().default(""),
  barangay: text("barangay").notNull().default(""),
  educationalStatus: text("educational_status").notNull().default("College / University"),
  occupation: text("occupation").notNull().default(""),
  profilePicture: text("profile_picture").notNull().default(""),
  membershipDate: text("membership_date").notNull().default(""),
  membershipStatus: text("membership_status").notNull().default("Active"),
  organizationPosition: text("organization_position"),
  committee: text("committee"),
  emergencyContact: jsonb("emergency_contact").$type<{
    name: string;
    relationship: string;
    contactNumber: string;
  }>(),
  stats: jsonb("stats").$type<{
    eventsJoined: number;
    totalAttendance: number;
    attendanceRate: number;
    volunteerHours: number;
    projectsParticipated: number;
    certificatesEarned: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow()
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  bannerImage: text("banner_image").notNull().default(""),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  venue: text("venue"),
  organizer: text("organizer").notNull().default("PAGASA Guimba"),
  description: text("description").notNull().default(""),
  objectives: jsonb("objectives").$type<string[]>(),
  requirements: jsonb("requirements").$type<string[]>(),
  maxParticipants: integer("max_participants").notNull().default(100),
  maxCapacity: integer("max_capacity"),
  currentParticipants: integer("current_participants").notNull().default(0),
  registeredCount: integer("registered_count"),
  registrationDeadline: text("registration_deadline"),
  registrationEnabled: boolean("registration_enabled").default(true),
  isRegistrationOpen: boolean("is_registration_open").default(true),
  status: text("status").notNull().default("Upcoming"),
  isPublished: boolean("is_published").notNull().default(true),
  qrCodeSecret: text("qr_code_secret"),
  speakers: jsonb("speakers").$type<{ name: string; title: string; avatar?: string }[]>(),
  agenda: jsonb("agenda").$type<{ time: string; title: string }[]>(),
  createdAt: text("created_at")
});

export const registrations = pgTable("registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  memberId: text("member_id").notNull(),
  memberName: text("member_name").notNull(),
  memberEmail: text("member_email").notNull(),
  registeredAt: text("registered_at").notNull(),
  status: text("status").notNull().default("Registered"),
  notes: text("notes")
});

export const attendanceSessions = pgTable("attendance_sessions", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  eventTitle: text("event_title").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
  isOpen: boolean("is_open").notNull().default(true),
  qrCodeValue: text("qr_code_value").notNull(),
  totalRegistered: integer("total_registered").notNull().default(0),
  presentCount: integer("present_count").notNull().default(0),
  lateCount: integer("late_count").notNull().default(0),
  absentCount: integer("absent_count").notNull().default(0),
  excusedCount: integer("excused_count").notNull().default(0),
  attendanceRate: integer("attendance_rate").notNull().default(0),
  createdAt: text("created_at").notNull()
});

export const attendanceRecords = pgTable("attendance_records", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  eventId: text("event_id").notNull(),
  eventTitle: text("event_title").notNull(),
  memberId: text("member_id").notNull(),
  memberName: text("member_name").notNull(),
  memberBarangay: text("member_barangay").notNull().default(""),
  checkInTime: text("check_in_time").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("Present"),
  method: text("method").notNull().default("QR_SCAN"),
  recordedBy: text("recorded_by").notNull().default("System"),
  remarks: text("remarks")
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull().default(""),
  description: text("description").notNull().default(""),
  objectives: jsonb("objectives").$type<string[]>(),
  deliverables: jsonb("deliverables").$type<string[]>(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  location: text("location"),
  projectLeader: text("project_leader").notNull(),
  targetBeneficiaries: text("target_beneficiaries"),
  budget: text("budget"),
  participantsCount: integer("participants_count").notNull().default(0),
  progress: integer("progress").default(0),
  status: text("status").notNull().default("Ongoing"),
  results: text("results"),
  gallery: jsonb("gallery").$type<string[]>()
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  leader: text("leader").notNull(),
  description: text("description").notNull().default(""),
  targetParticipants: integer("target_participants").notNull().default(50),
  status: text("status").notNull().default("Upcoming"),
  attendanceTracked: boolean("attendance_tracked").notNull().default(true)
});

export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  authorRole: text("author_role").notNull().default("Youth Executive"),
  featuredImage: text("featured_image").notNull().default(""),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  isPublished: boolean("is_published").notNull().default(true),
  isPinned: boolean("is_pinned").notNull().default(false),
  views: integer("views").notNull().default(0)
});

export const officials = pgTable("officials", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  position: text("position").notNull(),
  committee: text("committee").notNull().default("Executive Committee"),
  rank: integer("rank").default(1),
  order: integer("order").default(1),
  profilePicture: text("profile_picture").notNull().default(""),
  bio: text("bio").notNull().default(""),
  term: text("term").notNull().default("2025 - 2027"),
  contactEmail: text("contact_email"),
  contactNumber: text("contact_number"),
  facebookUrl: text("facebook_url")
});

export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  certificateNumber: text("certificate_number").notNull().unique(),
  memberId: text("member_id").notNull(),
  memberName: text("member_name").notNull(),
  eventOrActivityTitle: text("event_or_activity_title").notNull(),
  certificateType: text("certificate_type").notNull(),
  issueDate: text("issue_date").notNull(),
  organization: text("organization").notNull().default("PAGASA Guimba"),
  signatories: jsonb("signatories").$type<{ name: string; position: string }[]>(),
  description: text("description").notNull().default(""),
  qrVerificationUrl: text("qr_verification_url").notNull().default("")
});

export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  date: text("date").notNull(),
  caption: text("caption"),
  description: text("description"),
  eventTag: text("event_tag"),
  eventTitle: text("event_title")
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("system"),
  createdAt: text("created_at").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  linkAction: text("link_action")
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userName: text("user_name").notNull(),
  userRole: text("user_role").notNull(),
  action: text("action").notNull(),
  module: text("module").notNull(),
  details: text("details").notNull(),
  timestamp: text("timestamp").notNull(),
  ipAddress: text("ip_address")
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("default_settings"),
  data: jsonb("data").$type<any>().notNull()
});
