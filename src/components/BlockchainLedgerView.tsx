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
  Database,
  PlusCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface BlockchainLedgerViewProps {
  blocks: BlockchainBlock[];
  onTamperBlock: (blockIndex: number, newTemp: number) => void;
  onRestoreBlockchain: () => void;
  onAddNewBlock?: (block: BlockchainBlock) => void;
}

export const BlockchainLedgerView: React.FC<BlockchainLedgerViewProps> = ({
  blocks,
  onTamperBlock,
  onRestoreBlockchain,
  onAddNewBlock
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [activeTraceSku, setActiveTraceSku] = useState<string>('LOT-2026-BF-091');
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);

  // New Block Mining States
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningPhase, setMiningPhase] = useState<number>(0);
  const [newAction, setNewAction] = useState<string>('Pemeriksaan QC Halal & Pelepasan Mutu');
  const [newProduct, setNewProduct] = useState<string>('Daging Sapi Ribeye AUS');
  const [newBatch, setNewBatch] = useState<string>('LOT-2026-BF-099');
  const [newTemp, setNewTemp] = useState<number>(-20.2);
  const [newCert, setNewCert] = useState<string>('ID00310002931820124');

  // Verify chain validity
  const isChainValid = blocks.every((block, idx) => {
    if (idx === 0) return true;
    return block.previousHash === blocks[idx - 1].hash;
  });

  const handleMineNewBlock = () => {
    if (isMining) return;
    setIsMining(true);
    setMiningPhase(1);

    setTimeout(() => {
      setMiningPhase(2); // hashing
    }, 800);

    setTimeout(() => {
      setMiningPhase(3); // consensus
    }, 1600);

    setTimeout(() => {
      const prevBlock = blocks[blocks.length - 1];
      const newIndex = blocks.length;
      const blockData = {
        action: newAction,
        product: newProduct,
        batchLot: newBatch,
        actor: 'Operator WMS HalalLogix',
        location: 'Gudang Pusat Halal DC (Inbound)',
        tempLog: newTemp,
        halalCertNo: newCert,
        timestamp: new Date().toISOString(),
        signature: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`
      };
      const calculatedHash = calculateSimpleHash(JSON.stringify(blockData) + prevBlock.hash);

      const createdBlock: BlockchainBlock = {
        index: newIndex,
        timestamp: new Date().toLocaleTimeString('id-ID'),
        previousHash: prevBlock.hash,
        hash: calculatedHash,
        nonce: Math.floor(10000 + Math.random() * 90000),
        data: blockData,
        smartContractStatus: newTemp <= -18 ? 'VERIFIED' : 'TAMPERED'
      };

      if (onAddNewBlock) {
        onAddNewBlock(createdBlock);
      }
      setSelectedBlock(createdBlock);
      setIsMining(false);
      setMiningPhase(0);
    }, 2400);
  };

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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTamperBlock(2, 6.5)}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Uji Rekayasa Data di Blok #2 (Simulasi Kecurangan)</span>
          </button>
          <button
            onClick={onRestoreBlockchain}
            title="Pulihkan seluruh blok blockchain ke kondisi konsensus awal"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Pulihkan Konsensus (Reset)</span>
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
                ? `Seluruh ${blocks.length} blok memiliki sambungan hash kriptografi yang sah dan smart contract aktif.`
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Rangkaian Blok Buku Besar Digital ({blocks.length} Blok)</span>
          </h3>
          <span className="text-xs text-slate-400">Klik salah satu blok untuk melihat detail payload & hash</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocks.map((block, idx) => {
            const isBroken = idx > 0 && block.previousHash !== blocks[idx - 1].hash;
            const isSelected = selectedBlock?.index === block.index;
            return (
              <div
                key={block.index}
                onClick={() => setSelectedBlock(block)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 relative ${
                  isBroken
                    ? 'bg-rose-950/50 border-rose-500 shadow-rose-950/50 shadow-lg ring-1 ring-rose-500'
                    : isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500 shadow-lg'
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
                    <span className="text-slate-500 block">Current Hash:</span>
                    <span className="text-emerald-400 truncate block">
                      {block.hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCK MINING SIMULATION ARENA (INTERACTIVE ADD BLOCK) */}
      <div className="p-5 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Simulasi Penambangan Blok Baru (Mine Halal Block to Chain)
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan transaksi logistik baru dengan enkripsi SHA-256 dan konsensus smart contract otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={handleMineNewBlock}
            disabled={isMining}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isMining ? 'Sedang Menambang Blok...' : '⛏️ Tambang Blok Baru ke Ledger'}</span>
          </button>
        </div>

        {/* Mining Stepper Feedback */}
        {isMining && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500 rounded-lg text-xs space-y-2">
            <span className="font-bold text-emerald-400 block">
              Proses Kriptografi Blockchain Sedang Berlangsung:
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className={`p-2 rounded text-center border ${miningPhase >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                1. Hash Data Payload
              </div>
              <div className={`p-2 rounded text-center border ${miningPhase >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                2. Hitung Nonce PoW
              </div>
              <div className={`p-2 rounded text-center border ${miningPhase >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                3. Eksekusi Smart Contract
              </div>
            </div>
          </div>
        )}

        {/* Input Parameters for New Block */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Aksi / Event Logistik:</label>
            <select
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
            >
              <option value="Pemeriksaan QC Halal & Pelepasan Mutu">Pemeriksaan QC Halal & Pelepasan Mutu</option>
              <option value="Inbound Cross-Docking di Receiving 1">Inbound Cross-Docking di Receiving 1</option>
              <option value="Penerimaan Toko Ritel Superindo BSD">Penerimaan Toko Ritel Superindo BSD</option>
              <option value="Sertifikasi Halal Batch Final Ekspor">Sertifikasi Halal Batch Final Ekspor</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Produk & Lot:</label>
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Suhu Telemetri (°C):</label>
            <input
              type="number"
              step="0.1"
              value={newTemp}
              onChange={(e) => setNewTemp(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">No. Sertifikat BPJPH:</label>
            <input
              type="text"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Farm to Fork Traceability Pipeline Explorer */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Penelusuran Jejak Farm-to-Fork (End-to-End Halal Provenance)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pilih Batch Lot:</span>
            <select
              value={activeTraceSku}
              onChange={(e) => setActiveTraceSku(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1 font-mono"
            >
              <option value="LOT-2026-BF-091">LOT-2026-BF-091 (Daging Sapi Ribeye)</option>
              <option value="LOT-2026-CH-042">LOT-2026-CH-042 (Daging Ayam Broiler)</option>
              <option value="LOT-2026-PO-118">LOT-2026-PO-118 (Minyak Kelapa Sawit)</option>
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
