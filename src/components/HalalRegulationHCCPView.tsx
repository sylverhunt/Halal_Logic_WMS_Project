import React, { useState } from 'react';
import { HCCP_RULES } from '../data/mockData';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertOctagon, 
  Droplet, 
  CheckCircle2, 
  Scale, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';

export const HalalRegulationHCCPView: React.FC = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(1);
  const [sertuStep, setSertuStep] = useState<number>(0); // 0 = not started, 1..7 washes, 8 = verified
  const [sertuFacilityCleaned, setSertuFacilityCleaned] = useState<boolean>(false);

  const activeRule = HCCP_RULES.find(r => r.principle === selectedPrinciple) || HCCP_RULES[0];

  const handleAdvanceSertu = () => {
    if (sertuStep < 8) {
      setSertuStep(prev => prev + 1);
      if (sertuStep === 7) {
        setSertuFacilityCleaned(true);
      }
    }
  };

  const handleResetSertu = () => {
    setSertuStep(0);
    setSertuFacilityCleaned(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            Regulasi Halal, Standar BPJPH & Halal Critical Control Points (HCCP)
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          Dasar hukum logistik halal Indonesia mengacu pada <strong>UU No. 33 Tahun 2014 tentang Jaminan Produk Halal (UU JPH)</strong>, PP No. 39 Tahun 2021, serta standar teknis <strong>SNI 99004:2021 (Sistem Manajemen Rantai Pasok Halal - Pergudangan)</strong> dan <strong>HAS 23000</strong>.
        </p>
      </div>

      {/* 3 Pillars of Regulatory Framework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">1. UU JPH No. 33/2014 & BPJPH</span>
            <span className="text-[10px] text-slate-400">Mandatori Hukum</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pasal 21 mewajibkan pemisahan lokasi, tempat, dan alat penyembelihan, pengolahan, penyimpanan, pengemasan, pendistribusian, penjualan, serta penyajian antara produk Halal dan Tidak Halal.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400">2. SNI 99004:2021 Pergudangan</span>
            <span className="text-[10px] text-slate-400">Standar Teknis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spesifikasi teknis pergudangan halal: batas pemisah fisik, integritas kemasan, penanganan MHE terdedikasi, manajemen rantai dingin kontinu, serta sistem ketertelusuran batch.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">3. HAS 23000 & Standar Global</span>
            <span className="text-[10px] text-slate-400">Sistem Jaminan Halal</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            11 Kriteria Sistem Jaminan Halal: Kebijakan halal, Tim Manajemen Halal (Penyelia Halal), Pelatihan, Bahan, Produk, Fasilitas Produksi/Gudang, Prosedur Kritis, Audit Internal, dan Kaji Ulang Manajemen.
          </p>
        </div>
      </div>

      {/* 7 HCCP Principles Interactive Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Principle Navigation (4 cols) */}
        <div className="lg:col-span-4 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            7 Prinsip Halal Critical Control Point (HCCP)
          </h3>
          <div className="space-y-1.5">
            {HCCP_RULES.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setSelectedPrinciple(rule.principle)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                  selectedPrinciple === rule.principle
                    ? 'bg-emerald-950/60 border border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  selectedPrinciple === rule.principle ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {rule.principle}
                </div>
                <div className="truncate flex-1">
                  <span className="block truncate">{rule.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Principle Detail (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-emerald-400">Prinsip HCCP Ke-{activeRule.principle}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeRule.title}</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {activeRule.regulationBasis}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> Bahaya Kontaminasi Kritis:
              </span>
              <p className="text-slate-300 leading-relaxed">{activeRule.hazardDescription}</p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Batas Kritis (Critical Limit):
              </span>
              <p className="text-slate-300 leading-relaxed">{activeRule.criticalLimit}</p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-cyan-400">Metode Pemantauan Real-Time:</span>
              <p className="text-slate-300 leading-relaxed">{activeRule.monitoringMethod}</p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-amber-400">Tindakan Koreksi (Corrective Action):</span>
              <p className="text-slate-300 leading-relaxed">{activeRule.correctiveAction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Samak / Sertu Cleaning Protocol Simulator */}
      <div className="p-5 bg-slate-900 border border-emerald-900/60 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Simulasi Prosedur Pensucian Najis Mughallazah (Samak / Sertu)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sesuai Fatwa MUI No. 27/2013 & SNI 99004: Pensucian fasilitas/MHE yang terkena najis berat dengan 7 kali basuhan air, salah satunya menggunakan air tanah suci.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSertu}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
            >
              Reset Prosedur
            </button>
            <button
              onClick={handleAdvanceSertu}
              disabled={sertuStep >= 8}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>
                {sertuStep === 0 
                  ? 'Mulai Langkah 1 (Bersihkan Wujud Najis)' 
                  : sertuStep < 7 
                  ? `Lanjutkan Basuhan Ke-${sertuStep + 1}` 
                  : sertuStep === 7 
                  ? 'Pengesahan Berita Acara Penyelia Halal' 
                  : 'Sertu Selesai & Sah'}
              </span>
            </button>
          </div>
        </div>

        {/* Sertu Progress Visualizer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">
              {sertuStep === 0 && 'Status: Belum dimulai. Fasilitas terkontaminasi terisolasi di stasiun cuci.'}
              {sertuStep === 1 && 'Langkah 1: Menghilangkan wujud (' + 'ain), bau, dan rasa najis fisik.'}
              {sertuStep === 2 && 'Basuhan Ke-1: Menggunakan air bersih mengalir.'}
              {sertuStep === 3 && 'Basuhan Ke-2 (KRITIS): Campuran air dan tanah suci bebas najis.'}
              {sertuStep >= 4 && sertuStep <= 7 && `Basuhan Ke-${sertuStep - 1}: Pembilasan air bersih mengalir.`}
              {sertuStep === 8 && 'Pengesahan: Penyelia Halal menandatangani Berita Acara Sertu. MHE aman digunakan!'}
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {Math.min(100, Math.round((sertuStep / 8) * 100))}% Selesai
            </span>
          </div>

          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`p-2 rounded text-center text-xs font-mono font-bold transition-all ${
                  i < sertuStep
                    ? i === 2
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-emerald-600 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-500'
                }`}
              >
                {i === 0 ? 'Fisik' : i === 2 ? 'Air Tanah' : i === 7 ? 'Sahkan' : `Air ${i}`}
              </div>
            ))}
          </div>

          {sertuFacilityCleaned && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-600 rounded text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Berita Acara Sertu disetujui: Forklift F-02 dan area Dock telah suci kembali sesuai syariat.</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-900 rounded text-emerald-200">
                Dokumen ID: BA-SERTU-2026-X
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
