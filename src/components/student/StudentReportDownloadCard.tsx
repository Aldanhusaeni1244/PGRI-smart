import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle2,
  Building2,
  Sparkles,
  ExternalLink,
  Eye,
  Calendar,
  X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SCHOOL_PROFILE } from '../../data/mockData';

interface SubjectScore {
  code: string;
  name: string;
  kkm: number;
  tugas: number;
  uts: number;
  uas: number;
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  competency: string;
}

const DEFAULT_SUBJECT_SCORES: SubjectScore[] = [
  { code: 'IPA-8', name: 'Ilmu Pengetahuan Alam', kkm: 75, tugas: 88, uts: 86, uas: 90, finalScore: 88, predicate: 'A', competency: 'Sangat memahami sistem peredaran darah manusia dan hukum pewarisan sifat.' },
  { code: 'MTK-8', name: 'Matematika', kkm: 75, tugas: 82, uts: 80, uas: 85, finalScore: 82, predicate: 'B', competency: 'Mampu menyelesaikan masalah terkait Teorema Pythagoras dan persamaan linier.' },
  { code: 'BIN-8', name: 'Bahasa Indonesia', kkm: 75, tugas: 90, uts: 88, uas: 92, finalScore: 90, predicate: 'A', competency: 'Sangat mahir menyusun teks Laporan Hasil Observasi dengan kaidah baku.' },
  { code: 'ENG-8', name: 'Bahasa Inggris', kkm: 75, tugas: 85, uts: 84, uas: 87, finalScore: 85, predicate: 'B', competency: 'Good fluency in writing recount texts and engaging in casual daily conversations.' },
  { code: 'INF-8', name: 'Informatika', kkm: 75, tugas: 94, uts: 92, uas: 96, finalScore: 94, predicate: 'A', competency: 'Sangat menguasai logika algoritma pencarian biner dan pemrograman blok.' },
  { code: 'IPS-8', name: 'Ilmu Pengetahuan Sosial', kkm: 75, tugas: 86, uts: 85, uas: 88, finalScore: 86, predicate: 'A', competency: 'Memahami dinamika kependudukan dan integrasi sosial negara-negara ASEAN.' },
  { code: 'PAI-8', name: 'Pendidikan Agama Islam', kkm: 75, tugas: 92, uts: 90, uas: 95, finalScore: 92, predicate: 'A', competency: 'Sangat konsisten mempraktikkan adab menuntut ilmu dan toleransi antar sesama.' },
  { code: 'PKN-8', name: 'PPKn', kkm: 75, tugas: 88, uts: 86, uas: 89, finalScore: 88, predicate: 'A', competency: 'Menunjukkan pemahaman mendalam tentang prinsip kedaulatan rakyat UUD 1945.' },
  { code: 'PJK-8', name: 'PJOK', kkm: 75, tugas: 87, uts: 85, uas: 88, finalScore: 87, predicate: 'A', competency: 'Kebugaran jasmani prima dan aktif dalam olahraga atletik dan senam lantai.' },
  { code: 'SBD-8', name: 'Seni Budaya', kkm: 75, tugas: 84, uts: 82, uas: 86, finalScore: 84, predicate: 'B', competency: 'Mampu merancang ragam hias tradisional pada media kain dan kayu secara kreatif.' },
];

export interface StudentReportDownloadProps {
  studentName?: string;
  nisn?: string;
  className?: string;
  semester?: string;
  academicYear?: string;
}

