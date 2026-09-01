import React, { useEffect } from 'react';
import { AppProvider, useApp, ActivePage } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Public Pages
import { PublicHomePage } from './components/public/PublicHomePage';
import { AboutPage } from './components/public/AboutPage';
import { OfficialsPage } from './components/public/OfficialsPage';
import { EventsPage } from './components/public/EventsPage';
import { EventDetailPage } from './components/public/EventDetailPage';
import { ProjectsPage } from './components/public/ProjectsPage';
import { ActivitiesPage } from './components/public/ActivitiesPage';
import { AnnouncementsPage } from './components/public/AnnouncementsPage';
import { GalleryPage } from './components/public/GalleryPage';
import { JoinPage } from './components/public/JoinPage';

// Member Layout & Pages
import { MemberLayout } from './components/member/MemberLayout';
import { MemberDashboard } from './components/member/MemberDashboard';
import { MemberQRPass } from './components/member/MemberQRPass';
import { MemberEvents } from './components/member/MemberEvents';
import { MemberAttendance } from './components/member/MemberAttendance';
import { MemberCertificates } from './components/member/MemberCertificates';
import { MemberProfile } from './components/member/MemberProfile';

// Admin Layout & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMembers } from './components/admin/AdminMembers';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminEvents } from './components/admin/AdminEvents';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminOfficials } from './components/admin/AdminOfficials';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminSettings } from './components/admin/AdminSettings';

import { motion } from 'motion/react';

const PageRenderer: React.FC = () => {
  const { 
    currentPage, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen 
  } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const isAdminRoute = currentPage.startsWith('admin-');
  const isMemberRoute = currentPage.startsWith('member-');

  // 1. Admin Portal Layout & Pages
  if (isAdminRoute) {
    let adminContent = <AdminDashboard />;
    switch (currentPage) {
      case 'admin-dashboard':
        adminContent = <AdminDashboard />;
        break;
      case 'admin-members':
        adminContent = <AdminMembers />;
        break;
      case 'admin-attendance':
        adminContent = <AdminAttendance />;
        break;
      case 'admin-events':
        adminContent = <AdminEvents />;
        break;
      case 'admin-projects':
        adminContent = <AdminProjects />;
        break;
      case 'admin-announcements':
        adminContent = <AdminAnnouncements />;
        break;
      case 'admin-gallery':
        adminContent = <AdminGallery />;
        break;
      case 'admin-officials':
        adminContent = <AdminOfficials />;
        break;
      case 'admin-certificates':
        adminContent = <AdminCertificates />;
        break;
      case 'admin-reports':
        adminContent = <AdminReports />;
        break;
      case 'admin-audit':
        adminContent = <AdminAuditLogs />;
        break;
      case 'admin-settings':
        adminContent = <AdminSettings />;
        break;
      default:
        adminContent = <AdminDashboard />;
    }

    return (
      <AdminLayout>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {adminContent}
        </motion.div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
      </AdminLayout>
    );
  }

  // 2. Member Portal Layout & Pages
  if (isMemberRoute) {
    let memberContent = <MemberDashboard />;
    switch (currentPage) {
      case 'member-dashboard':
        memberContent = <MemberDashboard />;
        break;
      case 'member-qr':
        memberContent = <MemberQRPass />;
        break;
      case 'member-events':
        memberContent = <MemberEvents />;
        break;
      case 'member-attendance':
        memberContent = <MemberAttendance />;
        break;
      case 'member-certificates':
        memberContent = <MemberCertificates />;
        break;
      case 'member-profile':
        memberContent = <MemberProfile />;
        break;
      default:
        memberContent = <MemberDashboard />;
    }

    return (
      <MemberLayout>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {memberContent}
        </motion.div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
      </MemberLayout>
    );
  }

  // 3. Public Website Views
  let publicContent = <PublicHomePage />;

  switch (currentPage) {
    case 'home':
      publicContent = <PublicHomePage />;
      break;
    case 'about':
      publicContent = <AboutPage />;
      break;
    case 'officials':
      publicContent = <OfficialsPage />;
      break;
    case 'events':
      publicContent = <EventsPage />;
      break;
    case 'event-detail':
      publicContent = <EventDetailPage />;
      break;
    case 'projects':
      publicContent = <ProjectsPage />;
      break;
    case 'activities':
      publicContent = <ActivitiesPage />;
      break;
    case 'announcements':
      publicContent = <AnnouncementsPage />;
      break;
    case 'gallery':
      publicContent = <GalleryPage />;
      break;
    case 'join':
      publicContent = <JoinPage />;
      break;
    default:
      publicContent = <PublicHomePage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-16 sm:pb-0">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {publicContent}
        </motion.div>
      </main>

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PageRenderer />
      <ToastContainer />
    </AppProvider>
  );
}
