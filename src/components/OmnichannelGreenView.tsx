import React, { useState, useEffect, useMemo } from 'react';
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
  Navigation,
  AlertTriangle,
  Radio,
  Gauge,
  Thermometer,
  Lock,
  Unlock,
  Building2,
  Store,
  Home,
  RefreshCw,
  SunMedium,
  Boxes,
  Award,
  FileCheck
} from 'lucide-react';

interface OmnichannelGreenViewProps {
  fleet: VehicleFleet[];
  onDispatchFleet: (vehicleId: string) => void;
}

export const OmnichannelGreenView: React.FC<OmnichannelGreenViewProps> = ({
  fleet,
  onDispatchFleet
}) => {
  // Vehicle Selection & Telematics
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(fleet[0]?.id || 'EV-01');
  const activeVehicle = fleet.find(v => v.id === selectedVehicleId) || fleet[0];

  // Route Simulation Progress & Controls
  const [routeProgress, setRouteProgress] = useState<number>(28); // 0 - 100%
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1); // 1x, 2x, 4x
  const [isTrafficJam, setIsTrafficJam] = useState<boolean>(false);
  const [isDoorBreached, setIsDoorBreached] = useState<boolean>(false);
  const [ecoModeActive, setEcoModeActive] = useState<boolean>(true);

  // Dynamic Telemetry States
  const [batteryPercent, setBatteryPercent] = useState<number>(86);
  const [reeferTemp, setReeferTemp] = useState<number>(-19.6);
  const [speedKmh, setSpeedKmh] = useState<number>(58);
  const [regenActive, setRegenActive] = useState<boolean>(false);
  const [odometerKm, setOdometerKm] = useState<number>(14.8);
  const [tripDistanceTotalKm, setTripDistanceTotalKm] = useState<number>(45);

  // Omnichannel Wave Picking Fulfillment States
  const [waveFulfillmentActive, setWaveFulfillmentActive] = useState<boolean>(false);
  const [waveStage, setWaveStage] = useState<number>(2); // 1: Ingestion, 2: Batching, 3: Green Pack, 4: Staging
  const [packagingType, setPackagingType] = useState<'STYROFOAM' | 'BIO_CORRUGATED' | 'RETURNABLE_TOTE'>('BIO_CORRUGATED');
  const [showEcoCertModal, setShowEcoCertModal] = useState<boolean>(false);

  // Dynamic calculations based on user sandbox
  const distanceCovered = +((routeProgress / 100) * tripDistanceTotalKm).toFixed(1);
  const distanceRemaining = +(tripDistanceTotalKm - distanceCovered).toFixed(1);

  // Packaging Carbon factor (kg CO2e per shipment)
  const packagingEmissionKg = packagingType === 'STYROFOAM' ? 1.25 : packagingType === 'BIO_CORRUGATED' ? 0.28 : 0.04;
  const packagingPlasticSavedPct = packagingType === 'STYROFOAM' ? 0 : packagingType === 'BIO_CORRUGATED' ? 75 : 98;

  // Transport Emissions
  const dieselFactor = 0.82;
  const evFactor = ecoModeActive ? 0.16 : 0.21;
  const totalDieselEmissions = +(dieselFactor * tripDistanceTotalKm).toFixed(2);
  const totalEvEmissions = +(evFactor * tripDistanceTotalKm + packagingEmissionKg).toFixed(2);
  const carbonSavedKg = Math.max(0, +(totalDieselEmissions - totalEvEmissions).toFixed(2));
  const treesEquivalent = +(carbonSavedKg / 1.8).toFixed(1);
  const fuelCostDieselIDR = Math.round((tripDistanceTotalKm / 8.5) * 16800); // 8.5 km/L Dexlite @ Rp16.800
  const electricityCostEVIDR = Math.round((tripDistanceTotalKm * 0.22) * 1700); // 0.22 kWh/km @ Rp1.700/kWh PLN
  const costSavingsIDR = fuelCostDieselIDR - electricityCostEVIDR;

  // Real-time Simulation Loop
  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      setRouteProgress(prev => {
        let step = (isTrafficJam ? 0.5 : 1.2) * simSpeedMultiplier;
        let next = prev + step;
        if (next >= 100) {
          return 0; // cycle back to DC
        }
        return +next.toFixed(1);
      });

      // Update Odometer
      setOdometerKm(prev => +(prev + (isTrafficJam ? 0.05 : 0.2) * simSpeedMultiplier).toFixed(1));

      // Realistic speed variation
      setSpeedKmh(prev => {
        if (isTrafficJam) return Math.floor(12 + Math.random() * 6);
        const base = ecoModeActive ? 55 : 68;
        return Math.floor(base + (Math.random() - 0.5) * 8);
      });

      // Battery & Regenerative Braking
      setBatteryPercent(prev => {
        // Slow down section triggers regen
        if (routeProgress > 65 && routeProgress < 72) {
          setRegenActive(true);
          return Math.min(100, +(prev + 0.05).toFixed(2));
        } else {
          setRegenActive(false);
          const drain = (ecoModeActive ? 0.04 : 0.07) * (isTrafficJam ? 0.5 : 1.0);
          return prev <= 10 ? 95 : +(prev - drain).toFixed(2);
        }
      });

      // Reefer Thermal Dynamics
      setReeferTemp(prev => {
        if (isDoorBreached) {
          // Rapid temperature increase when door opened
          return Math.min(-6.0, +(prev + 0.35).toFixed(1));
        } else {
          // Re-chill back down to setpoint -20°C
          if (prev > -19.5) {
            return +(prev - 0.2).toFixed(1);
          }
          const jitter = (Math.random() - 0.5) * 0.15;
          return +(-19.8 + jitter).toFixed(1);
        }
      });

    }, 1000 / simSpeedMultiplier);

    return () => clearInterval(interval);
  }, [isSimRunning, simSpeedMultiplier, isTrafficJam, isDoorBreached, ecoModeActive, routeProgress]);

  // Handle vehicle change
  const handleSelectVehicle = (vehId: string) => {
    setSelectedVehicleId(vehId);
    setRouteProgress(5);
    onDispatchFleet(vehId);
  };

  // Reset simulation handler
  const handleResetEverything = () => {
    setRouteProgress(0);
    setIsSimRunning(false);
    setIsTrafficJam(false);
    setIsDoorBreached(false);
    setBatteryPercent(92);
    setReeferTemp(-20.2);
    setSpeedKmh(0);
    setRegenActive(false);
    setOdometerKm(0);
    setTripDistanceTotalKm(45);
    setWaveStage(1);
    setWaveFulfillmentActive(false);
    setPackagingType('BIO_CORRUGATED');
  };

  // Run Wave Picking Animation
  const handleTriggerWavePicking = () => {
    setWaveFulfillmentActive(true);
    setWaveStage(1);
    let stage = 1;
    const waveInterval = setInterval(() => {
      stage += 1;
      if (stage > 4) {
        clearInterval(waveInterval);
        setWaveFulfillmentActive(false);
        setWaveStage(4);
      } else {
        setWaveStage(stage);
      }
    }, 1200);
  };

  // Helper: Current geographical milestone
  const getCurrentMilestone = (pct: number) => {
    if (pct < 15) {
      return {
        name: 'Gerbang Outbound Halal Central DC (Cikarang)',
        type: 'HUB',
        desc: 'Verifikasi RFID Gate, segel digital E-Seal aktif, suhu awal -20.4°C.'
      };
    }
    if (pct < 45) {
      return {
        name: 'Jalan Tol Jakarta - Cikampek Km 24 (Koridor Cepat)',
        type: 'HIGHWAY',
        desc: 'Jalur jelajah kecepatan 65 km/h, inverter kompresor reefer aktif efisiensi tinggi.'
      };
    }
    if (pct < 68) {
      return {
        name: 'Interchange Cikunir & Tol Lingkar Luar JORR',
        type: 'INTERCHANGE',
        desc: 'Zona pengereman regeneratif (+2.4 kW energi kembali ke baterai EV).'
      };
    }
    if (pct < 88) {
      return {
        name: 'Urban Micro-Hub Halal (Jakarta Selatan)',
        type: 'MICRO_HUB',
        desc: 'Cross-docking B2C: Pemisahan paket kurir E-Bike dan pengantaran supermarket.'
      };
    }
    return {
      name: 'Gerai Superindo Hypermarket & Residensial Konsumen',
      type: 'DESTINATION',
      desc: 'Bongkar muat palet dingin & serah terima QR sertifikat BPJPH.'
    };
  };

  const currentMilestone = useMemo(() => getCurrentMilestone(routeProgress), [routeProgress]);

  // Coordinate math for 2.5D SVG Path
  // Path points:
  // Node 1 (DC Cikarang): (80, 220)
  // Curve 1 (Tol Japek): (240, 160)
  // Curve 2 (Cikunir Interchange): (450, 190)
  // Node 3 (Urban Micro Hub): (660, 110)
  // Node 4 (Superindo / Consumer): (860, 160)
  const svgPathD = "M 80 220 C 180 180, 240 140, 360 150 C 460 160, 530 220, 640 180 C 720 150, 780 100, 880 140";

  // Interpolate 2D position for vehicle marker along the curve
  const vehiclePos = useMemo(() => {
    const p = routeProgress / 100;
    // Approximating bezier curve coordinate for SVG canvas (960 x 300)
    let x = 80 + p * (880 - 80);
    // Sine wave modulation to simulate realistic winding highway curves
    let y = 200 - Math.sin(p * Math.PI * 2.2) * 55 - (p * 40);
    return { x: Math.min(880, Math.max(80, x)), y: Math.min(260, Math.max(90, y)) };
  }, [routeProgress]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Green Logistics & Omnichannel Fulfillment Digital Twin</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  TOP-GRADE SIMULATOR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulasi realistis armada rantai dingin bertenaga listrik (EV), integrasi telematika GPS, pemenuhan pesanan multikanal (B2B & B2C), dan audit jejak karbon ($CO_2e$).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowEcoCertModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-700/60 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Sertifikat Reduksi Karbon</span>
          </button>

          <button
            onClick={handleResetEverything}
            title="Reset seluruh simulasi rute, baterai, telemetri, dan pesanan kembali ke kondisi nol"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Simulasi Lengkap</span>
          </button>
        </div>
      </div>

      {/* 1. REALISTIC GIS 2.5D GPS ROUTE ARENA */}
      <div className="p-5 bg-slate-900 border-2 border-emerald-500/40 rounded-2xl space-y-4 shadow-xl">
        {/* Top Control Bar of GIS Map */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Peta Koridor Logistik Metropolitan (Real-Time GPS Telematics)
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSimRunning ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isSimRunning ? '● LIVE TRACKING' : '⏸ PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rute: <strong className="text-slate-200">DC Halal Cikarang ➔ Tol JORR ➔ Urban Micro-Hub ➔ Superindo Mall</strong>
              </p>
            </div>
          </div>

          {/* Map Interactive Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setSimSpeedMultiplier(1)}
                className={`px-2 py-1 rounded ${simSpeedMultiplier === 1 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSimSpeedMultiplier(2)}
                className={`px-2 py-1 rounded ${simSpeedMultiplier === 2 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                2x
              </button>
              <button
                onClick={() => setSimSpeedMultiplier(4)}
                className={`px-2 py-1 rounded ${simSpeedMultiplier === 4 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                4x
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsSimRunning(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow ${
                isSimRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimRunning ? 'Jeda Rute' : 'Lanjutkan Rute'}</span>
            </button>

            {/* Traffic Jam Toggle */}
            <button
              onClick={() => setIsTrafficJam(prev => !prev)}
              title="Simulasikan kemacetan jalan tol untuk menguji efisiensi baterai EV vs idling diesel"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                isTrafficJam 
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span>🚗 {isTrafficJam ? 'Kemacetan Aktif (15 km/h)' : 'Simulasi Macet'}</span>
            </button>

            {/* Door Breach Alarm Trigger */}
            <button
              onClick={() => setIsDoorBreached(prev => !prev)}
              title="Uji insiden pelanggaran SOP: Pintu reefer dibuka saat transit"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                isDoorBreached 
                  ? 'bg-rose-600 text-white border-rose-500 animate-bounce' 
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isDoorBreached ? '⚠️ PINTU TERBUKA (BAHAYA)!' : 'Uji Buka Pintu Reefer'}</span>
            </button>
          </div>
        </div>

        {/* 2.5D SVG HIGHWAY TOPOLOGICAL MAP */}
        <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden min-h-[300px]">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* SVG Map Canvas */}
          <svg className="w-full h-64 md:h-72 overflow-visible relative z-10" viewBox="0 0 960 280">
            {/* Background Highway Glow / Outline */}
            <path
              d={svgPathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Main Road Surface */}
            <path
              d={svgPathD}
              fill="none"
              stroke={isTrafficJam ? '#991b1b' : '#334155'}
              strokeWidth="20"
              strokeLinecap="round"
              className="transition-colors duration-500"
            />
            {/* Center Dashed Highway Line */}
            <path
              d={svgPathD}
              fill="none"
              stroke={isTrafficJam ? '#fca5a5' : '#10b981'}
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* NODE 1: Halal DC Cikarang */}
            <g transform="translate(80, 220)">
              <circle r="30" fill="#064e3b" opacity="0.4" className="animate-ping" />
              <circle r="18" fill="#047857" stroke="#34d399" strokeWidth="3" />
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">🏢</text>
              <text x="0" y="32" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">1. Halal Central DC</text>
              <text x="0" y="45" textAnchor="middle" fill="#94a3b8" fontSize="9">Origin & Cold Staging</text>
            </g>

            {/* NODE 2: Tol Japek & Cikunir Interchange */}
            <g transform="translate(420, 160)">
              <circle r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">🛣️</text>
              <text x="0" y="26" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">2. Tol JORR Km 18</text>
              <text x="0" y="38" textAnchor="middle" fill="#94a3b8" fontSize="8.5">Telematics Corridor</text>
            </g>

            {/* NODE 3: Urban Micro-Hub (Jakarta Selatan) */}
            <g transform="translate(660, 165)">
              <circle r="16" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#c084fc" fontSize="13">⚡</text>
              <text x="0" y="28" textAnchor="middle" fill="#d8b4fe" fontSize="10" fontWeight="bold">3. Urban Micro-Hub</text>
              <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8.5">B2C Sortir & DC Fast Charger</text>
            </g>

            {/* NODE 4: Destination Superindo Hypermarket */}
            <g transform="translate(880, 140)">
              <circle r="22" fill="#065f46" stroke="#10b981" strokeWidth="3" />
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="15">🏪</text>
              <text x="0" y="32" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">4. Superindo Retail</text>
              <text x="0" y="45" textAnchor="middle" fill="#94a3b8" fontSize="9">B2B Receiving & Konsumen</text>
            </g>

            {/* LIVE MOVING VEHICLE MARKER */}
            <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`} className="transition-all duration-300">
              {/* Radar pulse around truck */}
              <circle r="26" fill={isDoorBreached ? '#e11d48' : '#10b981'} opacity="0.3" className="animate-ping" />
              
              {/* Vehicle Body Box */}
              <rect x="-24" y="-14" width="48" height="28" rx="8" fill="#0f172a" stroke={isDoorBreached ? '#f43f5e' : '#34d399'} strokeWidth="2.5" />
              
              {/* Vehicle Icon */}
              <text x="-4" y="5" textAnchor="middle" fontSize="14">
                {activeVehicle.type === 'CARGO_EBIKE' ? '🚲' : '🚚'}
              </text>

              {/* Status Badge Tag above truck */}
              <g transform="translate(0, -22)">
                <rect x="-42" y="-12" width="84" height="16" rx="4" fill="#020617" stroke="#475569" strokeWidth="1" />
                <text x="0" y="0" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  {activeVehicle.plateNumber}
                </text>
              </g>
            </g>
          </svg>

          {/* Door Breach Alarm Warning Overlay */}
          {isDoorBreached && (
            <div className="absolute top-4 left-4 right-4 p-3 bg-rose-950/90 border-2 border-rose-500 rounded-xl text-white flex items-center justify-between shadow-2xl animate-pulse z-20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-200">
                    ALARM KRITIS: Sensor E-Seal Mendeteksi Pintu Reefer Dibuka di Jalan!
                  </h4>
                  <p className="text-[11px] text-rose-300">
                    Suhu kompartemen naik pesat! Risiko kontaminasi dan pencairan daging halal. Segera tutup pintu dan re-verifikasi segel.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDoorBreached(false)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow"
              >
                Tutup & Kunci Kembali E-Seal
              </button>
            </div>
          )}

          {/* Milestone Details Card */}
          <div className="mt-2 p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Posisi Aktual Kendaraan:</span>
                <span className="font-bold text-white text-sm">{currentMilestone.name}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{currentMilestone.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block">Jarak Ditempuh:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {distanceCovered} / {tripDistanceTotalKm} km
                </span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-400 block">Kemajuan Rute:</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {routeProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LIVE TELEMETRY COCKPIT & VEHICLE TELEMATICS HUD */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Speedometer */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>KECEPATAN</span>
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
              <span>{speedKmh}</span>
              <span className="text-[10px] font-sans text-slate-400">km/h</span>
            </div>
            <span className={`text-[9px] font-semibold block ${isTrafficJam ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isTrafficJam ? 'Macet Merayap' : 'Jelajah Lancar'}
            </span>
          </div>

          {/* Reefer Temperature */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>SUHU REEFER</span>
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className={`text-xl font-bold font-mono flex items-baseline gap-1 ${
              reeferTemp > -18 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
            }`}>
              <span>{reeferTemp}</span>
              <span className="text-[10px] font-sans text-slate-400">°C</span>
            </div>
            <span className={`text-[9px] font-semibold block ${reeferTemp > -18 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {reeferTemp > -18 ? '⚠️ MELEBIHI BATAS CCP!' : '✓ Beku Optimal'}
            </span>
          </div>

          {/* Battery State of Charge */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>BATERAI EV</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
              <span>{Math.round(batteryPercent)}</span>
              <span className="text-[10px] font-sans text-slate-400">%</span>
            </div>
            {regenActive ? (
              <span className="text-[9px] font-bold text-emerald-300 animate-pulse flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> +2.4kW REGEN
              </span>
            ) : (
              <span className="text-[9px] text-slate-400">Jangkauan: ~180 km</span>
            )}
          </div>

          {/* Smart Halal E-Seal */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>SMART E-SEAL</span>
              {isDoorBreached ? <Unlock className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-sm font-bold font-mono text-white truncate">
              {isDoorBreached ? 'TERBUKA' : 'TERKUNCI'}
            </div>
            <span className={`text-[9px] font-mono block truncate ${isDoorBreached ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
              {isDoorBreached ? 'HASH INVALID' : 'SHA256: 0x9B1..2C'}
            </span>
          </div>

          {/* Eco Mode State */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>MODE MENGEMUDI</span>
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <button
              onClick={() => setEcoModeActive(prev => !prev)}
              className="w-full text-left font-mono font-bold text-sm text-white hover:text-emerald-400 transition-colors"
            >
              {ecoModeActive ? '🌱 ECO DRIVE' : '⚡ SPORT DRIVE'}
            </button>
            <span className="text-[9px] text-slate-400 block">
              {ecoModeActive ? 'Regen Max (-24% kWh)' : 'Daya Penuh'}
            </span>
          </div>

          {/* Carbon Offset Current Trip */}
          <div className="p-3 bg-slate-950 border border-emerald-900/40 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>EMISI TERHEMAT</span>
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
              <span>{carbonSavedKg}</span>
              <span className="text-[10px] font-sans text-slate-400">kg CO2</span>
            </div>
            <span className="text-[9px] text-emerald-300 block">
              ≈ {treesEquivalent} Pohon/Bulan
            </span>
          </div>
        </div>
      </div>

      {/* 3. OMNICHANNEL B2B & B2C SPLIT FULFILLMENT SIMULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fulfillment Pipeline (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Omnichannel Dual-Channel Fulfillment (B2B Bulk vs B2C E-Commerce)
                </h3>
                <p className="text-xs text-slate-400">
                  Alur pemenuhan pesanan terintegrasi dari batching, sortir, hingga green packaging.
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerWavePicking}
              disabled={waveFulfillmentActive}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${waveFulfillmentActive ? 'animate-spin' : ''}`} />
              <span>{waveFulfillmentActive ? 'Memproses Wave...' : 'Jalankan Siklus Wave Picking'}</span>
            </button>
          </div>

          {/* 4-Stage Stepper of Omnichannel Wave */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border text-center transition-all ${
              waveStage >= 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[10px] opacity-75 block">TAHAP 1</span>
              <span className="font-bold text-[11px] block mt-0.5">Order Ingestion</span>
              <span className="text-[9px] text-slate-400 block mt-1">450 B2C + 12 Palet B2B</span>
            </div>

            <div className={`p-2.5 rounded-lg border text-center transition-all ${
              waveStage >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[10px] opacity-75 block">TAHAP 2</span>
              <span className="font-bold text-[11px] block mt-0.5">Wave Batching</span>
              <span className="text-[9px] text-slate-400 block mt-1">AS/RS Automated Pick</span>
            </div>

            <div className={`p-2.5 rounded-lg border text-center transition-all ${
              waveStage >= 3 ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[10px] opacity-75 block">TAHAP 3</span>
              <span className="font-bold text-[11px] block mt-0.5">Green Packaging</span>
              <span className="text-[9px] text-slate-400 block mt-1">Insulasi Dingin Bio</span>
            </div>

            <div className={`p-2.5 rounded-lg border text-center transition-all ${
              waveStage >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[10px] opacity-75 block">TAHAP 4</span>
              <span className="font-bold text-[11px] block mt-0.5">Outbound Dispatch</span>
              <span className="text-[9px] text-slate-400 block mt-1">Dimuat ke Armada EV</span>
            </div>
          </div>

          {/* Dual Channel Live Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            {/* B2B Supermarket Channel */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Kanal B2B (Supermarket & Retail)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Bulk Pallet</span>
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• Muatan: 12 Palet Daging Beku & Olahan Halal</li>
                <li>• Kendaraan: Mitsubishi Fuso eCanter 3.5T Reefer</li>
                <li>• Validasi: SIHALAL BPJPH Batch Electronic Waybill</li>
                <li>• Kemasan: Palet Kayu ISPM-15 + Thermal Pallet Blanket</li>
              </ul>
            </div>

            {/* B2C E-Commerce Channel */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-sky-400" />
                  <span>Kanal B2C (Direct-to-Consumer E-Commerce)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Micro Parcel</span>
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• Muatan: 450 Parcel Retail (Tokopedia, Shopee, App)</li>
                <li>• Kendaraan: BYD T3 Cargo Van & Selis Cargo E-Bike</li>
                <li>• Validasi: QR Code Sertifikasi Halal pada Kemasan Konsumen</li>
                <li>• Kemasan: Insulasi Kardus Biodegradable + Dry Ice Food Grade</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Green Packaging & LCA Material Selector (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>Simulasi Material Kemasan Ramah Lingkungan</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Pilih material insulasi termal kemasan dingin untuk melihat dampaknya terhadap jejak karbon ($CO_2e$) dan limbah:
          </p>

          <div className="space-y-2 text-xs">
            {/* Option 1: Styrofoam Box */}
            <div
              onClick={() => setPackagingType('STYROFOAM')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                packagingType === 'STYROFOAM'
                  ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/40'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">1. Box EPS Styrofoam Konvensional</span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">1.25 kg CO2e</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Murah, namun tidak dapat terurai secara alami (500 tahun) dan memicu penumpukan limbah mikroplastik.
              </p>
            </div>

            {/* Option 2: Bio-Corrugated Box (Recommended) */}
            <div
              onClick={() => setPackagingType('BIO_CORRUGATED')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                packagingType === 'BIO_CORRUGATED'
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">2. Box Kardus Kraft + Insulasi Miselium (Rekomendasi)</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">0.28 kg CO2e (-78%)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                100% biodegradable dan dapat dikomposkan dalam 45 hari. Kemampuan isolasi termal setara dengan styrofoam.
              </p>
            </div>

            {/* Option 3: Returnable Smart Tote */}
            <div
              onClick={() => setPackagingType('RETURNABLE_TOTE')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                packagingType === 'RETURNABLE_TOTE'
                  ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/40'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-300">3. Returnable Smart Tote Bersegel IoT (Sirkular)</span>
                <span className="text-[10px] font-mono text-sky-400 font-bold">0.04 kg CO2e (-96%)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tote box plastik daur ulang dapat digunakan berulang hingga 120 siklus pengantaran dengan pelacakan RFID.
              </p>
            </div>
          </div>

          {/* Current Material Impact Summary */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Pengurangan Limbah Kemasan:</span>
              <span className="font-bold text-emerald-400">{packagingPlasticSavedPct}% Bebas Sampah</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sertifikasi Ramah Lingkungan:</span>
              <span className="font-semibold text-white">ISO 14040 Life Cycle Assessment</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FLEET SELECTION & DEDICATED HALAL VEHICLES */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Daftar Armada Transportasi Dingin Terdedikasi Halal (HAS 23000 & SNI 99004)
              </h3>
              <p className="text-xs text-slate-400">
                Pilih kendaraan untuk mengaktifkan telemetri dan menjalankan simulasi di peta di atas:
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">Tersedia: {fleet.length} Unit Armada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((veh) => {
            const isSelected = selectedVehicleId === veh.id;
            return (
              <div
                key={veh.id}
                onClick={() => handleSelectVehicle(veh.id)}
                className={`p-4 bg-slate-950 border rounded-xl space-y-3 cursor-pointer transition-all hover:border-emerald-500 ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-white block">{veh.plateNumber}</span>
                    <span className="text-[11px] text-slate-400">
                      {veh.type === 'ELECTRIC_VAN' ? '⚡ Electric Cargo Van' : veh.type === 'CARGO_EBIKE' ? '🚲 Cargo E-Bike Micro' : '🚛 Diesel Reefer Truck'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    isSelected ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {isSelected ? 'SEDANG AKTIF' : veh.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kapasitas Muat:</span>
                    <span className="font-mono">{veh.currentLoadKg}/{veh.capacityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suhu Reefer Box:</span>
                    <span className="font-mono text-cyan-400 font-bold">{veh.currentTempCelsius || -20.0}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tujuan:</span>
                    <span className="text-white truncate max-w-[130px] font-medium">{veh.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Halal:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Suci
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectVehicle(veh.id);
                  }}
                  className={`w-full mt-2 py-1.5 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 shadow ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Sedang Dilacak di Peta' : 'Pilih & Simulasikan Rute'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FINANCIAL & ENVIRONMENTAL ROI CALCULATOR */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Kalkulator Dampak Ekonomi & Lingkungan (ROI Transisi Green Fleet)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Berdasarkan Trip {tripDistanceTotalKm} Km</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400 block text-[11px]">Biaya Solar Truk Diesel:</span>
            <div className="text-lg font-bold font-mono text-rose-400">
              Rp {fuelCostDieselIDR.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500">Konsumsi 8.5 km/L @ Dexlite Rp16.800</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400 block text-[11px]">Biaya Listrik Armada EV:</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              Rp {electricityCostEVIDR.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500">Konsumsi 0.22 kWh/km @ Listrik PLN Bisnis</p>
          </div>

          <div className="p-4 bg-slate-950 border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-slate-400 block text-[11px]">Penghematan Biaya per Rute:</span>
            <div className="text-lg font-bold font-mono text-emerald-300">
              Rp {costSavingsIDR.toLocaleString()} (-{Math.round((costSavingsIDR / fuelCostDieselIDR) * 100)}%)
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">Efisiensi operasional sangat tinggi</p>
          </div>

          <div className="p-4 bg-slate-950 border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-slate-400 block text-[11px]">Pengurangan Jejak Karbon:</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {carbonSavedKg} kg CO2e
            </div>
            <p className="text-[10px] text-slate-400">Setara {treesEquivalent} pohon serap karbon</p>
          </div>
        </div>
      </div>

      {/* MODAL: ECO CARBON CERTIFICATE */}
      {showEcoCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Sertifikat Kepatuhan Green Logistics</h3>
                  <p className="text-xs text-slate-400">Sertifikasi Praktikum Dekarbonisasi Rantai Pasok</p>
                </div>
              </div>
              <button
                onClick={() => setShowEcoCertModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 text-xs">
              <div className="text-center space-y-1 border-b border-slate-800 pb-3">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                  KAMPUS MERDEKA LOGISTIK HIJAU
                </span>
                <h4 className="text-base font-bold text-white">HASIL AUDIT EMISI KARBON</h4>
                <p className="text-slate-400 text-[11px]">No. Registrasi: CERT-ECO-2026-X981</p>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Kendaraan Beroperasi:</span>
                  <span className="font-mono text-white">{activeVehicle.plateNumber} ({activeVehicle.type})</span>
                </div>
                <div className="flex justify-between">
                  <span>Jarak Jelajah Rute:</span>
                  <span className="font-mono text-white">{tripDistanceTotalKm} Km</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Kemasan:</span>
                  <span className="font-semibold text-emerald-400">{packagingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emisi Karbon Terhindar:</span>
                  <span className="font-mono text-emerald-400 font-bold">{carbonSavedKg} kg CO2e</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Operasional Terhemat:</span>
                  <span className="font-mono text-emerald-400 font-bold">Rp {costSavingsIDR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Kepatuhan Halal:</span>
                  <span className="font-bold text-emerald-400">100% Bebas Najis & Cold Chain Terjaga</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEcoCertModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Cetak Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