export const StudentReportDownloadCard: React.FC<StudentReportDownloadProps> = ({
  studentName = 'Raditya Pratama',
  nisn = '0098234120',
  className = 'Kelas 8A',
  semester = 'Semester Genap',
  academicYear = '2026/2027',
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate PDF via jsPDF with official SMP PGRI 1 KOP SURAT
  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // --- KOP SURAT ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PERSATUAN GURU REPUBLIK INDONESIA (PGRI)', pageWidth / 2, 14, { align: 'center' });
      doc.setFontSize(9);
      doc.text('YAYASAN PEMBINA LEMBAGA PENDIDIKAN (YPLP) PGRI PUSAT', pageWidth / 2, 19, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175); // Blue primary
      doc.text('SMP PGRI 1 KOTA HARAPAN', pageWidth / 2, 25, { align: 'center' });
      doc.setTextColor(30, 41, 59);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        'NPSN: 20231945 · Terakreditasi "A" (Unggul) · SK BAN-SM No. 432/BAN-SM/2023',
        pageWidth / 2,
        30,
        { align: 'center' }
      );
      doc.text(
        'Alamat: Jl. Guru Bangsa No. 45, Kompleks Pendidikan PGRI · Email: info@smp-pgri.sch.id',
        pageWidth / 2,
        34,
        { align: 'center' }
      );

      // KOP Double Divider
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.8);
      doc.line(14, 37, pageWidth - 14, 37);
      doc.setLineWidth(0.2);
      doc.line(14, 38.5, pageWidth - 14, 38.5);

      // Document Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('LAPORAN HASIL BELAJAR SISWA (RAPOR AKADEMIK)', pageWidth / 2, 45, { align: 'center' });

      // Student Metadata Table
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      doc.text(`Nama Peserta Didik : ${studentName}`, 14, 52);
      doc.text(`Nomor Induk Siswa (NISN) : ${nisn}`, 14, 57);
      doc.text(`Kelas / Rombel : ${className}`, 14, 62);

      doc.text(`Semester : ${semester}`, 120, 52);
      doc.text(`Tahun Ajaran : ${academicYear}`, 120, 57);
      doc.text(`Fase Kurikulum : Fase D (Kurikulum Merdeka)`, 120, 62);

      // --- GRADES TABLE ---
      let startY = 68;
      doc.setFillColor(239, 246, 255);
      doc.rect(14, startY, pageWidth - 28, 7, 'F');
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.2);
      doc.rect(14, startY, pageWidth - 28, 7, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('NO', 17, startY + 5);
      doc.text('MATA PELAJARAN', 28, startY + 5);
      doc.text('KKM', 80, startY + 5, { align: 'center' });
      doc.text('NILAI', 98, startY + 5, { align: 'center' });
      doc.text('PRED', 114, startY + 5, { align: 'center' });
      doc.text('CAPAIAN KOMPETENSI / DESKRIPSI', 126, startY + 5);

      startY += 7;
      let totalScore = 0;

      DEFAULT_SUBJECT_SCORES.forEach((item, index) => {
        totalScore += item.finalScore;
        const rowHeight = 7.5;

        // Alternate fill
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, startY, pageWidth - 28, rowHeight, 'F');
        }
        doc.rect(14, startY, pageWidth - 28, rowHeight, 'S');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(String(index + 1), 18, startY + 5, { align: 'center' });
        doc.text(item.name, 28, startY + 5);
        doc.text(String(item.kkm), 80, startY + 5, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.text(String(item.finalScore), 98, startY + 5, { align: 'center' });
        doc.text(item.predicate, 114, startY + 5, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        const truncatedCompetency = doc.splitTextToSize(item.competency, 64);
        doc.text(truncatedCompetency[0] || '', 126, startY + 5);

        startY += rowHeight;
      });

      // Total & Average Row
      const avgScore = (totalScore / DEFAULT_SUBJECT_SCORES.length).toFixed(1);
      doc.setFillColor(224, 231, 255);
      doc.rect(14, startY, pageWidth - 28, 7.5, 'F');
      doc.rect(14, startY, pageWidth - 28, 7.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('JUMLAH NILAI / RATA-RATA SEMESTER', 28, startY + 5);
      doc.text(`${totalScore} / ${avgScore}`, 98, startY + 5, { align: 'center' });
      doc.text('A (Amat Baik)', 114, startY + 5);
      doc.text(`Peringkat Kelas: Ke-3 dari 32 Siswa · STATUS: TUNTAS`, 135, startY + 5);

      startY += 12;

      // Character & Attendance Boxes (2 columns)
      const colWidth = (pageWidth - 32) / 2;

      // Left: Attendance
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.rect(14, startY, colWidth, 24);
      doc.setFillColor(241, 245, 249);
      doc.rect(14, startY, colWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('REKAPITULASI KEHADIRAN SISWA', 18, startY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('1. Sakit (S) : 2 Hari (Dengan Surat Dokter Terverifikasi)', 18, startY + 11);
      doc.text('2. Izin (I)  : 1 Hari (Izin Resmi)', 18, startY + 16);
      doc.text('3. Alpa (A) : 0 Hari (Tanpa Keterangan)', 18, startY + 21);

      // Right: Character
      doc.rect(18 + colWidth, startY, colWidth, 24);
      doc.setFillColor(241, 245, 249);
      doc.rect(18 + colWidth, startY, colWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('PENILAIAN SIKAP & KARAKTER (PROFIL PANCASILA)', 22 + colWidth, startY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('· Sikap Spiritual: "A" (Sangat Baik - Rajin beribadah & toleran)', 22 + colWidth, startY + 11);
      doc.text('· Sikap Sosial: "A" (Sangat Baik - Disiplin, jujur & kolaboratif)', 22 + colWidth, startY + 16);
      doc.text('· Ekstrakurikuler: Pramuka Inti (A), English Club (A)', 22 + colWidth, startY + 21);

      startY += 28;

      // Catatan Wali Kelas
      doc.setFillColor(254, 243, 199);
      doc.rect(14, startY, pageWidth - 28, 12, 'F');
      doc.setDrawColor(251, 191, 36);
      doc.rect(14, startY, pageWidth - 28, 12, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(146, 64, 14);
      doc.text('CATATAN WALI KELAS UNTUK ORANG TUA / WALI SISWA:', 18, startY + 4);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);
      doc.text(
        '"Raditya menunjukkan perkembangan akademik dan kepemimpinan yang sangat membanggakan di Kelas 8A.',
        18,
        startY + 7.5
      );
      doc.text(
        'Pertahankan etos belajar ini untuk menyongsong ujian akhir jenjang di kelas 9."',
        18,
        startY + 10.5
      );

      startY += 16;

      // Signature Section
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const signY = startY;

      doc.text('Mengetahui,', 25, signY);
      doc.text('Orang Tua / Wali Siswa,', 25, signY + 4);
      doc.text('( ............................................. )', 25, signY + 22);

      doc.text('Kota Harapan, 20 Juni 2026', 130, signY);
      doc.text('Wali Kelas 8A,', 130, signY + 4);
      doc.setFont('helvetica', 'bold');
      doc.text('Dra. Hj. Sri Wahyuni, M.Pd', 130, signY + 20);
      doc.setFont('helvetica', 'normal');
      doc.text('NIP. 19780512 200501 2 003', 130, signY + 23.5);

      doc.text('Mengetahui & Mengesahkan,', pageWidth / 2, signY + 12, { align: 'center' });
      doc.text('Kepala Sekolah SMP PGRI 1 Kota Harapan', pageWidth / 2, signY + 16, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text('Drs. H. Mulyono, M.M.', pageWidth / 2, signY + 30, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('NIP. 19690314 199403 1 004', pageWidth / 2, signY + 33.5, { align: 'center' });

      // Save PDF file
      const fileName = `Rapor_Resmi_SMP_PGRI_1_${studentName.replace(/\s+/g, '_')}_${semester.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor PDF rapor. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 font-mono">
                RAPOR DIGITAL RESMI
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disahkan Kepala Sekolah & Wali Kelas
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Cetak Rapor & Laporan Hasil Belajar Mandiri
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Unduh dokumen Rapor Lengkap ber-Kop resmi SMP PGRI 1 untuk semester berjalan dalam format PDF.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Pratinjau Lembar</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Membuat PDF...' : 'Unduh Rapor PDF (Kop Resmi)'}</span>
          </button>
        </div>
      </div>

      {/* Mini Summary Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-blue-100 dark:border-slate-800 text-xs">
        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400">Rata-rata Nilai</span>
          <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
            87.4
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Predikat A (Sangat Baik)</span>
        </div>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400">Peringkat Kelas</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
            Ke-3 <span className="text-xs font-normal text-slate-500">dari 32 Siswa</span>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Kelas 8A Unggulan</span>
        </div>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400">Status Kelulusan</span>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            Tuntas KKM
          </div>
          <span className="text-[10px] text-slate-500">10 dari 10 Mapel Lulus</span>
        </div>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400">Tingkat Kehadiran</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
            98.2%
          </div>
          <span className="text-[10px] text-slate-500">S: 2 · I: 1 · A: 0</span>
        </div>
      </div>

      {/* Modal Pratinjau Rapor Resmi */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold">Pratinjau Lembar Rapor Digital SMP PGRI 1</h3>
                  <p className="text-xs text-slate-400">{studentName} · {nisn} · {className}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="p-8 overflow-y-auto space-y-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div className="bg-white text-slate-900 p-8 rounded-xl shadow-md border border-slate-300 w-full max-w-3xl text-xs space-y-5">
                {/* Kop Surat */}
                <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                    Persatuan Guru Republik Indonesia (PGRI)
                  </div>
                  <div className="font-semibold text-slate-600 text-[10px] uppercase">
                    Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI
                  </div>
                  <div className="font-black text-blue-800 text-base tracking-tight">
                    SMP PGRI 1 KOTA HARAPAN
                  </div>
                  <div className="text-[9px] text-slate-500">
                    NPSN: 20231945 · Terakreditasi "A" · Jl. Guru Bangsa No. 45 · Telp: (021) 8899-7711
                  </div>
                </div>

                <div className="text-center font-bold text-sm tracking-wide text-slate-900">
                  LAPORAN CAPAIAN HASIL BELAJAR SISWA
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-[11px] p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div><strong>Nama:</strong> {studentName}</div>
                    <div><strong>NISN:</strong> {nisn}</div>
                    <div><strong>Kelas:</strong> {className}</div>
                  </div>
                  <div>
                    <div><strong>Semester:</strong> {semester}</div>
                    <div><strong>Tahun Ajaran:</strong> {academicYear}</div>
                    <div><strong>Kurikulum:</strong> Kurikulum Merdeka (Fase D)</div>
                  </div>
                </div>

                {/* Table of Grades */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-blue-50 text-slate-800 font-bold border-b border-slate-300">
                        <th className="p-2 border border-slate-300 text-center w-8">No</th>
                        <th className="p-2 border border-slate-300">Mata Pelajaran</th>
                        <th className="p-2 border border-slate-300 text-center w-12">KKM</th>
                        <th className="p-2 border border-slate-300 text-center w-12">Nilai</th>
                        <th className="p-2 border border-slate-300 text-center w-12">Pred</th>
                        <th className="p-2 border border-slate-300">Deskripsi Capaian Kompetensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEFAULT_SUBJECT_SCORES.map((s, idx) => (
                        <tr key={s.code} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                          <td className="p-2 border border-slate-300 font-semibold">{s.name}</td>
                          <td className="p-2 border border-slate-300 text-center">{s.kkm}</td>
                          <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">{s.finalScore}</td>
                          <td className="p-2 border border-slate-300 text-center font-bold">{s.predicate}</td>
                          <td className="p-2 border border-slate-300 text-slate-600 text-[9.5px]">{s.competency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 pt-6 text-center text-[10px]">
                  <div>
                    <div>Mengetahui,</div>
                    <div>Orang Tua / Wali Siswa</div>
                    <div className="mt-14 font-bold">( .................................................. )</div>
                  </div>
                  <div>
                    <div>Kota Harapan, 20 Juni 2026</div>
                    <div>Wali Kelas 8A</div>
                    <div className="mt-14 font-bold underline">Dra. Hj. Sri Wahyuni, M.Pd</div>
                    <div>NIP. 19780512 200501 2 003</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Dokumen ini merupakan salinan digital resmi yang dihasilkan otomatis oleh sistem PGRI Smart.
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
