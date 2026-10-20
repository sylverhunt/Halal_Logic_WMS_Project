import React, { useState, useMemo } from 'react';
import { PurchaseOrder, InventoryItem } from '../types/logistics';
import { calculateEOQ, calculateROP, calculateSafetyStock } from '../utils/logisticsFormulas';
import { 
  Calculator, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface InventoryPlanningViewProps {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  onCreatePO: (newPO: PurchaseOrder) => void;
}

export const InventoryPlanningView: React.FC<InventoryPlanningViewProps> = ({
  inventory,
  purchaseOrders,
  onCreatePO
}) => {
  // EOQ Sandbox interactive states
  const [selectedSkuId, setSelectedSkuId] = useState<string>(inventory[0]?.id || 'SKU-001');
  const selectedItem = useMemo(() => inventory.find(i => i.id === selectedSkuId) || inventory[0], [inventory, selectedSkuId]);

  const [annualDemand, setAnnualDemand] = useState<number>(selectedItem ? selectedItem.dailyDemand * 300 : 3600);
  const [orderCost, setOrderCost] = useState<number>(selectedItem ? selectedItem.orderCostIdr : 1000000);
  const [holdingCost, setHoldingCost] = useState<number>(selectedItem ? selectedItem.holdingCostPerUnitIdr : 4500000);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(selectedItem ? selectedItem.leadTimeDays : 7);
  const [serviceLevelZ, setServiceLevelZ] = useState<number>(1.65); // 95% service level

  // Sync when selected item changes
  const handleSelectSku = (id: string) => {
    setSelectedSkuId(id);
    const item = inventory.find(i => i.id === id);
    if (item) {
      setAnnualDemand(item.dailyDemand * 300);
      setOrderCost(item.orderCostIdr);
      setHoldingCost(item.holdingCostPerUnitIdr);
      setLeadTimeDays(item.leadTimeDays);
    }
  };

  // Calculations
  const eoq = useMemo(() => calculateEOQ(annualDemand, orderCost, holdingCost), [annualDemand, orderCost, holdingCost]);
  const dailyDemand = Math.round(annualDemand / 300);
  const demandStdDev = Math.round(dailyDemand * 0.25);
  const safetyStock = useMemo(() => calculateSafetyStock(serviceLevelZ, demandStdDev, leadTimeDays), [serviceLevelZ, demandStdDev, leadTimeDays]);
  const rop = useMemo(() => calculateROP(dailyDemand, leadTimeDays, safetyStock), [dailyDemand, leadTimeDays, safetyStock]);
  const ordersPerYear = eoq > 0 ? (annualDemand / eoq).toFixed(1) : '0';
  const cycleTimeDays = eoq > 0 ? Math.round(300 / (annualDemand / eoq)) : 0;
  const totalAnnualCost = eoq > 0 
    ? Math.round((annualDemand / eoq) * orderCost + (eoq / 2) * holdingCost)
    : 0;

  // New PO Modal state
  const [showPOModal, setShowPOModal] = useState<boolean>(false);
  const [newPoSupplier, setNewPoSupplier] = useState<string>('PT Agro Halal Utama');
  const [newPoCertNo, setNewPoCertNo] = useState<string>('ID00310002931820124');
  const [newPoSku, setNewPoSku] = useState<string>('HLX-BEEF-AUS01');
  const [newPoQty, setNewPoQty] = useState<number>(eoq || 30);

  const handleCreateNewPO = () => {
    const isCertValid = newPoCertNo.startsWith('ID') && newPoCertNo.length >= 10;
    const po: PurchaseOrder = {
      id: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poNumber: `PO/HLX/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: newPoSupplier,
      supplierHalalGrade: isCertValid ? 'A' : 'UNRATED',
      supplierCertNo: newPoCertNo,
      items: [
        {
          sku: newPoSku,
          name: inventory.find(i => i.sku === newPoSku)?.name || 'Bahan Baku Halal',
          qty: newPoQty,
          priceIdr: 120000000
        }
      ],
      totalAmountIdr: newPoQty * 120000000,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + leadTimeDays * 86400000).toISOString().split('T')[0],
      status: isCertValid ? 'HALAL_VERIFIED' : 'REJECTED_NON_COMPLIANT',
      rejectionReason: isCertValid ? undefined : 'Sertifikat tidak valid di database BPJPH SIHALAL'
    };
    onCreatePO(po);
    setShowPOModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>Perencanaan E-Logistik & Manajemen Persediaan Digital (Topik 4 & 5)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulasi kalkulasi EOQ (Economic Order Quantity), Safety Stock, Reorder Point (ROP), dan E-Procurement terintegrasi sertifikasi BPJPH.
          </p>
        </div>
        <button
          onClick={() => setShowPOModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Digital Purchase Order (PO)</span>
        </button>
      </div>

      {/* Interactive EOQ & Inventory Planning Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parameters Deck (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Parameter Input Model Persediaan</span>
            </h3>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedSkuId}
                onChange={(e) => handleSelectSku(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 max-w-[170px] truncate"
              >
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.sku} - {item.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleSelectSku(selectedSkuId)}
                title="Reset parameter EOQ/ROP ke nilai bawaan SKU ini"
                className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 text-xs">
            {/* Annual Demand */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Permintaan Tahunan (D)</span>
                <span className="font-mono text-emerald-400 font-semibold">{annualDemand.toLocaleString()} unit/thn</span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="250"
                value={annualDemand}
                onChange={(e) => setAnnualDemand(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Rata-rata permintaan harian: ~{dailyDemand} unit/hari</span>
            </div>

            {/* Ordering Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Biaya Pemesanan per Order (S)</span>
                <span className="font-mono text-emerald-400 font-semibold">Rp {orderCost.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="5000000"
                step="100000"
                value={orderCost}
                onChange={(e) => setOrderCost(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Termasuk biaya audit halal inbound & verifikasi dokumen</span>
            </div>

            {/* Holding Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Biaya Penyimpanan per Unit/Tahun (H)</span>
                <span className="font-mono text-emerald-400 font-semibold">Rp {holdingCost.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="8000000"
                step="100000"
                value={holdingCost}
                onChange={(e) => setHoldingCost(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Biaya listrik chiller cold storage & ruang rak dedicated</span>
            </div>

            {/* Lead Time */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Lead Time Pemasok (L)</span>
                <span className="font-mono text-emerald-400 font-semibold">{leadTimeDays} Hari</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Service Level Z-Score */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Tingkat Pelayanan (Service Level)</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {serviceLevelZ === 1.28 ? '90% (Z=1.28)' : serviceLevelZ === 1.65 ? '95% (Z=1.65)' : '99% (Z=2.33)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceLevelZ(1.28)}
                  className={`py-1.5 rounded text-xs font-medium border ${serviceLevelZ === 1.28 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  90%
                </button>
                <button
                  type="button"
                  onClick={() => setServiceLevelZ(1.65)}
                  className={`py-1.5 rounded text-xs font-medium border ${serviceLevelZ === 1.65 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  95% (Rekomendasi)
                </button>
                <button
                  type="button"
                  onClick={() => setServiceLevelZ(2.33)}
                  className={`py-1.5 rounded text-xs font-medium border ${serviceLevelZ === 2.33 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  99%
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Theoretical Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Hasil Optimasi Persediaan (Formula Matematika Logistik)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">EOQ / ROP Model</span>
          </div>

          {/* Cards for EOQ and ROP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* EOQ */}
            <div className="p-3.5 bg-slate-950 border border-emerald-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Ukuran Pesanan Ekonomis (EOQ)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {eoq} <span className="text-xs text-slate-400 font-sans">unit</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Formula: &radic;(2DS / H)
              </p>
            </div>

            {/* Reorder Point (ROP) */}
            <div className="p-3.5 bg-slate-950 border border-cyan-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Titik Pesan Kembali (ROP)</span>
              <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                {rop} <span className="text-xs text-slate-400 font-sans">unit</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Formula: (D &times; L) + SS
              </p>
            </div>

            {/* Safety Stock */}
            <div className="p-3.5 bg-slate-950 border border-amber-900/40 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-400">Safety Stock (SS)</span>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {safetyStock} <span className="text-xs text-slate-400 font-sans">unit</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Formula: Z &times; &sigma; &times; &radic;L
              </p>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Frekuensi Pemesanan per Tahun:</span>
              <span className="font-mono text-white font-semibold">{ordersPerYear} kali pemesanan</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Siklus Waktu Pemesanan Ulang:</span>
              <span className="font-mono text-white font-semibold">Setiap ~{cycleTimeDays} Hari</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800/80">
              <span className="font-semibold text-slate-200">Total Biaya Persediaan Tahunan (TC):</span>
              <span className="font-mono text-emerald-400 font-bold">
                Rp {totalAnnualCost.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* ABC Velocity Slotting Strategy */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Analisis ABC & Rekomendasi Slotting Gudang
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span>Kelas A (Fast Moving - 70% Throughput)</span>
                </span>
                <span className="text-emerald-400 font-medium">Dekat Dock Pengiriman (Bay A-01, C-02)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-sky-500" />
                  <span>Kelas B (Medium Moving - 20% Throughput)</span>
                </span>
                <span className="text-sky-400 font-medium">Lorong Tengah (Bay C-01, B-01)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-slate-500" />
                  <span>Kelas C (Slow Moving - 10% Throughput)</span>
                </span>
                <span className="text-slate-400 font-medium">Rak Belakang / Level Atas (Bay A-02, B-02)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-Procurement Purchase Orders List */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              E-Procurement Digital Purchase Orders (Verifikasi Sertifikat BPJPH Otomatis)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total PO: {purchaseOrders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">No. PO</th>
                <th className="px-4 py-3">Nama Pemasok (Vendor)</th>
                <th className="px-4 py-3">Sertifikat Halal</th>
                <th className="px-4 py-3">Item Dipesan</th>
                <th className="px-4 py-3">Total Nilai</th>
                <th className="px-4 py-3">Status E-Procurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-white whitespace-nowrap">
                    {po.poNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-200">{po.supplierName}</span>
                    <span className="text-[10px] text-slate-500 block">Grade Halal: {po.supplierHalalGrade}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span className={po.supplierCertNo.startsWith('ID') ? 'text-emerald-400' : 'text-rose-400'}>
                      {po.supplierCertNo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {po.items.map((it, i) => (
                      <span key={i} className="block text-slate-300">
                        {it.name} ({it.qty} unit)
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-white whitespace-nowrap">
                    Rp {po.totalAmountIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {po.status === 'HALAL_VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" /> VERIFIKASI HALAL
                      </span>
                    ) : po.status === 'INBOUND_INSPECTING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded">
                        INSPEKSI DOCK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-800 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3" /> DITOLAK (NON-HALAL)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create PO */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Buat Digital Purchase Order (E-Procurement Halal)
            </h3>
            <p className="text-xs text-slate-400">
              Sistem akan memvalidasi nomor sertifikat BPJPH pemasok secara real-time sebelum menyetujui pemesanan.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Pemasok:</label>
                <input
                  type="text"
                  value={newPoSupplier}
                  onChange={(e) => setNewPoSupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nomor Sertifikat Halal BPJPH (Format: ID...):
                </label>
                <input
                  type="text"
                  value={newPoCertNo}
                  onChange={(e) => setNewPoCertNo(e.target.value)}
                  placeholder="Contoh: ID00210000045610821"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Tip Praktikum: Masukkan nomor tanpa awalan "ID" untuk menguji skenario penolakan otomatis oleh sistem.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Item SKU:</label>
                <select
                  value={newPoSku}
                  onChange={(e) => setNewPoSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.sku}>
                      {item.sku} - {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jumlah Pesanan (Berdasarkan EOQ):</label>
                <input
                  type="number"
                  value={newPoQty}
                  onChange={(e) => setNewPoQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowPOModal(false)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded"
              >
                Batal
              </button>
              <button
                onClick={handleCreateNewPO}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
              >
                Kirim PO & Verifikasi Halal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
