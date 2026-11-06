# 🎓 RuangBelajar SMP PGRI 1 - Sistem E-Learning & Akademik Terpadu

Platform pembelajaran digital dan pemantauan akademik real-time untuk siswa, guru, dan wali kelas berbasis web dengan standar **Kurikulum Merdeka**.

---

## 🚀 Fitur Unggulan

- **Role-Based Experience**: Akses khusus untuk Siswa (Raditya Pratama), Guru (Dra. Hj. Sri Wahyuni), dan Wali Kelas / Kepala Sekolah.
- **Dashboard Akademik Real-Time**: Pantau nilai harian, tugas mandiri, ulangan harian, UTS, UAS, dan perbandingan otomatis dengan standar KKM (75.0).
- **Computer-Based Test (CBT)**: Kuis digital interaktif dengan timer mundur, navigasi soal, auto-scoring real-time, dan pembahasan kunci jawaban.
- **Pusat Notifikasi Otomatis**: Alert tenggat tugas, publikasi nilai baru, notifikasi presensi, dan siaran pengumuman sekolah.
- **Buku Rapor Digital**: Ringkasan capaian kompetensi dan fungsi cetak resmi Laporan Hasil Belajar Siswa.
- **Presensi & Absensi Digital**: Rekap kehadiran terpadu (Hadir, Sakit, Izin, Alpa) dan penghitungan persentase kedisiplinan.
- **Jadwal Pelajaran & Modul**: Akses silabus 10 mata pelajaran SMP Fase D beserta modul unduhan PDF.

---

## 🛠️ Menjalankan Proyek Secara Lokal

1. **Clone repository ini**:
   ```bash
   git clone <URL_REPO_GITHUB_ANDA>
   cd smp-pgri-elearning
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

4. **Uji build produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Panduan Deploy ke GitHub & Vercel

### Langkah 1: Push ke GitHub
1. Buat repository baru di [GitHub](https://github.com/new) dengan nama misalnya: `smp-pgri-elearning`.
2. Hubungkan repositori lokal dan push:
   ```bash
   git remote add origin https://github.com/<USERNAME-GITHUB-ANDA>/smp-pgri-elearning.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 2: Deploy ke Vercel (Gratis & Otomatis)
1. Buka dashboard [Vercel](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository `smp-pgri-elearning` yang baru Anda push.
4. Vercel akan otomatis mendeteksi pengaturan berikut (file `vercel.json` sudah disediakan):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Klik **"Deploy"**.
6. Dalam waktu ~30 detik, aplikasi E-Learning SMP PGRI Anda akan langsung aktif dengan domain `.vercel.app`!
