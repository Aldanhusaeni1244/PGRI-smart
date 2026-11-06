import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve(process.cwd(), 'public/documents');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function addKopSurat(doc: jsPDF, subject: string, title: string, docNo: string) {
  // Border double
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.2);
  doc.line(14, 30, 196, 30);
  doc.setLineWidth(0.4);
  doc.line(14, 32, 196, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('YAYASAN PEMBINA LEMBAGA PENDIDIKAN DASAR DAN MENENGAH (YPLP PGRI)', 105, 12, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('SMP PGRI 1 KOTA HARAPAN', 105, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Jl. Guru Bangsa No. 45, Kompleks Pendidikan PGRI · NPSN: 20231945 · Terakreditasi A', 105, 22.5, { align: 'center' });
  doc.text('Portal E-Learning Resmi: https://smp-pgri.sch.id · Email: info@smp-pgri.sch.id', 105, 26.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text(title.toUpperCase(), 105, 39, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Mata Pelajaran: ${subject}  |  Nomor Dokumen: ${docNo}  |  Fase D (Kelas VIII)`, 105, 44, { align: 'center' });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(14, 282, 196, 282);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Dokumen Resmi Kurikulum Merdeka SMP PGRI 1 Kota Harapan · Terintegrasi E-Learning', 14, 286);
  doc.text(`Halaman ${pageNum} dari ${totalPages}`, 196, 286, { align: 'right' });
}

// 1. IPA: Panduan Praktikum Uji Nutrisi
export function createUjiNutrisi() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, 'Ilmu Pengetahuan Alam (IPA Terpadu)', 'Panduan Praktikum: Uji Nutrisi & Karbohidrat', 'SMP-PGRI/LKS-IPA/04');

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 49, 182, 16, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 49, 182, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Nama Siswa  : Raditya Pratama', 18, 55);
  doc.text('NISN / Kelas: 0098234120 / Kelas 8A', 18, 61);
  doc.text('Guru Pengampu: Dra. Hj. Sri Wahyuni, M.Pd', 110, 55);
  doc.text('Tenggat Tugas: 05 November 2026', 110, 61);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('A. CAPAIAN PEMBELAJARAN & TUJUAN PRAKTIKUM', 14, 73);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Mengidentifikasi kandungan amilum (pati) pada berbagai bahan pangan kantin sekolah.', 16, 79);
  doc.text('2. Menganalisis reaksi spesifik perubahan warna reagen lugol dari cokelat menjadi biru kehitaman.', 16, 84);
  doc.text('3. Menyusun laporan ilmiah sederhana berbasis data pengamatan eksperimen mandiri.', 16, 89);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('B. DASAR TEORI ILMIAH', 14, 98);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const teori = 'Karbohidrat merupakan makronutrien utama bagi metabolisme tubuh. Salah satu jenis polisakarida penting adalah amilum yang tersusun atas amilosa dan amilopektin. Uji lugol (iodin 1%) didasarkan pada masuknya molekul triiodida ke dalam struktur heliks amilosa sehingga membentuk kompleks adsorpsi berwarna biru tua hingga biru kehitaman pekat. Bahan yang tidak mengandung amilum akan tetap berwarna cokelat kekuningan.';
  doc.text(doc.splitTextToSize(teori, 182), 14, 104);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('C. ALAT DAN BAHAN LABORATORIUM', 14, 122);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('• Plat tetes porselen 12 lekukan (1 buah)        • Reagen Lugol / Larutan Iodin 1% (10 mL)', 16, 128);
  doc.text('• Pipet tetes kaca berskala (2 buah)            • Sampel A: Nasi putih kantin sekolah', 16, 133);
  doc.text('• Lumpang dan alu porselen (1 set)              • Sampel B: Tahu putih kukus', 16, 138);
  doc.text('• Spatula plastik pengaduk (1 buah)             • Sampel C: Biskuit gandum gurih', 16, 143);
  doc.text('• Gelas beker 100 mL dan akuades (50 mL)        • Sampel D: Putih telur rebus', 16, 148);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('D. LANGKAH KERJA PRAKTIKUM', 14, 158);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Haluskan masing-masing sampel makanan secara terpisah menggunakan lumpang porselen.', 16, 164);
  doc.text('2. Tambahkan 2 tetes akuades steril agar bahan makanan membentuk larutan suspensi kental.', 16, 169);
  doc.text('3. Letakkan 1 sendok kecil sampel ke lekukan plat tetes A, B, C, dan D yang telah diberi label.', 16, 174);
  doc.text('4. Teteskan 3-4 tetes reagen lugol secara merata ke permukaan masing-masing sampel bahan.', 16, 179);
  doc.text('5. Amati perubahan warna selama 60 detik dan dokumentasikan perubahan warna dengan foto.', 16, 184);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('E. TABEL HASIL PENGAMATAN UJI LUGOL', 14, 194);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 198, 182, 7, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(14, 198, 182, 35);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('No', 18, 203);
  doc.text('Bahan Makanan', 30, 203);
  doc.text('Warna Asal', 75, 203);
  doc.text('Warna Setelah Lugol', 120, 203);
  doc.text('Kandungan Amilum', 165, 203);

  doc.setFont('helvetica', 'normal');
  doc.text('1.', 18, 210);
  doc.text('Nasi Putih Kantin', 30, 210);
  doc.text('Putih bersih', 75, 210);
  doc.text('Biru kehitaman pekat', 120, 210);
  doc.text('Positif (+) Tinggi', 165, 210);

  doc.text('2.', 18, 217);
  doc.text('Tahu Putih Kukus', 30, 217);
  doc.text('Putih pucat', 75, 217);
  doc.text('Cokelat kekuningan', 120, 217);
  doc.text('Negatif (-) Protein', 165, 217);

  doc.text('3.', 18, 224);
  doc.text('Biskuit Gandum', 30, 224);
  doc.text('Cokelat muda', 75, 224);
  doc.text('Biru kehitaman sedang', 120, 224);
  doc.text('Positif (+) Sedang', 165, 224);

  doc.text('4.', 18, 230);
  doc.text('Putih Telur Rebus', 30, 230);
  doc.text('Putih susu', 75, 230);
  doc.text('Kuning kecokelatan', 120, 230);
  doc.text('Negatif (-) Protein', 165, 230);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('F. KESIMPULAN & TANDA TANGAN VALIDASI', 14, 242);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Berdasarkan hasil uji lugol, bahan yang mengandung amilum adalah nasi putih dan biskuit gandum.', 14, 248);
  doc.text('Tahu dan putih telur tidak mengandung amilum melainkan sumber protein. Gizi seimbang wajib dipenuhi.', 14, 253);

  doc.text('Praktikan Siswa,', 30, 264);
  doc.setFont('helvetica', 'bold');
  doc.text('Raditya Pratama (NISN 0098234120)', 14, 276);

  doc.setFont('helvetica', 'normal');
  doc.text('Guru Pembimbing IPA,', 135, 264);
  doc.setFont('helvetica', 'bold');
  doc.text('Dra. Hj. Sri Wahyuni, M.Pd (NIP 19780512)', 118, 276);

  addFooter(doc, 1, 1);

  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, 'Panduan_Praktikum_Uji_Nutrisi_8A.pdf'), buffer);
  fs.writeFileSync(path.join(outputDir, 'Lembar_Kerja_Tugas.pdf'), buffer);
}

// 2. MTK: Lembar Kerja Pythagoras
export function createPythagoras() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, 'Matematika Terapan', 'Lembar Kerja: Teorema Pythagoras & Masalah Nyata', 'SMP-PGRI/LKS-MTK/05');

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 49, 182, 16, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 49, 182, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Nama Siswa  : Raditya Pratama', 18, 55);
  doc.text('Kelas / Absen: 8A / 24', 18, 61);
  doc.text('Guru Pengampu: Bambang Sudirman, S.Pd', 110, 55);
  doc.text('Bobot Nilai : 20% Nilai Rapor', 110, 61);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('A. RANGKUMAN RUMUS DASAR', 14, 73);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Pada segitiga siku-siku dengan panjang sisi tegak a dan b, serta sisi miring (hipotenusa) c:', 14, 79);
  doc.setFont('helvetica', 'bold');
  doc.text('c² = a² + b²    atau    c = √(a² + b²)    |    a = √(c² - b²)    |    b = √(c² - a²)', 30, 86);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('B. BUTIR SOAL STUDI KASUS (KERJAKAN DENGAN LANGKAH LENGKAP)', 14, 98);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Soal 1: Identifikasi Kelompok Tripel Pythagoras', 14, 106);
  doc.setFont('helvetica', 'normal');
  doc.text('Ujilah apakah kelompok tiga bilangan berikut merupakan Tripel Pythagoras sejati:', 14, 111);
  doc.text('a) 6, 8, 10  ->  6² + 8² = 36 + 64 = 100 = 10²  (MEMENUHI)', 20, 116);
  doc.text('b) 7, 24, 25 ->  7² + 24² = 49 + 576 = 625 = 25²  (MEMENUHI)', 20, 121);
  doc.text('c) 9, 12, 16 ->  9² + 12² = 81 + 144 = 225 ≠ 256  (TIDAK MEMENUHI)', 20, 126);

  doc.setFont('helvetica', 'bold');
  doc.text('Soal 2: Kasus Tangga Bersandar pada Dinding Gedung PGRI', 14, 136);
  doc.setFont('helvetica', 'normal');
  doc.text('Sebuah tangga dengan panjang 5 meter bersandar pada dinding laboratorium. Jarak ujung bawah', 14, 141);
  doc.text('tangga ke dinding adalah 3 meter. Hitung tinggi dinding yang dicapai oleh tangga tersebut!', 14, 146);
  doc.text('Penyelesaian:  t = √(5² - 3²) = √(25 - 9) = √16 = 4 meter.', 20, 152);

  doc.setFont('helvetica', 'bold');
  doc.text('Soal 3: Kasus Tiang Pemancar Radio & Kawat Penyangga', 14, 162);
  doc.setFont('helvetica', 'normal');
  doc.text('Sebuah tiang pemancar setinggi 24 meter diikat kawat baja ke tanah dengan jarak patok 7 meter', 14, 167);
  doc.text('dari pangkal tiang. Berapakah panjang minimal kawat baja yang diperlukan?', 14, 172);
  doc.text('Penyelesaian:  k = √(24² + 7²) = √(576 + 49) = √625 = 25 meter.', 20, 178);

  doc.setFont('helvetica', 'bold');
  doc.text('Soal 4: Kasus Navigasi Kapal Patroli Pantai', 14, 188);
  doc.setFont('helvetica', 'normal');
  doc.text('Kapal berlayar ke arah utara sejauh 12 mil laut, kemudian berbelok ke arah timur sejauh 16 mil laut.', 14, 193);
  doc.text('Hitung jarak terpendek kapal dari pelabuhan awal!', 14, 198);
  doc.text('Penyelesaian:  s = √(12² + 16²) = √(144 + 256) = √400 = 20 mil laut.', 20, 204);

  doc.setFont('helvetica', 'bold');
  doc.text('Soal 5: Lapangan Upacara SMP PGRI (Panjang 40 m dan Lebar 30 m)', 14, 214);
  doc.setFont('helvetica', 'normal');
  doc.text('Seorang siswa berlari menyeberang secara diagonal dari sudut ke sudut. Tentukan jarak tempuh!', 14, 219);
  doc.text('Penyelesaian:  d = √(40² + 30²) = √(1600 + 900) = √2500 = 50 meter.', 20, 225);

  doc.text('Tanda Tangan Siswa,', 30, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Raditya Pratama (8A)', 22, 268);

  doc.setFont('helvetica', 'normal');
  doc.text('Guru Pengampu Matematika,', 130, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Bambang Sudirman, S.Pd', 125, 268);

  addFooter(doc, 1, 1);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, 'Lembar_Kerja_Pythagoras_No1-5.pdf'), buffer);
}

// 3. Bahasa Indonesia: Rubrik Penilaian Teks LHO
export function createRubrikLHO() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, 'Bahasa Indonesia', 'Pedoman & Rubrik Teks Laporan Hasil Observasi', 'SMP-PGRI/RUB-IND/03');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('A. STRUKTUR TEKS LAPORAN HASIL OBSERVASI (LHO)', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Pernyataan Umum (Klasifikasi): Berisi pengenalan dan klasifikasi ilmiah objek yang diobservasi.', 16, 62);
  doc.text('2. Deskripsi Bagian: Memerinci ciri fisik, morfologi, habitat, dan komponen objek secara objektif.', 16, 68);
  doc.text('3. Deskripsi Manfaat: Menjelaskan kegunaan dan fungsi ekologis atau praktis objek bagi kehidupan.', 16, 74);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('B. TABEL RUBRIK PENILAIAN LHO (SKOR MAKSIMAL: 100)', 14, 86);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 91, 182, 7, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(14, 91, 182, 45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('No', 18, 96);
  doc.text('Kriteria Penilaian', 30, 96);
  doc.text('Bobot', 100, 96);
  doc.text('Skor Maks', 125, 96);
  doc.text('Indikator Capaian', 150, 96);

  doc.setFont('helvetica', 'normal');
  doc.text('1.', 18, 105);
  doc.text('Keaslian Objek Lingkungan PGRI', 30, 105);
  doc.text('25%', 100, 105);
  doc.text('25 Poin', 125, 105);
  doc.text('Observasi Taman Toga & Laboratorium', 150, 105);

  doc.text('2.', 18, 115);
  doc.text('Kelengkapan Struktur 3 Bagian', 30, 115);
  doc.text('30%', 100, 115);
  doc.text('30 Poin', 125, 115);
  doc.text('Pernyataan umum, bagian & manfaat', 150, 115);

  doc.text('3.', 18, 125);
  doc.text('Tata Kalimat & Kaidah KBBI', 30, 125);
  doc.text('25%', 100, 125);
  doc.text('25 Poin', 125, 125);
  doc.text('Penggunaan istilah teknis & ejaan baku', 150, 125);

  doc.text('4.', 18, 133);
  doc.text('Kerapian & Ketepatan Waktu', 30, 133);
  doc.text('20%', 100, 133);
  doc.text('20 Poin', 125, 133);
  doc.text('Dikumpulkan tepat sebelum deadline', 150, 133);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('C. CONTOH TEKS LHO SISWA (NILAI 92 - RADITYA PRATAMA)', 14, 146);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const teksLho = 'Taman Tanaman Obat Keluarga (TOGA) SMP PGRI 1 merupakan area konservasi tanaman herbal yang terletak di sebelah barat gedung perpustakaan. Taman ini memiliki luas sekitar 40 meter persegi dan difungsikan sebagai sarana laboratorium hidup bagi pembelajaran IPA serta penyedia obat herbal pertolongan pertama di sekolah.\n\nDi dalam taman ini terdapat puluhan jenis tanaman obat seperti jahe merah (Zingiber officinale), kunyit (Curcuma longa), dan lidah buaya (Aloe vera). Tanaman dirawat secara bergiliran oleh kader lingkungan OSIS menggunakan pupuk kompos organik yang diproduksi dari daun kering sekolah.\n\nKeberadaan taman TOGA memberikan manfaat edukatif dan kesehatan yang signifikan bagi warga sekolah. Siswa dapat mengenali morfologi tanaman obat asli Indonesia serta memanfaatkannya untuk meredakan radang tenggorokan dan batuk ringan.';
  doc.text(doc.splitTextToSize(teksLho, 182), 14, 153);

  doc.text('Guru Bahasa Indonesia,', 130, 245);
  doc.setFont('helvetica', 'bold');
  doc.text('Endang Kusuma, M.Hum', 125, 258);

  addFooter(doc, 1, 1);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, 'Rubrik_Penilaian_Teks_LHO.pdf'), buffer);
}

// 4. Informatika: Studi Kasus Perpus
export function createPerpusInformatika() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, 'Informatika & Literasi Digital', 'Studi Kasus: Algoritma & Flowchart Peminjaman Buku', 'SMP-PGRI/INF-08/04');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('A. DESKRIPSI SISTEM PERPUSTAKAAN SMP PGRI', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const desc = 'Perpustakaan Digital SMP PGRI 1 melayani peminjaman buku pelajaran dan fiksi untuk seluruh siswa. Setiap siswa dibatasi meminjam maksimal 3 buku dengan batas waktu 7 hari kalender. Jika pengembalian terlambat, sistem secara otomatis mengenakan denda Rp 1.000 per hari keterlambatan.';
  doc.text(doc.splitTextToSize(desc, 182), 14, 62);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('B. NOTASI ALGORITMA PSEUDOCODE', 14, 80);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text('1. INPUT: NISN_Siswa, Kode_Buku, Tanggal_Pinjam', 16, 88);
  doc.text('2. IF Jumlah_Buku_Dipinjam >= 3 THEN TAMPILKAN "Batas Maksimal"', 16, 94);
  doc.text('3. ELSE Lanjutkan Transaksi Peminjaman (Tanggal_Kembali = Pinjam + 7 Hari)', 16, 100);
  doc.text('4. IF Tanggal_Pengembalian > Tanggal_Kembali THEN', 16, 106);
  doc.text('     Hari_Telat = Tanggal_Pengembalian - Tanggal_Kembali', 16, 112);
  doc.text('     Denda = Hari_Telat * 1000', 16, 118);
  doc.text('5. TAMPILKAN Struk Peminjaman Berhasil', 16, 124);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('C. DIAGRAM ALIR LOGIKA SISTEM (FLOWCHART)', 14, 138);

  doc.setDrawColor(37, 99, 235);
  doc.setFillColor(239, 246, 255);
  
  doc.roundedRect(80, 145, 50, 10, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('MULAI (START)', 105, 151, { align: 'center' });

  doc.rect(75, 162, 60, 10, 'FD');
  doc.text('Input NISN & Kode Buku', 105, 168, { align: 'center' });

  doc.rect(70, 180, 70, 12, 'FD');
  doc.text('Buku Dipinjam < 3 & Bebas Denda?', 105, 187, { align: 'center' });

  doc.rect(40, 202, 55, 10, 'FD');
  doc.text('[YA] Cetak Tiket Pinjam', 67.5, 208, { align: 'center' });

  doc.rect(115, 202, 55, 10, 'FD');
  doc.text('[TIDAK] Tolak & Bayar Denda', 142.5, 208, { align: 'center' });

  doc.roundedRect(80, 222, 50, 10, 4, 4, 'FD');
  doc.text('SELESAI (END)', 105, 228, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Guru Pengampu Informatika,', 130, 252);
  doc.setFont('helvetica', 'bold');
  doc.text('Ahmad Faisal, S.Kom', 125, 265);

  addFooter(doc, 1, 1);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, 'Studi_Kasus_Perpus_SMP_PGRI.pdf'), buffer);
}

// 5. Bahasa Inggris: Rubrik Writing Task
export function createEnglishWriting() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, 'English Communication (Fase D)', 'Writing Task: Recount Text & Personal Experience', 'SMP-PGRI/ENG-08/02');

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 49, 182, 16, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 49, 182, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Student Name : Raditya Pratama', 18, 55);
  doc.text('Class / NISN : 8A / 0098234120', 18, 61);
  doc.text('English Teacher: Nurul Hidayati, S.Pd', 110, 55);
  doc.text('Target Score   : Minimum 75 (KKM)', 110, 61);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('A. LEARNING OBJECTIVES & PROMPT', 14, 73);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Write a short recount text (3 paragraphs, 120-150 words) about your first study tour with SMP PGRI.', 16, 79);
  doc.text('Use past tense (simple past), chronological connectors (first, then, after that, finally), and descriptive adjectives.', 16, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('B. GENERIC STRUCTURE OF RECOUNT TEXT', 14, 96);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Orientation: Introducing the participants, place, and time (Who, Where, When).', 16, 102);
  doc.text('2. Events: Chronological sequence of activities and what happened.', 16, 108);
  doc.text('3. Re-orientation: Personal comments and feelings about the whole trip.', 16, 114);

  doc.setFont('helvetica', 'bold');
  doc.text('C. SCORING RUBRIC (TOTAL: 100 POINTS)', 14, 126);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 131, 182, 7, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(14, 131, 182, 35);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Criteria', 18, 136);
  doc.text('Weight', 80, 136);
  doc.text('Max Score', 110, 136);
  doc.text('Description', 140, 136);

  doc.setFont('helvetica', 'normal');
  doc.text('Content & Generic Structure', 18, 144);
  doc.text('30%', 80, 144);
  doc.text('30 pts', 110, 144);
  doc.text('Complete 3 parts orientation, events, re-orient', 140, 144);

  doc.text('Grammar & Past Tense', 18, 151);
  doc.text('35%', 80, 151);
  doc.text('35 pts', 110, 151);
  doc.text('Correct irregular & regular verbs', 140, 151);

  doc.text('Vocabulary & Cohesion', 18, 158);
  doc.text('35%', 80, 158);
  doc.text('35 pts', 110, 158);
  doc.text('Rich vocabulary and smooth connectors', 140, 158);

  doc.setFont('helvetica', 'normal');
  doc.text('English Teacher,', 130, 245);
  doc.setFont('helvetica', 'bold');
  doc.text('Nurul Hidayati, S.Pd', 125, 258);

  addFooter(doc, 1, 1);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, 'Rubrik_Tugas_Writing_English.pdf'), buffer);
}

// 6. Generic Subject Module Generator
function generateSubjectModulePdf(
  fileName: string,
  subjectName: string,
  chapterTitle: string,
  docCode: string,
  teacherName: string,
  teacherNip: string,
  summaryText: string,
  keyPoints: string[],
  exampleProblem: { question: string; answer: string },
  independentTask: string
) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  addKopSurat(doc, subjectName, `Bahan Ajar & Modul Digital: ${chapterTitle}`, docCode);

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 48, 182, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 48, 182, 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Materi Pokok   : ${chapterTitle}`, 18, 53.5);
  doc.text(`Tingkat / Fase : Kelas VIII (Fase D SMP)`, 18, 59);
  doc.text(`Penyusun Modul : ${teacherName}`, 110, 53.5);
  doc.text(`NIP            : ${teacherNip}`, 110, 59);

  // Section A: Ringkasan Materi
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('A. RINGKASAN KONSEP & CAPAIAN PEMBELAJARAN', 14, 69);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.text(doc.splitTextToSize(summaryText, 182), 14, 75);

  // Section B: Poin-Poin Utama Pemahaman
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('B. POKOK-POKOK PEMBAHASAN MATERI', 14, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  let yPos = 111;
  keyPoints.forEach((point) => {
    const wrapped = doc.splitTextToSize(`•  ${point}`, 178);
    doc.text(wrapped, 16, yPos);
    yPos += wrapped.length * 4.8;
  });

  // Section C: Contoh Kasus & Pembahasan Konseptual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('C. CONTOH SOAL STUDI KASUS & PEMBAHASAN', 14, 158);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 163, 182, 45, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 163, 182, 45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('Pertanyaan / Studi Kasus:', 18, 169);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(doc.splitTextToSize(exampleProblem.question, 174), 18, 175);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Solusi & Langkah Penyelesaian:', 18, 189);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(exampleProblem.answer, 174), 18, 195);

  // Section D: Tugas Mandiri Siswa
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('D. LEMBAR REFLEKSI & TUGAS MANDIRI SISWA', 14, 218);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.text(doc.splitTextToSize(independentTask, 182), 14, 224);

  // Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Mengetahui, Guru Pengampu', 130, 248);
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, 125, 260);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${teacherNip}`, 125, 265);

  addFooter(doc, 1, 1);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(outputDir, fileName), buffer);
}

// Generate all 10 Subject Learning Modules
export function generateAllSubjectModules() {
  // 1. IPA
  generateSubjectModulePdf(
    'Modul_IPA_Sistem_Peredaran_Darah.pdf',
    'Ilmu Pengetahuan Alam (IPA)',
    'Sistem Transportasi & Peredaran Darah Manusia',
    'SMP-PGRI/MOD-IPA/03',
    'Dra. Hj. Sri Wahyuni, M.Pd',
    '19780512 200501 2 003',
    'Sistem peredaran darah manusia merupakan sistem sirkulasi tertutup ganda yang berfungsi mengedarkan oksigen, nutrisi, hormon, dan mengangkut sisa metabolisme. Organ vital terdiri dari jantung (4 ruang: atrium dekstra/sinistra, ventrikel dekstra/sinistra) serta pembuluh darah arteri, vena, dan kapiler.',
    [
      'Komponen darah terdiri atas plasma darah (55%) dan sel-sel darah (45%: eritrosit, leukosit, trombosit).',
      'Peredaran darah kecil: Jantung (Ventrikel Kanan) -> Arteri Pulmonalis -> Paru-paru -> Vena Pulmonalis -> Jantung (Atrium Kiri).',
      'Peredaran darah besar: Jantung (Ventrikel Kiri) -> Aorta -> Seluruh Tubuh -> Vena Cava -> Jantung (Atrium Kanan).',
      'Faktor gaya hidup sehat penting untuk mencegah hipertensi, arteriosklerosis, dan anemia.'
    ],
    {
      question: 'Jelaskan perbedaan struktur dinding dan arah aliran darah antara pembuluh Arteri dan Vena!',
      answer: 'Arteri memiliki dinding tebal, elastis, bertekanan tinggi dengan arah aliran meninggalkan jantung. Vena berdinding lebih tipis, kurang elastis, memiliki katup di sepanjang pembuluh, dengan arah aliran menuju jantung.'
    },
    'Lakukan pencatatan denyut nadi istirahat dan denyut nadi setelah berolahraga 5 menit. Buat grafik perbandingan dan simpulkan pengaruh aktivitas fisik terhadap ritme denyut jantung.'
  );

  // 2. Matematika
  generateSubjectModulePdf(
    'Modul_Matematika_Teorema_Pythagoras.pdf',
    'Matematika Terapan',
    'Teorema Pythagoras & Segitiga Istimewa',
    'SMP-PGRI/MOD-MTK/05',
    'Bambang Sudirman, S.Pd',
    '19810415 200801 1 012',
    'Teorema Pythagoras menyatakan bahwa pada setiap segitiga siku-siku, luas persegi pada sisi miring sama dengan jumlah luas persegi pada kedua sisi lainnya (c² = a² + b²). Teorema ini menjadi fondasi trigonometri, analisis vektor, dan geometri ruang.',
    [
      'Tripel Pythagoras dasar: (3, 4, 5), (5, 12, 13), (7, 24, 25), (8, 15, 17), dan kelipatannya.',
      'Segitiga siku-siku sama kaki (sudut 45°-45°-90°) memiliki perbandingan sisi 1 : 1 : √2.',
      'Segitiga siku-siku dengan sudut 30°-60°-90° memiliki perbandingan sisi 1 : √3 : 2.',
      'Penerapan langsung meliputi perhitungan kemiringan atap gedung sekolah, jarak pandang, dan navigasi radar.'
    ],
    {
      question: 'Sebuah tiang bendera SMP PGRI setinggi 12 meter ditopang kawat baja yang ditancapkan ke tanah sejauh 5 meter dari dasar tiang. Berapakah panjang kawat baja penopang tersebut?',
      answer: 'Gunakan rumus hipotenusa: c = √(12² + 5²) = √(144 + 25) = √169 = 13 meter. Jadi panjang kawat baja adalah 13 meter.'
    },
    'Carilah 2 objek nyata di sekitar rumah Anda yang membentuk sudut siku-siku. Ukur kedua sisi tegak dan hitung panjang hipotenusanya menggunakan Teorema Pythagoras!'
  );

  // 3. Bahasa Indonesia
  generateSubjectModulePdf(
    'Modul_Bahasa_Indonesia_Teks_LHO.pdf',
    'Bahasa Indonesia',
    'Menyusun Teks Laporan Hasil Observasi (LHO)',
    'SMP-PGRI/MOD-IND/02',
    'Endang Kusuma, M.Hum',
    '19850920 201001 2 009',
    'Teks Laporan Hasil Observasi (LHO) adalah teks yang memuat klasifikasi dan deskripsi faktual mengenai suatu objek berdasarkan pengamatan langsung yang objektif, sistematis, dan dapat dibuktikan kebenarannya secara ilmiah.',
    [
      'Struktur teks: 1) Pernyataan Umum / Klasifikasi, 2) Deskripsi Bagian, 3) Deskripsi Manfaat / Simpulan.',
      'Ciri kebahasaan: Menggunakan kalimat definisi (adalah, merupakan), istilah teknis keilmuan, dan verba aktif.',
      'Objektivitas: Tidak mengandung prasangka, opini subjektif, atau keberpihakan yang tidak berdasar.',
      'Teknik wawancara dan pencatatan lapangan menjadi instrumen esensial pengumpulan data observasi.'
    ],
    {
      question: 'Sebutkan perbedaan mendasar antara teks deskripsi umum dengan teks laporan hasil observasi!',
      answer: 'Teks deskripsi menggambarkan objek secara spesifik dan subjektif sesuai sudut pandang penulis, sedangkan teks LHO menggambarkan objek secara umum, ilmiah, dan objektif berbasis fakta.'
    },
    'Lakukan observasi 15 menit terhadap salah satu fasilitas sekolah (Perpustakaan atau Laboratorium Komputer). Tuliskan paragraf pernyataan umum dan deskripsi bagian sesuai kaidah teks LHO.'
  );

  // 4. Bahasa Inggris
  generateSubjectModulePdf(
    'Modul_Bahasa_Inggris_Recount_Text.pdf',
    'Bahasa Inggris (English)',
    'Recount Texts & Personal Experiences',
    'SMP-PGRI/MOD-ENG/04',
    'Nurul Hidayati, S.Pd',
    '19890218 201402 2 004',
    'A recount text is a text that retells events or experiences in the past. Its social function is either to inform or to entertain the audience. It strictly utilizes simple past tense and action verbs to denote completed occurrences.',
    [
      'Generic Structure: Orientation (Background who, where, when) -> Series of Events -> Re-orientation (Ending summary).',
      'Language Features: Using Simple Past Tense (V2 / was / were) and past time signals (yesterday, last week).',
      'Conjunctions of sequence: First, next, after that, then, eventually, finally.',
      'Action verbs examples: went, played, visited, studied, observed, discovered.'
    ],
    {
      question: 'Change this sentence into correct Past Simple: "Raditya and his friends (visit) the science museum and (see) ancient fossils."',
      answer: 'Correct sentence: "Raditya and his friends visited the science museum and saw ancient fossils."'
    },
    'Write a 5-sentence paragraph narrating your favorite holiday or extracurricular activity using regular and irregular past verbs correctly.'
  );

  // 5. Informatika
  generateSubjectModulePdf(
    'Modul_Informatika_Algoritma_Searching.pdf',
    'Informatika & Literasi Digital',
    'Berpikir Komputasional: Algoritma Pencarian & Flowchart',
    'SMP-PGRI/MOD-INF/04',
    'Ahmad Faisal, S.Kom',
    '19920611 201801 1 007',
    'Berpikir komputasional (Computational Thinking) mencakup dekomposisi masalah, pengenalan pola, abstraksi, dan perancangan algoritma. Pada modul ini dibahas efisiensi algoritma pencarian linear search vs binary search.',
    [
      'Linear Search: Memeriksa elemen array satu per satu dari indeks awal hingga akhir (Kompleksitas O(n)).',
      'Binary Search: Memeriksa data yang telah terurut dengan membagi rentang pencarian menjadi dua (Kompleksitas O(log n)).',
      'Simbol standar flowchart: Oval (Terminator), Jajaran Genjang (Input/Output), Persegi (Proses), Belah Ketupat (Keputusan).',
      'Etika digital: Keamanan data privasi dan perlindungan akun e-learning sekolah.'
    ],
    {
      question: 'Mengapa algoritma Binary Search memerlukan data yang sudah dalam keadaan terurut (sorted)?',
      answer: 'Karena prinsip binary search membandingkan nilai tengah dengan elemen target untuk mengeliminasi separuh sisa data. Jika data acak, eliminasi tidak valid.'
    },
    'Buatlah flowchart sederhana di buku catatan mengenai prosedur masuk ke laboratorium komputer SMP PGRI (memeriksa kartu pelajar -> melepas sepatu -> registrasi absensi digital).'
  );

  // 6. IPS
  generateSubjectModulePdf(
    'Modul_IPS_Dinamika_Kependudukan_ASEAN.pdf',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Interaksi Antarnegara ASEAN & Dinamika Kependudukan',
    'SMP-PGRI/MOD-IPS/02',
    'Dra. Siti Rahmah',
    '19750312 200212 2 001',
    'Kawasan Asia Tenggara (ASEAN) memiliki keragaman geografis, sosial, budaya, dan potensi ekonomi strategis. Dinamika kependudukan mencakup persebaran penduduk, piramida usia, bonus demografi, serta migrasi tenaga kerja.',
    [
      'Pilar kerja sama ASEAN: Komunitas Keamanan, Komunitas Ekonomi (MEA), dan Komunitas Sosial Budaya.',
      'Faktor pendorong interaksi: Kesamaan dan perbedaan sumber daya alam serta kondisi geografis maritim.',
      'Tantangan kependudukan: Urbanisasi pesat, kualitas pendidikan vokasi, dan pemerataan kesejahteraan.',
      'Peran Indonesia sebagai inisiator perdamaian dan perekonomian terbesar di Asia Tenggara.'
    ],
    {
      question: 'Sebutkan 3 dampak positif dibentuknya Masyarakat Ekonomi ASEAN (MEA) bagi tenaga kerja Indonesia!',
      answer: '1) Membuka pasar kerja lebih luas di kawasan regional, 2) Mendorong peningkatan standar sertifikasi keahlian profesional, 3) Meningkatkan arus investasi dan transfer teknologi.'
    },
    'Tuliskan telaah ringkas mengenai komoditas ekspor unggulan Indonesia ke sesama negara anggota ASEAN.'
  );

  // 7. PAI
  generateSubjectModulePdf(
    'Modul_PAI_Adab_Menuntut_Ilmu.pdf',
    'Pendidikan Agama & Budi Pekerti',
    'Meneladani Adab Menuntut Ilmu & Menjaga Kejujuran',
    'SMP-PGRI/MOD-PAI/03',
    'Ust. Ridwan Kamil, S.Ag',
    '19830805 200901 1 005',
    'Menuntut ilmu merupakan kewajiban bagi setiap muslim sepanjang hayat. Nilai-nilai budi pekerti luhur meliputi kejujuran akademik (anti-mencontek), menghormati guru, berbakti kepada orang tua, dan mengamalkan ilmu untuk kemaslahatan.',
    [
      'Makna firman Allah SWT dalam QS. Al-Mujadilah ayat 11 tentang derajat orang yang berilmu.',
      'Sifat Siddiq (jujur) dan Amanah (dapat dipercaya) sebagai pondasi integritas pelajar berkarakter.',
      'Adab berdiskusi ilmiah: Mengedepankan sopan santun, tidak memotong pembicaraan, dan menghargai argumen.',
      'Penerapan toleransi antarumat beragama dalam bingkai kebinekaan sekolah PGRI.'
    ],
    {
      question: 'Bagaimana keterkaitan antara sifat amanah dengan kejujuran siswa saat mengerjakan ujian CBT online?',
      answer: 'Sifat amanah menuntut siswa menjaga kepercayaan dengan tidak berbuat curang saat ujian daring meskipun tidak diawasi fisik, karena meyakini pengawasan Allah SWT Maha Melihat.'
    },
    'Tuliskan satu contoh konkret penerapan sikap adab kepada bapak/ibu guru saat berlangsungnya pembelajaran daring maupun tatap muka.'
  );

  // 8. PPKn
  generateSubjectModulePdf(
    'Modul_PPKn_Kedaulatan_Rakyat_UUD1945.pdf',
    'Pendidikan Pancasila & PPKn',
    'Hakikat Kedaulatan & Sistem Demokrasi Pancasila',
    'SMP-PGRI/MOD-PPK/02',
    'Suryadi, S.Pd, M.H.',
    '19801122 200604 1 008',
    'Kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar (Pasal 1 Ayat 2 UUD NRI 1945). Demokrasi Pancasila menjunjung musyawarah untuk mufakat yang berlandaskan sila keempat Pancasila.',
    [
      'Bentuk kedaulatan: Kedaulatan ke dalam (mengatur urusan negara) dan kedaulatan ke luar (hubungan internasional).',
      'Prinsip checks and balances antara lembaga legislatif (DPR/DPD/MPR), eksekutif (Presiden), dan yudikatif (MA/MK/KY).',
      'Praktik demokrasi di sekolah: Pemilihan ketua OSIS secara langsung, umum, bebas, rahasia, jujur, dan adil.',
      'Kewajiban bela negara dan mematuhi tata tertib sekolah sebagai wujud warga negara yang bertanggung jawab.'
    ],
    {
      question: 'Jelaskan mengapa musyawarah mufakat lebih diutamakan dibandingkan pemungutan suara terbanyak (voting)!',
      answer: 'Musyawarah mufakat mengedepankan kebijaksanaan, kerukunan, dan menghargai semua aspirasi demi kesepakatan bersama yang adil tanpa ada pihak yang merasa dikalahkan.'
    },
    'Analisislah pelaksanaan pemilihan pengurus kelas 8A apakah sudah mencerminkan nilai musyawarah untuk mufakat.'
  );

  // 9. PJOK
  generateSubjectModulePdf(
    'Modul_PJOK_Kebugaran_Jasmani.pdf',
    'Pendidikan Jasmani & Olahraga (PJOK)',
    'Komponen Kebugaran Jasmani & Pola Hidup Sehat',
    'SMP-PGRI/MOD-PJK/02',
    'Hendra Gunawan, S.Pd',
    '19870420 201201 1 003',
    'Kebugaran jasmani adalah kesanggupan tubuh untuk melakukan aktivitas sehari-hari tanpa menimbulkan kelelahan berarti. Terdiri atas daya tahan jantung paru (kardiovaskular), kekuatan otot, kelenturan, dan komposisi tubuh seimbang.',
    [
      'Latihan daya tahan aerobik: Lari interval, jogging 20 menit, dan skipping.',
      'Latihan kekuatan: Push-up (otot dada & trisep), sit-up (otot perut), squat (otot tungkai).',
      'Pentingnya pemanasan (warming-up) dinamis untuk mencegah cedera sendi dan pendinginan (cooling-down).',
      'Pola gizi seimbang: Pedoman Isi Piringku Kementerian Kesehatan RI.'
    ],
    {
      question: 'Apa fungsi utama fase pendinginan (cooling down) setelah melakukan olahraga intensitas tinggi?',
      answer: 'Menurunkan denyut jantung dan suhu tubuh secara bertahap, serta mempercepat penguraian asam laktat agar terhindar dari kram dan nyeri otot pasca-latihan.'
    },
    'Lakukan tes sederhana menghitung repetisi push-up dan sit-up selama 30 detik. Catat hasilnya pada jurnal kebugaran mandiri.'
  );

  // 10. Seni Budaya
  generateSubjectModulePdf(
    'Modul_Seni_Budaya_Ragam_Hias.pdf',
    'Seni Budaya & Keterampilan',
    'Ragam Hias Nusantara & Ekspresi Seni Rupa',
    'SMP-PGRI/MOD-SNB/02',
    'Dewi Sartika, S.Sn',
    '19910515 201601 2 006',
    'Ragam hias (ornamen) Nusantara merupakan warisan visual budaya yang diilhami dari flora, fauna, figuratif, dan geometris. Karya seni mencerminkan identitas kearifan lokal bangsa Indonesia.',
    [
      'Motif flora (vegetal) terinspirasi dedaunan dan bunga teratai khas ukiran Jepara dan Bali.',
      'Motif fauna terinspirasi burung cendrawasih (Papua), gajah (Lampung), dan naga.',
      'Motif geometris mencakup pola pilin berganda, tumpal, kawung, dan meander.',
      'Teknik pewarnaan: Gradasi akrilik, batik cap/tulis, dan penerapan pada media kayu atau tekstil.'
    ],
    {
      question: 'Sebutkan makna filosofis di balik motif batik Kawung khas Nusantara!',
      answer: 'Batik Kawung melambangkan kesucian hati, keadilan, dan pengendalian diri, serta kesadaran akan empat penjuru mata angin yang berpusat pada Sang Pencipta.'
    },
    'Gambarlah sebuah sketsa ragam hias stilasi flora berukuran 10x10 cm di buku gambar dengan pola pengulangan simetris.'
  );
}

// Run all creations
createUjiNutrisi();
createPythagoras();
createRubrikLHO();
createPerpusInformatika();
createEnglishWriting();
generateAllSubjectModules();
console.log('All 15 comprehensive educational PDFs (Assignments + 10 Subject Modules) generated successfully!');
