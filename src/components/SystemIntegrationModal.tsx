import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Server, 
  Smartphone, 
  Globe, 
  X,
  Database
} from 'lucide-react';

interface SystemIntegrationModalProps {
  onClose: () => void;
}

export const SystemIntegrationModal: React.FC<SystemIntegrationModalProps> = ({ onClose }) => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('sihalal');

  const payloads: Record<string, { title: string; method: string; url: string; json: string }> = {
    sihalal: {
      title: 'Sinkronisasi API BPJPH SIHALAL (Verifikasi Sertifikat Online)',
      method: 'GET',
      url: 'https://api.sihalal.kemenag.go.id/v2/certificates/verify?cert_no=ID00410000213450923',
      json: JSON.stringify({
        status: "ACTIVE",
        certificate_number: "ID00410000213450923",
        company_name: "Australian Halal Meat Producer Pty",
        standard: "HAS 23000 / SNI 99002",
        slaughterhouse_approval_code: "RPH-AUS-EST381-JULEHA",
        valid_until: "2028-11-20T00:00:00Z",
        mutual_recognition_agreement: true,
        digital_seal_hash: "0x89fcb21908aa312e094..."
      }, null, 2)
    },
    wms_inbound: {
      title: 'Integrasi WMS <-> ERP (Penerimaan Palet & Put-away Otomatis)',
      method: 'POST',
      url: 'https://wms.halallogix.internal/api/v1/inbound/putaway',
      json: JSON.stringify({
        po_number: "PO/HLX/2026/X/0881",
        pallet_rfid: "E28011606000020478B45001",
        sku: "HLX-BEEF-AUS01",
        allocated_bay: "C-01 (Deep Freeze)",
        hccp_zone_check: "COMPLIANT_COLD_CHAIN",
        mhe_allocated: "AGV-04 (Halal Dedicated)",
        temp_at_dock_celsius: -20.2,
        operator_id: "WMS-OP-14"
      }, null, 2)
    },
    tms_telematics: {
      title: 'Integrasi TMS <-> IoT Fleet (GPS, E-Seal & Suhu Reefer Real-Time)',
      method: 'POST',
      url: 'https://tms.halallogix.internal/api/v1/telematics/stream',
      json: JSON.stringify({
        vehicle_plate: "B 9102 HLX",
        vehicle_type: "ELECTRIC_VAN",
        current_coordinates: [-6.2088, 106.8456],
        cargo_temp_celsius: 3.4,
        e_seal_tamper_status: "SECURE_LOCKED",
        clean_cargo_bay_verified: true,
        eta_minutes: 24,
        eco_emission_factor_kg_co2_km: 0.18
      }, null, 2)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Integrasi Sistem Logistik Digital End-to-End (Topik Pembelajaran 9)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* ERP */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">1. ERP Enterprise</span>
              <Server className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-slate-400 text-[11px]">
              SAP/Oracle: Manajemen PO, Keuangan, Master Data Bahan, dan Rencana Kebutuhan Material (MRP).
            </p>
          </div>

          {/* WMS */}
          <div className="p-3.5 bg-slate-950 border border-emerald-800/80 rounded-xl space-y-1.5 shadow-sm shadow-emerald-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">2. HalalLogix WMS</span>
              <Database className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-[11px]">
              Inti Pergudangan: Slotting ABC, Pemisahan Halal/Haram, Pengendalian Cold Storage, dan Sertu Log.
            </p>
          </div>

          {/* TMS */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">3. TMS Transportasi</span>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-slate-400 text-[11px]">
              GPS Telematics, Armada EV Rendah Emisi, E-Seal Anti-Bongkar, dan Pemantauan Suhu Jalanan.
            </p>
          </div>

          {/* BPJPH */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">4. SIHALAL BPJPH</span>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Pemerintah: API Verifikasi Sertifikat Halal, Pelaporan Ketertelusuran, dan Audit Kepatuhan Nasional.
            </p>
          </div>
        </div>

        {/* Live API Payload Inspector */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                Inspektor Payload API (Data Exchange Schema):
              </span>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setActiveEndpoint('sihalal')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  activeEndpoint === 'sihalal' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                BPJPH SIHALAL
              </button>
              <button
                onClick={() => setActiveEndpoint('wms_inbound')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  activeEndpoint === 'wms_inbound' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                WMS Put-away
              </button>
              <button
                onClick={() => setActiveEndpoint('tms_telematics')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  activeEndpoint === 'tms_telematics' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                TMS Telematics
              </button>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className={`px-2 py-0.5 rounded font-bold ${
                payloads[activeEndpoint].method === 'GET' ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {payloads[activeEndpoint].method}
              </span>
              <span className="text-slate-300 truncate">{payloads[activeEndpoint].url}</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-56">
              {payloads[activeEndpoint].json}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded"
          >
            Tutup Inspektor
          </button>
        </div>
      </div>
    </div>
  );
};
