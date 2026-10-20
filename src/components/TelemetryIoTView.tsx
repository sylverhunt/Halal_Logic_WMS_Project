import React, { useState } from 'react';
import { IoTSensorNode } from '../types/logistics';
import { 
  Activity, 
  Thermometer, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sliders, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  RefreshCw,
  Cpu,
  Zap,
  BatteryCharging,
  WifiOff
} from 'lucide-react';

interface TelemetryIoTViewProps {
  sensors: IoTSensorNode[];
  onTriggerAnomaly: (type: 'COLD_CHAIN' | 'QUARANTINE_SPILL' | 'EXPIRED_CERT') => void;
  onResetSensors: () => void;
}

export const TelemetryIoTView: React.FC<TelemetryIoTViewProps> = ({
  sensors,
  onTriggerAnomaly,
  onResetSensors
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>(sensors[0]?.id || 'SENS-01');
  const [testTempValue, setTestTempValue] = useState<number>(-20.4);
  const [isPacketLossActive, setIsPacketLossActive] = useState<boolean>(false);
  const [isLowBatteryActive, setIsLowBatteryActive] = useState<boolean>(false);

  const selectedSensor = sensors.find(s => s.id === selectedSensorId) || sensors[0];

  const handleResetAllTelemetry = () => {
    setTestTempValue(-20.4);
    setIsPacketLossActive(false);
    setIsLowBatteryActive(false);
    onResetSensors();
  };

  const getStatusBadge = (status: IoTSensorNode['status']) => {
    switch (status) {
      case 'NOMINAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> NOMINAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> PERINGATAN
          </span>
        );
      case 'ALERT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2 py-0.5 rounded animate-pulse">
            <AlertTriangle className="w-3 h-3" /> KRITIS ANOMALI
          </span>
        );
    }
  };

  const isColdViolated = testTempValue > -18.0;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-950/50 border border-sky-800/50 text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                IoT Telemetry Stream & Big Data Analytics (Topik Pembelajaran 3)
              </h2>
              <p className="text-xs text-slate-400">
                Pemantauan telemetri rantai dingin, sensor getaran AGV, gerbang RFID, dan integritas segel digital (E-Seal).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTriggerAnomaly('COLD_CHAIN')}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Uji Anomali Suhu Cold Storage (-6.5°C)</span>
          </button>
          <button
            onClick={handleResetAllTelemetry}
            title="Reset seluruh parameter sensor telemetri ke kondisi awal"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Normal Telemetri</span>
          </button>
        </div>
      </div>

      {/* Big Data Analytics KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400">Cold Chain Integrity Rate</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${isColdViolated ? 'text-rose-400' : 'text-white'}`}>
              {isColdViolated ? '74.2%' : '99.8%'}
            </span>
            <span className={`text-xs font-medium ${isColdViolated ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isColdViolated ? 'Melanggar SLA' : 'SLA Terpenuhi'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Batas toleransi maksimal deviasi: 15 menit</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400">Kecepatan Pembacaan RFID Inbound</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">42 tag/detik</span>
          </div>
          <p className="text-[10px] text-slate-500">Akurasi deteksi sertifikat BPJPH: 100%</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400">Konektivitas Node Gateway</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${isPacketLossActive ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isPacketLossActive ? 'Degraded (40%)' : '99.9%'}
            </span>
            <span className="text-xs text-slate-400 font-mono">LoRaWAN + MQTT</span>
          </div>
          <p className="text-[10px] text-slate-500">Protokol industri IEC 62443</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400">Total Data Telemetri Terarsip</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">1.42 M</span>
            <span className="text-xs text-slate-400">Data Points</span>
          </div>
          <p className="text-[10px] text-slate-500">Sinkron ke Apache Kafka & Blockchain</p>
        </div>
      </div>

      {/* INTERACTIVE SENSOR SIMULATION CONSOLE & LIVE WAVEFORM */}
      <div className="p-5 bg-slate-900 border border-cyan-500/30 rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Konsol Uji Eksperimen Sensor Interaktif Mahasiswa
              </h3>
              <p className="text-xs text-slate-400">
                Uji langsung pengaruh deviasi suhu dingin terhadap status kepatuhan CCP-3 dan peringatan WMS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPacketLossActive(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isPacketLossActive
                  ? 'bg-amber-600 text-white border-amber-500 shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{isPacketLossActive ? 'Simulasi Gangguan Sinyal Aktif' : 'Uji Sinyal Hilang (Packet Loss)'}</span>
            </button>

            <button
              onClick={() => setIsLowBatteryActive(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isLowBatteryActive
                  ? 'bg-amber-600 text-white border-amber-500 shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{isLowBatteryActive ? 'Baterai Sensor 8%' : 'Uji Baterai Lemah'}</span>
            </button>
          </div>
        </div>

        {/* Live Slider & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Slider Control (5 cols) */}
          <div className="lg:col-span-5 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Slider Eksperimen Suhu Probe C-01:
              </span>
              <span className={`text-base font-bold font-mono tabular-nums ${isColdViolated ? 'text-rose-400' : 'text-emerald-400'}`}>
                {testTempValue.toFixed(1)} °C
              </span>
            </div>

            <input
              type="range"
              min="-25"
              max="5"
              step="0.5"
              value={testTempValue}
              onChange={(e) => setTestTempValue(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-25°C (Deep Freeze)</span>
              <span className="text-amber-400 font-bold">-18°C (Batas Kritis CCP-3)</span>
              <span>+5°C (Chilled/Danger)</span>
            </div>

            {/* Instant Reaction Alert Box */}
            <div className={`p-3.5 rounded-lg text-xs border ${
              isColdViolated
                ? 'bg-rose-950/50 border-rose-600 text-rose-200 animate-pulse'
                : 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
            }`}>
              <div className="flex items-start gap-2">
                {isColdViolated ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {isColdViolated
                      ? 'PERINGATAN KRITIS: Pelanggaran Titik Kendali Kritis (CCP-3)!'
                      : 'Kondisi Suhu Dingin Ideal (Standar SNI 99004:2021)'}
                  </span>
                  <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                    {isColdViolated
                      ? 'Suhu berada di atas -18°C! Sistem WMS memicu alarm, mengunci status batch daging sapi di blockchain, dan menyalakan unit chiller darurat.'
                      : 'Suhu stabil di bawah -18°C. Mutu mikrobiologis terjaga dan status halal produk terlindungi tanpa risiko kebusukan.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
              <span className="text-slate-400">Aksi Cepat Uji:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTestTempValue(-20.4)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded text-[11px] font-semibold border border-slate-800"
                >
                  Set Optimal (-20.4°C)
                </button>
                <button
                  onClick={() => setTestTempValue(-12.0)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded text-[11px] font-semibold border border-slate-800"
                >
                  Set Bahaya (-12.0°C)
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Streaming SVG Waveform (7 cols) */}
          <div className="lg:col-span-7 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Grafik Gelombang Telemetri Suhu Real-Time (Live Streaming)
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 1 Hz
              </span>
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative h-44 w-full bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 flex flex-col justify-between">
              <div className="absolute inset-x-3 top-10 border-b border-dashed border-rose-500/50 flex justify-between text-[9px] text-rose-400">
                <span>Batas Bahaya CCP-3: -18.0°C</span>
              </div>

              {/* Dynamic waveform representation */}
              <div className="flex-1 flex items-end gap-2 pt-10 pb-2">
                {[
                  -20.2, -20.5, -20.4, -20.3, -20.6, -20.4, 
                  testTempValue > -18 ? testTempValue - 2 : -20.5,
                  testTempValue > -18 ? testTempValue - 1 : -20.3,
                  testTempValue,
                  testTempValue
                ].map((val, idx) => {
                  const normalized = Math.min(100, Math.max(10, ((val + 25) / 30) * 100));
                  const isOver = val > -18;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] font-mono text-slate-400">{val}°</span>
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isOver ? 'bg-rose-500 shadow-rose-500/50 shadow-md' : 'bg-cyan-500'
                        }`}
                        style={{ height: `${normalized}%` }}
                      />
                      <span className="text-[8px] text-slate-600 font-mono">T-{10 - idx}s</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                <span>Sensor Probe: RTD Pt100 Calibrated</span>
                <span className="font-mono text-cyan-300">ID: SENS-01 · Cold Bay C-01</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sensor Nodes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Node Sensor Lapangan (IoT Live Telemetry)</span>
          </h3>
          <span className="text-xs text-slate-400">Klik salah satu node sensor untuk inspeksi telemetri</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => {
            const isSelected = selectedSensorId === sensor.id;
            const displayValue = sensor.id === 'SENS-01' ? testTempValue.toFixed(1) : sensor.value;
            const effectiveStatus = (sensor.id === 'SENS-01' && testTempValue > -18) 
              ? 'ALERT' 
              : isPacketLossActive 
              ? 'WARNING' 
              : sensor.status;

            return (
              <div
                key={sensor.id}
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all space-y-3 border ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/40 shadow-lg'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">{sensor.id}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{sensor.name}</h4>
                    <span className="text-[11px] text-slate-400">{sensor.location}</span>
                  </div>
                  {getStatusBadge(effectiveStatus)}
                </div>

                {/* Sensor Live Value Box */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-slate-400">Nilai Terkini:</span>
                  <span className={`text-base font-bold font-mono tabular-nums ${
                    effectiveStatus === 'ALERT' ? 'text-rose-400' : 'text-white'
                  }`}>
                    {displayValue} {sensor.unit}
                  </span>
                </div>

                {/* Historical Sparkline Bars */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Tren 5 Bacaan Terakhir</span>
                    <span>{sensor.lastUpdated}</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-8 pt-1">
                    {sensor.history.map((val, idx) => {
                      const normalizedHeight = typeof val === 'number' 
                        ? Math.min(100, Math.max(20, Math.abs(val) * 3))
                        : 50;
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-slate-800 hover:bg-emerald-500 rounded-t transition-colors relative group"
                          style={{ height: `${normalizedHeight}%` }}
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] bg-black px-1 rounded text-white whitespace-nowrap">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Data Engineering Lab Explanation */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Landasan Teori Big Data Analytics & IoT Logistik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-white">1. Edge Computing Telemetri</span>
            <p className="text-slate-400 leading-relaxed">
              Data suhu dari RTD probe dikalkulasi di edge controller untuk mendeteksi deviasi dalam milidetik, mencegah pemutusan rantai dingin (cold chain rupture).
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-white">2. Deteksi Anomali Prediktif</span>
            <p className="text-slate-400 leading-relaxed">
              Algoritma Moving Average & Exponential Smoothing mengidentifikasi tren kenaikan suhu bertahap sebelum mencapai batas kritis HCCP -18°C.
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-white">3. Smart Contract Trigger</span>
            <p className="text-slate-400 leading-relaxed">
              Jika suhu berada di atas batas kritis lebih dari 30 menit, hash sensor otomatis mengunci batch di blockchain sebagai produk diragukan (Syubhat).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
