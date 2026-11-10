import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Printer,
  Download,
  Search,
  Award,
  Sparkles,
  Users,
  Building2,
  Save,
  Eye,
  Filter,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  X,
  Send,
  Calendar
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { StudentPermit, INITIAL_PERMITS } from '../student/PermitRequestModal';

export interface StudentLegerRecord {
  no: number;
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  scores: {
    ipa: number;
    mtk: number;
    indo: number;
    inggris: number;
    infor: number;
    ips: number;
    pai: number;
    ppkn: number;
    pjok: number;
    seni: number;
  };
  totalScore: number;
  averageScore: number;
  rank: number;
  attendance: {
    sakit: number;
    izin: number;
    alpa: number;
  };
  status: 'Tuntas KKM' | 'Perlu Remedial';
  spiritualGrade: 'A' | 'B' | 'C';
  spiritualDesc: string;
  socialGrade: 'A' | 'B' | 'C';
  socialDesc: string;
  homeroomNotes: string;
}

// 32 Students dataset of Class 8A SMP PGRI 1
export const CLASS_8A_32_STUDENTS: StudentLegerRecord[] = [
  {
    no: 1, id: 'std_02', nisn: '0098234121', name: 'Aisyah Putri Maharani', gender: 'P',
    scores: { ipa: 94, mtk: 92, indo: 95, inggris: 92, infor: 96, ips: 90, pai: 96, ppkn: 92, pjok: 88, seni: 86 },
    totalScore: 921, averageScore: 92.1, rank: 1, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Sangat taat beribadah, rajin membaca Al-Qur\'an dan berakhlak mulia.',
    socialGrade: 'A', socialDesc: 'Sangat santun, disiplin tinggi, dan memiliki jiwa kepemimpinan prima.',
    homeroomNotes: 'Sangat berprestasi. Pertahankan peringkat 1 umum dan teruslah menginspirasi rekan-rekanmu.'
  },
  {
    no: 2, id: 'std_03', nisn: '0098234122', name: 'Muhammad Rizky Ramadhan', gender: 'L',
    scores: { ipa: 90, mtk: 91, indo: 88, inggris: 90, infor: 94, ips: 88, pai: 92, ppkn: 88, pjok: 90, seni: 84 },
    totalScore: 895, averageScore: 89.5, rank: 2, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Tertib menjalankan salat berjamaah dan aktif dalam kegiatan Rohis.',
    socialGrade: 'A', socialDesc: 'Jujur, sportif, bertanggung jawab, dan aktif dalam organisasi OSIS.',
    homeroomNotes: 'Prestasi gemilang. Keseimbangan antara akademik dan organisasi sangat luar biasa.'
  },
  {
    no: 3, id: 'std_01', nisn: '0098234120', name: 'Raditya Pratama', gender: 'L',
    scores: { ipa: 88, mtk: 82, indo: 90, inggris: 85, infor: 94, ips: 86, pai: 92, ppkn: 88, pjok: 87, seni: 84 },
    totalScore: 876, averageScore: 87.6, rank: 3, attendance: { sakit: 2, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Menunjukkan ketaatan beribadah dan sikap toleransi yang tinggi.',
    socialGrade: 'A', socialDesc: 'Sangat disiplin, kolaboratif, dan menunjukkan etos belajar konsisten.',
    homeroomNotes: 'Menunjukkan perkembangan akademik dan kepemimpinan yang sangat membanggakan di kelas 8A.'
  },
  {
    no: 4, id: 'std_04', nisn: '0098234123', name: 'Cantika Dewi Anjani', gender: 'P',
    scores: { ipa: 86, mtk: 84, indo: 92, inggris: 88, infor: 88, ips: 85, pai: 90, ppkn: 86, pjok: 82, seni: 88 },
    totalScore: 869, averageScore: 86.9, rank: 4, attendance: { sakit: 1, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Berperilaku syukur dan selalu berdoa sebelum memulai pembelajaran.',
    socialGrade: 'A', socialDesc: 'Kreatif, ramah, dan selalu siap membantu teman yang kesulitan belajar.',
    homeroomNotes: 'Bakat sastra dan bahasamu sangat menonjol. Terus tingkatkan kemampuan analitis matematika.'
  },
  {
    no: 5, id: 'std_05', nisn: '0098234124', name: 'Dimas Satria Nugraha', gender: 'L',
    scores: { ipa: 85, mtk: 86, indo: 84, inggris: 82, infor: 90, ips: 84, pai: 88, ppkn: 84, pjok: 89, seni: 82 },
    totalScore: 854, averageScore: 85.4, rank: 5, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Rajin beribadah dan menghargai perbedaan pendapat di kelas.',
    socialGrade: 'A', socialDesc: 'Kompak, bertanggung jawab, dan antusias dalam kegiatan olahraga sekolah.',
    homeroomNotes: 'Prestasi sangat baik dan stabil. Tingkatkan lagi penguasaan kosakata bahasa asing.'
  },
  {
    no: 6, id: 'std_07', nisn: '0098234126', name: 'Gita Nirmala Sari', gender: 'P',
    scores: { ipa: 84, mtk: 82, indo: 88, inggris: 85, infor: 86, ips: 84, pai: 88, ppkn: 85, pjok: 80, seni: 89 },
    totalScore: 851, averageScore: 85.1, rank: 6, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Taat beribadah dan selalu menghormati bapak/ibu guru.',
    socialGrade: 'A', socialDesc: 'Tertib, santun, dan berbakat dalam seni rupa ragam hias.',
    homeroomNotes: 'Karya seni dan kerapian tugasmu patut dicontoh. Pertahankan prestasi ini.'
  },
  {
    no: 7, id: 'std_09', nisn: '0098234128', name: 'Indah Permata Bunda', gender: 'P',
    scores: { ipa: 82, mtk: 80, indo: 86, inggris: 84, infor: 85, ips: 86, pai: 88, ppkn: 86, pjok: 80, seni: 85 },
    totalScore: 842, averageScore: 84.2, rank: 7, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Melaksanakan ibadah dengan baik dan menunjukkan toleransi.',
    socialGrade: 'A', socialDesc: 'Sopan santun dan memiliki kepedulian sosial yang tinggi.',
    homeroomNotes: 'Kemampuan komunikasi sangat baik. Terus pacu semangat belajar dalam sains.'
  },
  {
    no: 8, id: 'std_06', nisn: '0098234125', name: 'Fadhil Al-Ghifari', gender: 'L',
    scores: { ipa: 83, mtk: 85, indo: 80, inggris: 80, infor: 88, ips: 82, pai: 86, ppkn: 82, pjok: 85, seni: 80 },
    totalScore: 831, averageScore: 83.1, rank: 8, attendance: { sakit: 0, izin: 2, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Taat beribadah dan bertutur kata sopan kepada sesama.',
    socialGrade: 'B', socialDesc: 'Cukup disiplin dan mampu bekerja sama dalam kelompok.',
    homeroomNotes: 'Potensi logika komputasi sangat baik. Tingkatkan keaktifan berdiskusi di kelas.'
  },
  {
    no: 9, id: 'std_11', nisn: '0098234130', name: 'Aditya Bagus Saputra', gender: 'L',
    scores: { ipa: 82, mtk: 84, indo: 82, inggris: 80, infor: 86, ips: 80, pai: 85, ppkn: 82, pjok: 86, seni: 80 },
    totalScore: 827, averageScore: 82.7, rank: 9, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Selalu berdoa sebelum kegiatan belajar.',
    socialGrade: 'B', socialDesc: 'Disiplin dan aktif dalam kegiatan ekstrakurikuler futsal.',
    homeroomNotes: 'Semangat belajar yang gigih. Tingkatkan konsentrasi pada tugas mandiri.'
  },
  {
    no: 10, id: 'std_12', nisn: '0098234131', name: 'Anindya Kirana Larasati', gender: 'P',
    scores: { ipa: 80, mtk: 82, indo: 85, inggris: 83, infor: 82, ips: 84, pai: 86, ppkn: 84, pjok: 79, seni: 84 },
    totalScore: 829, averageScore: 82.9, rank: 10, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'A', spiritualDesc: 'Taat beribadah dan bersikap rendah hati.',
    socialGrade: 'A', socialDesc: 'Pekerja keras, tekun, dan ramah kepada semua orang.',
    homeroomNotes: 'Prestasi belajar stabil. Terus asah kemampuan berbicara di depan umum.'
  },
  {
    no: 11, id: 'std_13', nisn: '0098234132', name: 'Bayu Aji Pamungkas', gender: 'L',
    scores: { ipa: 80, mtk: 81, indo: 80, inggris: 79, infor: 84, ips: 80, pai: 84, ppkn: 80, pjok: 87, seni: 79 },
    totalScore: 814, averageScore: 81.4, rank: 11, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Menjalankan ibadah wajib dengan tertib.',
    socialGrade: 'B', socialDesc: 'Jujur, sportif, dan aktif dalam baris berbaris Paskibra.',
    homeroomNotes: 'Kedisiplinan fisik luar biasa. Salurkan fokus yang sama pada pelajaran berhitung.'
  },
  {
    no: 12, id: 'std_08', nisn: '0098234127', name: 'Hafiz Surya Perkasa', gender: 'L',
    scores: { ipa: 78, mtk: 80, indo: 80, inggris: 78, infor: 82, ips: 81, pai: 84, ppkn: 80, pjok: 84, seni: 78 },
    totalScore: 805, averageScore: 80.5, rank: 12, attendance: { sakit: 2, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Melaksanakan doa bersama dengan khidmat.',
    socialGrade: 'B', socialDesc: 'Cukup bertanggung jawab dan mudah bergaul.',
    homeroomNotes: 'Mampu menyelesaikan tugas tepat waktu. Tingkatkan ketelitian dalam ujian.'
  },
  {
    no: 13, id: 'std_14', nisn: '0098234133', name: 'Citra Ayu Lestari', gender: 'P',
    scores: { ipa: 79, mtk: 78, indo: 84, inggris: 81, infor: 80, ips: 82, pai: 85, ppkn: 82, pjok: 78, seni: 83 },
    totalScore: 812, averageScore: 81.2, rank: 13, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Selalu bersyukur dan menjaga sopan santun.',
    socialGrade: 'B', socialDesc: 'Tekun dalam menyusun tugas kliping dan makalah.',
    homeroomNotes: 'Terus pertahankan semangat belajarmu yang positif.'
  },
  {
    no: 14, id: 'std_15', nisn: '0098234134', name: 'Daffa Rizqullah', gender: 'L',
    scores: { ipa: 79, mtk: 80, indo: 79, inggris: 80, infor: 82, ips: 79, pai: 84, ppkn: 80, pjok: 82, seni: 78 },
    totalScore: 803, averageScore: 80.3, rank: 14, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Taat pada aturan ibadah di sekolah.',
    socialGrade: 'B', socialDesc: 'Bisa diajak kerja sama dengan kompak.',
    homeroomNotes: 'Capaian sudah di atas KKM. Tingkatkan minat baca di perpustakaan.'
  },
  {
    no: 15, id: 'std_16', nisn: '0098234135', name: 'Dewi Sekar Arum', gender: 'P',
    scores: { ipa: 80, mtk: 77, indo: 82, inggris: 80, infor: 80, ips: 82, pai: 84, ppkn: 81, pjok: 78, seni: 84 },
    totalScore: 808, averageScore: 80.8, rank: 15, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Rajin mengikuti siraman rohani Jumat pagi.',
    socialGrade: 'A', socialDesc: 'Sangat rapi, ramah, dan telaten.',
    homeroomNotes: 'Tugas-tugas selalu selesai dengan rapi dan teratur.'
  },
  {
    no: 16, id: 'std_17', nisn: '0098234136', name: 'Eko Prasetyo', gender: 'L',
    scores: { ipa: 78, mtk: 79, indo: 78, inggris: 77, infor: 82, ips: 78, pai: 82, ppkn: 80, pjok: 84, seni: 78 },
    totalScore: 796, averageScore: 79.6, rank: 16, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Menjalankan kewajiban ibadah dengan tertib.',
    socialGrade: 'B', socialDesc: 'Jujur dan suka membantu teman sekelas.',
    homeroomNotes: 'Terus giat berlatih soal-soal latihan mandiri.'
  },
  {
    no: 17, id: 'std_18', nisn: '0098234137', name: 'Farhan Maulana', gender: 'L',
    scores: { ipa: 77, mtk: 78, indo: 79, inggris: 76, infor: 82, ips: 79, pai: 83, ppkn: 79, pjok: 85, seni: 77 },
    totalScore: 795, averageScore: 79.5, rank: 17, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Berperilaku baik dan menghormati guru.',
    socialGrade: 'B', socialDesc: 'Sportif dan aktif dalam kegiatan keolahragaan.',
    homeroomNotes: 'Perhatikan tenggat waktu pengumpulan tugas agar tidak menumpuk.'
  },
  {
    no: 18, id: 'std_19', nisn: '0098234138', name: 'Ghaniyya Zahra', gender: 'P',
    scores: { ipa: 78, mtk: 76, indo: 82, inggris: 80, infor: 80, ips: 80, pai: 84, ppkn: 81, pjok: 78, seni: 82 },
    totalScore: 801, averageScore: 80.1, rank: 18, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Tertib berdoa sebelum belajar.',
    socialGrade: 'B', socialDesc: 'Punya rasa empati yang bagus terhadap kawan.',
    homeroomNotes: 'Terus tingkatkan percaya diri dalam mengajukan pertanyaan.'
  },
  {
    no: 19, id: 'std_20', nisn: '0098234139', name: 'Gilang Ramadhan', gender: 'L',
    scores: { ipa: 76, mtk: 78, indo: 78, inggris: 76, infor: 80, ips: 78, pai: 82, ppkn: 78, pjok: 83, seni: 78 },
    totalScore: 787, averageScore: 78.7, rank: 19, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Selalu menjaga ketertiban saat ibadah.',
    socialGrade: 'B', socialDesc: 'Mau bekerja sama dalam diskusi kelompok.',
    homeroomNotes: 'Kehadiran sempurna. Tingkatkan daya analisis pada mata pelajaran IPA.'
  },
  {
    no: 20, id: 'std_21', nisn: '0098234140', name: 'Hana Khairunnisa', gender: 'P',
    scores: { ipa: 78, mtk: 76, indo: 81, inggris: 79, infor: 78, ips: 80, pai: 84, ppkn: 80, pjok: 77, seni: 81 },
    totalScore: 794, averageScore: 79.4, rank: 20, attendance: { sakit: 2, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Rendah hati dan menjaga kesantunan.',
    socialGrade: 'B', socialDesc: 'Rajin mencatat rangkuman pelajaran.',
    homeroomNotes: 'Kerapian catatan patut dipuji. Jangan ragu berpendapat di kelas.'
  },
  {
    no: 21, id: 'std_22', nisn: '0098234141', name: 'Ilham Wahyudi', gender: 'L',
    scores: { ipa: 77, mtk: 77, indo: 78, inggris: 76, infor: 80, ips: 78, pai: 81, ppkn: 78, pjok: 82, seni: 77 },
    totalScore: 784, averageScore: 78.4, rank: 21, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Taat pada tata tertib sekolah.',
    socialGrade: 'B', socialDesc: 'Disiplin dan menghargai arahan wali kelas.',
    homeroomNotes: 'Pertahankan ketuntasan KKM dan kurangi waktu bermain game.'
  },
  {
    no: 22, id: 'std_23', nisn: '0098234142', name: 'Jasmine Aurelia', gender: 'P',
    scores: { ipa: 76, mtk: 75, indo: 80, inggris: 81, infor: 78, ips: 79, pai: 82, ppkn: 79, pjok: 76, seni: 80 },
    totalScore: 786, averageScore: 78.6, rank: 22, attendance: { sakit: 1, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Menjaga sopan santun kepada bapak/ibu guru.',
    socialGrade: 'B', socialDesc: 'Ceria dan bersahabat dengan semua rekan.',
    homeroomNotes: 'Bakat bahasa asingmu baik. Tingkatkan latihan soal numerasi.'
  },
  {
    no: 23, id: 'std_24', nisn: '0098234143', name: 'Kevin Pratama', gender: 'L',
    scores: { ipa: 76, mtk: 78, indo: 76, inggris: 78, infor: 82, ips: 76, pai: 80, ppkn: 77, pjok: 81, seni: 76 },
    totalScore: 780, averageScore: 78.0, rank: 23, attendance: { sakit: 0, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Selalu mengikuti kegiatan keagamaan sekolah.',
    socialGrade: 'B', socialDesc: 'Terampil menggunakan komputer dan aplikasi digital.',
    homeroomNotes: 'Kemampuan IT kamu sangat membantu kelas. Jaga kedisiplinan belajar.'
  },
  {
    no: 24, id: 'std_25', nisn: '0098234144', name: 'Laila Nur Azizah', gender: 'P',
    scores: { ipa: 76, mtk: 75, indo: 80, inggris: 78, infor: 78, ips: 78, pai: 84, ppkn: 78, pjok: 76, seni: 79 },
    totalScore: 782, averageScore: 78.2, rank: 24, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Rajin beribadah dan bertutur kata santun.',
    socialGrade: 'B', socialDesc: 'Selalu tertib menjaga kebersihan meja kelas.',
    homeroomNotes: 'Sikap santun dan ramahmu menciptakan suasana kelas yang damai.'
  },
  {
    no: 25, id: 'std_26', nisn: '0098234145', name: 'Mahesa Danendra', gender: 'L',
    scores: { ipa: 75, mtk: 77, indo: 76, inggris: 75, infor: 80, ips: 76, pai: 80, ppkn: 76, pjok: 82, seni: 75 },
    totalScore: 772, averageScore: 77.2, rank: 25, attendance: { sakit: 0, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Mengikuti doa bersama dengan tertib.',
    socialGrade: 'B', socialDesc: 'Aktif berolahraga dan memiliki jiwa korsa yang tinggi.',
    homeroomNotes: 'Fokus belajar di kelas perlu lebih dijaga agar nilai terus merangkak naik.'
  },
  {
    no: 26, id: 'std_27', nisn: '0098234146', name: 'Nabila Syakira', gender: 'P',
    scores: { ipa: 76, mtk: 75, indo: 79, inggris: 76, infor: 77, ips: 78, pai: 82, ppkn: 78, pjok: 76, seni: 78 },
    totalScore: 775, averageScore: 77.5, rank: 26, attendance: { sakit: 1, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Menjaga sopan santun dan berperilaku syukur.',
    socialGrade: 'B', socialDesc: 'Tekun dalam mengerjakan pekerjaan rumah.',
    homeroomNotes: 'Seluruh mapel tuntas KKM. Tingkatkan keaktifan saat presentasi.'
  },
  {
    no: 27, id: 'std_28', nisn: '0098234147', name: 'Oscar Wijaya', gender: 'L',
    scores: { ipa: 75, mtk: 76, indo: 76, inggris: 75, infor: 79, ips: 75, pai: 80, ppkn: 76, pjok: 80, seni: 75 },
    totalScore: 767, averageScore: 76.7, rank: 27, attendance: { sakit: 0, izin: 0, alpa: 1 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Melaksanakan ibadah sesuai dengan agamanya.',
    socialGrade: 'B', socialDesc: 'Jujur dan mampu menghargai perbedaan latar belakang.',
    homeroomNotes: 'Perhatikan absensi, hindari alpa tanpa keterangan dari orang tua.'
  },
  {
    no: 28, id: 'std_29', nisn: '0098234148', name: 'Putri Maharani', gender: 'P',
    scores: { ipa: 75, mtk: 75, indo: 78, inggris: 76, infor: 77, ips: 76, pai: 81, ppkn: 76, pjok: 75, seni: 77 },
    totalScore: 766, averageScore: 76.6, rank: 28, attendance: { sakit: 1, izin: 0, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Taat pada norma kesopanan dan agama.',
    socialGrade: 'B', socialDesc: 'Santun dan pendiam namun tekun belajar.',
    homeroomNotes: 'Nilai sudah memenuhi batas minimal KKM. Pacu lagi belajarmu.'
  },
  {
    no: 29, id: 'std_30', nisn: '0098234149', name: 'Rian Hidayat', gender: 'L',
    scores: { ipa: 75, mtk: 75, indo: 75, inggris: 75, infor: 78, ips: 75, pai: 80, ppkn: 75, pjok: 80, seni: 75 },
    totalScore: 763, averageScore: 76.3, rank: 29, attendance: { sakit: 2, izin: 1, alpa: 0 }, status: 'Tuntas KKM',
    spiritualGrade: 'B', spiritualDesc: 'Melaksanakan doa bersama dengan baik.',
    socialGrade: 'B', socialDesc: 'Mudah bergaul dan suka kegiatan bakti sosial.',
    homeroomNotes: 'Pertahankan komitmen menyelesaikan seluruh tugas tepat waktu.'
  },
  {
    no: 30, id: 'std_10', nisn: '0098234129', name: 'Budi Santoso', gender: 'L',
    scores: { ipa: 72, mtk: 70, indo: 74, inggris: 70, infor: 76, ips: 71, pai: 78, ppkn: 72, pjok: 78, seni: 74 },
    totalScore: 735, averageScore: 73.5, rank: 30, attendance: { sakit: 3, izin: 2, alpa: 1 }, status: 'Perlu Remedial',
    spiritualGrade: 'B', spiritualDesc: 'Cukup taat beribadah saat dibimbing bapak/ibu guru.',
    socialGrade: 'C', socialDesc: 'Perlu bimbingan intensif dalam kedisiplinan jam masuk sekolah.',
    homeroomNotes: 'Wajib mengikuti program remedial mandiri pada mata pelajaran Matematika dan IPA.'
  },
  {
    no: 31, id: 'std_31', nisn: '0098234150', name: 'Satria Wicaksono', gender: 'L',
    scores: { ipa: 73, mtk: 71, indo: 74, inggris: 71, infor: 75, ips: 72, pai: 76, ppkn: 73, pjok: 77, seni: 73 },
    totalScore: 735, averageScore: 73.5, rank: 31, attendance: { sakit: 2, izin: 1, alpa: 1 }, status: 'Perlu Remedial',
    spiritualGrade: 'B', spiritualDesc: 'Menjaga tata krama dan sopan santun.',
    socialGrade: 'C', socialDesc: 'Perlu meningkatkan tanggung jawab pengumpulan PR.',
    homeroomNotes: 'Tingkatkan jam belajar di rumah dan ikuti bimbingan belajar tambahan.'
  },
  {
    no: 32, id: 'std_32', nisn: '0098234151', name: 'Tiara Anggraini', gender: 'P',
    scores: { ipa: 72, mtk: 70, indo: 75, inggris: 72, infor: 74, ips: 71, pai: 76, ppkn: 73, pjok: 75, seni: 74 },
    totalScore: 732, averageScore: 73.2, rank: 32, attendance: { sakit: 4, izin: 2, alpa: 0 }, status: 'Perlu Remedial',
    spiritualGrade: 'B', spiritualDesc: 'Berperilaku baik dan menghormati sesama.',
    socialGrade: 'B', socialDesc: 'Kerap tidak masuk karena sakit. Perlu menjaga kesehatan.',
    homeroomNotes: 'Manfaatkan waktu pemulihan kesehatan dengan tetap mempelajari modul daring.'
  },
];

const STORAGE_LEGER_KEY = 'pgri_homeroom_32_leger';
const STORAGE_PERMITS_KEY = 'pgri_student_permits';

export const HomeroomManagementPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'permits' | 'character' | 'leger'>('permits');

  // Permits state
  const [permits, setPermits] = useState<StudentPermit[]>(INITIAL_PERMITS);
  const [permitFilter, setPermitFilter] = useState<'all' | 'menunggu' | 'disetujui' | 'ditolak'>('all');
  const [rejectingPermitId, setRejectingPermitId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Lampiran surat dokter tidak terbaca atau kurang jelas.');

  // Students Character & Leger State
  const [studentsData, setStudentsData] = useState<StudentLegerRecord[]>(CLASS_8A_32_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPermits = localStorage.getItem(STORAGE_PERMITS_KEY);
      if (storedPermits) {
        setPermits(JSON.parse(storedPermits));
      }

      const storedLeger = localStorage.getItem(STORAGE_LEGER_KEY);
      if (storedLeger) {
        setStudentsData(JSON.parse(storedLeger));
      }
    } catch {
      // Ignore
    }
  }, []);

  const selectedStudent = studentsData.find((s) => s.id === selectedStudentId) || studentsData[0];

  // Handle Permit Approval
  const handleApprovePermit = (id: string) => {
    const now = new Date();
    const reviewedAt = `${now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const updated = permits.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'disetujui' as const,
          reviewedBy: 'Dra. Hj. Sri Wahyuni, M.Pd (Wali Kelas 8A)',
          reviewedAt,
          reviewNotes: 'Surat izin telah diverifikasi sah. Absensi otomatis diperbarui.',
        };
      }
      return p;
    });

    setPermits(updated);
    try {
      localStorage.setItem(STORAGE_PERMITS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setToastMessage('Surat izin siswa berhasil DISETUJUI dan dicatat ke absensi kelas!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Permit Rejection
  const handleRejectPermit = (id: string) => {
    const now = new Date();
    const reviewedAt = `${now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const updated = permits.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'ditolak' as const,
          reviewedBy: 'Dra. Hj. Sri Wahyuni, M.Pd (Wali Kelas 8A)',
          reviewedAt,
          reviewNotes: rejectReason || 'Surat izin ditolak oleh wali kelas.',
        };
      }
      return p;
    });

    setPermits(updated);
    try {
      localStorage.setItem(STORAGE_PERMITS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setRejectingPermitId(null);
    setToastMessage('Surat izin telah DITOLAK dengan catatan untuk orang tua/siswa.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update Character & Notes for current student
  const handleUpdateCurrentStudent = (field: keyof StudentLegerRecord, value: any) => {
    const updated = studentsData.map((s) => {
      if (s.id === selectedStudentId) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setStudentsData(updated);
    try {
      localStorage.setItem(STORAGE_LEGER_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Export Leger Nilai 32 Siswa to PDF
  const handleExportLegerPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // KOP SURAT
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('PERSATUAN GURU REPUBLIK INDONESIA (PGRI) · KOTA HARAPAN', pageWidth / 2, 12, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('LEGER REKAPITULASI HASIL BELAJAR SISWA KELAS 8A (32 SISWA)', pageWidth / 2, 18, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(
        'SMP PGRI 1 KOTA HARAPAN · Semester Genap Tahun Ajaran 2026/2027 · Wali Kelas: Dra. Hj. Sri Wahyuni, M.Pd',
        pageWidth / 2,
        23,
        { align: 'center' }
      );

      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.6);
      doc.line(10, 26, pageWidth - 10, 26);

      // Table Header
      let y = 31;
      doc.setFillColor(239, 246, 255);
      doc.rect(10, y, pageWidth - 20, 6, 'F');
      doc.setDrawColor(148, 163, 184);
      doc.rect(10, y, pageWidth - 20, 6, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text('NO', 12, y + 4);
      doc.text('NISN', 18, y + 4);
      doc.text('NAMA LENGKAP SISWA', 36, y + 4);
      doc.text('L/P', 82, y + 4);
      doc.text('IPA', 90, y + 4);
      doc.text('MTK', 100, y + 4);
      doc.text('IND', 110, y + 4);
      doc.text('ING', 120, y + 4);
      doc.text('INF', 130, y + 4);
      doc.text('IPS', 140, y + 4);
      doc.text('PAI', 150, y + 4);
      doc.text('PKN', 160, y + 4);
      doc.text('PJK', 170, y + 4);
      doc.text('SBD', 180, y + 4);
      doc.text('JML', 192, y + 4);
      doc.text('RATA', 205, y + 4);
      doc.text('RNK', 218, y + 4);
      doc.text('S/I/A', 228, y + 4);
      doc.text('STATUS KELULUSAN', 248, y + 4);

      y += 6;

      studentsData.forEach((st, idx) => {
        const rowH = 4.3;
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(10, y, pageWidth - 20, rowH, 'F');
        }
        doc.rect(10, y, pageWidth - 20, rowH, 'S');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.2);
        doc.text(String(st.no), 12, y + 3);
        doc.text(st.nisn, 18, y + 3);
        doc.text(st.name.slice(0, 28), 36, y + 3);
        doc.text(st.gender, 83, y + 3);
        doc.text(String(st.scores.ipa), 90, y + 3);
        doc.text(String(st.scores.mtk), 100, y + 3);
        doc.text(String(st.scores.indo), 110, y + 3);
        doc.text(String(st.scores.inggris), 120, y + 3);
        doc.text(String(st.scores.infor), 130, y + 3);
        doc.text(String(st.scores.ips), 140, y + 3);
        doc.text(String(st.scores.pai), 150, y + 3);
        doc.text(String(st.scores.ppkn), 160, y + 3);
        doc.text(String(st.scores.pjok), 170, y + 3);
        doc.text(String(st.scores.seni), 180, y + 3);

        doc.setFont('helvetica', 'bold');
        doc.text(String(st.totalScore), 192, y + 3);
        doc.text(String(st.averageScore), 205, y + 3);
        doc.text(String(st.rank), 220, y + 3);
        doc.setFont('helvetica', 'normal');
        doc.text(`${st.attendance.sakit}/${st.attendance.izin}/${st.attendance.alpa}`, 228, y + 3);
        doc.text(st.status, 248, y + 3);

        y += rowH;
      });

      // Signatures
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Mengetahui,', 40, y);
      doc.text('Kepala Sekolah SMP PGRI 1,', 40, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text('Drs. H. Mulyono, M.M.', 40, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.text('NIP. 19690314 199403 1 004', 40, y + 19);

      doc.text('Kota Harapan, 20 Juni 2026', 220, y);
      doc.text('Wali Kelas 8A,', 220, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text('Dra. Hj. Sri Wahyuni, M.Pd', 220, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.text('NIP. 19780512 200501 2 003', 220, y + 19);

      doc.save('Leger_Nilai_Resmi_Kelas_8A_32_Siswa_SMP_PGRI_1.pdf');
      setToastMessage('Dokumen Leger Nilai 32 Siswa Kelas 8A berhasil diekspor ke PDF!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor PDF leger. Silakan coba kembali.');
    }
  };

  // Mass Report Print Batch
  const handlePrintMassReports = () => {
    alert(
      'Mempersiapkan 32 Berkas Rapor Digital Kelas 8A. Dialog cetak massal peramban akan terbuka...'
    );
    window.print();
  };

  const filteredPermits = permits.filter((p) => {
    if (permitFilter === 'all') return true;
    return p.status === permitFilter;
  });

  const filteredStudents = studentsData.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-0">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Administrasi Terpadu Wali Kelas · Rombel 8A</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            Panel Manajemen & Administrasi Wali Kelas
          </h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Dra. Hj. Sri Wahyuni, M.Pd · 32 Siswa Terbina · Semester Genap TA 2026/2027
          </p>
        </div>

        {/* Global Action Badges */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <Users className="w-4 h-4 text-blue-200" />
            <span>32 Siswa Kelas 8A</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-xs font-semibold flex items-center gap-1.5 border border-emerald-400/30 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Akreditasi A</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 pt-3 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('permits')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'permits'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi Surat Izin / Sakit</span>
          {permits.filter((p) => p.status === 'menunggu').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold">
              {permits.filter((p) => p.status === 'menunggu').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('character')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'character'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Catatan Wali Kelas & Penilaian Sikap</span>
        </button>

        <button
          onClick={() => setActiveTab('leger')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'leger'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Leger Nilai & Cetak Rapor Massal</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="m-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Panel */}
      <div className="p-6">
        {/* ================= TAB 1: VERIFIKASI SURAT IZIN ================= */}
        {activeTab === 'permits' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
              <div>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  Antrean Verifikasi Surat Permohonan Siswa Kelas 8A
                </span>
                <p className="text-blue-700 dark:text-blue-300 text-[11px] mt-0.5">
                  Surat yang disetujui akan otomatis sinkron ke pembukuan kehadiran jurnal absensi kelas.
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'menunggu', label: 'Menunggu' },
                  { id: 'disetujui', label: 'Disetujui' },
                  { id: 'ditolak', label: 'Ditolak' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPermitFilter(f.id as typeof permitFilter)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                      permitFilter === f.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredPermits.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Tidak ada pengajuan izin pada kategori ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPermits.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.type === 'sakit'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {item.type === 'sakit' ? 'Sakit (Dokter)' : 'Izin Acara'}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.studentName} ({item.studentNisn})
                          </span>
                          <span className="text-xs font-mono text-slate-400">· {item.className}</span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <strong>Keterangan:</strong> {item.reason}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                          <span>
                            Tanggal: <strong>{item.startDate} s/d {item.endDate}</strong> ({item.totalDays} Hari)
                          </span>
                          <span>·</span>
                          <span>Kontak Ortu: <strong>{item.parentContact}</strong></span>
                          <span>·</span>
                          <span>Diajukan: {item.submittedAt}</span>
                        </div>
                      </div>

                      {/* Status / Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        {item.status === 'menunggu' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprovePermit(item.id)}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui Izin</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingPermitId(item.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </>
                        ) : item.status === 'disetujui' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Telah Disetujui</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Ditolak</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reviewer Note Info */}
                    {item.reviewNotes && (
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Catatan Verifikasi:</strong> "{item.reviewNotes}"
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Diverifikasi oleh: {item.reviewedBy} pada {item.reviewedAt}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Tolak Surat */}
        {rejectingPermitId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Alasan Penolakan Surat Izin</span>
              </h3>
              <p className="text-xs text-slate-500">
                Cantumkan alasan penolakan agar siswa atau orang tua dapat memperbaiki berkas surat izin.
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingPermitId(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectPermit(rejectingPermitId)}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CATATAN WALI KELAS & SIKAP ================= */}
        {activeTab === 'character' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Student Selector List */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Daftar 32 Siswa Kelas 8A</span>
                <span className="font-mono text-blue-600">Terdata 32 Siswa</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa atau NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Scrollable List */}
              <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
                {filteredStudents.map((st) => {
                  const isSelected = st.id === selectedStudentId;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStudentId(st.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {st.no}. {st.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          NISN: {st.nisn} · Rata: {st.averageScore}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Input Character & Homeroom Notes */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedStudent.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                      Ranking {selectedStudent.rank}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    NISN: {selectedStudent.nisn} · Rata-rata Nilai: {selectedStudent.averageScore} · Kehadiran S/I/A: {selectedStudent.attendance.sakit}/{selectedStudent.attendance.izin}/{selectedStudent.attendance.alpa}
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Siap Rapor</span>
                </div>
              </div>

              {/* 1. Sikap Spiritual */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    1. Penilaian Sikap Spiritual (Karakter Beriman & Bertakwa)
                  </label>
                  <div className="flex items-center gap-1 text-xs">
                    {(['A', 'B', 'C'] as const).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleUpdateCurrentStudent('spiritualGrade', grade)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                          selectedStudent.spiritualGrade === grade
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={selectedStudent.spiritualDesc}
                  onChange={(e) => handleUpdateCurrentStudent('spiritualDesc', e.target.value)}
                  placeholder="Deskripsi capaian sikap spiritual siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                />
              </div>

              {/* 2. Sikap Sosial */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    2. Penilaian Sikap Sosial (Gotong Royong, Disiplin & Santun)
                  </label>
                  <div className="flex items-center gap-1 text-xs">
                    {(['A', 'B', 'C'] as const).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleUpdateCurrentStudent('socialGrade', grade)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                          selectedStudent.socialGrade === grade
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={selectedStudent.socialDesc}
                  onChange={(e) => handleUpdateCurrentStudent('socialDesc', e.target.value)}
                  placeholder="Deskripsi capaian sikap sosial siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                />
              </div>

              {/* 3. Catatan Wali Kelas Kolom Rapor */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                  3. Pesan Motivasi & Catatan Wali Kelas untuk Lembar Rapor Semester
                </label>
                <textarea
                  rows={3}
                  value={selectedStudent.homeroomNotes}
                  onChange={(e) => handleUpdateCurrentStudent('homeroomNotes', e.target.value)}
                  placeholder="Tuliskan catatan apresiatif atau evaluasi perkembangan siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage(`Catatan karakter untuk ${selectedStudent.name} tersimpan ke basis data rapor!`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Catatan Siswa</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LEGER NILAI & RAPOR MASSAL ================= */}
        {activeTab === 'leger' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span>Tabel Leger Nilai Lengkap 32 Siswa Kelas 8A</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi 10 mata pelajaran, total nilai, ranking, kehadiran, dan status kelulusan KKM.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportLegerPdf}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor Leger Nilai (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintMassReports}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>Cetak Rapor Massal</span>
                </button>
              </div>
            </div>

            {/* Leger Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 text-center w-8">No</th>
                    <th className="p-2.5">NISN</th>
                    <th className="p-2.5 min-w-[170px]">Nama Siswa</th>
                    <th className="p-2 text-center">L/P</th>
                    <th className="p-2 text-center">IPA</th>
                    <th className="p-2 text-center">MTK</th>
                    <th className="p-2 text-center">IND</th>
                    <th className="p-2 text-center">ING</th>
                    <th className="p-2 text-center">INF</th>
                    <th className="p-2 text-center">IPS</th>
                    <th className="p-2 text-center">PAI</th>
                    <th className="p-2 text-center">PKN</th>
                    <th className="p-2 text-center">PJK</th>
                    <th className="p-2 text-center">SBD</th>
                    <th className="p-2.5 text-center font-extrabold text-blue-600">Rata²</th>
                    <th className="p-2 text-center font-bold">Rank</th>
                    <th className="p-2 text-center">S/I/A</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {studentsData.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-2 text-center font-mono text-slate-500">{s.no}</td>
                      <td className="p-2 font-mono text-slate-500 text-[10px]">{s.nisn}</td>
                      <td className="p-2 font-bold text-slate-900 dark:text-white truncate">
                        {s.name}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-500">{s.gender}</td>
                      <td className="p-2 text-center font-mono">{s.scores.ipa}</td>
                      <td className="p-2 text-center font-mono">{s.scores.mtk}</td>
                      <td className="p-2 text-center font-mono">{s.scores.indo}</td>
                      <td className="p-2 text-center font-mono">{s.scores.inggris}</td>
                      <td className="p-2 text-center font-mono">{s.scores.infor}</td>
                      <td className="p-2 text-center font-mono">{s.scores.ips}</td>
                      <td className="p-2 text-center font-mono">{s.scores.pai}</td>
                      <td className="p-2 text-center font-mono">{s.scores.ppkn}</td>
                      <td className="p-2 text-center font-mono">{s.scores.pjok}</td>
                      <td className="p-2 text-center font-mono">{s.scores.seni}</td>
                      <td className="p-2 text-center font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        {s.averageScore}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        #{s.rank}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-500 text-[10px]">
                        {s.attendance.sakit}/{s.attendance.izin}/{s.attendance.alpa}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'Tuntas KKM'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
