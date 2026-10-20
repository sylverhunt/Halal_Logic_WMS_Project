import React, { useState } from 'react';
import { AuditChecklistItem } from '../types/logistics';
import { 
  ShieldCheck, 
  Printer, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Calendar,
  Building,
  UserCheck,
  RotateCcw,
  Zap,
  XCircle
} from 'lucide-react';

interface RealTimeAuditViewProps {
  checklist: AuditChecklistItem[];
  halalScore: number;
}

export const RealTimeAuditView: React.FC<RealTimeAuditViewProps> = ({
  checklist,
  halalScore: initialHalalScore
}) => {
  const [auditItems, setAuditItems] = useState<AuditChecklistItem[]>(() =>
    checklist.map(i => ({ ...i, status: i.status || i.currentStatus }))
  );
  const [studentName, setStudentName] = useState<string>('Mahasiswa Teknik Logistik');
  const [studentNIM, setStudentNIM] = useState<string>('21/482910/TK/52104');
  const [university, setUniversity] = useState<string>('Departemen Teknik Mesin & Industri - Lab Logistik & Rantai Pasok');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Compute live compliance score from items
  const dynamicScore = Math.round(
    auditItems.reduce((sum, item) => sum + (item.status === 'COMPLIANT' ? item.score : item.status === 'NEEDS_CORRECTION' ? item.score * 0.5 : 0), 0) /
    (auditItems.length || 1)
  );

  const effectiveScore = dynamicScore;

  const handleToggleItemStatus = (itemId: string) => {
    setAuditItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const nextStatus: AuditChecklistItem['currentStatus'] =
            (item.status || item.currentStatus) === 'COMPLIANT'
              ? 'NON_COMPLIANT'
              : (item.status || item.currentStatus) === 'NON_COMPLIANT'
              ? 'NEEDS_CORRECTION'
              : 'COMPLIANT';
          return { ...item, status: nextStatus, currentStatus: nextStatus };
        }
        return item;
      })
    );
  };

  const handleResetAuditChecklist = () => {
    setAuditItems(checklist.map(item => ({ ...item, status: 'COMPLIANT', currentStatus: 'COMPLIANT', score: 100 })));
  };

  const handleInjectFindings = () => {
    setAuditItems(prev =>
      prev.map((item, idx) => {
        if (idx === 1) {
          return {
            ...item,
            status: 'NON_COMPLIANT',
            score: 40,
            notes: 'TEMUAN AUDIT: Fluktuasi suhu terdeteksi di probe C-01 melewati -18°C selama 22 menit.'
          };
        }
        if (idx === 3) {
          return {
            ...item,
            status: 'NEEDS_CORRECTION',
            score: 70,
            notes: 'TEMUAN MINOR: Kartu kendali pembersihan MHE Forklift F-02 belum ditandatangani Penyelia Halal.'
          };
        }
        return item;
      })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Audit Kepatuhan Berbasis Data Secara Real-Time (Topik 10)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Indeks Integritas Halal kontinyu, matriks kepatuhan klausul SNI 99004 / HAS 23000, dan generator Berita Acara Audit Mahasiswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleInjectFindings}
            title="Simulasikan temuan audit lapangan untuk menguji respons sistem"
            className="px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Uji Skenario Temuan Audit</span>
          </button>

          <button
            onClick={handleResetAuditChecklist}
            title="Reset seluruh klausul audit kembali ke status 100% Compliant"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Audit (100%)</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Laporan Berita Acara</span>
          </button>
        </div>
      </div>

      {/* Real-time Halal Compliance Score Meter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Real-Time Halal Integrity Index (HII)
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1e293b"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={effectiveScore >= 90 ? '#10b981' : effectiveScore >= 75 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * effectiveScore) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {effectiveScore}%
              </span>
              <span className={`text-[10px] font-bold uppercase ${
                effectiveScore >= 90 ? 'text-emerald-400' : effectiveScore >= 75 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {effectiveScore >= 95 ? 'GRADE A (SANGAT BAIK)' : effectiveScore >= 80 ? 'GRADE B (BAIK)' : 'PERLU PERBAIKAN'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-xs">
            Skor dihitung secara otomatis dari telemetri sensor cold chain (25%), segregasi rak fisik (30%), validitas sertifikat BPJPH (20%), sanitasi (15%), dan MHE terdedikasi (10%).
          </p>
        </div>

        {/* Detailed Compliance Pillars */}
        <div className="md:col-span-7 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Komponen Pembobotan Audit Otomatis
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pemisahan Fisik Zona & Rak (HAS 23000 Kriteria Fasilitas):</span>
                <span className="font-mono text-emerald-400 font-bold">98% (Bobot 30%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Kepatuhan Suhu Cold Chain RTD IoT (Batas Kritis -18°C):</span>
                <span className={`font-mono font-bold ${auditItems[1]?.status === 'NON_COMPLIANT' ? 'text-rose-400' : 'text-sky-400'}`}>
                  {auditItems[1]?.status === 'NON_COMPLIANT' ? '40% (Temuan Pelanggaran)' : '96% (Bobot 25%)'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full ${auditItems[1]?.status === 'NON_COMPLIANT' ? 'bg-rose-500 w-[40%]' : 'bg-sky-500 w-[96%]'}`} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Validitas Sertifikat SIHALAL BPJPH (E-Procurement):</span>
                <span className="font-mono text-emerald-400 font-bold">95% (Bobot 20%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Protokol Sanitasi & Fasilitas Pensucian Sertu:</span>
                <span className="font-mono text-emerald-400 font-bold">100% (Bobot 15%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[100%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Peralatan Penanganan MHE Terdedikasi Label Halal:</span>
                <span className="font-mono text-emerald-400 font-bold">92% (Bobot 10%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Matriks Kepatuhan Klausul Standar Audit Lapangan (SNI 99004:2021)</span>
          </h3>
          <span className="text-xs text-slate-400">Klik status pada baris tabel untuk mengubah hasil audit (Simulasi Lapangan)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Klausul Standar</th>
                <th className="px-4 py-3">Deskripsi Persyaratan Kepatuhan</th>
                <th className="px-4 py-3">Bukti Bukti (Evidence)</th>
                <th className="px-4 py-3">Skor</th>
                <th className="px-4 py-3">Status Audit (Klik untuk Mengubah)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-white whitespace-nowrap">
                    {item.standardClause}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-200">{item.requirement}</p>
                    <p className={`text-[10px] mt-0.5 ${item.status === 'NON_COMPLIANT' ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                      {item.notes}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.evidenceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold tabular-nums">
                    <span className={item.status === 'COMPLIANT' ? 'text-emerald-400' : item.status === 'NEEDS_CORRECTION' ? 'text-amber-400' : 'text-rose-400'}>
                      {item.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleItemStatus(item.id)}
                      title="Klik untuk mengubah status audit item ini"
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded border transition-all ${
                        item.status === 'COMPLIANT'
                          ? 'text-emerald-300 bg-emerald-950/60 border-emerald-700 hover:border-emerald-500'
                          : item.status === 'NEEDS_CORRECTION'
                          ? 'text-amber-300 bg-amber-950/60 border-amber-700 hover:border-amber-500'
                          : 'text-rose-300 bg-rose-950/60 border-rose-700 hover:border-rose-500 animate-pulse'
                      }`}
                    >
                      {item.status === 'COMPLIANT' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : item.status === 'NEEDS_CORRECTION' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>
                        {item.status === 'COMPLIANT' ? 'COMPLIANT (LULUS)' : item.status === 'NEEDS_CORRECTION' ? 'PERBAIKAN MINOR' : 'NON-COMPLIANT (MAYOR)'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Audit Report Generation Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Berita Acara Audit Praktikum Logistik Halal (BPJPH & LPPOM)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Dokumen laporan resmi hasil simulasi praktikum mahasiswa Teknik Logistik.
                </p>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded"
              >
                Tutup
              </button>
            </div>

            {/* Student Metadata Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Mahasiswa:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">NIM / ID Mahasiswa:</label>
                <input
                  type="text"
                  value={studentNIM}
                  onChange={(e) => setStudentNIM(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Program Studi / Lab:</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white truncate"
                />
              </div>
            </div>

            {/* Printable Certificate Preview */}
            <div className="p-6 bg-slate-950 border-2 border-emerald-600/60 rounded-xl space-y-4 text-xs font-sans">
              <div className="text-center border-b border-slate-800 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                  LEMBAR AUDIT SISTEM JAMINAN PRODUK HALAL (HAS 23000 / SNI 99004:2021)
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  HALALLOGIX WMS · SIMULASI PRAKTIKUM TEKNIK LOGISTIK
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tanggal Pelaksanaan: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Auditor (Mahasiswa):</span>
                  <span className="font-semibold text-white">{studentName} ({studentNIM})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Fasilitas / Gudang:</span>
                  <span className="font-semibold text-white">HalalLogix Automated Cold & Ambient Distribution Center</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between font-bold text-white text-xs">
                  <span>Hasil Skor Indeks Integritas Halal:</span>
                  <span className="font-mono text-emerald-400">{effectiveScore}% ({effectiveScore >= 90 ? 'GRADE A - LULUS AUDIT' : 'PERLU PERBAIKAN'})</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Berdasarkan pemantauan sensor telemetri IoT kontinu, pemisahan fisik rak penyimpanan ambient dan cold chain (-20°C), verifikasi sertifikat BPJPH aktif pada modul E-Procurement, serta kesiapan stasiun pensucian Sertu/Samak, fasilitas pergudangan dinyatakan <strong>{effectiveScore >= 90 ? 'MEMENUHI KETENTUAN (COMPLIANT)' : 'MEMERLUKAN TINDAKAN KOREKSI SEGERA'}</strong> secara syariat dan regulasi nasional UU JPH No. 33/2014.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800 text-[10px] text-slate-400">
                <div className="text-center">
                  <span>Penyelia Halal Tersertifikasi:</span>
                  <div className="h-10 flex items-center justify-center font-mono text-emerald-400 font-bold">
                    [ VERIFIED DIGITAL STAMP ]
                  </div>
                  <span>Ir. Ahmad Zulkarnain, S.T., M.T. (Halal Lead Auditor)</span>
                </div>
                <div className="text-center">
                  <span>Tanda Tangan Mahasiswa:</span>
                  <div className="h-10 flex items-center justify-center font-mono text-slate-300">
                    [ DIGITAL SIGNATURE ]
                  </div>
                  <span>{studentName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
