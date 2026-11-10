import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Subject, MaterialItem } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  X
} from 'lucide-react';
import { PdfDocumentViewer, PdfDocumentData, openPdfInNewTab } from '../documents/PdfDocumentViewer';

export function getMaterialPdf(mat: MaterialItem, subject?: Subject | null): { pdfUrl: string; fileName: string } {
  if (mat.pdfFileName) {
    return {
      pdfUrl: `/documents/${mat.pdfFileName}`,
      fileName: mat.pdfFileName,
    };
  }
  const name = (mat.title + ' ' + (subject?.name || '')).toLowerCase();
  if (name.includes('peredaran') || name.includes('ipa') || name.includes('nutrisi')) {
    return { pdfUrl: '/documents/Modul_IPA_Sistem_Peredaran_Darah.pdf', fileName: 'Modul_IPA_Sistem_Peredaran_Darah.pdf' };
  }
  if (name.includes('pythagoras') || name.includes('matematika')) {
    return { pdfUrl: '/documents/Modul_Matematika_Teorema_Pythagoras.pdf', fileName: 'Modul_Matematika_Teorema_Pythagoras.pdf' };
  }
  if (name.includes('lho') || name.includes('observasi') || name.includes('indonesia')) {
    return { pdfUrl: '/documents/Modul_Bahasa_Indonesia_Teks_LHO.pdf', fileName: 'Modul_Bahasa_Indonesia_Teks_LHO.pdf' };
  }
  if (name.includes('recount') || name.includes('english') || name.includes('inggris')) {
    return { pdfUrl: '/documents/Modul_Bahasa_Inggris_Recount_Text.pdf', fileName: 'Modul_Bahasa_Inggris_Recount_Text.pdf' };
  }
  if (name.includes('algoritma') || name.includes('informatika') || name.includes('flowchart')) {
    return { pdfUrl: '/documents/Modul_Informatika_Algoritma_Searching.pdf', fileName: 'Modul_Informatika_Algoritma_Searching.pdf' };
  }
  if (name.includes('asean') || name.includes('ips') || name.includes('kependudukan')) {
    return { pdfUrl: '/documents/Modul_IPS_Dinamika_Kependudukan_ASEAN.pdf', fileName: 'Modul_IPS_Dinamika_Kependudukan_ASEAN.pdf' };
  }
  if (name.includes('adab') || name.includes('agama') || name.includes('ilmu')) {
    return { pdfUrl: '/documents/Modul_PAI_Adab_Menuntut_Ilmu.pdf', fileName: 'Modul_PAI_Adab_Menuntut_Ilmu.pdf' };
  }
  if (name.includes('kedaulatan') || name.includes('ppkn') || name.includes('pancasila')) {
    return { pdfUrl: '/documents/Modul_PPKn_Kedaulatan_Rakyat_UUD1945.pdf', fileName: 'Modul_PPKn_Kedaulatan_Rakyat_UUD1945.pdf' };
  }
  if (name.includes('kebugaran') || name.includes('pjok') || name.includes('jasmani')) {
    return { pdfUrl: '/documents/Modul_PJOK_Kebugaran_Jasmani.pdf', fileName: 'Modul_PJOK_Kebugaran_Jasmani.pdf' };
  }
  if (name.includes('ragam') || name.includes('seni') || name.includes('budaya')) {
    return { pdfUrl: '/documents/Modul_Seni_Budaya_Ragam_Hias.pdf', fileName: 'Modul_Seni_Budaya_Ragam_Hias.pdf' };
  }
  return { pdfUrl: '/documents/Lembar_Kerja_Tugas.pdf', fileName: 'Modul_Ajar.pdf' };
}

interface ScheduleSlot {
  time: string;
  subject: string;
  code: string;
  teacherOrClass: string;
  room: string;
  type: 'lesson' | 'break' | 'activity' | 'homeroom';
}

