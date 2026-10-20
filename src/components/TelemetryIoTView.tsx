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
  Cpu
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
  const [selectedSensor, setSelectedSensor] = useState<IoTSensorNode | null>(null);
  const [tempAlertThreshold, setTempAlertThreshold] = useState<number>(-18);

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerAnomaly('COLD_CHAIN')}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Injeksi Anomali Suhu Cold Storage</span>
          </button>
          <button
            onClick={onResetSensors}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Normal</span>
          </button>
        </div>
      </div>

      {/* Big Data Analytics KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400">Cold Chain Integrity Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">99.8%</span>
            <span className="text-xs text-emerald-400 font-medium">SLA Terpenuhi</span>
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
          <span className="text-xs font-medium text-slate-400">Utilitas Armada AGV Dedicated</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">88.4%</span>
            <span className="text-xs text-slate-400 font-mono">4 unit aktif</span>
          </div>
          <p className="text-[10px] text-slate-500">MHE terisolasi khusus palet halal</p>
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

      {/* Live Sensor Nodes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Node Sensor Lapangan (IoT Live Telemetry)</span>
          </h3>
          <span className="text-xs text-slate-400">Auto-refresh streaming setiap detik</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{sensor.id}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{sensor.name}</h4>
                  <span className="text-[11px] text-slate-400">{sensor.location}</span>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              {/* Sensor Live Value Box */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
                <span className="text-xs text-slate-400">Nilai Terkini:</span>
                <span className="text-base font-bold font-mono tabular-nums text-white">
                  {typeof sensor.value === 'number' ? `${sensor.value} ${sensor.unit}` : sensor.value}
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
          ))}
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
