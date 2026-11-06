import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  FileText,
  FileCode,
  UploadCloud,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SCHOOL_PROFILE } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export interface PdfDocumentData {
  assignmentId?: string;
  fileName: string;
  title: string;
  subjectName: string;
  targetClass?: string;
  dueDate?: string;
  defaultTemplateName?: string;
}

interface PdfDocumentViewerProps {
  document: PdfDocumentData;
  onBack: () => void;
}

export function openPdfInNewTab(pdfUrl: string, fileName: string) {
  const newWin = window.open('', '_blank');
  if (!newWin) {
    const tempA = window.document.createElement('a');
    tempA.href = pdfUrl;
    tempA.target = '_blank';
    tempA.download = fileName;
    window.document.body.appendChild(tempA);
    tempA.click();
    window.document.body.removeChild(tempA);
    return;
  }

  newWin.document.title = fileName;
  newWin.document.body.style.margin = '0';
  newWin.document.body.style.padding = '0';
  newWin.document.body.style.height = '100vh';
  newWin.document.body.style.backgroundColor = '#0f172a';
  newWin.document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  newWin.document.body.innerHTML = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${fileName}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #0f172a; }
        .pdf-topbar {
          height: 48px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          color: white;
        }
        .pdf-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pdf-badge {
          background: #2563eb;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .pdf-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pdf-btn {
          background: #2563eb;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }
        .pdf-btn:hover { background: #1d4ed8; }
        .pdf-frame {
          width: 100%;
          height: calc(100vh - 48px);
          border: none;
          background: #334155;
        }
      </style>
    </head>
    <body>
      <div class="pdf-topbar">
        <div class="pdf-info">
          <span class="pdf-badge">DOKUMEN RESMI PDF</span>
          <span>${fileName} · SMP PGRI 1</span>
        </div>
        <div class="pdf-actions">
          <a class="pdf-btn" href="${pdfUrl}" download="${fileName}">Unduh Berkas PDF</a>
        </div>
      </div>
      <iframe class="pdf-frame" src="${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1"></iframe>
    </body>
    </html>
  `;
}

export function resolvePdfUrl(fileName: string): string {
  const name = (fileName || '').toLowerCase();
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
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  document,
  onBack,
}) => {
  const { customPdfs, uploadCustomPdf, resetCustomPdf, getAssignmentPdfUrl } = useApp();
  const [viewMode, setViewMode] = useState<'real_pdf' | 'lks_sheet'>('real_pdf');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customRecord = document.assignmentId ? customPdfs[document.assignmentId] : null;
  const isCustomPdf = !!customRecord;
  const currentFileName = customRecord?.fileName || document.fileName;
  const pdfUrl = getAssignmentPdfUrl(document.assignmentId, currentFileName);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Harap pilih berkas berformat .PDF');
      return;
    }

    try {
      setIsUploading(true);
      const targetId = document.assignmentId || `asg_custom_${Date.now()}`;
      await uploadCustomPdf(targetId, file);
    } catch (err) {
      console.error('Failed to upload custom PDF:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDefault = () => {
    if (!document.assignmentId) return;
    const defaultName = document.defaultTemplateName || 'Panduan_Tugas.pdf';
    resetCustomPdf(document.assignmentId, defaultName);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Hidden file input for uploading custom PDF */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Controls Bar */}
      <div className="sticky top-16 z-20 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back button & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Tugas</span>
          </button>

          <div className="border-l border-slate-200 dark:border-slate-700 pl-3 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate font-mono max-w-[220px] sm:max-w-[340px]">
                {currentFileName}
              </span>
              {isCustomPdf ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PDF MANDIRI ANDA ({customRecord?.sizeKb} KB)
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white font-mono shrink-0">
                  DOKUMEN ASLI .PDF
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {document.subjectName} · {document.title}
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Real PDF vs Sheet View) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('real_pdf')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'real_pdf'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dokumen Asli PDF</span>
          </button>
          <button
            onClick={() => setViewMode('lks_sheet')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'lks_sheet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Lembar LKS Resmi</span>
          </button>
        </div>

        {/* Right: Actions (Upload/Change PDF, Open in tab, Download) */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Upload / Change PDF Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            title="Unggah berkas PDF baru dari perangkat Anda untuk menggantikan PDF ini"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Mengunggah...' : 'Unggah / Ganti PDF'}</span>
          </button>

          {/* Reset button if custom PDF */}
          {isCustomPdf && (
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Kembalikan ke dokumen PDF bawaan kurikulum SMP PGRI"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Bawaan</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openPdfInNewTab(pdfUrl, currentFileName)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            title="Buka dokumen PDF di tab browser baru dengan judul dokumen resmi"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tab Baru</span>
          </button>

          <a
            href={pdfUrl}
            download={currentFileName}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            title="Unduh berkas PDF ke perangkat Anda"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh</span>
          </a>
        </div>
      </div>

      {/* Info notice about custom PDF editing */}
      <div className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            {isCustomPdf ? (
              <>
                Dokumen ini merupakan <strong>PDF mandiri yang Anda unggah</strong> ({customRecord?.uploadedAt}). Anda dapat menggantinya lagi kapan saja dengan tombol <em>Unggah / Ganti PDF</em>.
              </>
            ) : (
              <>
                Dokumen PDF kurikulum SMP PGRI resmi telah terisi materi praktikum & soal lengkap. Anda juga dapat <strong>mengganti dengan PDF buatan Anda sendiri</strong> lewat tombol <em>Unggah / Ganti PDF</em> di atas.
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main PDF Viewer Display Area */}
      {viewMode === 'real_pdf' ? (
        /* Real Embedded Native PDF View */
        <div className="w-full bg-slate-900/5 dark:bg-slate-950 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium truncate">
                Menampilkan Berkas: <strong>{currentFileName}</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono opacity-80 shrink-0">
              Format: Portable Document Format (.PDF)
            </span>
          </div>

          <div className="w-full h-[84vh] min-h-[720px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              type="application/pdf"
              className="w-full h-full"
            >
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                title={document.title}
                className="w-full h-full border-0"
              >
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Dokumen PDF: {currentFileName}
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Klik tombol di bawah untuk membuka dan membaca berkas PDF di peramban Anda:
                  </p>
                  <button
                    type="button"
                    onClick={() => openPdfInNewTab(pdfUrl, currentFileName)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Dokumen PDF Sekarang</span>
                  </button>
                </div>
              </iframe>
            </object>
          </div>
        </div>
      ) : (
        /* Alternative Formatted Curriculum Sheet View */
        <div className="bg-slate-200/80 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 flex flex-col items-center overflow-x-auto min-h-[800px]">
          <div className="w-full max-w-[850px] bg-white text-slate-900 rounded shadow-2xl border border-slate-300 p-8 sm:p-14 space-y-6">
            {/* Kop Surat SMP PGRI 1 */}
            <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-between gap-4">
                <img
                  src={SCHOOL_PROFILE.badgeUrl}
                  alt="Logo SMP PGRI"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div className="flex-1 space-y-0.5 text-center">
                  <div className="text-[11px] font-bold tracking-wider uppercase text-slate-600">
                    YAYASAN PEMBINA LEMBAGA PENDIDIKAN DASAR DAN MENENGAH (YPLP PGRI)
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-slate-950">
                    {SCHOOL_PROFILE.name}
                  </h1>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {SCHOOL_PROFILE.address} · NPSN: {SCHOOL_PROFILE.npsn} · Akreditasi A
                  </div>
                  <div className="text-[10px] text-blue-800 font-semibold">
                    Portal E-Learning Resmi: https://smp-pgri.sch.id · Email: info@smp-pgri.sch.id
                  </div>
                </div>
              </div>
            </div>

            {/* Title Banner */}
            <div className="text-center space-y-1 py-1 bg-slate-50 border border-slate-200 rounded p-3">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">
                LEMBAR KERJA SISWA (LKS) · KURIKULUM MERDEKA FASE D
              </div>
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                {document.title}
              </h2>
              <div className="text-xs font-mono text-slate-500">
                Berkas: <strong className="text-slate-800">{currentFileName}</strong> · Mata Pelajaran: {document.subjectName}
              </div>
            </div>

            {/* Instruction content */}
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div>
                <h3 className="font-bold uppercase text-slate-950 border-b border-slate-300 pb-1 mb-2">
                  1. PETUNJUK PENGERJAAN
                </h3>
                <p>
                  Selesaikan lembar kerja tugas ini secara teliti dan mandiri. Setelah dikerjakan, pastikan dokumen disimpan dalam format PDF dan diunggah kembali ke menu pengumpulan tugas sebelum batas akhir tenggat.
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-slate-950 border-b border-slate-300 pb-1 mb-2">
                  2. KRITERIA PENILAIAN GURU
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Ketepatan data dan sistematika penyelesaian (Bobot: 40%)</li>
                  <li>Analisis konsep dan kedalaman kesimpulan (Bobot: 40%)</li>
                  <li>Kerapian penyusunan dan ketepatan waktu pengumpulan (Bobot: 20%)</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>SMP PGRI 1 KOTA HARAPAN · TAHUN AJARAN 2026/2027</span>
              <span>Dokumen Resmi Kurikulum Merdeka</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
