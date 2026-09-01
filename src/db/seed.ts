import { db } from "./index.ts";
import * as schema from "./schema.ts";
import {
  INITIAL_SETTINGS,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_OFFICIALS,
  INITIAL_CERTIFICATES,
  INITIAL_GALLERY,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from "../data/mockData.ts";

export async function seedDatabaseIfEmpty() {
  try {
    const existingSettings = await db.select().from(schema.settings).limit(1);
    if (existingSettings.length === 0) {
      console.log("Seeding initial database with default organization datasets...");
      
      // 1. Settings
      await db.insert(schema.settings).values({
        id: "default_settings",
        data: INITIAL_SETTINGS
      }).onConflictDoNothing();

      // 2. Members
      for (const m of INITIAL_MEMBERS) {
        await db.insert(schema.members).values({
          id: m.id,
          memberId: m.memberId,
          fullName: m.fullName,
          email: m.email,
          contactNumber: m.contactNumber || "",
          birthdate: m.birthdate || "",
          age: m.age || 18,
          gender: m.gender || "Prefer not to say",
          address: m.address || "",
          barangay: m.barangay || "",
          educationalStatus: m.educationalStatus || "College / University",
          occupation: m.occupation || "",
          profilePicture: m.profilePicture || "",
          membershipDate: m.membershipDate || "",
          membershipStatus: m.membershipStatus || "Active",
          organizationPosition: m.organizationPosition || null,
          committee: m.committee || null,
          emergencyContact: m.emergencyContact || null,
          stats: m.stats || null,
        }).onConflictDoNothing();
      }

      // 3. Events
      for (const e of INITIAL_EVENTS) {
        await db.insert(schema.events).values({
          id: e.id,
          title: e.title,
          category: e.category,
          bannerImage: e.bannerImage || "",
          date: e.date,
          time: e.time,
          location: e.location,
          venue: e.venue || null,
          organizer: e.organizer || "PAGASA Guimba",
          description: e.description || "",
          objectives: e.objectives || [],
          requirements: e.requirements || [],
          maxParticipants: e.maxParticipants || 100,
          maxCapacity: e.maxCapacity || null,
          currentParticipants: e.currentParticipants || 0,
          registeredCount: e.registeredCount || null,
          registrationDeadline: e.registrationDeadline || null,
          registrationEnabled: e.registrationEnabled ?? true,
          isRegistrationOpen: e.isRegistrationOpen ?? true,
          status: e.status || "Upcoming",
          isPublished: e.isPublished ?? true,
          qrCodeSecret: e.qrCodeSecret || null,
          speakers: e.speakers || [],
          agenda: e.agenda || [],
          createdAt: e.createdAt || null
        }).onConflictDoNothing();
      }

      // 4. Attendance Sessions
      for (const s of INITIAL_SESSIONS) {
        await db.insert(schema.attendanceSessions).values({
          id: s.id,
          eventId: s.eventId,
          eventTitle: s.eventTitle,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          location: s.location,
          isOpen: s.isOpen ?? true,
          qrCodeValue: s.qrCodeValue,
          totalRegistered: s.totalRegistered || 0,
          presentCount: s.presentCount || 0,
          lateCount: s.lateCount || 0,
          absentCount: s.absentCount || 0,
          excusedCount: s.excusedCount || 0,
          attendanceRate: Math.round(s.attendanceRate || 0),
          createdAt: s.createdAt
        }).onConflictDoNothing();
      }

      // 5. Attendance Records
      for (const r of INITIAL_ATTENDANCE_RECORDS) {
        await db.insert(schema.attendanceRecords).values({
          id: r.id,
          sessionId: r.sessionId,
          eventId: r.eventId,
          eventTitle: r.eventTitle,
          memberId: r.memberId,
          memberName: r.memberName,
          memberBarangay: r.memberBarangay || "",
          checkInTime: r.checkInTime,
          date: r.date,
          status: r.status || "Present",
          method: r.method || "QR_SCAN",
          recordedBy: r.recordedBy || "System",
          remarks: r.remarks || null
        }).onConflictDoNothing();
      }

      // 6. Projects
      for (const p of INITIAL_PROJECTS) {
        await db.insert(schema.projects).values({
          id: p.id,
          title: p.title,
          category: p.category,
          image: p.image || "",
          description: p.description || "",
          objectives: p.objectives || [],
          deliverables: p.deliverables || [],
          startDate: p.startDate,
          endDate: p.endDate || null,
          location: p.location || null,
          projectLeader: p.projectLeader,
          targetBeneficiaries: p.targetBeneficiaries || null,
          budget: p.budget || null,
          participantsCount: p.participantsCount || 0,
          progress: p.progress || 0,
          status: p.status || "Ongoing",
          results: p.results || null,
          gallery: p.gallery || []
        }).onConflictDoNothing();
      }

      // 7. Activities
      for (const a of INITIAL_ACTIVITIES) {
        await db.insert(schema.activities).values({
          id: a.id,
          title: a.title,
          category: a.category,
          date: a.date,
          time: a.time,
          location: a.location,
          leader: a.leader,
          description: a.description || "",
          targetParticipants: a.targetParticipants || 50,
          status: a.status || "Upcoming",
          attendanceTracked: a.attendanceTracked ?? true
        }).onConflictDoNothing();
      }

      // 8. Announcements
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await db.insert(schema.announcements).values({
          id: ann.id,
          title: ann.title,
          category: ann.category,
          date: ann.date,
          author: ann.author,
          authorRole: ann.authorRole || "Youth Executive",
          featuredImage: ann.featuredImage || "",
          summary: ann.summary || "",
          content: ann.content || "",
          isPublished: ann.isPublished ?? true,
          isPinned: ann.isPinned ?? false,
          views: ann.views || 0
        }).onConflictDoNothing();
      }

      // 9. Officials
      for (const o of INITIAL_OFFICIALS) {
        await db.insert(schema.officials).values({
          id: o.id,
          fullName: o.fullName,
          position: o.position,
          committee: o.committee || "Executive Committee",
          rank: o.rank || 1,
          order: o.order || 1,
          profilePicture: o.profilePicture || "",
          bio: o.bio || "",
          term: o.term || "2025 - 2027",
          contactEmail: o.contactEmail || null,
          contactNumber: o.contactNumber || null,
          facebookUrl: o.facebookUrl || null
        }).onConflictDoNothing();
      }

      // 10. Certificates
      for (const c of INITIAL_CERTIFICATES) {
        await db.insert(schema.certificates).values({
          id: c.id,
          certificateNumber: c.certificateNumber,
          memberId: c.memberId,
          memberName: c.memberName,
          eventOrActivityTitle: c.eventOrActivityTitle,
          certificateType: c.certificateType,
          issueDate: c.issueDate,
          organization: c.organization || "PAGASA Guimba",
          signatories: c.signatories || [],
          description: c.description || "",
          qrVerificationUrl: c.qrVerificationUrl || ""
        }).onConflictDoNothing();
      }

      // 11. Gallery
      for (const g of INITIAL_GALLERY) {
        await db.insert(schema.gallery).values({
          id: g.id,
          title: g.title,
          category: g.category,
          imageUrl: g.imageUrl,
          date: g.date,
          caption: g.caption || null,
          description: g.description || null,
          eventTag: g.eventTag || null,
          eventTitle: g.eventTitle || null
        }).onConflictDoNothing();
      }

      // 12. Notifications
      for (const n of INITIAL_NOTIFICATIONS) {
        await db.insert(schema.notifications).values({
          id: n.id,
          userId: n.userId || null,
          title: n.title,
          message: n.message,
          type: n.type || "system",
          createdAt: n.createdAt,
          isRead: n.isRead ?? false,
          linkAction: n.linkAction || null
        }).onConflictDoNothing();
      }

      // 13. Audit Logs
      for (const l of INITIAL_AUDIT_LOGS) {
        await db.insert(schema.auditLogs).values({
          id: l.id,
          userName: l.userName,
          userRole: l.userRole,
          action: l.action,
          module: l.module,
          details: l.details,
          timestamp: l.timestamp,
          ipAddress: l.ipAddress || null
        }).onConflictDoNothing();
      }

      console.log("Database seeded successfully with all organization records.");
    }
  } catch (err) {
    console.error("Error during initial database seeding:", err);
  }
}