export const SubjectPage: React.FC = () => {
  const { subjects, materials, activeTab } = useApp();
  const { user } = useAuth();

  const [activeMainTab, setActiveMainTab] = useState<'subjects' | 'schedule'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(subjects[0] || null);
  const [activePdfDoc, setActivePdfDoc] = useState<PdfDocumentData | null>(null);
  const [activeDay, setActiveDay] = useState<'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat'>('senin');

  useEffect(() => {
    if (activeTab === 'jadwal') {
      setActiveMainTab('schedule');
    }
  }, [activeTab]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === 'subjects' || e.detail === 'schedule') {
        setActiveMainTab(e.detail);
      }
    };
    window.addEventListener('pgri_switch_mapel_tab', handler);
    return () => window.removeEventListener('pgri_switch_mapel_tab', handler);
  }, []);

  const currentRole = user?.role || 'student';

  // --- Schedules Per Role (Senin - Jumat) ---
  const studentSchedule: Record<string, ScheduleSlot[]> = {
    senin: [
      { time: '07:00 - 07:30', subject: 'Upacara Bendera Hari Senin & Pembiasaan Karakter PGRI', code: 'UPC', teacherOrClass: 'Pembina Upacara', room: 'Lapangan Utama', type: 'activity' },
      { time: '07:30 - 09:30', subject: 'Ilmu Pengetahuan Alam (IPA Terpadu)', code: 'IPA-8', teacherOrClass: 'Dra. Hj. Sri Wahyuni, M.Pd', room: 'Lab Biologi Lantai 2', type: 'lesson' },
      { time: '09:30 - 10:00', subject: 'Istirahat Pertama & Pojok Baca Literasi', code: 'IST', teacherOrClass: '-', room: 'Kantin & Perpustakaan', type: 'break' },
      { time: '10:00 - 11:30', subject: 'Pendidikan Agama & Budi Pekerti', code: 'PAI-8', teacherOrClass: 'Ust. Ridwan Kamil, S.Ag', room: 'Musholla & Kelas 8A', type: 'lesson' },
      { time: '11:30 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacherOrClass: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    selasa: [
      { time: '07:15 - 07:45', subject: 'Literasi Numerasi & Doa Pagi', code: 'LIT', teacherOrClass: 'Wali Kelas 8A', room: 'Ruang Kelas 8A', type: 'activity' },
      { time: '07:45 - 09:45', subject: 'Matematika Terapan (SPLDV & Teorema Pythagoras)', code: 'MTK-8', teacherOrClass: 'Bambang Sudirman, S.Pd', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '09:45 - 10:15', subject: 'Istirahat Pagi', code: 'IST', teacherOrClass: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '10:15 - 11:45', subject: 'Pendidikan Pancasila & PPKn', code: 'PPK-8', teacherOrClass: 'Suryadi, S.Pd, M.H.', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '11:45 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacherOrClass: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    rabu: [
      { time: '07:15 - 07:30', subject: 'Tadarus / Renungan Budi Pekerti', code: 'TDR', teacherOrClass: 'Wali Kelas', room: 'Ruang Kelas 8A', type: 'activity' },
      { time: '07:30 - 09:30', subject: 'Bahasa Indonesia (Teks LHO & Menulis Efektif)', code: 'IND-8', teacherOrClass: 'Endang Kusuma, M.Hum', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '09:30 - 10:15', subject: 'Istirahat Pagi', code: 'IST', teacherOrClass: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '10:15 - 11:45', subject: 'Ilmu Pengetahuan Sosial (IPS Dinamika ASEAN)', code: 'IPS-8', teacherOrClass: 'Dra. Siti Rahmah', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '11:45 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacherOrClass: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    kamis: [
      { time: '06:45 - 08:00', subject: 'PJOK (Kebugaran Jasmani & Atletik)', code: 'PJK-8', teacherOrClass: 'Hendra Setiawan, S.Pd', room: 'GOR & Lapangan PGRI', type: 'lesson' },
      { time: '08:00 - 10:00', subject: 'Bahasa Inggris (Recount Text & Daily Speaking)', code: 'ENG-8', teacherOrClass: 'Nurul Hidayati, S.Pd', room: 'Lab Bahasa Lantai 1', type: 'lesson' },
      { time: '10:00 - 10:30', subject: 'Istirahat Pagi', code: 'IST', teacherOrClass: '-', room: 'Kantin Sehat', type: 'break' },
      { time: '10:30 - 12:00', subject: 'Penguatan Profil Pelajar Pancasila (P5 Tema Kewirausahaan)', code: 'P5', teacherOrClass: 'Fasilitator P5 Kelas 8', room: 'Aula SMP PGRI', type: 'lesson' },
    ],
    jumat: [
      { time: '06:45 - 07:30', subject: 'Jumat Bersih & Senam Kesegaran Jasmani PGRI', code: 'SKJ', teacherOrClass: 'Seluruh Dewan Guru', room: 'Halaman Utama', type: 'activity' },
      { time: '07:30 - 09:00', subject: 'Informatika & Algoritma Searching', code: 'INF-8', teacherOrClass: 'Ahmad Faisal, S.Kom', room: 'Lab Komputer 1', type: 'lesson' },
      { time: '09:00 - 09:30', subject: 'Istirahat Pagi', code: 'IST', teacherOrClass: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '09:30 - 11:00', subject: 'Seni Budaya & Ragam Hias Nusantara', code: 'SNB-8', teacherOrClass: 'Dewi Lestari, S.Sn', room: 'Studio Seni & Kerajinan', type: 'lesson' },
      { time: '11:30 - 12:30', subject: 'Sholat Jumat Berjamaah', code: 'JMT', teacherOrClass: 'Keluarga Besar PGRI', room: 'Masjid Agung Harapan', type: 'activity' },
    ],
  };

  const teacherSchedule: Record<string, ScheduleSlot[]> = {
    senin: [
      { time: '07:00 - 07:30', subject: 'Upacara Bendera Hari Senin', code: 'UPC', teacherOrClass: 'Dewan Guru', room: 'Lapangan Utama', type: 'activity' },
      { time: '07:30 - 09:30', subject: 'Mengajar IPA Terpadu (Sirkulasi Darah)', code: 'IPA-8A', teacherOrClass: 'Rombel Kelas 8A', room: 'Lab Biologi Lantai 2', type: 'lesson' },
      { time: '10:00 - 12:00', subject: 'Mengajar IPA Terpadu (Nutrisi Makanan)', code: 'IPA-8B', teacherOrClass: 'Rombel Kelas 8B', room: 'Ruang Kelas 8B', type: 'lesson' },
    ],
    selasa: [
      { time: '08:00 - 10:00', subject: 'Praktikum IPA Uji Zat Makanan', code: 'IPA-8C', teacherOrClass: 'Rombel Kelas 8C', room: 'Lab Kimia & Biologi', type: 'lesson' },
      { time: '10:30 - 12:00', subject: 'Koordinasi MGMP IPA SMP PGRI', code: 'MGMP', teacherOrClass: 'Tim MGMP Sains', room: 'Ruang Guru Lantai 1', type: 'activity' },
    ],
    rabu: [
      { time: '07:30 - 09:30', subject: 'Mengajar IPA Bab Pewarisan Sifat', code: 'IPA-8A', teacherOrClass: 'Rombel Kelas 8A', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '10:15 - 11:45', subject: 'Bimbingan Siswa Persiapan OSN Sains', code: 'OSN', teacherOrClass: 'Tim Olimpiade', room: 'Perpustakaan Sains', type: 'lesson' },
    ],
    kamis: [
      { time: '08:00 - 10:00', subject: 'Mengajar IPA Bab Tekanan Zat', code: 'IPA-8B', teacherOrClass: 'Rombel Kelas 8B', room: 'Lab Fisika', type: 'lesson' },
      { time: '10:30 - 12:00', subject: 'Koreksi Lembar Kerja Siswa & Input Nilai CBT', code: 'EVAL', teacherOrClass: 'Mandiri', room: 'Ruang Kerja Guru', type: 'activity' },
    ],
    jumat: [
      { time: '06:45 - 07:30', subject: 'Senam Pagi Guru & Karyawan PGRI', code: 'SKJ', teacherOrClass: 'Seluruh Pegawai', room: 'Halaman Utama', type: 'activity' },
      { time: '08:00 - 10:00', subject: 'Evaluasi Pembelajaran Mingguan Guru', code: 'RAPAT', teacherOrClass: 'Dewan Guru', room: 'Ruang Rapat Utama', type: 'activity' },
    ],
  };

  const homeroomSchedule: Record<string, ScheduleSlot[]> = {
    senin: [
      { time: '07:00 - 07:30', subject: 'Pendampingan Upacara Bendera Siswa 8A', code: 'UPC', teacherOrClass: 'Kelas 8A Binaan', room: 'Lapangan Utama', type: 'homeroom' },
      { time: '07:30 - 09:30', subject: 'Pelajaran IPA Kelas 8A', code: 'IPA-8', teacherOrClass: 'Dra. Hj. Sri Wahyuni', room: 'Lab Biologi Lantai 2', type: 'lesson' },
      { time: '12:30 - 13:15', subject: 'Pemeriksaan Jurnal Kehadiran & Surat Izin 8A', code: 'ADM', teacherOrClass: 'Wali Kelas 8A', room: 'Ruang Bimbingan 8A', type: 'homeroom' },
    ],
    selasa: [
      { time: '07:15 - 07:45', subject: 'Pemeriksaan Kerapian & Doa Pagi Kelas 8A', code: 'BIM', teacherOrClass: '32 Siswa Kelas 8A', room: 'Ruang Kelas 8A', type: 'homeroom' },
      { time: '07:45 - 09:45', subject: 'Monitoring Belajar Matematika 8A', code: 'MTK-8', teacherOrClass: 'Bambang Sudirman', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '12:30 - 13:30', subject: 'Konseling Siswa & Koordinasi Orang Tua 8A', code: 'KONS', teacherOrClass: 'Wali Murid 8A', room: 'Ruang Konseling PGRI', type: 'homeroom' },
    ],
    rabu: [
      { time: '07:15 - 07:30', subject: 'Tadarus & Renungan Karakter Kelas 8A', code: 'TDR', teacherOrClass: 'Kelas 8A', room: 'Ruang Kelas 8A', type: 'homeroom' },
      { time: '07:30 - 09:30', subject: 'Pelajaran Bahasa Indonesia', code: 'IND-8', teacherOrClass: 'Endang Kusuma', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '13:00 - 14:00', subject: 'Rekapitulasi Nilai & Leger Semester 8A', code: 'LEGER', teacherOrClass: 'Administrasi', room: 'Ruang Guru Lantai 1', type: 'homeroom' },
    ],
    kamis: [
      { time: '06:45 - 08:00', subject: 'Pemantauan Olahraga PJOK Kelas 8A', code: 'PJK-8', teacherOrClass: 'Kelas 8A', room: 'Lapangan PGRI', type: 'lesson' },
      { time: '10:30 - 12:00', subject: 'Fasilitasi Proyek P5 Kewirausahaan 8A', code: 'P5', teacherOrClass: 'Kelas 8A Binaan', room: 'Aula SMP PGRI', type: 'homeroom' },
    ],
    jumat: [
      { time: '06:45 - 07:30', subject: 'Jumat Bersih Lingkungan Kelas 8A', code: 'BERSIH', teacherOrClass: 'Regu Piket 8A', room: 'Ruang Kelas 8A', type: 'homeroom' },
      { time: '07:30 - 09:00', subject: 'Pelajaran Informatika Lab 1', code: 'INF-8', teacherOrClass: 'Ahmad Faisal', room: 'Lab Komputer 1', type: 'lesson' },
      { time: '10:00 - 11:00', subject: 'Evaluasi Mingguan Kelas & Catatan Karakter', code: 'EVAL', teacherOrClass: 'Kelas 8A', room: 'Ruang Kelas 8A', type: 'homeroom' },
    ],
  };

  const currentScheduleData =
    currentRole === 'student'
      ? studentSchedule
      : currentRole === 'teacher'
      ? teacherSchedule
      : homeroomSchedule;

  const currentDaySlots = currentScheduleData[activeDay] || [];

  if (activePdfDoc) {
    return (
      <PdfDocumentViewer
        document={activePdfDoc}
        onBack={() => setActivePdfDoc(null)}
      />
    );
  }

  const selectedMaterials = selectedSubject
    ? materials.filter((m) => m.subjectId === selectedSubject.id)
    : [];

  return (
    <div className="space-y-6 selection:bg-blue-600 selection:text-white">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Kurikulum Merdeka · SMP PGRI 1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Mata Pelajaran & Jadwal Belajar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentRole === 'student'
              ? 'Akses modul digital, buku teks resmi, materi ajar, dan jadwal belajar mingguan Kelas 8A.'
              : currentRole === 'teacher'
              ? 'Kelola materi pengajaran, modul PDF kurikulum, dan pantau jadwal tatap muka mingguan.'
              : 'Pantauan kurikulum, modul ajar 10 mata pelajaran, dan jadwal kegiatan kelas binaan 8A.'}
          </p>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs ${
              currentRole === 'student'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200'
                : currentRole === 'teacher'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
            }`}
          >
            {currentRole === 'student' ? (
              <GraduationCap className="w-4 h-4" />
            ) : currentRole === 'teacher' ? (
              <BookOpen className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              {currentRole === 'student'
                ? 'Jadwal Siswa (8A)'
                : currentRole === 'teacher'
                ? 'Jadwal Mengajar Guru'
                : 'Jadwal Rombel 8A'}
            </span>
          </span>
        </div>
      </div>

      {/* Main Sub-Tab Interactive Switcher */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveMainTab('subjects')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'subjects'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Mata Pelajaran & Modul (10 Mapel)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('schedule')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'schedule'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Pelajaran Mingguan (Senin - Jumat)</span>
        </button>
      </div>

      {/* ================= TAB 1: DAFTAR MATA PELAJARAN & MODUL ================= */}
      {activeMainTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 10 Subjects Grid */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
              <span>Mata Pelajaran Wajib Kurikulum</span>
              <span className="font-mono text-blue-600">{subjects.length} Mapel</span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {subjects.map((s) => {
                const isSelected = selectedSubject?.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSubject(s)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between shadow-xs ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {s.code.split('-')[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {s.teacherName}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Subject Detail & PDF Modules */}
          <div className="lg:col-span-2 space-y-4">
            {selectedSubject ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                {/* Subject Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                        {selectedSubject.code}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">KKM: {selectedSubject.kkm} Poin</span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {selectedSubject.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pengampu: <strong>{selectedSubject.teacherName}</strong> ({selectedSubject.teacherNip})
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedSubject.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{selectedSubject.room}</span>
                    </div>
                  </div>
                </div>

                {/* Modules List for Selected Subject */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      E-Modul & Materi Pembelajaran Terverifikasi ({selectedMaterials.length} Bab)
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">Format Dokumen PDF Resmi</span>
                  </div>

                  {selectedMaterials.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                      Belum ada modul yang diterbitkan untuk mata pelajaran ini.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedMaterials.map((mat) => {
                        const { pdfUrl, fileName } = getMaterialPdf(mat, selectedSubject);
                        return (
                          <div
                            key={mat.id}
                            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                                  Bab {mat.chapterNumber}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {mat.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {mat.description}
                              </p>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                                <span>{mat.durationOrPages}</span>
                                <span>·</span>
                                <span>{mat.fileSize}</span>
                                <span>·</span>
                                <span>Diunggah: {mat.uploadDate}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                              <button
                                type="button"
                                onClick={() =>
                                  setActivePdfDoc({
                                    fileName,
                                    title: `${selectedSubject.name} - ${mat.title}`,
                                    subjectName: selectedSubject.name,
                                    targetClass: selectedSubject.classGroup,
                                    defaultTemplateName: fileName,
                                  })
                                }
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                                title="Buka dan baca modul PDF di peramban"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Buka PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openPdfInNewTab(pdfUrl, fileName)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                                title="Buka di tab baru peramban dengan judul resmi"
                              >
                                <span>Tab Baru</span>
                              </button>

                              <a
                                href={pdfUrl}
                                download={fileName}
                                className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50 transition-colors"
                                title="Unduh berkas PDF ke perangkat"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ================= TAB 2: JADWAL PELAJARAN MINGGUAN ================= */}
      {activeMainTab === 'schedule' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  {currentRole === 'student'
                    ? 'Jadwal Pelajaran Mingguan Siswa Kelas 8A'
                    : currentRole === 'teacher'
                    ? 'Jadwal Mengajar & Kegiatan Guru (IPA)'
                    : 'Jadwal Mingguan Terpadu Kelas Binaan 8A'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Semester Genap Tahun Ajaran 2026/2027 · SMP PGRI 1 KOTA HARAPAN
              </p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              5 Hari Belajar (Senin - Jumat)
            </span>
          </div>

          {/* Day Selector Tabs (Senin - Jumat) */}
          <div className="grid grid-cols-5 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            {[
              { id: 'senin', label: 'Senin' },
              { id: 'selasa', label: 'Selasa' },
              { id: 'rabu', label: 'Rabu' },
              { id: 'kamis', label: 'Kamis' },
              { id: 'jumat', label: 'Jumat' },
            ].map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDay(day.id as typeof activeDay)}
                className={`py-2 px-2 text-xs font-bold rounded-lg text-center transition-all ${
                  activeDay === day.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Timeline / Slots List */}
          <div className="space-y-3">
            {currentDaySlots.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada agenda pembelajaran untuk hari ini.
              </div>
            ) : (
              currentDaySlots.map((slot, index) => {
                const isBreak = slot.type === 'break';
                const isActivity = slot.type === 'activity';
                const isHomeroom = slot.type === 'homeroom';

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isBreak
                        ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800/80 text-slate-500'
                        : isActivity
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isHomeroom
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs shrink-0 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{slot.time}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {slot.subject}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                            {slot.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                          <span>Pengampu / Rombel: <strong>{slot.teacherOrClass}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 self-start sm:self-auto">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{slot.room}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
