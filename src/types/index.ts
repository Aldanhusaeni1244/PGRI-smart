export type UserRole = 'siswa' | 'guru' | 'wali_kelas';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // NISN for student, NIP for teacher
  className?: string; // e.g. "Kelas 8A"
  schoolName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  gender: 'L' | 'P';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  teacherNip: string;
  kkm: number;
  classGroup: string;
  color: string;
  iconName: string;
  room: string;
  schedule: string;
  materialsCount: number;
  assignmentsCount: number;
}

export interface MaterialItem {
  id: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  description: string;
  contentType: 'pdf' | 'video' | 'article' | 'slide';
  durationOrPages: string;
  fileSize: string;
  uploadDate: string;
  downloadUrl?: string;
  videoUrl?: string;
  pdfFileName?: string;
}

export interface AssignmentSubmission {
  studentId: string;
  studentName: string;
  studentNisn: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  studentNote?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  status: 'terkumpul' | 'dinilai' | 'terlambat';
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string; // ISO or YYYY-MM-DD HH:mm
  targetClass: string;
  maxScore: number;
  weightPercent: number; // e.g., 20%
  attachmentName?: string;
  submissions: AssignmentSubmission[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  targetClass: string;
  deadline: string;
  questions: QuizQuestion[];
  completedByStudent?: {
    score: number;
    completedAt: string;
    answers: Record<number, number>;
    passed: boolean;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpa';
  notes?: string;
}

export interface StudentAcademicScore {
  studentId: string;
  studentName: string;
  nisn: string;
  subjectId: string;
  subjectName: string;
  tugas1: number;
  tugas2: number;
  ulanganHarian: number;
  uts: number;
  uas: number;
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  kkm: number;
  notes: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  category: 'akademik' | 'kegiatan' | 'penting' | 'libur';
  author: string;
  authorRole: string;
  date: string;
  targetAudience: 'semua' | 'siswa' | 'guru' | 'kelas_8a';
  summary: string;
  content: string;
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'tugas' | 'pengumuman' | 'nilai' | 'presensi' | 'sistem';
  isRead: boolean;
  priority: 'normal' | 'urgent';
  targetRole?: UserRole | 'all';
  actionTarget?: string; // tab id e.g. 'tugas', 'pengumuman'
}
