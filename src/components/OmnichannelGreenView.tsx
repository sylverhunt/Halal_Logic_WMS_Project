import React, { useState, useEffect } from 'react';
import { VehicleFleet } from '../types/logistics';
import { calculateCarbonEmissionsKg } from '../utils/logisticsFormulas';
import { 
  Truck, 
  Leaf, 
  BatteryCharging, 
  Package, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Layers, 
  Clock,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  Navigation
} from 'lucide-react';

interface OmnichannelGreenViewProps {
  fleet: VehicleFleet[];
  onDispatchFleet: (vehicleId: string) => void;
}

export const OmnichannelGreenView: React.FC<OmnichannelGreenViewProps> = ({
  fleet,
  onDispatchFleet
}) => {
  // Green Logistics Carbon Sandbox states
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(850);
  const [wavePickingActive, setWavePickingActive] = useState<boolean>(false);
  const [waveProgress, setWaveProgress] = useState<number>(68);

  // Active Vehicle Route Simulation
  const [activeTransitVehicle, setActiveTransitVehicle] = useState<VehicleFleet | null>(fleet[0] || null);
  const [transitProgress, setTransitProgress] = useState<number>(35);
  const [isTransitRunning, setIsTransitRunning] = useState<boolean>(true);
  const [transitBattery, setTransitBattery] = useState<number>(88);
  const [transitReeferTemp, setTransitReeferTemp] = useState<number>(-19.4);

  // Emissions calculations
  const dieselEmissions = calculateCarbonEmissionsKg(distanceKm, 0.82);
  const evEmissions = calculateCarbonEmissionsKg(distanceKm, 0.18);
  const eBikeEmissions = calculateCarbonEmissionsKg(distanceKm, 0.04);
  const carbonSavedKg = +(dieselEmissions - evEmissions).toFixed(2);
  const treesEquivalent = +(carbonSavedKg / 1.8).toFixed(1); // approx 1.8kg CO2 per tree-month

  // Automatic journey movement ticker
  useEffect(() => {
    if (!isTransitRunning) return;
    const timer = setInterval(() => {
      setTransitProgress(prev => {
        if (prev >= 98) {
          return 5; // loop back to DC
        }
        return prev + 3;
      });

      // minor sensor jitter
      setTransitReeferTemp(prev => {
        const jitter = +( (Math.random() - 0.5) * 0.2 ).toFixed(1);
        return Math.min(-18.2, Math.max(-21.0, +(prev + jitter).toFixed(1)));
      });

      setTransitBattery(prev => (prev <= 20 ? 98 : prev - 0.2));
    }, 800);

    return () => clearInterval(timer);
  }, [isTransitRunning]);

  const handleStartFleetSimulation = (vehicle: VehicleFleet) => {
    setActiveTransitVehicle(vehicle);
    setTransitProgress(10);
    setIsTransitRunning(true);
    onDispatchFleet(vehicle.id);
  };

  const handleResetFleetSimulation = () => {
    setTransitProgress(0);
    setIsTransitRunning(false);
    setTransitBattery(98);
    setTransitReeferTemp(-20.0);
    setWaveProgress(0);
    setWavePickingActive(false);
    setDistanceKm(45);
    setCargoWeightKg(850);
  };

  const handleTriggerWave = () => {
    setWavePickingActive(true);
    setWaveProgress(15);
    const interval = setInterval(() => {
      setWaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setWavePickingActive(false);
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const getTransitLocationName = (pct: number) => {
    if (pct < 20) return 'Gerbang Keluar Halal DC (Staging)';
    if (pct < 45) return 'Jalan Tol Lingkar Luar Km 18 (Koridor Dingin)';
    if (pct < 70) return 'Urban Micro-Hub Serpong (Sortir Last-Mile)';
    if (pct < 90) return 'Menuju Gerai Hypermarket / Konsumen Akhir';
    return 'Tiba di Lokasi Tujuan (Selesai Kirim)';
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span>Omnichannel Logistics & Green E-Logistics (Topik 6 & 8)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen pemenuhan pesanan multikanal (B2B Hypermarket & B2C E-Commerce), armada listrik ramah lingkungan, dan kalkulator jejak emisi karbon ($CO_2e$).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerWave}
            disabled={wavePickingActive}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>{wavePickingActive ? 'Proses Wave Picking...' : 'Lepas Wave Picking Omnichannel'}</span>
          </button>

          <button
            onClick={handleResetFleetSimulation}
            title="Reset simulasi pergerakan armada dan gelombang wave picking"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Armada & Rute</span>
          </button>
        </div>
      </div>

      {/* Wave Picking Status Strip if active or recent */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Wave Fulfillment #W-2026-X:</span>
            <span className="text-slate-400">450 Order B2C E-Commerce + 12 Pallet B2B Superindo</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">{waveProgress}% Selesai</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${waveProgress}%` }}
          />
        </div>
      </div>

      {/* VISIBLE ACTIVE LAST-MILE DELIVERY ROUTE TRACKER ARENA */}
      <div className="p-5 bg-slate-900 border border-emerald-500/40 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Simulasi Rute Pengiriman Last-Mile Real-Time (GPS & E-Seal Tracking)
              </h3>
              <p className="text-xs text-slate-400">
                Kendaraan Aktif:{' '}
                <strong className="text-white">
                  {activeTransitVehicle?.plateNumber} (
                  {activeTransitVehicle?.type === 'ELECTRIC_VAN' ? 'Electric Cargo Van' : 'Cargo E-Bike'}
                  )
                </strong>{' '}
                · Menuju: <strong className="text-emerald-400">{activeTransitVehicle?.destination}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTransitRunning(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow ${
                isTransitRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isTransitRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTransitRunning ? 'Jeda Rute' : 'Jalankan Rute'}</span>
            </button>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 font-bold">
              {transitProgress}% Perjalanan
            </span>
          </div>
        </div>

        {/* Graphical Animated Delivery Map Track */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-hidden">
          {/* Waypoints Header */}
          <div className="relative h-14 flex items-center">
            {/* Road bar */}
            <div className="absolute inset-x-0 h-2 bg-slate-800 border-t border-b border-dashed border-slate-600 rounded" />

            {/* Waypoints */}
            <div className="absolute inset-x-0 flex justify-between items-center px-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-900 border-2 border-emerald-400 flex items-center justify-center" />
                <span className="text-[10px] text-emerald-300 font-bold mt-1">Gudang DC</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center" />
                <span className="text-[10px] text-cyan-300 font-bold mt-1">Tol Lingkar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-sky-900 border-2 border-sky-400 flex items-center justify-center" />
                <span className="text-[10px] text-sky-300 font-bold mt-1">Urban Hub</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-900 border-2 border-amber-400 flex items-center justify-center" />
                <span className="text-[10px] text-amber-300 font-bold mt-1">Superindo Retail</span>
              </div>
            </div>

            {/* Moving Vehicle */}
            <div
              className="absolute z-10 transition-all duration-700 ease-linear flex flex-col items-center -translate-x-1/2"
              style={{ left: `${transitProgress}%` }}
            >
              <div className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded shadow-lg flex items-center gap-1 whitespace-nowrap animate-bounce">
                <span>🚚 {activeTransitVehicle?.plateNumber}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Telematics Bar */}
          <div className="mt-4 pt-3 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Lokasi Real-Time:</span>
              <span className="font-semibold text-white truncate block">{getTransitLocationName(transitProgress)}</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Suhu Box Reefer:</span>
              <span className="font-mono font-bold text-cyan-400">{transitReeferTemp}°C (Aman)</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Baterai EV:</span>
              <span className="font-mono font-bold text-emerald-400">{Math.round(transitBattery)}%</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Status Segel Halal:</span>
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>E-Seal Terkunci</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Green Logistics CO2e Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Simulasi Rute & Emisi Karbon (Green Last-Mile)</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Jarak Pengiriman Last-Mile (Km)</span>
                <span className="font-mono text-emerald-400 font-semibold">{distanceKm} Km</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Jarak tempuh rute pengantaran ke gerai perkotaan</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Berat Muatan Kargo (Kg)</span>
                <span className="font-mono text-emerald-400 font-semibold">{cargoWeightKg.toLocaleString()} Kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={cargoWeightKg}
                onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Kapasitas angkut dingin terisolasi</span>
            </div>

            {/* Packaging sustainability */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Indeks Kemasan Berkelanjutan (Packaging):</span>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Reusable Insulated Thermal Tote:</span>
                <span className="text-emerald-400 font-semibold">-85% Limbah Plastik</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Karton Biodegradable Kraft Halal:</span>
                <span className="text-emerald-400 font-semibold">100% Dapat Didaur Ulang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Emission Comparison (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4" />
              <span>Komparasi Emisi Transportasi (kg CO2e)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">GHG Protocol Scope 1 & 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Diesel Truck */}
            <div className="p-3.5 bg-slate-950 border border-rose-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Truk Diesel Konvensional</span>
              <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {dieselEmissions} <span className="text-xs text-slate-400 font-sans">kg CO2e</span>
              </div>
              <p className="text-[10px] text-slate-500">Faktor: 0.82 kg/km</p>
            </div>

            {/* Electric Van */}
            <div className="p-3.5 bg-slate-950 border border-emerald-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Electric Cargo Van (EV)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {evEmissions} <span className="text-xs text-slate-400 font-sans">kg CO2e</span>
              </div>
              <p className="text-[10px] text-slate-500">Faktor: 0.18 kg/km (-78%)</p>
            </div>

            {/* Cargo E-Bike */}
            <div className="p-3.5 bg-slate-950 border border-sky-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Cargo E-Bike (Ultra-Green)</span>
              <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                {eBikeEmissions} <span className="text-xs text-slate-400 font-sans">kg CO2e</span>
              </div>
              <p className="text-[10px] text-slate-500">Faktor: 0.04 kg/km (-95%)</p>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-600/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-emerald-400 block">
                Penghematan Emisi dengan Transisi Armada Listrik:
              </span>
              <p className="text-slate-300 mt-0.5">
                Mengurangi <strong>{carbonSavedKg} kg CO2e</strong> per rute pengantaran, setara dengan menyerap karbon oleh <strong>{treesEquivalent} pohon dewasa</strong> per bulan.
              </p>
            </div>
            <div className="shrink-0 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700 rounded text-emerald-300 font-semibold text-center">
              Target Net-Zero Logistik 2030
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Halal Fleet Monitoring */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Armada Transportasi & Distribusi Halal Terdedikasi (HAS 23000 & SNI 99004)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total Kendaraan: {fleet.length} Unit · Klik untuk simulasikan perjalanan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((veh) => (
            <div
              key={veh.id}
              onClick={() => handleStartFleetSimulation(veh)}
              className={`p-4 bg-slate-950 border rounded-xl space-y-3 cursor-pointer transition-all hover:border-emerald-500 ${
                activeTransitVehicle?.id === veh.id ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">{veh.plateNumber}</span>
                  <span className="text-[11px] text-slate-400">
                    {veh.type === 'ELECTRIC_VAN' ? 'Electric Cargo Van' : veh.type === 'CARGO_EBIKE' ? 'E-Bike Delivery' : 'Diesel Reefer Truck'}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  veh.status === 'TRANSIT' 
                    ? 'border-sky-700 bg-sky-950 text-sky-400' 
                    : veh.status === 'LOADING'
                    ? 'border-amber-700 bg-amber-950 text-amber-400'
                    : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}>
                  {veh.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Muatan:</span>
                  <span className="font-mono">{veh.currentLoadKg}/{veh.capacityKg} kg</span>
                </div>
                {veh.currentTempCelsius !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suhu Reefer:</span>
                    <span className="font-mono text-cyan-400 font-semibold">{veh.currentTempCelsius}°C</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Tujuan:</span>
                  <span className="text-white truncate max-w-[130px]">{veh.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Halal:</span>
                  <span className="text-emerald-400 font-semibold">Tersertifikasi (Bebas Najis)</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartFleetSimulation(veh);
                }}
                className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Simulasikan Perjalanan Rute Ini</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
