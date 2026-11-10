import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AcademicMonitor } from './components/academic/AcademicMonitor';
import { AssignmentManager } from './components/assignments/AssignmentManager';
import { CBTExamModule } from './components/cbt/CBTExamModule';
import { SubjectList } from './components/subjects/SubjectList';
import { AnnouncementBoard } from './components/announcements/AnnouncementBoard';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { ScheduleCalendar } from './components/schedule/ScheduleCalendar';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { PgriSmartExtensionHub } from './components/extensions/PgriSmartExtensionHub';
import { SCHOOL_PROFILE } from './data/mockData';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  FileQuestion,
  LineChart,
  Megaphone,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { role, setRole, activeTab, setActiveTab } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Synchronize AuthContext role with AppContext role
  useEffect(() => {
    if (user) {
      if (user.role === 'student' && role !== 'siswa') {
        setRole('siswa');
      } else if (user.role === 'teacher' && role !== 'guru') {
        setRole('guru');
      } else if (user.role === 'homeroom' && role !== 'wali_kelas') {
        setRole('wali_kelas');
      }
    }
  }, [user, role, setRole]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-semibold text-slate-500">
            Memuat Sesi Pengguna SMP PGRI 1...
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, render LoginPage
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return role === 'siswa' ? <StudentDashboard /> : <TeacherDashboard />;
      case 'mata-pelajaran':
        return <SubjectList />;
      case 'tugas':
        return <AssignmentManager />;
      case 'cbt-ujian':
        return <CBTExamModule />;
      case 'pantauan-akademik':
        return <AcademicMonitor />;
      case 'presensi':
        return <AttendanceTracker />;
      case 'pengumuman':
        return <AnnouncementBoard />;
      case 'jadwal':
        return <ScheduleCalendar />;
      default:
        return role === 'siswa' ? <StudentDashboard /> : <TeacherDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header onOpenNotifications={() => setIsNotificationOpen(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Executive Navy Left Sidebar */}
        <Sidebar />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'mata-pelajaran', label: 'Mapel', icon: BookOpen },
          { id: 'tugas', label: 'Tugas', icon: FileCheck2 },
          { id: 'cbt-ujian', label: 'CBT', icon: FileQuestion },
          { id: 'pantauan-akademik', label: 'Rapor', icon: LineChart },
          { id: 'pengumuman', label: 'Warta', icon: Megaphone },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Official Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-6 text-xs text-slate-500 transition-colors hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_PROFILE.badgeUrl}
              alt="Logo SMP PGRI"
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {SCHOOL_PROFILE.name}
              </span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">·</span>
              <span>NPSN: {SCHOOL_PROFILE.npsn}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Kurikulum Merdeka SMP</span>
            <span>·</span>
            <span>Tahun Ajaran 2026/2027</span>
            <span>·</span>
            <span>Hak Cipta Terpelihara YPLP PGRI</span>
          </div>
        </div>
      </footer>

      {/* Real-time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Toast alert system */}
      <ToastContainer />

      {/* Modular Extension Hub */}
      <PgriSmartExtensionHub />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <DashboardContent />
      </AppProvider>
    </AuthProvider>
  );
}
