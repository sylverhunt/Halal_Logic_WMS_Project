import React, { useState } from 'react';
import { BlockchainBlock } from '../types/logistics';
import { calculateSimpleHash } from '../utils/logisticsFormulas';
import { 
  Link as LinkIcon, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  QrCode, 
  Lock, 
  RefreshCw, 
  Key, 
  ArrowRight,
  Database
} from 'lucide-react';

interface BlockchainLedgerViewProps {
  blocks: BlockchainBlock[];
  onTamperBlock: (blockIndex: number, newTemp: number) => void;
  onRestoreBlockchain: () => void;
}

export const BlockchainLedgerView: React.FC<BlockchainLedgerViewProps> = ({
  blocks,
  onTamperBlock,
  onRestoreBlockchain
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [activeTraceSku, setActiveTraceSku] = useState<string>('LOT-2026-BF-091');

  // Verify chain validity
  const isChainValid = blocks.every((block, idx) => {
    if (idx === 0) return true;
    return block.previousHash === blocks[idx - 1].hash;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-emerald-400" />
            <span>Blockchain Rantai Pasok Halal & Ketertelusuran (Topik 7 & 8)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Buku besar digital terdistribusi (Distributed Ledger) nir-manipulasi (immutable) untuk audit jejak asal usul produk (Farm-to-Fork) dan smart contract kepatuhan halal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTamperBlock(2, 6.5)}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Uji Rekayasa Data di Blok #2 (Simulasi Kecurangan)</span>
          </button>
          <button
            onClick={onRestoreBlockchain}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pulihkan Konsensus</span>
          </button>
        </div>
      </div>

      {/* Chain Status Bar */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        isChainValid 
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
          : 'bg-rose-950/40 border-rose-500 text-rose-300 animate-pulse'
      }`}>
        <div className="flex items-center gap-3">
          {isChainValid ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          )}
          <div>
            <span className="text-sm font-bold block">
              {isChainValid 
                ? 'Status Blockchain: VALID & KONSENSUS TERVERIFIKASI' 
                : 'PELANGGARAN TERDETEKSI: HASH BLOCKCHAIN TIDAK COCOK (CHAIN BROKEN!)'}
            </span>
            <span className="text-xs text-slate-300">
              {isChainValid 
                ? 'Seluruh 4 blok memiliki sambungan hash kriptografi yang sah dan smart contract aktif.'
                : 'Data pada salah satu blok diubah secara ilegal! Smart Contract mengunci transaksi dan membunyikan alarm audit BPJPH.'}
            </span>
          </div>
        </div>

        <div className="text-right font-mono text-xs hidden sm:block">
          <span>Tingkat Integritas: {isChainValid ? '100%' : '0% (TERKUNCI)'}</span>
        </div>
      </div>

      {/* Visual Blockchain Blocks List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Rangkaian Blok Buku Besar Digital (Block Explorer)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocks.map((block, idx) => {
            const isBroken = idx > 0 && block.previousHash !== blocks[idx - 1].hash;
            return (
              <div
                key={block.index}
                onClick={() => setSelectedBlock(block)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 relative ${
                  isBroken
                    ? 'bg-rose-950/50 border-rose-500 shadow-rose-950/50 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Block Index and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold font-mono text-white">Blok #{block.index}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    block.smartContractStatus === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {block.smartContractStatus}
                  </span>
                </div>

                {/* Block Content */}
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Aksi / Event</span>
                    <span className="font-semibold text-white truncate block">{block.data.action}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Produk & Lot</span>
                    <span className="text-slate-300 truncate block">{block.data.product} ({block.data.batchLot})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Suhu Log Telemetri</span>
                    <span className="font-mono text-cyan-400 font-semibold">{block.data.tempLog}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sertifikat BPJPH</span>
                    <span className="font-mono text-emerald-400 text-[11px] truncate block">{block.data.halalCertNo}</span>
                  </div>
                </div>

                {/* Hashes display */}
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Prev Hash:</span>
                    <span className={`truncate block ${isBroken ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                      {block.previousHash.slice(0, 16)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Block Hash:</span>
                    <span className="text-emerald-400 truncate block">
                      {block.hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>

                {isBroken && (
                  <div className="p-2 bg-rose-950 border border-rose-800 rounded text-[10px] text-rose-300 font-medium">
                    Sambungan Terputus: Hash tidak cocok dengan blok sebelumnya!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Farm to Fork Traceability Flow Visualizer */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Penelusuran Rantai Pasok Halal Interaktif (Farm-to-Fork Traceability)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pilih Batch:</span>
            <select
              value={activeTraceSku}
              onChange={(e) => setActiveTraceSku(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value="LOT-2026-BF-091">LOT-2026-BF-091 (Daging Sapi Ribeye Australia)</option>
              <option value="LOT-2026-CK-114">LOT-2026-CK-114 (Ayam Karkas Subang Segar)</option>
            </select>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Rumah Potong Hewan (RPH)</h4>
            <p className="text-[11px] text-slate-400">
              Disembelih oleh Juru Sembelih Halal (Juleha) tersertifikasi. Standar SNI 99002:2016. Rekam sertifikat digital diunggah ke ledger.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Hash: 0x3a88...verified</span>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Transportasi Reefer Pendingin</h4>
            <p className="text-[11px] text-slate-400">
              Suhu dipantau terus menerus pada &le; -18&deg;C dengan E-Seal anti-tamper. Tidak ada pembukaan segel liar.
            </p>
            <span className="text-[10px] text-cyan-400 font-mono block">Suhu rata-rata: -19.5°C</span>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-white">WMS HalalLogix Storage</h4>
            <p className="text-[11px] text-slate-400">
              Diterima di Dock 1 Halal Dedicated. Ditempatkan di Deep Freeze Bay C-01. MHE berlabel halal eksklusif.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Slot: Bay C-01 (AS/RS)</span>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="text-xs font-bold text-white">Last-Mile Green Dispatch</h4>
            <p className="text-[11px] text-slate-400">
              Pengiriman ke Supermarket dengan Electric Cargo Van. Konsumen memindai QR Code untuk melihat seluruh jejak otentik.
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold block">Konsumen: QR Verifikasi Sukses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
