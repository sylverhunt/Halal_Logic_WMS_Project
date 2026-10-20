import React, { useState } from 'react';
import { WarehouseBay, InventoryItem, LabScenario, HalalZone } from '../types/logistics';
import { 
  FolderPlus, 
  PlusCircle, 
  Upload, 
  Download, 
  FileJson, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  PackagePlus, 
  Layers, 
  BookOpen, 
  Trash2,
  Copy
} from 'lucide-react';

interface ScenarioDataStudioProps {
  bays: WarehouseBay[];
  inventory: InventoryItem[];
  scenarios: LabScenario[];
  onAddNewItem: (item: InventoryItem, targetBayId: string) => void;
  onAddNewScenario: (scenario: LabScenario) => void;
  onLoadPreset: (presetKey: string) => void;
  onImportFullState: (jsonState: any) => void;
  onResetToDefault: () => void;
  onOpenLab: () => void;
}

export const ScenarioDataStudio: React.FC<ScenarioDataStudioProps> = ({
  bays,
  inventory,
  scenarios,
  onAddNewItem,
  onAddNewScenario,
  onLoadPreset,
  onImportFullState,
  onResetToDefault,
  onOpenLab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'create_scenario' | 'add_sku' | 'json_io'>('presets');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // --- Form State for New Inbound SKU ---
  const [skuCode, setSkuCode] = useState<string>('HLX-PHARM-VACC01');
  const [skuName, setSkuName] = useState<string>('Vaksin Biologis Halal (Cold Chain)');
  const [skuCategory, setSkuCategory] = useState<InventoryItem['category']>('Raw Material');
  const [skuQty, setSkuQty] = useState<number>(20);
  const [skuUnit, setSkuUnit] = useState<string>('Palet (500 Vial)');
  const [skuBayId, setSkuBayId] = useState<string>('bay-c1');
  const [skuMinTemp, setSkuMinTemp] = useState<number>(-22);
  const [skuMaxTemp, setSkuMaxTemp] = useState<number>(-18);
  const [skuCertNo, setSkuCertNo] = useState<string>('ID00910000412890525');
  const [skuCertStatus, setSkuCertStatus] = useState<'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED'>('ACTIVE');
  const [skuIssuer, setSkuIssuer] = useState<'BPJPH' | 'LPPOM_MUI' | 'JAKIM' | 'MUIS' | 'CICOT' | 'UNVERIFIED'>('BPJPH');
  const [skuHccpCrit, setSkuHccpCrit] = useState<'CRITICAL_HIGH' | 'CRITICAL_MEDIUM' | 'STANDARD'>('CRITICAL_HIGH');
  const [skuDailyDemand, setSkuDailyDemand] = useState<number>(15);
  const [skuLeadTime, setSkuLeadTime] = useState<number>(5);

  const handleCreateSkuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBay = bays.find(b => b.id === skuBayId);
    const assignedZone: HalalZone = targetBay ? targetBay.zone : 'HALAL_AMBIENT';

    const newItem: InventoryItem = {
      id: `SKU-${Date.now().toString().slice(-4)}`,
      sku: skuCode,
      name: skuName,
      category: skuCategory,
      quantity: Number(skuQty),
      unit: skuUnit,
      bayId: skuBayId,
      zone: assignedZone,
      weightKg: skuQty * 50,
      temperatureRequired: { min: Number(skuMinTemp), max: Number(skuMaxTemp) },
      halalCert: {
        certNumber: skuCertNo,
        issuer: skuIssuer,
        validUntil: '2028-12-31',
        standard: 'UU JPH No. 33/2014',
        status: skuCertStatus,
        auditorNotes: 'Diinput melalui Form Studio Laboratorium Teknik Logistik'
      },
      hccpCriticality: skuHccpCrit,
      batchLot: `LOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2027-12-31',
      inboundDate: new Date().toISOString().split('T')[0],
      dailyDemand: Number(skuDailyDemand),
      leadTimeDays: Number(skuLeadTime),
      unitCostIdr: 45000000,
      holdingCostPerUnitIdr: 1200000,
      orderCostIdr: 800000,
      rfidTag: `E28011606000020478B${Math.floor(1000 + Math.random() * 9000)}`
    };

    onAddNewItem(newItem, skuBayId);
    showNotification(`Item ${skuName} (${skuCode}) berhasil dimasukkan ke Bay ${targetBay?.code || skuBayId}!`);
  };

  // --- Form State for Custom Case Scenario ---
  const [customTitle, setCustomTitle] = useState<string>('Kasus 5: Investigasi Sertifikat Palsu pada Ekstrak Perisa Impor');
  const [customCategory, setCustomCategory] = useState<LabScenario['category']>('Regulatory Audit BPJPH');
  const [customDifficulty, setCustomDifficulty] = useState<LabScenario['difficulty']>('Lanjutan');
  const [customDescription, setCustomDescription] = useState<string>(
    'Petugas inbound dock menemukan 15 palet perisa impor dengan sertifikat yang nomornya tidak terdaftar di sistem SIHALAL BPJPH. Analisis lab awal mendeteksi adanya turunan senyawa non-halal.'
  );
  const [customTrigger, setCustomTrigger] = useState<string>('Scan Barcode Gagal Verifikasi di Dock 1');
  const [customTask1, setCustomTask1] = useState<string>('Tahan palet dan kirim ke Karantina Q-01');
  const [customTask2, setCustomTask2] = useState<string>('Jalankan audit investigasi silang dengan data BPJPH');
  const [customOpt1Label, setCustomOpt1Label] = useState<string>('Pindahkan segera ke Karantina Q-01 dan laporkan ke Penyelia Halal');
  const [customOpt1Expl, setCustomOpt1Expl] = useState<string>('BENAR: Setiap bahan diragukan wajib diisolasi mutlak agar tidak mencemari rak halal.');
  const [customOpt2Label, setCustomOpt2Label] = useState<string>('Simpan di rak umum A-01 sambil menunggu konfirmasi supplier');
  const [customOpt2Expl, setCustomOpt2Expl] = useState<string>('SALAH: Pelanggaran berat UU JPH Pasal 21! Bahan tak bertuan sertifikat dilarang masuk area halal.');

  const handleCreateScenarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScen: LabScenario = {
      id: `SCENARIO-${Date.now().toString().slice(-4)}`,
      title: customTitle,
      category: customCategory,
      difficulty: customDifficulty,
      scenarioDescription: customDescription,
      triggerCondition: customTrigger,
      tasks: [
        { id: 't1', description: customTask1, completed: false, points: 50 },
        { id: 't2', description: customTask2, completed: false, points: 50 }
      ],
      correctResolutionId: 'opt-1',
      options: [
        {
          id: 'opt-1',
          actionLabel: customOpt1Label,
          explanation: customOpt1Expl,
          isCorrect: true,
          scoreDelta: 100
        },
        {
          id: 'opt-2',
          actionLabel: customOpt2Label,
          explanation: customOpt2Expl,
          isCorrect: false,
          scoreDelta: -50
        }
      ],
      learningOutcome: 'Mahasiswa mampu mengidentifikasi ketidaksesuaian dokumen sertifikasi halal impor dan mengeksekusi SOP karantina WMS.'
    };

    onAddNewScenario(newScen);
    showNotification(`Skenario studi kasus "${customTitle}" berhasil ditambahkan dan siap dimainkan!`);
  };

  // --- JSON State I/O ---
  const [jsonInput, setJsonInput] = useState<string>('');

  const handleExportJson = () => {
    const fullState = {
      exportedAt: new Date().toISOString(),
      appName: 'HalalLogix WMS',
      bays,
      inventory,
      scenarios
    };
    const jsonStr = JSON.stringify(fullState, null, 2);
    setJsonInput(jsonStr);

    // trigger file download
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HalalLogix_Scenario_Data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('File data skenario JSON berhasil diekspor dan diunduh!');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.bays || !parsed.inventory) {
        alert('Format JSON tidak valid: Properti "bays" atau "inventory" tidak ditemukan.');
        return;
      }
      onImportFullState(parsed);
      showNotification('Data skenario studi kasus berhasil diimpor ke sistem!');
    } catch (err: any) {
      alert(`Gagal membaca JSON: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Studio Manajemen Skenario & Input Data Praktikum
              </h2>
              <p className="text-xs text-slate-400">
                Pusat kendali dosen dan mahasiswa untuk memuat studi kasus template, merancang skenario masalah kustom, menginput SKU palet baru, atau impor/ekspor dataset JSON.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLab}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buka Lab Studi Kasus</span>
          </button>
          <button
            onClick={onResetToDefault}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Default</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('presets')}
          className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'presets'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Pustaka Template Studi Kasus</span>
        </button>
        <button
          onClick={() => setActiveSubTab('add_sku')}
          className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'add_sku'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <PackagePlus className="w-3.5 h-3.5" />
          <span>2. Input SKU & Palet Baru (WMS Inbound)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('create_scenario')}
          className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'create_scenario'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>3. Rancang Skenario Praktikum Kustom</span>
        </button>
        <button
          onClick={() => setActiveSubTab('json_io')}
          className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'json_io'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>4. Impor & Ekspor Dataset JSON</span>
        </button>
      </div>

      {/* --- SUBTAB 1: TEMPLATE PRESETS --- */}
      {activeSubTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Pilih Template Kasus Praktikum Siap Pakai (1-Click Load)
            </h3>
            <span className="text-xs text-slate-400">Total Skenario Terpasang: {scenarios.length} Kasus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Preset 1 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Cold Chain & Meat Supply Chain
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Krisis Kerusakan Pendingin Daging Sapi Import (Bay C-01)
                </h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Menguji respon telemetri IoT saat kompresor pendingin melemah, memicu kenaikan suhu ke -6.5°C pada daging bersertifikat BPJPH senilai Rp 7.9 Miliar.
                </p>
              </div>
              <button
                onClick={() => { onLoadPreset('cold_chain_crisis'); showNotification('Memuat Preset: Krisis Kerusakan Pendingin Daging Sapi!'); }}
                className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
              >
                Terapkan Skenario Ini
              </button>
            </div>

            {/* Preset 2 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Najis Mughallazah & Halal Contamination
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Kontaminasi Silang Gelatin Babi di Inbound & Ritual Sertu
                </h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Truk kargo membongkar drum gelatin porcine tanpa sertifikat yang bocor di dock penerimaan. Forklift F-02 terkontaminasi dan harus disucikan dengan 7 bilasan air tanah.
                </p>
              </div>
              <button
                onClick={() => { onLoadPreset('spill_sertu'); showNotification('Memuat Preset: Kontaminasi Silang Inbound & Pensucian Sertu!'); }}
                className="w-full py-2 bg-slate-800 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                Terapkan Skenario Ini
              </button>
            </div>

            {/* Preset 3 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Green Logistics & Omnichannel E-Commerce
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Lonjakan Peak Season Ramadhan 320% & Rute Armada EV
                </h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Menyeimbangkan wave picking 1,500 order e-commerce bahan makanan halal dengan target pengurangan emisi karbon perkotaan menggunakan van listrik dan kemasan kraft.
                </p>
              </div>
              <button
                onClick={() => { onLoadPreset('ramadhan_green'); showNotification('Memuat Preset: Lonjakan Peak Season Ramadhan & Rute EV!'); }}
                className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
              >
                Terapkan Skenario Ini
              </button>
            </div>

            {/* Preset 4 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-rose-500/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Blockchain & Audit Forensik BPJPH
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Audit Manipulasi Data Suhu & Smart Contract Lock
                </h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Auditor BPJPH mendeteksi perbedaan hash antara catatan perjalanan transporter dengan log WMS. Mahasiswa harus membuktikan keaslian batch melalui buku besar blockchain.
                </p>
              </div>
              <button
                onClick={() => { onLoadPreset('blockchain_audit'); showNotification('Memuat Preset: Audit Forensik Blockchain BPJPH!'); }}
                className="w-full py-2 bg-slate-800 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors"
              >
                Terapkan Skenario Ini
              </button>
            </div>

            {/* Preset 5 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Biopharmaceutical Halal Logistics
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Distribusi Vaksin & Produk Biologis Halal Ultra-Cold
                </h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Penanganan bahan aktif vaksin halal suhu sangat rendah (-25°C) dengan persyaratan tidak adanya enzim tripsin babi pada media kultur.
                </p>
              </div>
              <button
                onClick={() => { onLoadPreset('biopharm_vaccine'); showNotification('Memuat Preset: Logistik Biologis & Vaksin Halal!'); }}
                className="w-full py-2 bg-slate-800 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
              >
                Terapkan Skenario Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: ADD NEW INVENTORY SKU --- */}
      {activeSubTab === 'add_sku' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-emerald-400" />
              <span>Formulir Input SKU & Penerimaan Palet Baru ke Rak Gudang</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data yang Anda input akan langsung dialokasikan ke Bay terpilih, menambah okupansi palet, dan dievaluasi dalam Indeks Kepatuhan Halal WMS.
            </p>
          </div>

          <form onSubmit={handleCreateSkuSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kode SKU:</label>
              <input
                type="text"
                required
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Barang / Produk:</label>
              <input
                type="text"
                required
                value={skuName}
                onChange={(e) => setSkuName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kategori Barang:</label>
              <select
                value={skuCategory}
                onChange={(e) => setSkuCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="Meat & Poultry">Meat & Poultry (Daging & Unggas)</option>
                <option value="Dairy & Fats">Dairy & Fats (Susu & Lemak Nabati)</option>
                <option value="Raw Material">Raw Material (Bahan Baku / Kimia)</option>
                <option value="Seasoning & Flavour">Seasoning & Flavour (Bumbu & Rempah)</option>
                <option value="Beverages">Beverages (Minuman)</option>
                <option value="Packaging">Packaging (Kemasan Halal)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Jumlah Palet & Satuan:</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={skuQty}
                  onChange={(e) => setSkuQty(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
                <input
                  type="text"
                  value={skuUnit}
                  onChange={(e) => setSkuUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pilih Rak / Bay Alokasi:</label>
              <select
                value={skuBayId}
                onChange={(e) => setSkuBayId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-semibold"
              >
                {bays.map((bay) => (
                  <option key={bay.id} value={bay.id}>
                    {bay.code} ({bay.zone}) - Sisa Kapasitas: {bay.capacityPallets - bay.occupiedPallets}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rentang Suhu (°C Min s/d Max):</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={skuMinTemp}
                  onChange={(e) => setSkuMinTemp(Number(e.target.value))}
                  placeholder="Min"
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-cyan-400 font-mono"
                />
                <input
                  type="number"
                  value={skuMaxTemp}
                  onChange={(e) => setSkuMaxTemp(Number(e.target.value))}
                  placeholder="Max"
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor Sertifikat Halal BPJPH:</label>
              <input
                type="text"
                required
                value={skuCertNo}
                onChange={(e) => setSkuCertNo(e.target.value)}
                placeholder="Format: ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Sertifikat Halal:</label>
              <select
                value={skuCertStatus}
                onChange={(e) => setSkuCertStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="ACTIVE">ACTIVE (Valid Resmi)</option>
                <option value="EXPIRING_SOON">EXPIRING_SOON (Mendekati Kadaluwarsa)</option>
                <option value="EXPIRED">EXPIRED (Kedaluwarsa - Wajib Karantina)</option>
                <option value="REVOKED">REVOKED (Dicabut / Tidak Sah)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tingkat Kekritisan HCCP:</label>
              <select
                value={skuHccpCrit}
                onChange={(e) => setSkuHccpCrit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="CRITICAL_HIGH">CRITICAL_HIGH (Daging/Hewani/Cold Chain)</option>
                <option value="CRITICAL_MEDIUM">CRITICAL_MEDIUM (Dairy/Premiks Olahan)</option>
                <option value="STANDARD">STANDARD (Minyak Nabati/Kemasan)</option>
              </select>
            </div>

            <div className="md:col-span-3 pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan & Tempatkan Palet ke Gudang</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- SUBTAB 3: CREATE CUSTOM LAB SCENARIO --- */}
      {activeSubTab === 'create_scenario' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-emerald-400" />
              <span>Rancang Skenario Praktikum Mahasiswa Baru (Custom Case Study Builder)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dosen atau asisten lab dapat menambahkan soal ujian studi kasus baru dengan parameter pemicu, tugas analisis, dan opsi tindakan yang dinilai otomatis.
            </p>
          </div>

          <form onSubmit={handleCreateScenarioSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Judul Kasus Praktikum:</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori Bidang:</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                >
                  <option value="IoT & Cold Chain">IoT & Cold Chain</option>
                  <option value="Halal Cross-Contamination">Halal Cross-Contamination (Najis)</option>
                  <option value="Green E-Commerce Peak">Green E-Commerce Peak</option>
                  <option value="Regulatory Audit BPJPH">Regulatory Audit BPJPH</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deskripsi Masalah Skenario:</label>
              <textarea
                rows={3}
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kondisi Pemicu Alarm / Trigger:</label>
                <input
                  type="text"
                  required
                  value={customTrigger}
                  onChange={(e) => setCustomTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-amber-300"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tingkat Kesulitan:</label>
                <select
                  value={customDifficulty}
                  onChange={(e) => setCustomDifficulty(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                >
                  <option value="Pemula">Pemula (Tingkat Sarjana Awal)</option>
                  <option value="Menengah">Menengah (Semester 5-6)</option>
                  <option value="Lanjutan">Lanjutan (Praktik Profesi / Akhir)</option>
                </select>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-slate-200 block">Daftar Tugas Praktikum Mahasiswa:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tugas 1"
                  value={customTask1}
                  onChange={(e) => setCustomTask1(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                />
                <input
                  type="text"
                  required
                  placeholder="Tugas 2"
                  value={customTask2}
                  onChange={(e) => setCustomTask2(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option Correct */}
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-700/50 rounded-lg space-y-2">
                <span className="font-bold text-emerald-400 block">Opsi Solusi Tepat (Skor +100):</span>
                <input
                  type="text"
                  required
                  placeholder="Label Tindakan Benar"
                  value={customOpt1Label}
                  onChange={(e) => setCustomOpt1Label(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Penjelasan Ilmiah / Regulasi"
                  value={customOpt1Expl}
                  onChange={(e) => setCustomOpt1Expl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-300"
                />
              </div>

              {/* Option Incorrect */}
              <div className="p-3.5 bg-rose-950/20 border border-rose-700/50 rounded-lg space-y-2">
                <span className="font-bold text-rose-400 block">Opsi Solusi Keliru (Penalti -50):</span>
                <input
                  type="text"
                  required
                  placeholder="Label Tindakan Salah"
                  value={customOpt2Label}
                  onChange={(e) => setCustomOpt2Label(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Penjelasan Mengapa Keliru"
                  value={customOpt2Expl}
                  onChange={(e) => setCustomOpt2Expl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-rose-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simpan Skenario & Buka di Lab</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- SUBTAB 4: JSON IMPORT / EXPORT --- */}
      {activeSubTab === 'json_io' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Impor & Ekspor Dataset Kasus (Format JSON)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simpan seluruh konfigurasi gudang, palet barang, sensor, dan skenario lab menjadi file JSON untuk dibagikan kepada mahasiswa sebagai lembar tugas ujian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJson}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor & Unduh File Dataset (.json)</span>
            </button>

            <button
              onClick={() => {
                if (!jsonInput) {
                  const fullState = {
                    exportedAt: new Date().toISOString(),
                    appName: 'HalalLogix WMS',
                    bays,
                    inventory,
                    scenarios
                  };
                  const jsonStr = JSON.stringify(fullState, null, 2);
                  setJsonInput(jsonStr);
                  navigator.clipboard?.writeText(jsonStr);
                } else {
                  navigator.clipboard?.writeText(jsonInput);
                }
                showNotification('Teks JSON berhasil disalin ke clipboard!');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Teks JSON ke Clipboard</span>
            </button>

            <button
              onClick={handleImportJson}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Impor & Muat dari Teks JSON di Bawah</span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-semibold block">Teks Dataset JSON (Salin atau Tempel di sini):</label>
            <textarea
              rows={12}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Tempelkan isi file JSON studi kasus di sini lalu klik "Impor & Muat dari Teks JSON di Bawah"...'
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
