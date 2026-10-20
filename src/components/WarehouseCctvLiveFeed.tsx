import React, { useState, useEffect } from 'react';
import {
  Video,
  Camera,
  Scan,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Layers,
  Crosshair,
  Cpu,
  Flame,
  ThermometerSnowflake,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Activity,
  CheckCircle2,
  Wifi,
  Sparkles
} from 'lucide-react';
import warehouseDigitalTwinImg from '../assets/images/warehouse_digital_twin_iso_1791795136928.jpg';

interface WarehouseCctvLiveFeedProps {
  simSeconds: number;
  agvPositionPercent: number;
  simulationRunning: boolean;
  simulationSpeed: number;
  onAddEventLog?: (log: { id: string; time: string; text: string; type: 'success' | 'info' | 'warning' }) => void;
}

export type CctvCameraId = 'CAM-01' | 'CAM-02' | 'CAM-03' | 'CAM-04';
export type VisionFilterMode = 'RGB' | 'IR_NIGHT' | 'FLIR_THERMAL' | 'AI_EDGE';

export const WarehouseCctvLiveFeed: React.FC<WarehouseCctvLiveFeedProps> = ({
  simSeconds,
  agvPositionPercent,
  simulationRunning,
  simulationSpeed,
  onAddEventLog
}) => {
  const [activeCamera, setActiveCamera] = useState<CctvCameraId>('CAM-01');
  const [visionFilter, setVisionFilter] = useState<VisionFilterMode>('RGB');
  const [aiBoundingBoxes, setAiBoundingBoxes] = useState<boolean>(true);
  const [laserScanActive, setLaserScanActive] = useState<boolean>(true);
  const [isAutoPatrol, setIsAutoPatrol] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.12);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [detectedAnomaly, setDetectedAnomaly] = useState<boolean>(false);
  const [msTicker, setMsTicker] = useState<number>(128);
  const [confidenceScore, setConfidenceScore] = useState<number>(99.4);
  const [fpsVal, setFpsVal] = useState<number>(29.9);

  // Microsecond ticker for ultra-realistic CCTV timestamp and fluctuating telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setMsTicker(prev => (prev + 37) % 1000);
      if (Math.random() < 0.2) {
        setConfidenceScore(+(98.6 + Math.random() * 1.2).toFixed(1));
        setFpsVal(+(29.6 + Math.random() * 0.6).toFixed(1));
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // Glitch effect on camera change
  const handleSwitchCamera = (camId: CctvCameraId) => {
    if (camId === activeCamera) return;
    setIsGlitching(true);
    setActiveCamera(camId);
    setTimeout(() => {
      setIsGlitching(false);
    }, 280);
  };

  // PTZ Joystick handlers
  const handlePan = (dx: number, dy: number) => {
    setIsAutoPatrol(false);
    setPanOffset(prev => ({
      x: Math.max(-25, Math.min(25, prev.x + dx)),
      y: Math.max(-20, Math.min(20, prev.y + dy))
    }));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(1.0, Math.min(1.8, +(prev + delta).toFixed(2))));
  };

  const handleResetPTZ = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1.12);
    setIsAutoPatrol(true);
  };

  const handleTriggerAnomalyTest = () => {
    setDetectedAnomaly(true);
    if (onAddEventLog) {
      const now = new Date().toTimeString().split(' ')[0];
      onAddEventLog({
        id: Date.now().toString(),
        time: now,
        text: `⚠️ CCTV ${activeCamera} ALARM: Deteksi kontaminan mencurigakan tanpa label BPJPH!`,
        type: 'warning'
      });
    }
  };

  const handleResolveAnomaly = () => {
    setDetectedAnomaly(false);
    if (onAddEventLog) {
      const now = new Date().toTimeString().split(' ')[0];
      onAddEventLog({
        id: Date.now().toString(),
        time: now,
        text: `CCTV ${activeCamera}: Objek asing berhasil dialihkan ke Karantina Bay Q-01. Area steril.`,
        type: 'success'
      });
    }
  };

  // Time format helper
  const hours = Math.floor(simSeconds / 3600) % 24;
  const minutes = Math.floor((simSeconds % 3600) / 60);
  const seconds = simSeconds % 60;
  const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${msTicker.toString().padStart(3, '0')}`;

  // AGV Position in CCTV Frame based on simulation percentage
  // AGV moves horizontally across the bottom third of the camera feed
  const agvVisualX = 10 + (agvPositionPercent % 100) * 0.75; // 10% to 85%
  const palletVisualX = (15 + ((agvPositionPercent * 1.4) % 75)); // Pallet on conveyor 15% to 90%

  // Coordinates indicator tracking moving targets
  const trackingCoordX = Math.round(280 + agvVisualX * 3.4);
  const trackingCoordY = Math.round(activeCamera === 'CAM-02' ? 180 + Math.sin(simSeconds) * 15 : 240);

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-950 shadow-2xl">
      {/* CCTV Top Control Bar */}
      <div className="p-3 bg-slate-900/95 border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div className="leading-tight">
              <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                <span>AI VISION & CCTV 4K LIVE STREAM</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                  60 FPS ACTIVE
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                PST-WMS-CAM-{activeCamera.split('-')[1]} · PROTOCOL: RTSP/H.265 SECURE
              </div>
            </div>
          </div>

          {/* Camera Selection Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { id: 'CAM-01', label: '📹 CAM-01', desc: 'Dock 1 Inbound & RFID Gantry' },
              { id: 'CAM-02', label: '📹 CAM-02', desc: 'Cold Room AS/RS (-20°C)' },
              { id: 'CAM-03', label: '📹 CAM-03', desc: 'AGV Robot High-Speed Corridor' },
              { id: 'CAM-04', label: '📹 CAM-04', desc: 'Outbound EV Staging & E-Seal' }
            ].map(cam => (
              <button
                key={cam.id}
                onClick={() => handleSwitchCamera(cam.id as CctvCameraId)}
                title={cam.desc}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  activeCamera === cam.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/50 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vision Filter & AI Feature Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Vision Mode Selectors */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setVisionFilter('RGB')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                visionFilter === 'RGB' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RGB Warna
            </button>
            <button
              onClick={() => setVisionFilter('IR_NIGHT')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                visionFilter === 'IR_NIGHT' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Infrared IR
            </button>
            <button
              onClick={() => setVisionFilter('FLIR_THERMAL')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                visionFilter === 'FLIR_THERMAL' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FLIR Termal
            </button>
            <button
              onClick={() => setVisionFilter('AI_EDGE')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                visionFilter === 'AI_EDGE' ? 'bg-cyan-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cyber Edge
            </button>
          </div>

          {/* AI Bounding Box & Laser Scan Toggles */}
          <button
            onClick={() => setAiBoundingBoxes(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
              aiBoundingBoxes
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            AI Deteksi: {aiBoundingBoxes ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setLaserScanActive(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
              laserScanActive
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Laser Scan
          </button>

          {/* Auto Patrol Toggle */}
          <button
            onClick={() => setIsAutoPatrol(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
              isAutoPatrol
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            PTZ Patrol: {isAutoPatrol ? 'AKTIF' : 'MANUAL'}
          </button>
        </div>
      </div>

      {/* Main Live Video Feed Screen */}
      <div className="relative h-64 sm:h-72 md:h-84 lg:h-96 overflow-hidden bg-slate-950 select-none">
        {/* Background Warehouse Image with Camera Pan/Tilt/Zoom */}
        <div
          className={`w-full h-full relative transition-transform duration-300 ease-out ${
            isAutoPatrol ? 'animate-cctv-patrol' : ''
          }`}
          style={{
            transform: !isAutoPatrol
              ? `scale(${zoomLevel}) translate(${panOffset.x}%, ${panOffset.y}%)`
              : undefined
          }}
        >
          <img
            src={warehouseDigitalTwinImg}
            alt="Live CCTV Camera Feed"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.includes('warehouse_digital_twin.jpg')) {
                target.src = '/warehouse_digital_twin.jpg';
              }
            }}
            className={`w-full h-full object-cover transition-all duration-700 ${
              activeCamera === 'CAM-01'
                ? 'object-left brightness-95'
                : activeCamera === 'CAM-02'
                ? 'object-top brightness-90'
                : activeCamera === 'CAM-03'
                ? 'object-center brightness-95'
                : 'object-right brightness-90'
            } ${
              visionFilter === 'IR_NIGHT'
                ? 'grayscale contrast-150 brightness-110 hue-rotate-90 sepia-[0.35]'
                : visionFilter === 'FLIR_THERMAL'
                ? 'invert hue-rotate-180 contrast-125 saturate-200'
                : visionFilter === 'AI_EDGE'
                ? 'contrast-200 brightness-75 saturate-150'
                : ''
            }`}
          />

          {/* Filter Visual Overlays */}
          {visionFilter === 'IR_NIGHT' && (
            <div className="absolute inset-0 bg-emerald-950/30 mix-blend-color-dodge pointer-events-none" />
          )}

          {visionFilter === 'FLIR_THERMAL' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-purple-900/20 to-orange-500/40 mix-blend-screen pointer-events-none" />
          )}

          {visionFilter === 'AI_EDGE' && (
            <div className="absolute inset-0 border-[3px] border-cyan-500/20 pointer-events-none" />
          )}

          {/* DYNAMIC MOVING OBJECT 1: Animated High-Bay Automated Guided Vehicle (AGV-04) */}
          <div
            className="absolute transition-all duration-300 ease-linear pointer-events-none z-10"
            style={{
              left: `${agvVisualX}%`,
              bottom: activeCamera === 'CAM-02' ? '28%' : '20%',
              transform: 'translate(-50%, 0)'
            }}
          >
            {/* 360-degree LiDAR Radar Sweeping Beam */}
            <div className="relative w-28 h-28 -top-10 -left-6 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-emerald-400/30 animate-ping opacity-25" />
              <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40 bg-emerald-950/10" />
              <div
                className="absolute w-24 h-24 rounded-full animate-radar-sweep pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(16, 185, 129, 0.45) 0deg, rgba(16, 185, 129, 0) 75deg, transparent 75deg)'
                }}
              />

              {/* Physical AGV Vehicle Body Graphic */}
              <div className="relative z-10 p-1.5 rounded-lg bg-slate-900/90 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-center flex flex-col items-center">
                {/* Flashing Amber Warning Beacon */}
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_#f59e0b] -top-2 relative" />

                {/* Cargo Pallet Loaded on AGV */}
                <div className="w-12 h-6 rounded bg-amber-800/80 border border-amber-600 flex items-center justify-center shadow-inner text-[9px] font-bold text-white mb-1">
                  <span className="text-[8px] bg-emerald-600 px-1 rounded text-white font-mono">HALAL</span>
                </div>

                {/* AGV Chassis with mecanum wheels */}
                <div className="w-14 h-4 rounded bg-slate-800 border border-emerald-500 flex items-center justify-between px-1 text-[8px] font-mono text-emerald-300 font-bold">
                  <span>◀</span>
                  <span>AGV-04</span>
                  <span>▶</span>
                </div>

                {/* Forward Projecting Headlight Beams */}
                <div className="absolute -right-10 top-3 w-12 h-8 bg-gradient-to-r from-emerald-400/40 via-emerald-300/10 to-transparent blur-xs transform -skew-y-6 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DYNAMIC MOVING OBJECT 2: Continuous Inbound Pallet Conveyor Line (Visible in CAM-01 & CAM-03) */}
          {(activeCamera === 'CAM-01' || activeCamera === 'CAM-03') && (
            <div className="absolute left-0 bottom-4 w-full h-10 pointer-events-none flex items-center">
              {/* Conveyor Bed with Moving Rollers texture */}
              <div className="w-full h-3 bg-slate-800/90 border-y border-slate-600 animate-conveyor-roll bg-[linear-gradient(90deg,#334155_50%,#1e293b_50%)] bg-[size:16px_100%]" />

              {/* Moving Pallet on Conveyor */}
              <div
                className="absolute transition-all duration-300 ease-linear -top-6"
                style={{
                  left: `${palletVisualX}%`,
                  transform: 'translate(-50%, 0)'
                }}
              >
                <div className="p-1 bg-amber-900/90 border border-amber-500 rounded shadow-lg flex items-center gap-1">
                  <div className="w-6 h-4 bg-emerald-700 rounded text-[7px] text-white font-bold flex items-center justify-center">
                    BPJPH
                  </div>
                  <div className="text-[8px] font-mono text-amber-200 whitespace-nowrap">
                    #LOT-{simSeconds % 999}
                  </div>
                </div>
              </div>

              {/* RFID Gantry Portal Laser Scan Plane */}
              <div className="absolute left-1/3 -top-12 h-16 w-8 border-2 border-dashed border-emerald-400/80 bg-emerald-950/20 rounded flex items-center justify-center">
                <div className="w-full h-[2px] bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              </div>
            </div>
          )}

          {/* DYNAMIC MOVING OBJECT 3: Cold Room Frost Mist & AS/RS Lift (Visible in CAM-02) */}
          {activeCamera === 'CAM-02' && (
            <>
              {/* Drifting Translucent Cold Vapor Mist */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sky-400/20 via-sky-300/10 to-transparent animate-vapor-drift pointer-events-none blur-sm" />

              {/* AS/RS Crane Lift Mast Moving Up/Down */}
              <div
                className="absolute right-1/4 w-12 border-l-2 border-r-2 border-sky-400/60 bg-sky-950/20 pointer-events-none flex flex-col justify-end"
                style={{
                  top: '10%',
                  bottom: '15%'
                }}
              >
                {/* Moving Carriage Carriage */}
                <div
                  className="w-full p-1 bg-sky-900/80 border-2 border-sky-400 rounded text-center transition-all duration-1000"
                  style={{
                    transform: `translateY(${-((simSeconds * 12) % 180)}px)`
                  }}
                >
                  <span className="text-[8px] font-mono text-sky-200 block font-bold">AS/RS FORK</span>
                  <span className="text-[7px] text-white bg-sky-600 px-1 rounded">-20.4°C</span>
                </div>
              </div>

              {/* Thermal Hot/Cold Gradient Sidebar Indicator in FLIR mode */}
              <div className="absolute right-4 top-16 bottom-16 w-3 rounded-full bg-gradient-to-t from-blue-700 via-cyan-400 via-yellow-400 to-rose-600 border border-white/40 p-0.5 flex flex-col justify-between text-[8px] text-white font-mono pointer-events-none">
                <span>+30°</span>
                <span>0°</span>
                <span>-25°</span>
              </div>
            </>
          )}

          {/* DYNAMIC MOVING OBJECT 4: Outbound Electric Truck E-Seal Sensor Gate (CAM-04) */}
          {activeCamera === 'CAM-04' && (
            <div className="absolute right-12 bottom-12 p-3 bg-amber-950/60 border-2 border-amber-400 rounded-xl pointer-events-none flex items-center gap-3 shadow-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center animate-ping">
                <Wifi className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-amber-200 font-bold">RFID E-SEAL SCANNER #04</div>
                <div className="text-[9px] text-emerald-300">STATUS: TERKUNCI RAPAT (0x8F..21)</div>
                <div className="text-[8px] text-slate-300">INTEGRITAS SUHU REEFER: AMAN (-19.8°C)</div>
              </div>
            </div>
          )}
        </div>

        {/* Scanline CRT Texture Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40 z-20" />

        {/* Continuous AI Vision Laser Scanning Bar */}
        {laserScanActive && (
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-cctv-scan pointer-events-none z-20" />
        )}

        {/* Temporary Glitch Flash when Switching Cameras */}
        {isGlitching && (
          <div className="absolute inset-0 bg-slate-900/90 z-40 flex items-center justify-center pointer-events-none">
            <div className="w-full h-1 bg-emerald-400 animate-pulse shadow-[0_0_20px_#10b981]" />
            <span className="absolute font-mono text-emerald-400 text-xs tracking-widest animate-ping">
              SWITCHING FREQUENCY {activeCamera}...
            </span>
          </div>
        )}

        {/* HUD OVERLAY: Real-time Camera Telemetry */}
        <div className="absolute inset-0 pointer-events-none p-3 sm:p-4 flex flex-col justify-between z-20">
          {/* Top Bar: Camera Info & AI Engine Status */}
          <div className="flex justify-between items-start gap-2">
            {/* Top Left: Camera Spec Box */}
            <div className="p-2 sm:p-2.5 bg-slate-950/85 border border-emerald-500/80 rounded-xl backdrop-blur-md text-[10px] sm:text-[11px] space-y-0.5 text-emerald-300 font-mono shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white tracking-wide">
                  {activeCamera} LIVE FEED (1080p @ {fpsVal} FPS)
                </span>
              </div>
              <div className="text-slate-300">
                WAKTU: <span className="text-white font-bold">{timeFormatted}</span> · LATENSI: 11ms
              </div>
              <div className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                LOKASI:{' '}
                {activeCamera === 'CAM-01'
                  ? 'RECEIVING DOCK 1 (HALAL PORTAL)'
                  : activeCamera === 'CAM-02'
                  ? 'COLD STORAGE HIGH-BAY (CCP-3)'
                  : activeCamera === 'CAM-03'
                  ? 'AGV AUTONOMOUS HIGHWAY 02'
                  : 'OUTBOUND EV DISPATCH RAMP'}
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 pt-0.5">
                <span>FILTER: {visionFilter}</span>
                <span>·</span>
                <span>PTZ: {isAutoPatrol ? 'PATROL RUNNING' : `ZOOM ${zoomLevel}x`}</span>
              </div>
            </div>

            {/* Top Right: AI Vision Recognition Engine */}
            <div className="p-2 sm:p-2.5 bg-slate-950/85 border border-cyan-500/80 rounded-xl backdrop-blur-md text-[10px] sm:text-[11px] text-cyan-300 font-mono shadow-2xl text-right">
              <div className="font-bold text-white flex items-center justify-end gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>YOLO-v10 LOGISTICS HALAL</span>
              </div>
              <div>
                AKURASI DETEKSI: <span className="text-cyan-200 font-bold">{confidenceScore}%</span>
              </div>
              <div>OBJEK AKTIF: {aiBoundingBoxes ? '4 TRACKING BOXES' : 'STANDBY'}</div>
              <div className="text-slate-400">STATUS BUFFER: ZERO PACKET LOSS</div>
            </div>
          </div>

          {/* CENTER: Dynamic Moving AI Bounding Boxes Following Real Objects */}
          {aiBoundingBoxes && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Dynamic Tracking Reticle Following AGV */}
              <div
                className="absolute transition-all duration-300 ease-out p-2 border-2 border-emerald-400 bg-emerald-950/30 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] backdrop-blur-xs flex flex-col items-center"
                style={{
                  left: `${agvVisualX}%`,
                  bottom: activeCamera === 'CAM-02' ? '32%' : '26%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Corner reticle tick marks */}
                <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black tracking-tight">
                  [OBJECT #1: AGV-04]
                </span>
                <span className="text-[10px] font-bold text-white whitespace-nowrap mt-0.5">
                  MHE CARRIER · 1.4 m/s
                </span>
                <span className="text-[9px] text-emerald-200 font-mono">
                  LiDAR: BEBAS HAMBATAN · 94%
                </span>
              </div>

              {/* Camera 2 Specific Thermal CCP Bounding Box */}
              {activeCamera === 'CAM-02' && (
                <div className="absolute top-1/4 right-1/4 p-2.5 border-2 border-sky-400 bg-sky-950/50 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.5)] backdrop-blur-xs text-center space-y-0.5 animate-in zoom-in-95">
                  <span className="text-[9px] font-mono bg-sky-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    [CCP-3 THERMAL SENSOR C-01]
                  </span>
                  <div className="text-xs font-bold text-white">Suhu Titik Kritis: -20.4°C</div>
                  <div className="text-[9px] text-sky-200 font-mono">
                    STATUS: AMAN (&le; -18°C) · FROZEN MEAT
                  </div>
                </div>
              )}

              {/* Camera 1 Specific Inbound RFID Bounding Box */}
              {activeCamera === 'CAM-01' && (
                <div className="absolute top-1/4 left-1/4 p-2.5 border-2 border-emerald-400 bg-emerald-950/50 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] backdrop-blur-xs text-center space-y-0.5 animate-in zoom-in-95">
                  <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    [RFID GATEWAY #01]
                  </span>
                  <div className="text-xs font-bold text-white">SKU: Daging Sapi Australia Halal</div>
                  <div className="text-[9px] text-emerald-200 font-mono">
                    BPJPH: #ID0091000041289 · STATUS: VALID ✓
                  </div>
                </div>
              )}

              {/* Camera 4 Specific Outbound Reefer Bounding Box */}
              {activeCamera === 'CAM-04' && (
                <div className="absolute top-1/3 left-1/3 p-2.5 border-2 border-amber-400 bg-amber-950/50 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] backdrop-blur-xs text-center space-y-0.5 animate-in zoom-in-95">
                  <span className="text-[9px] font-mono bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    [ARMADA DINGIN: EV-01 BYD]
                  </span>
                  <div className="text-xs font-bold text-white">E-Seal: TERKUNCI (0x9B1..2C)</div>
                  <div className="text-[9px] text-amber-200 font-mono">
                    Bongkar Muat Superindo · BEBAS KONTAMINASI
                  </div>
                </div>
              )}

              {/* SIMULATED AI ANOMALY ALERT BOUNDING BOX */}
              {detectedAnomaly && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-rose-950/80 border-2 border-rose-500 rounded-xl text-center space-y-1 shadow-[0_0_30px_rgba(244,63,94,0.8)] backdrop-blur-md animate-bounce z-30">
                  <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-ping" />
                    <span>⚠️ PERINGATAN KRITIS: KONTAMINASI DETEKSI AI!</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    Objek Tak Dikenal Tanpa Barcode Halal di Jalur Konveyor
                  </div>
                  <div className="text-[10px] text-rose-300 font-mono">
                    Klausul HAS 23000: Karantina Segera Diperlukan
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Bar: Crosshairs, Dynamic Coordinates & Telemetry */}
          <div className="flex justify-between items-end text-[9px] sm:text-[10px] text-slate-300 font-mono pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Crosshair className="w-3.5 h-3.5 animate-spin" />
                <span>
                  TARGET TRACKING: [X: {trackingCoordX}, Y: {trackingCoordY}]
                </span>
              </div>
              <div className="hidden sm:inline text-slate-400">
                FOV: 84° · APERTURE: f/1.8 · BITRATE: 6.4 Mb/s
              </div>
            </div>

            <div className="text-right flex items-center gap-2">
              <span className="hidden md:inline text-emerald-400 font-bold">
                HALALLOGIX CONTROL TOWER
              </span>
              <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                JAKARTA HUB DC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CCTV Bottom Interactive Deck: PTZ Joystick Controls & Anomaly Simulator */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* PTZ Joystick Control Cluster */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono hidden sm:inline">
            Kontrol PTZ Kamera:
          </span>

          {/* Directional Pad */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handlePan(-5, 0)}
              title="Pan Kiri"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePan(0, -5)}
              title="Tilt Atas"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePan(0, 5)}
              title="Tilt Bawah"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePan(5, 0)}
              title="Pan Kanan"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleZoom(0.1)}
              title="Zoom In"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              title="Zoom Out"
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetPTZ}
              title="Reset Sudut & Aktifkan Patrol"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            Zoom: {zoomLevel}x
          </span>
        </div>

        {/* Anomaly Testing & Action Buttons */}
        <div className="flex items-center gap-2">
          {!detectedAnomaly ? (
            <button
              onClick={handleTriggerAnomalyTest}
              className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-700/80 text-rose-300 hover:bg-rose-900 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>🚨 Uji Simulasi Anomali AI</span>
            </button>
          ) : (
            <button
              onClick={handleResolveAnomaly}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-900/50 animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>⛔ Eksekusi Karantina Bay Q-01 & Reset Alarm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
