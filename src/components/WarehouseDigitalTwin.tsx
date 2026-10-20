import React, { useState, useEffect } from 'react';
import { WarehouseBay, InventoryItem } from '../types/logistics';
import { 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Snowflake, 
  ShieldAlert, 
  ArrowRightLeft, 
  X, 
  FileCheck, 
  RefreshCw, 
  Zap, 
  Info, 
  Sliders,
  Play,
  Pause,
  Clock,
  Radio,
  Truck,
  Package,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

interface WarehouseDigitalTwinProps {
  bays: WarehouseBay[];
  onUpdateBay: (bayId: string, updates: Partial<WarehouseBay>) => void;
  onRelocateItem: (itemId: string, sourceBayId: string, targetBayId: string) => void;
  onTriggerAnomaly: (type: 'COLD_CHAIN' | 'QUARANTINE_SPILL' | 'EXPIRED_CERT') => void;
  simulationRunning: boolean;
  simulationSpeed: number;
  setSimulationSpeed: (spd: number) => void;
  toggleSimulation: () => void;
  onOpenLab: () => void;
  onOpenStudio?: () => void;
  onResetWarehouseSimulation?: () => void;
}

export const WarehouseDigitalTwin: React.FC<WarehouseDigitalTwinProps> = ({
  bays,
  onUpdateBay,
  onRelocateItem,
  onTriggerAnomaly,
  simulationRunning,
  simulationSpeed,
  setSimulationSpeed,
  toggleSimulation,
  onOpenLab,
  onOpenStudio,
  onResetWarehouseSimulation
}) => {
  const [selectedBay, setSelectedBay] = useState<WarehouseBay | null>(null);
  const [relocateModalItem, setRelocateModalItem] = useState<{ item: InventoryItem; fromBayId: string } | null>(null);
  const [targetBayId, setTargetBayId] = useState<string>('');
  const [showImageBanner, setShowImageBanner] = useState<boolean>(true);

  // --- VISIBLE ANIMATED SIMULATION ENGINE STATES ---
  const [simSeconds, setSimSeconds] = useState<number>(34200); // starts at 09:30:00
  const [agvPositionPercent, setAgvPositionPercent] = useState<number>(15);
  const [agvStatusText, setAgvStatusText] = useState<string>('Memuat Pallet Daging Halal di Dock 1');
  const [agvCurrentLocation, setAgvCurrentLocation] = useState<string>('Dock 1 (Inbound)');
  const [throughputInbound, setThroughputInbound] = useState<number>(142);
  const [throughputPutaway, setThroughputPutaway] = useState<number>(118);
  const [throughputOutbound, setThroughputOutbound] = useState<number>(86);
  const [eventLogs, setEventLogs] = useState<Array<{ id: string; time: string; text: string; type: 'success' | 'info' | 'warning' }>>([
    { id: '1', time: '09:30:10', text: 'Dock 1: Palet #LOT-2026-BF-091 terverifikasi RFID Gate (Sertifikat BPJPH Aktif)', type: 'success' },
    { id: '2', time: '09:30:14', text: 'AGV-04: Membawa muatan 1,200 kg menuju Zona Cold Storage C-01', type: 'info' },
    { id: '3', time: '09:30:18', text: 'RTD Sensor C-01: Suhu stabil pada -20.4°C (Batas Kritis Aman)', type: 'success' },
    { id: '4', time: '09:30:22', text: 'AS/RS: Put-away selesai di rak level 3 Bay C-01', type: 'success' }
  ]);

  // Automated Put-away Simulation State
  const [putawayCycleRunning, setPutawayCycleRunning] = useState<boolean>(false);
  const [putawayPhase, setPutawayPhase] = useState<number>(0); // 0=idle, 1=dock rfid, 2=conveyor, 3=agv pickup, 4=rack storage, 5=verified
  const [putawayMessage, setPutawayMessage] = useState<string>('');

  const handleStartPutawayCycle = () => {
    if (putawayCycleRunning) return;
    setPutawayCycleRunning(true);
    setPutawayPhase(1);
    setPutawayMessage('Langkah 1/5: Palet #LOT-BF-901 tiba di Dock 1 Inbound. Pemindaian portal RFID BPJPH...');
    setAgvPositionPercent(10);
    setAgvStatusText('Menuju Dock 1 untuk mengambil Palet Daging Sapi Halal');
    setAgvCurrentLocation('Dock 1 (Inbound)');

    setTimeout(() => {
      setPutawayPhase(2);
      setPutawayMessage('Langkah 2/5: Validasi Sertifikat BPJPH #ID0031000293182 lolos. Palet masuk ke Konveyor AS/RS...');
      setAgvPositionPercent(35);
      setAgvStatusText('Palet meluncur pada Konveyor Roller Otomatis');
      setAgvCurrentLocation('Jalur Konveyor AS/RS');
      setThroughputInbound(prev => prev + 1);
    }, 1200);

    setTimeout(() => {
      setPutawayPhase(3);
      setPutawayMessage('Langkah 3/5: Robot AGV-04 mengangkat palet dari transfer station, menuju Zona Cold Chain...');
      setAgvPositionPercent(60);
      setAgvStatusText('Robot AGV-04 membawa palet menuju Bay C-01');
      setAgvCurrentLocation('Lorong Cold Chain Bay C');
    }, 2400);

    setTimeout(() => {
      setPutawayPhase(4);
      setPutawayMessage('Langkah 4/5: Crane AS/RS menaikkan palet ke rak Level 2 Bay C-01 (-20°C)...');
      setAgvPositionPercent(75);
      setAgvStatusText('Menempatkan palet ke slot penyimpanan Cold Storage');
      setAgvCurrentLocation('Rak Bay C-01');
      setThroughputPutaway(prev => prev + 1);
    }, 3600);

    setTimeout(() => {
      setPutawayPhase(5);
      setPutawayMessage('Langkah 5/5: Sukses! Palet tersimpan aman, barcode & RFID terdaftar di WMS, suhu stabil -20.4°C.');
      setAgvPositionPercent(90);
      setAgvStatusText('Kembali ke stasiun pengisian daya (Idle)');
      setAgvCurrentLocation('Stasiun Dock 2 / Charger');
      setEventLogs(prev => [
        { id: Date.now().toString(), time: new Date().toTimeString().split(' ')[0], text: 'Siklus Put-Away Otomatis Selesai: Palet #LOT-BF-901 berhasil ditempatkan di Bay C-01', type: 'success' },
        ...prev
      ]);
      onUpdateBay('bay-c1', { occupiedPallets: Math.min(40, (bays.find(b => b.id === 'bay-c1')?.occupiedPallets || 28) + 1) });
      
      setTimeout(() => {
        setPutawayCycleRunning(false);
        setPutawayPhase(0);
      }, 3000);
    }, 4800);
  };

  // Clock & AGV movement ticker
  useEffect(() => {
    if (!simulationRunning) return;

    const intervalTime = Math.max(300, 1000 / simulationSpeed);
    const interval = setInterval(() => {
      // 1. Advance simulation clock
      setSimSeconds(prev => prev + 1);

      // 2. Animate AGV loop across the track (0% to 100%)
      setAgvPositionPercent(prev => {
        const next = prev >= 95 ? 5 : prev + (simulationSpeed * 3);
        if (next < 25) {
          setAgvStatusText('Memuat Pallet Halal di Receiving Dock 1');
          setAgvCurrentLocation('Dock 1 (Inbound Buffer)');
        } else if (next < 50) {
          setAgvStatusText('Melintasi Jalur Konveyor Otomatis AS/RS');
          setAgvCurrentLocation('Koridor Utama AS/RS');
        } else if (next < 75) {
          setAgvStatusText('Put-away Pallet ke Rak Pendingin Bay C-01');
          setAgvCurrentLocation('Zona Cold Chain Bay C');
        } else {
          setAgvStatusText('Menuju Staging Outbound Pengiriman Dock 2');
          setAgvCurrentLocation('Dock 2 (Dispatch Staging)');
        }
        return next;
      });

      // 3. Random event generator periodically
      if (Math.random() < 0.25) {
        const nowFormatted = new Date().toTimeString().split(' ')[0];
        const logSamples = [
          { text: 'RFID Gate Dock 1: Palet Minyak Sawit RSPO lolos verifikasi sertifikasi halal', type: 'success' as const },
          { text: 'Sensor Suhu Bay C-02: Suhu chilled termonitor stabil 2.1°C', type: 'success' as const },
          { text: 'AGV Robot #04: Pemeriksaan sensor LiDAR nominal (Bebas Halangan)', type: 'info' as const },
          { text: 'Wave Picking: 12 pesanan e-commerce dialokasikan ke armada Electric Cargo Van', type: 'info' as const },
          { text: 'E-Seal Tracker: Segel kontainer reefer B-9012-HLX utuh tanpa pelanggaran', type: 'success' as const }
        ];
        const randomLog = logSamples[Math.floor(Math.random() * logSamples.length)];
        setEventLogs(prev => [
          { id: Date.now().toString(), time: nowFormatted, text: randomLog.text, type: randomLog.type },
          ...prev.slice(0, 6)
        ]);
        setThroughputInbound(prev => prev + 1);
        if (Math.random() > 0.5) setThroughputPutaway(prev => prev + 1);
        if (Math.random() > 0.7) setThroughputOutbound(prev => prev + 1);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);

  const handleResetLocalSimulation = () => {
    setSimSeconds(34200); // 09:30:00
    setAgvPositionPercent(15);
    setAgvStatusText('Memuat Pallet Daging Halal di Dock 1');
    setAgvCurrentLocation('Dock 1 (Inbound)');
    setThroughputInbound(142);
    setThroughputPutaway(118);
    setThroughputOutbound(86);
    setEventLogs([
      { id: '1', time: '09:30:10', text: 'Dock 1: Palet #LOT-2026-BF-091 terverifikasi RFID Gate (Sertifikat BPJPH Aktif)', type: 'success' },
      { id: '2', time: '09:30:14', text: 'AGV-04: Membawa muatan 1,200 kg menuju Zona Cold Storage C-01', type: 'info' },
      { id: '3', time: '09:30:18', text: 'RTD Sensor C-01: Suhu stabil pada -20.4°C (Batas Kritis Aman)', type: 'success' }
    ]);
    if (onResetWarehouseSimulation) {
      onResetWarehouseSimulation();
    }
  };

  // Format digital time
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600) % 24;
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getZoneLabel = (zone: WarehouseBay['zone']) => {
    switch (zone) {
      case 'HALAL_AMBIENT': return 'Halal Dedicated Ambient';
      case 'HALAL_COLD_CHAIN': return 'Halal Cold Chain (-20°C s/d 4°C)';
      case 'QUARANTINE': return 'Karantina Khusus (Isolasi Mutlak)';
      case 'NON_HALAL_SEGREGATED': return 'Segregasi Non-Halal (Terpisah Fisik)';
      default: return zone;
    }
  };

  const getZoneBadgeStyle = (zone: WarehouseBay['zone']) => {
    switch (zone) {
      case 'HALAL_AMBIENT': return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20';
      case 'HALAL_COLD_CHAIN': return 'border-sky-500/40 text-sky-400 bg-sky-950/20';
      case 'QUARANTINE': return 'border-amber-500/40 text-amber-400 bg-amber-950/20';
      case 'NON_HALAL_SEGREGATED': return 'border-rose-500/40 text-rose-400 bg-rose-950/20';
      default: return 'border-slate-700 text-slate-400 bg-slate-900';
    }
  };

  const handleExecuteRelocate = () => {
    if (!relocateModalItem || !targetBayId) return;
    onRelocateItem(relocateModalItem.item.id, relocateModalItem.fromBayId, targetBayId);
    setRelocateModalItem(null);
    setSelectedBay(null);
  };

  const ambientBays = bays.filter(b => b.zone === 'HALAL_AMBIENT');
  const coldBays = bays.filter(b => b.zone === 'HALAL_COLD_CHAIN');
  const quarantineBays = bays.filter(b => b.zone === 'QUARANTINE');
  const nonHalalBays = bays.filter(b => b.zone === 'NON_HALAL_SEGREGATED');

  return (
    <div className="space-y-6">
      {/* Top Controls & Live Simulation Status Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              simulationRunning 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' 
                : 'bg-amber-950/60 border-amber-500/50 text-amber-400'
            }`}>
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Digital Twin Warehouse Floor Plan (SNI 99004:2021)</h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  simulationRunning 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-600' 
                    : 'bg-amber-950 text-amber-400 border border-amber-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${simulationRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  {simulationRunning ? 'SIMULASI LIVE BERJALAN' : 'SIMULASI DIJEDA'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulasi aliran fisik barang halal, sensor telemetri RTD real-time, robot AGV, dan titik kendali kritis (CCP).
              </p>
            </div>
          </div>

          {/* Simulation Toggles & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Clock Counter */}
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Jam Simulasi:</span>
              <span className="font-bold tabular-nums text-white">{formatTime(simSeconds)} WIB</span>
            </div>

            {/* Play/Pause & Speed Segmented Control */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={toggleSimulation}
                className={`px-3 py-1 font-semibold rounded transition-colors flex items-center gap-1.5 ${
                  simulationRunning
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-amber-600 text-white shadow'
                }`}
              >
                {simulationRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{simulationRunning ? 'Jeda' : 'Jalankan'}</span>
              </button>
              <div className="h-4 w-px bg-slate-800 mx-1.5" />
              <button
                onClick={() => setSimulationSpeed(1)}
                className={`px-2 py-1 rounded transition-colors ${simulationSpeed === 1 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSimulationSpeed(2)}
                className={`px-2 py-1 rounded transition-colors ${simulationSpeed === 2 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                2x
              </button>
              <button
                onClick={() => setSimulationSpeed(5)}
                className={`px-2 py-1 rounded transition-colors ${simulationSpeed === 5 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                5x (Cepat)
              </button>
            </div>

            <button
              onClick={handleResetLocalSimulation}
              title="Reset suhu gudang, posisi AGV, dan log operasional kembali ke kondisi awal"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Simulasi Gudang</span>
            </button>

            {/* Live Automated Put-away trigger */}
            <button
              onClick={handleStartPutawayCycle}
              disabled={putawayCycleRunning}
              title="Jalankan simulasi otomatis: kedatangan palet di Dock 1, scan RFID, konveyor AS/RS, dan robot AGV menempatkan palet ke rak"
              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ring-1 ring-cyan-400/40 animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-200" />
              <span>{putawayCycleRunning ? 'Sedang Berjalan...' : '⚡ Jalankan Put-Away Otomatis'}</span>
            </button>

            {/* Manual Anomaly triggers for training students */}
            <button
              onClick={() => onTriggerAnomaly('COLD_CHAIN')}
              title="Simulasikan kompresor mati & lonjakan suhu C-01"
              className="px-2.5 py-1.5 bg-sky-950/70 hover:bg-sky-900 border border-sky-800/80 text-sky-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>Uji Anomali Suhu Cold Chain</span>
            </button>

            <button
              onClick={() => onTriggerAnomaly('QUARANTINE_SPILL')}
              title="Simulasikan tumpahan najis mughallazah di receiving dock"
              className="px-2.5 py-1.5 bg-amber-950/70 hover:bg-amber-900 border border-amber-800/80 text-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Uji Tumpahan Najis</span>
            </button>

            {onOpenStudio && (
              <button
                onClick={onOpenStudio}
                title="Input SKU baru atau rancang skenario baru"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>+ Input Data & Skenario</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Palet Inbound (Diterima):</span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">{throughputInbound} Palet</span>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Palet Put-away (Di Rak):</span>
            <span className="font-mono text-sky-400 font-bold tabular-nums">{throughputPutaway} Palet</span>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Palet Outbound (Terkirim):</span>
            <span className="font-mono text-amber-400 font-bold tabular-nums">{throughputOutbound} Palet</span>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Status Robot AGV-04:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Aktif Beroperasi</span>
            </span>
          </div>
        </div>
      </div>

      {/* VISIBLE ACTIVE PUT-AWAY SIMULATION MONITOR */}
      {putawayPhase > 0 && (
        <div className="p-4 bg-cyan-950/60 border-2 border-cyan-500 rounded-xl space-y-3 animate-in fade-in shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-800/60 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400 animate-spin" />
              <h3 className="text-sm font-bold text-white">
                Simulasi Put-Away Palet Otomatis Berjalan (Inbound ➔ AS/RS ➔ Bay C-01)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-900/80 px-2.5 py-0.5 rounded border border-cyan-700">
              Tahap {putawayPhase} dari 5
            </span>
          </div>

          <p className="text-xs text-cyan-100 font-medium">{putawayMessage}</p>

          {/* 5-Phase Step Indicators */}
          <div className="grid grid-cols-5 gap-2 pt-1 text-[11px] font-semibold">
            <div className={`p-2 rounded text-center border ${putawayPhase >= 1 ? 'bg-cyan-600 text-white border-cyan-400 shadow' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              1. Dock 1 RFID
            </div>
            <div className={`p-2 rounded text-center border ${putawayPhase >= 2 ? 'bg-cyan-600 text-white border-cyan-400 shadow' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              2. Konveyor AS/RS
            </div>
            <div className={`p-2 rounded text-center border ${putawayPhase >= 3 ? 'bg-cyan-600 text-white border-cyan-400 shadow' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              3. Robot AGV-04
            </div>
            <div className={`p-2 rounded text-center border ${putawayPhase >= 4 ? 'bg-cyan-600 text-white border-cyan-400 shadow' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              4. Rak Bay C-01
            </div>
            <div className={`p-2 rounded text-center border ${putawayPhase >= 5 ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              5. Terverifikasi
            </div>
          </div>
        </div>
      )}

      {/* VISIBLE ACTIVE AGV & CONVEYOR SIMULATION ARENA */}
      <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Lintasan Simulasi Bergerak Robot AGV & Konveyor (Real-Time Transit Arena)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Posisi:</span>
            <span className="font-mono text-emerald-400 font-semibold">{agvCurrentLocation}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Tugas:</span>
            <span className="font-medium text-white">{agvStatusText}</span>
          </div>
        </div>

        {/* Graphical Animated Transit Track */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
          {/* Track Waypoints Line */}
          <div className="relative h-12 flex items-center">
            {/* Background dashed rail */}
            <div className="absolute inset-x-0 h-1.5 bg-slate-800 border-t border-b border-dashed border-slate-700 rounded" />
            
            {/* Visual Waypoint Stations */}
            <div className="absolute inset-x-0 flex justify-between items-center px-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center" />
                <span className="text-[10px] text-emerald-400 font-bold mt-1">Dock 1 (Inbound)</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center" />
                <span className="text-[10px] text-cyan-400 font-bold mt-1">Konveyor AS/RS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-sky-950 border-2 border-sky-500 flex items-center justify-center" />
                <span className="text-[10px] text-sky-400 font-bold mt-1">Rak Dingin Bay C</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center" />
                <span className="text-[10px] text-emerald-400 font-bold mt-1">Rak Ambient Bay A/B</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-950 border-2 border-amber-500 flex items-center justify-center" />
                <span className="text-[10px] text-amber-400 font-bold mt-1">Dock 2 (Dispatch)</span>
              </div>
            </div>

            {/* VISIBLY MOVING AGV VEHICLE AVATAR */}
            <div
              className="absolute z-10 transition-all duration-300 ease-linear flex flex-col items-center -translate-x-1/2"
              style={{ left: `${agvPositionPercent}%` }}
            >
              <div className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded shadow-lg flex items-center gap-1 whitespace-nowrap animate-bounce">
                <span>🤖 AGV-04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white mt-0.5">
                <Package className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Animated Conveyor Belt Strip */}
          <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">Aliran Konveyor AS/RS:</span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
                <span className="animate-pulse">📦 Palet #882</span>
                <ChevronRight className="w-3 h-3 text-cyan-500 animate-pulse" />
                <span className="animate-pulse">📦 Palet #883</span>
                <ChevronRight className="w-3 h-3 text-cyan-500 animate-pulse" />
                <span className="animate-pulse">📦 Palet #884</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Baterai AGV:</span>
              <span className="text-emerald-400 font-mono font-bold">94%</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Kecepatan:</span>
              <span className="text-white font-mono font-bold">1.4 m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Facility Architecture Banner */}
      {showImageBanner && (
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 group">
          <img
            src="/src/assets/images/warehouse_digital_twin_iso_1791795136928.jpg"
            alt="Arsitektur Fasilitas Gudang Pintar Halal"
            referrerPolicy="no-referrer"
            className="w-full h-44 sm:h-56 md:h-64 object-cover object-center opacity-85 group-hover:opacity-95 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  HalalLogix Engineering Testbed · Kampus Merdeka Praktikum
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                  Fasilitas Gudang Pintar Berstandar Jaminan Produk Halal (HAS 23000)
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">
                  Dilengkapi pemisahan zonasi mutlak, sensor RTD telemetri rantai dingin, sistem konveyor otomatis (AS/RS & AGV), dan stasiun pensucian sertu.
                </p>
              </div>
              <button
                onClick={() => setShowImageBanner(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900/80 rounded border border-slate-700"
              >
                Sembunyikan Visual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive 2D Warehouse Floor Canvas */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-6">
        {/* Dock Section: Inbound & Receiving */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-800">
          {/* Dock 1 */}
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 relative">
            <div className="w-8 h-8 rounded bg-emerald-900/50 border border-emerald-600 flex items-center justify-center text-emerald-300 text-xs font-bold">
              D-1
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Dock 1: Halal Dedicated Receiving</span>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  RFID Auto-Gate Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pemeriksaan ketat sertifikasi BPJPH. Pallet berlabel hijau dengan pembacaan RFID gantry 100%.
              </p>
            </div>
          </div>

          {/* AGV Lanes in the middle */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-400">Jalur AGV & Konveyor Otomatis</span>
              <p className="text-xs text-slate-400 mt-1">Status: Membawa Pallet Halal ke Rak C-01</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dedicated Halal MHE</span>
            </div>
          </div>

          {/* Dock 2 */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
              D-2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Dock 2: General / Outbound Staging</span>
                <span className="text-[10px] text-slate-400">Disinfeksi Kontainer</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Jalur muat armada logistik terverifikasi bebas kontaminasi sebelum berangkat.
              </p>
            </div>
          </div>
        </div>

        {/* Warehouse Zones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Halal Cold Chain Zone (Left 4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Zona Cold Storage Halal (C-01 s/d C-03)
                </h3>
              </div>
              <span className="text-[11px] text-sky-300 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse text-sky-400" />
                <span>RTD Online</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kritis: Penyimpanan daging & produk susu beku/dingin. Standar CCP-3: suhu beku &le; -18&deg;C dan chilled 0&deg;C s/d 4&deg;C.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {coldBays.map((bay) => (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBay(bay)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    bay.temperature > bay.targetTemp.max
                      ? 'bg-rose-950/50 border-rose-500 hover:border-rose-400 shadow-md shadow-rose-950'
                      : 'bg-slate-900/90 border-sky-900/60 hover:border-sky-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{bay.code}</span>
                      {bay.temperature > bay.targetTemp.max && (
                        <span className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold bg-rose-900/40 px-1.5 py-0.5 rounded animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> ANOMALI SUHU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                      <span className={bay.temperature > bay.targetTemp.max ? 'text-rose-400 font-bold' : 'text-sky-300'}>
                        {bay.temperature}°C
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Terisi: {bay.occupiedPallets}/{bay.capacityPallets} Palet</span>
                    <span className="text-slate-300 font-medium">
                      {bay.items.length > 0 ? bay.items[0].sku : 'Kosong'}
                    </span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${bay.temperature > bay.targetTemp.max ? 'bg-rose-500' : 'bg-sky-500'}`}
                      style={{ width: `${Math.round((bay.occupiedPallets / bay.capacityPallets) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Halal Ambient Storage Zone (Middle 5 cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Zona Rak Halal Dedicated Ambient (A & B)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-300">HAS 23000 Standard</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Penyimpanan bahan nabati, minyak sawit, bumbu, & karton box food-grade. Larangan: penempatan di bawah barang non-halal.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {ambientBays.map((bay) => (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBay(bay)}
                  className="p-3 rounded-lg bg-slate-900/90 border border-emerald-900/60 hover:border-emerald-500 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{bay.code}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{bay.temperature}°C</span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    <p className="truncate font-medium text-slate-200">
                      {bay.items.length > 0 ? bay.items[0].name : 'Slot Tersedia'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {bay.occupiedPallets}/{bay.capacityPallets} Palet ({Math.round((bay.occupiedPallets / bay.capacityPallets) * 100)}%)
                    </p>
                  </div>

                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${Math.round((bay.occupiedPallets / bay.capacityPallets) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 3 cols: Quarantine & Non-Halal Isolation */}
          <div className="lg:col-span-3 space-y-4">
            {/* Quarantine Bay */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Karantina Mutlak (Q-01)
                  </h3>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Untuk barang belum terverifikasi halal, sertifikat kedaluwarsa, atau kemasan rusak/diduga terkontaminasi.
              </p>

              {quarantineBays.map((bay) => (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBay(bay)}
                  className="p-3 rounded-lg bg-slate-900/90 border border-amber-600/70 hover:border-amber-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{bay.code}</span>
                    <span className="text-[10px] text-amber-400 font-semibold px-1 bg-amber-950 rounded">TERISOLASI</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 truncate">
                    {bay.items.length > 0 ? bay.items[0].name : 'Kosong'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Palet: {bay.occupiedPallets}/{bay.capacityPallets}
                  </p>
                </div>
              ))}
            </div>

            {/* Non-Halal Segregated Room */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Segregasi Non-Halal (NH-01)
                </h3>
                <span className="text-[10px] text-rose-300">Sekat Dinding Kedap</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Pemisahan fisik total sesuai UU JPH Pasal 21. Tidak ada aliran udara atau saluran pembuangan bersama.
              </p>

              {nonHalalBays.map((bay) => (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBay(bay)}
                  className="p-2.5 rounded-lg bg-slate-900/90 border border-rose-900 hover:border-rose-500 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300">{bay.code}</span>
                    <span className="text-xs text-slate-400">{bay.occupiedPallets} Palet</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sertu / Samak Decontamination Station */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">Stasiun Sertu & Sanitasi</span>
                <p className="text-[10px] text-slate-400">Pencucian Najis Mughallazah (Air + Tanah)</p>
              </div>
              <span className="text-[10px] text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                Siap Pakai
              </span>
            </div>
          </div>
        </div>

        {/* LIVE SIMULATION EVENT ACTIVITY LOG FEED */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Log Aliran Operasional Gudang Real-Time (Live Activity Stream)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Auto-scrolling telemetry</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto">
            {eventLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-[11px] py-1 border-b border-slate-900 last:border-none">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={
                  log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-sky-300'
                }>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Zona Halal Ambient</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500/30 border border-sky-500" />
              <span>Zona Cold Chain Halal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
              <span>Karantina Khusus (Quarantine)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" />
              <span>Segregasi Non-Halal</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Klik pada salah satu Bay untuk melihat isi palet & sertifikasi BPJPH</span>
          </div>
        </div>
      </div>

      {/* Selected Bay Modal / Detail Panel */}
      {selectedBay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Inspektur Bay: {selectedBay.code}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getZoneBadgeStyle(selectedBay.zone)}`}>
                    {getZoneLabel(selectedBay.zone)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Kapasitas: {selectedBay.occupiedPallets} / {selectedBay.capacityPallets} Palet · Suhu Terpantau: {selectedBay.temperature}°C · Kelembaban: {selectedBay.humidity}%
                </p>
              </div>
              <button
                onClick={() => setSelectedBay(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory Stored */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Daftar Barang (SKU Terdaftar di Bay Ini)
              </h4>

              {selectedBay.items.length === 0 ? (
                <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg text-sm">
                  Tidak ada barang di bay ini saat ini (Slot Kosong).
                </div>
              ) : (
                selectedBay.items.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.name}</span>
                          <span className="text-xs font-mono text-emerald-400">{item.sku}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Lot: {item.batchLot} · Kadaluwarsa: {item.expiryDate} · Muatan: {item.quantity} {item.unit}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setRelocateModalItem({ item, fromBayId: selectedBay.id });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors self-start sm:self-center"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Pindahkan (Relokasi)</span>
                      </button>
                    </div>

                    {/* Halal Certificate Verification Box */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-slate-200">
                            Sertifikat Halal: {item.halalCert.certNumber}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            item.halalCert.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                              : 'bg-rose-950 text-rose-400 border border-rose-700'
                          }`}>
                            {item.halalCert.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1">
                          Penerbit: {item.halalCert.issuer} · Standar: {item.halalCert.standard} · Berlaku s/d: {item.halalCert.validUntil}
                        </p>
                        <p className="text-slate-400 text-[10px] italic mt-0.5">
                          "{item.halalCert.auditorNotes}"
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">RFID Tag</span>
                        <span className="font-mono text-[11px] text-slate-300">{item.rfidTag}</span>
                      </div>
                    </div>

                    {item.allergenAlert && (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{item.allergenAlert}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Simulation Testing Actions for Students */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newTemp = selectedBay.temperature > 10 ? -20 : 15;
                    onUpdateBay(selectedBay.id, { temperature: newTemp });
                    setSelectedBay({ ...selectedBay, temperature: newTemp });
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
                >
                  Ganti Suhu Uji ({selectedBay.temperature > 10 ? 'Mode Dingin -20°C' : 'Mode Hangat +15°C'})
                </button>
              </div>

              <button
                onClick={() => setSelectedBay(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relocate Modal (Put-away simulation) */}
      {relocateModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Simulasi Relokasi Pallet (WMS Put-away)
            </h3>
            <p className="text-xs text-slate-400">
              Pindahkan <strong>{relocateModalItem.item.name}</strong> ke rak tujuan. Perhatikan aturan segregasi halal agar tidak terjadi pelanggaran kontaminasi silang!
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Pilih Bay Rak Tujuan:</label>
              <select
                value={targetBayId}
                onChange={(e) => setTargetBayId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Pilih Rak Tujuan --</option>
                {bays
                  .filter((b) => b.id !== relocateModalItem.fromBayId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} ({getZoneLabel(b.zone)}) - Kapasitas sisa: {b.capacityPallets - b.occupiedPallets}
                    </option>
                  ))}
              </select>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded text-xs text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Catatan Praktikum: Memindahkan barang non-halal/karantina ke zona halal akan memicu penurunan Halal Compliance Score dan kegagalan audit.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRelocateModalItem(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded"
              >
                Batal
              </button>
              <button
                disabled={!targetBayId}
                onClick={handleExecuteRelocate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded"
              >
                Konfirmasi Pemindahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
