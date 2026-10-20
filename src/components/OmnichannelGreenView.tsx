import React, { useState } from 'react';
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
  ArrowRight
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

  // Emissions calculations
  const dieselEmissions = calculateCarbonEmissionsKg(distanceKm, 0.82);
  const evEmissions = calculateCarbonEmissionsKg(distanceKm, 0.18);
  const eBikeEmissions = calculateCarbonEmissionsKg(distanceKm, 0.04);
  const carbonSavedKg = +(dieselEmissions - evEmissions).toFixed(2);
  const treesEquivalent = +(carbonSavedKg / 1.8).toFixed(1); // approx 1.8kg CO2 per tree-month

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

        <button
          onClick={handleTriggerWave}
          disabled={wavePickingActive}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Layers className="w-4 h-4" />
          <span>{wavePickingActive ? 'Proses Wave Picking...' : 'Lepas Wave Picking Omnichannel'}</span>
        </button>
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
          <span className="text-xs text-slate-400">Total Kendaraan: {fleet.length} Unit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((veh) => (
            <div
              key={veh.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
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
                onClick={() => onDispatchFleet(veh.id)}
                className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Simulasikan Pergerakan Rute</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
