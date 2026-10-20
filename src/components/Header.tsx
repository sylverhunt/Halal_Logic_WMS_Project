import React from 'react';
import { ShieldCheck, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLab: () => void;
  onOpenQuiz: () => void;
  onOpenIntegration: () => void;
  halalScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenLab,
  onOpenQuiz,
  onOpenIntegration,
  halalScore
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-inner font-bold text-sm">
              HL
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveTab('warehouse'); }}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-emerald-400 transition-colors"
            >
              HalalLogix WMS
            </a>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('warehouse')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'warehouse'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Gudang Digital
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'telemetry'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              IoT & Telemetri
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'planning'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Perencanaan & EOQ
            </button>
            <button
              onClick={() => setActiveTab('omnichannel')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'omnichannel'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Omnichannel & Green
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'blockchain'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Blockchain Traceability
            </button>
            <button
              onClick={() => setActiveTab('regulation')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'regulation'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Regulasi & HCCP
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'audit'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Audit Real-Time
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`whitespace-nowrap pb-1 transition-colors ${
                activeTab === 'studio'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Studio Data & Skenario
            </button>
          </nav>

          {/* Zone 3: Primary action & student lab trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenIntegration}
              title="Integrasi Sistem ERP - WMS - TMS - BPJPH"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Integrasi Sistem</span>
            </button>

            <button
              onClick={onOpenQuiz}
              title="Uji Pemahaman Praktikum Logistik"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kuis Evaluasi</span>
            </button>

            <button
              onClick={onOpenLab}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Praktikum Lab (Studi Kasus)</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'warehouse' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Gudang Digital
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'telemetry' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            IoT
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'planning' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            EOQ & Planning
          </button>
          <button
            onClick={() => setActiveTab('omnichannel')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'omnichannel' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Green & Omnichannel
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'blockchain' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Blockchain
          </button>
          <button
            onClick={() => setActiveTab('regulation')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'regulation' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Regulasi & HCCP
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'audit' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Audit ({halalScore}%)
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'studio' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Studio Data & Skenario
          </button>
        </div>
      </div>
    </header>
  );
};
