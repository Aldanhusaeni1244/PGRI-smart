import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Subject,
  MaterialItem,
  Assignment,
  Quiz,
  StudentAcademicScore,
  SchoolAnnouncement,
  AppNotification,
  AttendanceRecord
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  INITIAL_HEADMASTER,
  SUBJECTS_LIST,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_QUIZZES,
  INITIAL_SCORES,
  CLASS_STUDENTS_LIST,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ATTENDANCE
} from '../data/mockData';

interface ToastData {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

export interface CustomPdfRecord {
  assignmentId: string;
  fileName: string;
  dataUrl: string;
  blobUrl?: string;
  sizeKb: number;
  uploadedAt: string;
}

export function base64ToBlobUrl(dataUrl: string): string {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Error converting base64 to blob URL:', e);
    return dataUrl;
  }
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeUser: UserProfile;
  subjects: Subject[];
  materials: MaterialItem[];
  assignments: Assignment[];
  quizzes: Quiz[];
  academicScores: StudentAcademicScore[];
  classStudents: typeof CLASS_STUDENTS_LIST;
  announcements: SchoolAnnouncement[];
  notifications: AppNotification[];
  attendanceRecords: AttendanceRecord[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  unreadCount: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastData[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  playNotificationChime: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  submitAssignment: (assignmentId: string, note: string, fileName?: string) => void;
  createAssignment: (data: Omit<Assignment, 'id' | 'submissions'>, customPdf?: { file: File }) => void;
  gradeSubmission: (assignmentId: string, studentId: string, score: number, feedback: string) => void;
  createAnnouncement: (data: Omit<SchoolAnnouncement, 'id' | 'date'>) => void;
  submitQuizAttempt: (quizId: string, answers: Record<number, number>, score: number, passed: boolean) => void;
  createQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateAttendance: (recordId: string, status: AttendanceRecord['status'], notes?: string) => void;
  updateAcademicScore: (studentId: string, subjectId: string, field: keyof StudentAcademicScore, value: number | string) => void;
  customPdfs: Record<string, CustomPdfRecord>;
  uploadCustomPdf: (assignmentId: string, file: File) => Promise<string>;
  resetCustomPdf: (assignmentId: string, defaultName?: string) => void;
  getAssignmentPdfUrl: (assignmentId?: string, fallbackFileName?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for Web Audio API Chime
const playChimeSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Ignore audio restrictions
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('smppgri_role') as UserRole) || 'siswa';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('smppgri_theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem('smppgri_assignments_v3');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('smppgri_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    const saved = localStorage.getItem('smppgri_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('smppgri_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [academicScores, setAcademicScores] = useState<StudentAcademicScore[]>(() => {
    const saved = localStorage.getItem('smppgri_scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('smppgri_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [customPdfs, setCustomPdfs] = useState<Record<string, CustomPdfRecord>>(() => {
    try {
      const saved = localStorage.getItem('smppgri_custom_pdfs');
      if (!saved) return {};
      const parsed: Record<string, CustomPdfRecord> = JSON.parse(saved);
      Object.keys(parsed).forEach((k) => {
        if (parsed[k].dataUrl && !parsed[k].blobUrl) {
          parsed[k].blobUrl = base64ToBlobUrl(parsed[k].dataUrl);
        }
      });
      return parsed;
    } catch {
      return {};
    }
  });

  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Apply dark mode to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smppgri_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smppgri_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('smppgri_role', newRole);
    showToast(`Beralih ke mode ${newRole === 'siswa' ? 'Siswa (Raditya)' : newRole === 'guru' ? 'Guru (Dra. Sri Wahyuni)' : 'Wali Kelas / Kurikulum'}`, 'info');
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('smppgri_assignments_v3', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('smppgri_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('smppgri_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smppgri_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smppgri_scores', JSON.stringify(academicScores));
  }, [academicScores]);

  useEffect(() => {
    localStorage.setItem('smppgri_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const playNotificationChime = () => {
    playChimeSound();
  };

  const activeUser: UserProfile =
    role === 'siswa' ? INITIAL_STUDENT : role === 'guru' ? INITIAL_TEACHER : INITIAL_HEADMASTER;

  const unreadCount = notifications.filter(
    n => !n.isRead && (n.targetRole === 'all' || n.targetRole === role)
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.targetRole === 'all' || n.targetRole === role ? { ...n, isRead: true } : n
      )
    );
    showToast('Semua notifikasi telah ditandai sudah dibaca', 'info');
  };

  // Student action: Submit Assignment
  const submitAssignment = (assignmentId: string, note: string, fileName?: string) => {
    const submissionDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const resolvedFileName = fileName || 'Tugas_Raditya_Pratama_8A.pdf';

    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id === assignmentId) {
          const existingWithoutStudent = asg.submissions.filter(
            s => s.studentId !== INITIAL_STUDENT.id
          );
          return {
            ...asg,
            submissions: [
              ...existingWithoutStudent,
              {
                studentId: INITIAL_STUDENT.id,
                studentName: INITIAL_STUDENT.name,
                studentNisn: INITIAL_STUDENT.identifier,
                submittedAt: submissionDate,
                fileName: resolvedFileName,
                fileSize: '2.5 MB',
                studentNote: note,
                status: 'terkumpul',
              },
            ],
          };
        }
        return asg;
      })
    );

    // Add teacher notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Tugas Masuk Baru',
      message: `${INITIAL_STUDENT.name} telah mengumpulkan tugas. Status: Siap diperiksa.`,
      timestamp: 'Baru saja',
      type: 'tugas',
      isRead: false,
      priority: 'normal',
      targetRole: 'guru',
      actionTarget: 'tugas',
    };
    setNotifications(prev => [newNotif, ...prev]);
    playChimeSound();
    showToast('Tugas Anda berhasil diunggah ke sistem e-learning!', 'success');
  };

  // Custom PDF File Handlers
  const uploadCustomPdf = (assignmentId: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const directBlobUrl = URL.createObjectURL(file);

      reader.onload = () => {
        const dataUrl = reader.result as string;
        const record: CustomPdfRecord = {
          assignmentId,
          fileName: file.name,
          dataUrl,
          blobUrl: directBlobUrl,
          sizeKb: Math.round(file.size / 1024),
          uploadedAt: new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setCustomPdfs(prev => {
          const next = { ...prev, [assignmentId]: record };
          try {
            const forStorage = Object.fromEntries(
              Object.entries(next).map(([k, v]) => [k, { ...v, blobUrl: undefined }])
            );
            localStorage.setItem('smppgri_custom_pdfs', JSON.stringify(forStorage));
          } catch {
            // Memory state preserved
          }
          return next;
        });

        setAssignments(prev =>
          prev.map(asg => (asg.id === assignmentId ? { ...asg, attachmentName: file.name } : asg))
        );

        showToast(`Dokumen PDF "${file.name}" berhasil diunggah dan disimpan!`, 'success');
        resolve(directBlobUrl);
      };
      reader.onerror = () => {
        showToast('Gagal memproses berkas PDF.', 'warning');
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const resetCustomPdf = (assignmentId: string, defaultName?: string) => {
    setCustomPdfs(prev => {
      const copy = { ...prev };
      delete copy[assignmentId];
      try {
        localStorage.setItem('smppgri_custom_pdfs', JSON.stringify(copy));
      } catch {
        // Ignored
      }
      return copy;
    });

    if (defaultName) {
      setAssignments(prev =>
        prev.map(asg => (asg.id === assignmentId ? { ...asg, attachmentName: defaultName } : asg))
      );
    }
    showToast('Dokumen dikembalikan ke versi PDF kurikulum bawaan.', 'info');
  };

  const getAssignmentPdfUrl = (assignmentId?: string, fallbackFileName?: string): string => {
    if (assignmentId && customPdfs[assignmentId]) {
      const rec = customPdfs[assignmentId];
      if (rec.blobUrl) return rec.blobUrl;
      if (rec.dataUrl) {
        const bUrl = base64ToBlobUrl(rec.dataUrl);
        rec.blobUrl = bUrl;
        return bUrl;
      }
    }
    const name = (fallbackFileName || '').toLowerCase();
    // Assignments
    if (name.includes('pythagoras')) {
      return '/documents/Lembar_Kerja_Pythagoras_No1-5.pdf';
    }
    if (name.includes('nutrisi') || name.includes('ipa') || name.includes('praktikum')) {
      return '/documents/Panduan_Praktikum_Uji_Nutrisi_8A.pdf';
    }
    if (name.includes('lho') || name.includes('observasi') || name.includes('rubrik')) {
      return '/documents/Rubrik_Penilaian_Teks_LHO.pdf';
    }
    if (name.includes('perpus') || name.includes('flowchart') || name.includes('kasus')) {
      return '/documents/Studi_Kasus_Perpus_SMP_PGRI.pdf';
    }
    if (name.includes('writing') || name.includes('english') || name.includes('recount')) {
      return '/documents/Rubrik_Tugas_Writing_English.pdf';
    }
    // Modules
    if (name.includes('modul_ipa') || name.includes('peredaran')) {
      return '/documents/Modul_IPA_Sistem_Peredaran_Darah.pdf';
    }
    if (name.includes('modul_matematika') || name.includes('modul_mtk')) {
      return '/documents/Modul_Matematika_Teorema_Pythagoras.pdf';
    }
    if (name.includes('modul_bahasa_indonesia') || name.includes('modul_indo')) {
      return '/documents/Modul_Bahasa_Indonesia_Teks_LHO.pdf';
    }
    if (name.includes('modul_bahasa_inggris') || name.includes('modul_inggris')) {
      return '/documents/Modul_Bahasa_Inggris_Recount_Text.pdf';
    }
    if (name.includes('modul_informatika') || name.includes('searching') || name.includes('sorting')) {
      return '/documents/Modul_Informatika_Algoritma_Searching.pdf';
    }
    if (name.includes('modul_ips') || name.includes('asean') || name.includes('kependudukan')) {
      return '/documents/Modul_IPS_Dinamika_Kependudukan_ASEAN.pdf';
    }
    if (name.includes('modul_pai') || name.includes('agama') || name.includes('adab')) {
      return '/documents/Modul_PAI_Adab_Menuntut_Ilmu.pdf';
    }
    if (name.includes('modul_ppkn') || name.includes('kedaulatan') || name.includes('uud')) {
      return '/documents/Modul_PPKn_Kedaulatan_Rakyat_UUD1945.pdf';
    }
    if (name.includes('modul_pjok') || name.includes('kebugaran') || name.includes('jasmani')) {
      return '/documents/Modul_PJOK_Kebugaran_Jasmani.pdf';
    }
    if (name.includes('modul_seni') || name.includes('ragam_hias') || name.includes('budaya')) {
      return '/documents/Modul_Seni_Budaya_Ragam_Hias.pdf';
    }
    return '/documents/Lembar_Kerja_Tugas.pdf';
  };

  // Teacher action: Create Assignment
  const createAssignment = (
    data: Omit<Assignment, 'id' | 'submissions'>,
    customPdf?: { file: File }
  ) => {
    const newId = `asg_${Date.now()}`;
    const newAssignment: Assignment = {
      ...data,
      id: newId,
      attachmentName: customPdf ? customPdf.file.name : data.attachmentName,
      submissions: [],
    };
    setAssignments(prev => [newAssignment, ...prev]);

    if (customPdf) {
      uploadCustomPdf(newId, customPdf.file).catch(() => {});
    }

    // Push automated broadcast notification to students
    const autoNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Tugas Baru: ${data.subjectName}`,
      message: `Tugas baru "${data.title}" telah diterbitkan. Tenggat: ${data.dueDate}`,
      timestamp: 'Baru saja',
      type: 'tugas',
      isRead: false,
      priority: 'urgent',
      targetRole: 'siswa',
      actionTarget: 'tugas',
    };
    setNotifications(prev => [autoNotif, ...prev]);
    playChimeSound();
    showToast(`Tugas baru berhasil diterbitkan dan notifikasi terkirim ke siswa!`, 'success');
  };

  // Teacher action: Grade Submission
  const gradeSubmission = (
    assignmentId: string,
    studentId: string,
    score: number,
    feedback: string
  ) => {
    const gradedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetAssignmentTitle = '';

    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id === assignmentId) {
          targetAssignmentTitle = asg.title;
          const updatedSubs = asg.submissions.map(sub => {
            if (sub.studentId === studentId) {
              return {
                ...sub,
                score,
                feedback,
                gradedAt,
                status: 'dinilai' as const,
              };
            }
            return sub;
          });
          return { ...asg, submissions: updatedSubs };
        }
        return asg;
      })
    );

    // Push automated student notification
    const gradeNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Nilai Tugas Diberikan',
      message: `Tugas "${targetAssignmentTitle || 'Tugas Anda'}" telah dinilai oleh Guru: ${score}/100. "${feedback}"`,
      timestamp: 'Baru saja',
      type: 'nilai',
      isRead: false,
      priority: 'normal',
      targetRole: 'siswa',
      actionTarget: 'pantauan-akademik',
    };
    setNotifications(prev => [gradeNotif, ...prev]);
    playChimeSound();
    showToast(`Nilai ${score} berhasil disimpan dan dikirimkan ke siswa!`, 'success');
  };

  // Create Announcement
  const createAnnouncement = (data: Omit<SchoolAnnouncement, 'id' | 'date'>) => {
    const newId = `ann_${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const newAnnouncement: SchoolAnnouncement = {
      ...data,
      id: newId,
      date: dateStr,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);

    // Push automated notification to everyone
    const annNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Pengumuman: ${data.title}`,
      message: data.summary,
      timestamp: 'Baru saja',
      type: 'pengumuman',
      isRead: false,
      priority: data.category === 'penting' ? 'urgent' : 'normal',
      targetRole: data.targetAudience === 'semua' ? 'all' : (data.targetAudience as UserRole),
      actionTarget: 'pengumuman',
    };
    setNotifications(prev => [annNotif, ...prev]);
    playChimeSound();
    showToast(`Pengumuman sekolah berhasil dipublikasikan dan disiarkan!`, 'success');
  };

  // Student CBT Quiz Completion
  const submitQuizAttempt = (
    quizId: string,
    answers: Record<number, number>,
    score: number,
    passed: boolean
  ) => {
    const completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id === quizId) {
          return {
            ...q,
            completedByStudent: {
              score,
              completedAt,
              answers,
              passed,
            },
          };
        }
        return q;
      })
    );

    // Notify
    const quizNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Hasil Kuis CBT Tersedia',
      message: `Anda menyelesaikan kuis CBT dengan skor ${score}/100. Status: ${passed ? 'TUNTAS KKM' : 'PERLU REMEDIAL'}.`,
      timestamp: 'Baru saja',
      type: 'nilai',
      isRead: false,
      priority: 'normal',
      targetRole: 'siswa',
      actionTarget: 'pantauan-akademik',
    };
    setNotifications(prev => [quizNotif, ...prev]);
    playChimeSound();
    showToast(`Kuis CBT selesai! Skor: ${score} (${passed ? 'Lulus KKM' : 'Remedial'})`, 'success');
  };

  // Create Quiz (Teacher)
  const createQuiz = (data: Omit<Quiz, 'id'>) => {
    const newId = `quiz_${Date.now()}`;
    const newQuiz: Quiz = {
      ...data,
      id: newId,
    };
    setQuizzes(prev => [newQuiz, ...prev]);

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Kuis CBT Baru: ${data.title}`,
      message: `Kuis daring dibuka untuk ${data.targetClass}. Durasi: ${data.durationMinutes} menit.`,
      timestamp: 'Baru saja',
      type: 'tugas',
      isRead: false,
      priority: 'urgent',
      targetRole: 'siswa',
      actionTarget: 'cbt-ujian',
    };
    setNotifications(prev => [notif, ...prev]);
    playChimeSound();
    showToast(`Kuis CBT baru berhasil dibuat dan dijadwalkan!`, 'success');
  };

  // Update Attendance Record
  const updateAttendance = (
    recordId: string,
    status: AttendanceRecord['status'],
    notes?: string
  ) => {
    setAttendanceRecords(prev =>
      prev.map(item =>
        item.id === recordId ? { ...item, status, notes: notes ?? item.notes } : item
      )
    );
    showToast(`Status presensi diperbarui: ${status.toUpperCase()}`, 'info');
  };

  // Update Academic Score (Teacher / Wali Kelas)
  const updateAcademicScore = (
    studentId: string,
    subjectId: string,
    field: keyof StudentAcademicScore,
    value: number | string
  ) => {
    setAcademicScores(prev =>
      prev.map(item => {
        if (item.studentId === studentId && item.subjectId === subjectId) {
          const updated = { ...item, [field]: value };
          // recalculate finalScore
          const final = Math.round(
            (Number(updated.tugas1) * 0.15 +
              Number(updated.tugas2) * 0.15 +
              Number(updated.ulanganHarian) * 0.2 +
              Number(updated.uts) * 0.25 +
              Number(updated.uas) * 0.25) *
              10
          ) / 10;
          updated.finalScore = final;
          updated.predicate = final >= 88 ? 'A' : final >= 78 ? 'B' : final >= 75 ? 'C' : 'D';
          return updated;
        }
        return item;
      })
    );
    showToast(`Nilai akademik diperbarui secara real-time`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeUser,
        subjects: SUBJECTS_LIST,
        materials: INITIAL_MATERIALS,
        assignments,
        quizzes,
        academicScores,
        classStudents: CLASS_STUDENTS_LIST,
        announcements,
        notifications,
        attendanceRecords,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        unreadCount,
        darkMode,
        toggleDarkMode,
        toasts,
        showToast,
        playNotificationChime,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        submitAssignment,
        createAssignment,
        gradeSubmission,
        createAnnouncement,
        submitQuizAttempt,
        createQuiz,
        updateAttendance,
        updateAcademicScore,
        customPdfs,
        uploadCustomPdf,
        resetCustomPdf,
        getAssignmentPdfUrl,
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
