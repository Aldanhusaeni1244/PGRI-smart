import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, MaterialItem } from '../../types';
import {
  BookOpen,
  Atom,
  Calculator,
  Languages,
  Cpu,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Activity,
  Palette,
  FileText,
  Download,
  Calendar,
  MapPin,
  User,
  ExternalLink,
  ChevronRight,
  X,
  Eye,
  Sparkles
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

export const SubjectList: React.FC = () => {
  const { subjects, materials } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(subjects[0]);
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [activePdfDoc, setActivePdfDoc] = useState<PdfDocumentData | null>(null);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-600" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-indigo-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-violet-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-teal-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-orange-600" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-fuchsia-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-600" />;
    }
  };

  const currentMaterials = materials.filter(
    (m) => !selectedSubject || m.subjectId === selectedSubject.id
  );

  if (activePdfDoc) {
    return (
      <PdfDocumentViewer
        document={activePdfDoc}
        onBack={() => setActivePdfDoc(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Kurikulum Merdeka Belajar Fase D</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Mata Pelajaran & Modul Belajar Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Akses seluruh 10 mata pelajaran terpadu SMP PGRI 1 lengkap dengan berkas PDF modul ajar resmi setiap topik.
          </p>
        </div>
      </div>

      {/* Grid: Left Column Subjects (1 col), Right Column Selected Subject Syllabus & Materials (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Subject Cards List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Daftar 10 Mata Pelajaran (Kelas 8A)
          </h2>
          <div className="space-y-2">
            {subjects.map((sub) => {
              const isSelected = selectedSubject?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getSubjectIcon(sub.iconName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sub.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {sub.teacherName}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed View of Selected Subject */}
        {selectedSubject && (
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Overview Banner */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60">
                    {getSubjectIcon(selectedSubject.iconName)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                      KODE: {selectedSubject.code}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedSubject.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    KKM: {selectedSubject.kkm}
                  </span>
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-slate-400" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Guru Pengampu</span>
                    <span className="font-semibold">{selectedSubject.teacherName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jadwal Kelas</span>
                    <span className="font-semibold font-mono text-[11px]">{selectedSubject.schedule}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lokasi Ruang</span>
                    <span className="font-semibold">{selectedSubject.room}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters & Learning Materials List */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Modul Digital & Bahan Ajar Resmi (PDF)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {currentMaterials.length} Modul Tersedia
                </span>
              </div>

              {currentMaterials.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <div className="text-xs font-medium">
                    Belum ada modul unggahan untuk mata pelajaran ini.
                  </div>
                  <div className="text-[11px]">
                    Guru sedang menyusun modul pengayaan untuk semester ini.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentMaterials.map((mat) => {
                    const { pdfUrl, fileName } = getMaterialPdf(mat, selectedSubject);

                    return (
                      <div
                        key={mat.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50/50 dark:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold uppercase">
                              BAB {mat.chapterNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {mat.title}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white font-mono shrink-0">
                              PDF MODUL
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {mat.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono flex-wrap">
                            <span>Berkas: <strong>{fileName}</strong></span>
                            <span>·</span>
                            <span>{mat.durationOrPages}</span>
                            <span>·</span>
                            <span>Diunggah {mat.uploadDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 shrink-0 self-start md:self-auto">
                          {/* Open PDF in full in-app viewer */}
                          <button
                            type="button"
                            onClick={() =>
                              setActivePdfDoc({
                                fileName,
                                title: mat.title,
                                subjectName: selectedSubject.name,
                                targetClass: 'Kelas 8A',
                                dueDate: 'Semester Genap',
                              })
                            }
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                            title="Buka dokumen modul PDF di dalam halaman baca"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka PDF Modul</span>
                          </button>

                          {/* Open in new tab with explicit document title */}
                          <button
                            type="button"
                            onClick={() => openPdfInNewTab(pdfUrl, fileName)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                            title="Buka dokumen modul di tab browser baru"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">Tab Baru</span>
                          </button>

                          {/* Download PDF */}
                          <a
                            href={pdfUrl}
                            download={fileName}
                            className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Unduh Berkas PDF Modul"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Material Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pratinjau Modul Pembelajaran
                </h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-blue-600 uppercase font-semibold">
                Bab {previewMaterial.chapterNumber} · MODUL DIGITAL RESMI
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {previewMaterial.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {previewMaterial.description}
              </p>
            </div>

            {(() => {
              const { pdfUrl, fileName } = getMaterialPdf(previewMaterial, selectedSubject);
              return (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {fileName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold">
                      PDF 1.4
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dokumen resmi Kurikulum Merdeka Fase D SMP PGRI 1 Kota Harapan.
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewMaterial(null);
                        setActivePdfDoc({
                          fileName,
                          title: previewMaterial.title,
                          subjectName: selectedSubject?.name || 'Mata Pelajaran',
                          targetClass: 'Kelas 8A',
                          dueDate: 'Semester Genap',
                        });
                      }}
                      className="flex-1 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Dokumen PDF Penuh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openPdfInNewTab(pdfUrl, fileName)}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
