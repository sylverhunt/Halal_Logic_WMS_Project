import { WarehouseBay, InventoryItem, IoTSensorNode, BlockchainBlock, VehicleFleet, PurchaseOrder, HCCPRule, LabScenario, AuditChecklistItem } from '../types/logistics';
import { calculateSimpleHash } from '../utils/logisticsFormulas';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'SKU-001',
    sku: 'HLX-BEEF-AUS01',
    name: 'Daging Sapi Ribeye Halal (Import Australia)',
    category: 'Meat & Poultry',
    quantity: 48,
    unit: 'Pallet (1,200 kg)',
    bayId: 'bay-c1',
    zone: 'HALAL_COLD_CHAIN',
    weightKg: 1200,
    temperatureRequired: { min: -22, max: -18 },
    halalCert: {
      certNumber: 'ID00410000213450923',
      issuer: 'BPJPH',
      validUntil: '2028-11-20',
      standard: 'UU JPH No. 33/2014',
      status: 'ACTIVE',
      slaughterhouseCode: 'RPH-AUS-EST381-JULEHA',
      auditorNotes: 'Penyembelihan halal sesuai syariat oleh Juleha tersertifikasi Halal Australia & diakui BPJPH MRA'
    },
    hccpCriticality: 'CRITICAL_HIGH',
    batchLot: 'LOT-2026-BF-091',
    expiryDate: '2027-04-15',
    inboundDate: '2026-09-10',
    dailyDemand: 12,
    leadTimeDays: 7,
    unitCostIdr: 165000000,
    holdingCostPerUnitIdr: 4500000,
    orderCostIdr: 1200000,
    rfidTag: 'E28011606000020478B45001'
  },
  {
    id: 'SKU-002',
    sku: 'HLX-CHICK-KARKAS',
    name: 'Ayam Karkas Segar Halal Grade A',
    category: 'Meat & Poultry',
    quantity: 72,
    unit: 'Pallet (800 kg)',
    bayId: 'bay-c2',
    zone: 'HALAL_COLD_CHAIN',
    weightKg: 800,
    temperatureRequired: { min: 0, max: 4 },
    halalCert: {
      certNumber: 'ID31110001892300424',
      issuer: 'BPJPH',
      validUntil: '2028-05-12',
      standard: 'HAS 23000',
      status: 'ACTIVE',
      slaughterhouseCode: 'RPHU-SUBANG-04',
      auditorNotes: 'RPHU memiliki sertifikat halal aktif dan audit berkala'
    },
    hccpCriticality: 'CRITICAL_HIGH',
    batchLot: 'LOT-2026-CK-114',
    expiryDate: '2026-10-30',
    inboundDate: '2026-10-01',
    dailyDemand: 24,
    leadTimeDays: 3,
    unitCostIdr: 36000000,
    holdingCostPerUnitIdr: 1800000,
    orderCostIdr: 800000,
    rfidTag: 'E28011606000020478B45002'
  },
  {
    id: 'SKU-003',
    sku: 'HLX-MILK-PASTEUR',
    name: 'Susu Pasteurisasi Segar Halal 1000ml',
    category: 'Dairy & Fats',
    quantity: 60,
    unit: 'Pallet (900 Liter)',
    bayId: 'bay-c3',
    zone: 'HALAL_COLD_CHAIN',
    weightKg: 950,
    temperatureRequired: { min: 2, max: 4 },
    halalCert: {
      certNumber: 'ID32110002341901022',
      issuer: 'BPJPH',
      validUntil: '2027-10-18',
      standard: 'HAS 23000',
      status: 'ACTIVE',
      auditorNotes: 'Kandungan enzim mikrobial terverifikasi halal tanpa gelatin hewani'
    },
    hccpCriticality: 'CRITICAL_MEDIUM',
    batchLot: 'LOT-2026-MK-882',
    expiryDate: '2026-11-15',
    inboundDate: '2026-10-08',
    dailyDemand: 18,
    leadTimeDays: 4,
    unitCostIdr: 28000000,
    holdingCostPerUnitIdr: 1200000,
    orderCostIdr: 650000,
    rfidTag: 'E28011606000020478B45003'
  },
  {
    id: 'SKU-004',
    sku: 'HLX-PALM-OIL-RSPO',
    name: 'Minyak Nabati Sawit Halal RSPO Refined',
    category: 'Raw Material',
    quantity: 120,
    unit: 'Drum Pallet (1,000 kg)',
    bayId: 'bay-a1',
    zone: 'HALAL_AMBIENT',
    weightKg: 1000,
    temperatureRequired: { min: 20, max: 32 },
    halalCert: {
      certNumber: 'ID00210000045610821',
      issuer: 'BPJPH',
      validUntil: '2027-08-30',
      standard: 'SNI 99004:2021',
      status: 'ACTIVE',
      auditorNotes: 'Minyak 100% nabati murni, tangki angkut bersertifikat halal food grade'
    },
    hccpCriticality: 'STANDARD',
    batchLot: 'LOT-2026-PO-551',
    expiryDate: '2028-06-30',
    inboundDate: '2026-08-15',
    dailyDemand: 30,
    leadTimeDays: 5,
    unitCostIdr: 18500000,
    holdingCostPerUnitIdr: 550000,
    orderCostIdr: 500000,
    rfidTag: 'E28011606000020478B45004'
  },
  {
    id: 'SKU-005',
    sku: 'HLX-SPICE-EXTRACT',
    name: 'Premiks Rempah & Bumbu Alami Ekstrak Halal',
    category: 'Seasoning & Flavour',
    quantity: 35,
    unit: 'Pallet (500 kg)',
    bayId: 'bay-a2',
    zone: 'HALAL_AMBIENT',
    weightKg: 500,
    temperatureRequired: { min: 20, max: 28 },
    halalCert: {
      certNumber: 'ID33110000984210123',
      issuer: 'BPJPH',
      validUntil: '2027-01-14',
      standard: 'HAS 23000',
      status: 'EXPIRING_SOON',
      auditorNotes: 'Perlu resertifikasi perpanjangan dalam 90 hari, formulasi bebas alkohol khamr'
    },
    hccpCriticality: 'CRITICAL_MEDIUM',
    batchLot: 'LOT-2026-SP-309',
    expiryDate: '2027-08-20',
    inboundDate: '2026-07-22',
    dailyDemand: 8,
    leadTimeDays: 6,
    unitCostIdr: 45000000,
    holdingCostPerUnitIdr: 1500000,
    orderCostIdr: 750000,
    rfidTag: 'E28011606000020478B45005'
  },
  {
    id: 'SKU-006',
    sku: 'HLX-PKG-ECO-KRAFT',
    name: 'Karton Box Food-Grade Kraft Biodegradable Halal',
    category: 'Packaging',
    quantity: 200,
    unit: 'Bundle Pallet',
    bayId: 'bay-b1',
    zone: 'HALAL_AMBIENT',
    weightKg: 350,
    temperatureRequired: { min: 18, max: 35 },
    halalCert: {
      certNumber: 'ID00110003291820623',
      issuer: 'BPJPH',
      validUntil: '2028-09-19',
      standard: 'SNI 99004:2021',
      status: 'ACTIVE',
      auditorNotes: 'Bahan perekat lem kanji nabati, bebas lemak babi (animal fat free)'
    },
    hccpCriticality: 'STANDARD',
    batchLot: 'LOT-2026-BX-402',
    expiryDate: '2030-12-31',
    inboundDate: '2026-06-10',
    dailyDemand: 45,
    leadTimeDays: 2,
    unitCostIdr: 8500000,
    holdingCostPerUnitIdr: 150000,
    orderCostIdr: 300000,
    rfidTag: 'E28011606000020478B45006'
  },
  {
    id: 'SKU-007',
    sku: 'HLX-SUSP-IMPORT-GEL',
    name: 'Gelatin Impor Non-Halal (Batch Dikarantina)',
    category: 'Raw Material',
    quantity: 12,
    unit: 'Drum Pallet (300 kg)',
    bayId: 'bay-q1',
    zone: 'QUARANTINE',
    weightKg: 300,
    temperatureRequired: { min: 15, max: 25 },
    halalCert: {
      certNumber: 'PENDING-AUDIT-NO-CERT',
      issuer: 'UNVERIFIED',
      validUntil: '2026-01-01',
      standard: 'UU JPH No. 33/2014',
      status: 'REVOKED',
      auditorNotes: 'DITOLAK: Mengandung porcine DNA derivatif tanpa sertifikat Halal BPJPH. Wajib diisolasi di Bay Karantina Q-1!'
    },
    hccpCriticality: 'CRITICAL_HIGH',
    allergenAlert: 'POTENSI NAJIS MUGHALLAZAH - DILARANG BERSENTUHAN DENGAN MHE HALAL',
    batchLot: 'LOT-SUSPECT-999',
    expiryDate: '2026-12-31',
    inboundDate: '2026-10-10',
    dailyDemand: 0,
    leadTimeDays: 30,
    unitCostIdr: 12000000,
    holdingCostPerUnitIdr: 900000,
    orderCostIdr: 500000,
    rfidTag: 'E28011606000020478B45999'
  }
];

export const INITIAL_BAYS: WarehouseBay[] = [
  {
    id: 'bay-a1',
    code: 'A-01',
    zone: 'HALAL_AMBIENT',
    capacityPallets: 150,
    occupiedPallets: 120,
    temperature: 24.2,
    targetTemp: { min: 20, max: 28 },
    humidity: 58,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[3]]
  },
  {
    id: 'bay-a2',
    code: 'A-02',
    zone: 'HALAL_AMBIENT',
    capacityPallets: 150,
    occupiedPallets: 35,
    temperature: 24.6,
    targetTemp: { min: 20, max: 28 },
    humidity: 60,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[4]]
  },
  {
    id: 'bay-b1',
    code: 'B-01',
    zone: 'HALAL_AMBIENT',
    capacityPallets: 250,
    occupiedPallets: 200,
    temperature: 25.1,
    targetTemp: { min: 18, max: 30 },
    humidity: 55,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[5]]
  },
  {
    id: 'bay-b2',
    code: 'B-02',
    zone: 'HALAL_AMBIENT',
    capacityPallets: 200,
    occupiedPallets: 0,
    temperature: 24.0,
    targetTemp: { min: 18, max: 30 },
    humidity: 56,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: []
  },
  {
    id: 'bay-c1',
    code: 'C-01 (Deep Freeze)',
    zone: 'HALAL_COLD_CHAIN',
    capacityPallets: 80,
    occupiedPallets: 48,
    temperature: -20.4,
    targetTemp: { min: -22, max: -18 },
    humidity: 82,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[0]]
  },
  {
    id: 'bay-c2',
    code: 'C-02 (Chilled Meat)',
    zone: 'HALAL_COLD_CHAIN',
    capacityPallets: 100,
    occupiedPallets: 72,
    temperature: 2.1,
    targetTemp: { min: 0, max: 4 },
    humidity: 88,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[1]]
  },
  {
    id: 'bay-c3',
    code: 'C-03 (Dairy Chill)',
    zone: 'HALAL_COLD_CHAIN',
    capacityPallets: 90,
    occupiedPallets: 60,
    temperature: 3.2,
    targetTemp: { min: 2, max: 4 },
    humidity: 85,
    airCirculationClean: true,
    mheDedicatedHalal: true,
    status: 'OPTIMAL',
    items: [INITIAL_INVENTORY[2]]
  },
  {
    id: 'bay-q1',
    code: 'Q-01 (Karantina Mutlak)',
    zone: 'QUARANTINE',
    capacityPallets: 30,
    occupiedPallets: 12,
    temperature: 21.0,
    targetTemp: { min: 15, max: 28 },
    humidity: 62,
    airCirculationClean: true,
    mheDedicatedHalal: false,
    status: 'WARNING',
    items: [INITIAL_INVENTORY[6]]
  },
  {
    id: 'bay-nh1',
    code: 'NH-01 (Non-Halal Terisolasi)',
    zone: 'NON_HALAL_SEGREGATED',
    capacityPallets: 50,
    occupiedPallets: 15,
    temperature: 22.0,
    targetTemp: { min: 18, max: 28 },
    humidity: 60,
    airCirculationClean: false,
    mheDedicatedHalal: false,
    status: 'OPTIMAL',
    items: []
  }
];

export const INITIAL_SENSORS: IoTSensorNode[] = [
  {
    id: 'SENS-01',
    name: 'Deep Freeze RTD Cold Probe C-01',
    type: 'TEMPERATURE',
    location: 'Zone C-01 (Beef Storage)',
    value: -20.4,
    unit: '°C',
    status: 'NOMINAL',
    lastUpdated: '10 detik lalu',
    history: [-20.1, -20.3, -20.5, -20.4, -20.4]
  },
  {
    id: 'SENS-02',
    name: 'Chilled Meat Sensor C-02',
    type: 'TEMPERATURE',
    location: 'Zone C-02 (Poultry Chiller)',
    value: 2.1,
    unit: '°C',
    status: 'NOMINAL',
    lastUpdated: '8 detik lalu',
    history: [1.9, 2.0, 2.1, 2.2, 2.1]
  },
  {
    id: 'SENS-03',
    name: 'Chilled Dairy Sensor C-03',
    type: 'TEMPERATURE',
    location: 'Zone C-03 (Dairy Pasteurized)',
    value: 3.2,
    unit: '°C',
    status: 'NOMINAL',
    lastUpdated: '12 detik lalu',
    history: [3.1, 3.2, 3.3, 3.2, 3.2]
  },
  {
    id: 'SENS-04',
    name: 'Ambient Relative Humidity Probe A-01',
    type: 'HUMIDITY',
    location: 'Zone A-01 (Vegetable Oil Racks)',
    value: 58.4,
    unit: '% RH',
    status: 'NOMINAL',
    lastUpdated: '15 detik lalu',
    history: [57.8, 58.0, 58.2, 58.5, 58.4]
  },
  {
    id: 'SENS-05',
    name: 'RFID Fast-Gate Inbound Dock 1',
    type: 'RFID_GATE',
    location: 'Receiving Dock 1 (Halal Dedicated)',
    value: 'PASSED (100% Tag BPJPH Valid)',
    unit: 'Readings/sec: 42',
    status: 'NOMINAL',
    lastUpdated: '2 menit lalu',
    history: [40, 42, 45, 42, 42]
  },
  {
    id: 'SENS-06',
    name: 'AGV Robot Forklift #04 Telemetry',
    type: 'AGV_TELEMETRY',
    location: 'Main Aisle AS/RS Bay C',
    value: 'Battery: 94% | Vibe: 0.12g | Dedicated Halal Tag: VERIFIED',
    unit: 'Speed: 1.4 m/s',
    status: 'NOMINAL',
    lastUpdated: 'Real-time',
    history: [95, 95, 94, 94, 94]
  },
  {
    id: 'SENS-07',
    name: 'Electronic Seal (E-Seal) Tamper Sensor',
    type: 'DOOR_SEAL',
    location: 'Reefer Container B-9012-HLX',
    value: 'LOCKED & SEALED (0 Tamper Event)',
    unit: 'Integrity: 100%',
    status: 'NOMINAL',
    lastUpdated: '1 menit lalu',
    history: [100, 100, 100, 100, 100]
  }
];

export const INITIAL_BLOCKCHAIN: BlockchainBlock[] = [
  {
    index: 0,
    timestamp: '2026-09-01T08:00:00Z',
    data: {
      action: 'GENESIS_SUPPLY_CHAIN_INITIALIZATION',
      product: 'HalalLogix Smart Ledger Network',
      batchLot: 'GENESIS-000',
      actor: 'BPJPH & Kemenag RI Authority',
      location: 'Jakarta, Indonesia',
      halalCertNo: 'BPJPH-ROOT-KEY-2026',
      tempLog: 0,
      signature: '0x8fbc9102194812a0f8'
    },
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '0000a4b7e891c2f3d456789abcdef0123456789abcdef0123456789abcdef012',
    nonce: 1024,
    smartContractStatus: 'VERIFIED'
  },
  {
    index: 1,
    timestamp: '2026-09-05T04:30:00Z',
    data: {
      action: 'HALAL_SLAUGHTER_VERIFIED',
      product: 'Australian Black Angus Beef',
      batchLot: 'LOT-2026-BF-091',
      actor: 'Juleha Certified Auditor (JPH)',
      location: 'Halal Slaughterhouse EST-381, Victoria',
      halalCertNo: 'ID00410000213450923',
      tempLog: -19.5,
      signature: '0x334acbc12891f7a01d'
    },
    previousHash: '0000a4b7e891c2f3d456789abcdef0123456789abcdef0123456789abcdef012',
    hash: '3a88bf2019488a109ecf8102374b5c7710928374651928374651029384756102',
    nonce: 4921,
    smartContractStatus: 'VERIFIED'
  },
  {
    index: 2,
    timestamp: '2026-09-10T14:15:00Z',
    data: {
      action: 'COLD_CHAIN_INBOUND_WMS_RECEIVING',
      product: 'Australian Black Angus Beef',
      batchLot: 'LOT-2026-BF-091',
      actor: 'WMS Halal Logistics Operator #14',
      location: 'Receiving Dock 1 - HalalLogix Hub',
      halalCertNo: 'ID00410000213450923',
      tempLog: -20.2,
      signature: '0x55bcda9910382741ab'
    },
    previousHash: '3a88bf2019488a109ecf8102374b5c7710928374651928374651029384756102',
    hash: '772bca0192837465102938475610293847561029384756102938475610293847',
    nonce: 8392,
    smartContractStatus: 'VERIFIED'
  },
  {
    index: 3,
    timestamp: '2026-10-01T09:00:00Z',
    data: {
      action: 'POULTRY_PROCESSING_&_INSPECTION',
      product: 'Ayam Karkas Segar Halal Grade A',
      batchLot: 'LOT-2026-CK-114',
      actor: 'PT Ciomas Halal Poultry Processing',
      location: 'Subang Cold Logistics Hub',
      halalCertNo: 'ID31110001892300424',
      tempLog: 1.8,
      signature: '0x992019abcf81726450'
    },
    previousHash: '772bca0192837465102938475610293847561029384756102938475610293847',
    hash: 'bb10293847561029384756102938475610293847561029384756102938475610',
    nonce: 6214,
    smartContractStatus: 'VERIFIED'
  }
];

export const INITIAL_FLEET: VehicleFleet[] = [
  {
    id: 'VEH-01',
    plateNumber: 'B 9102 HLX',
    type: 'ELECTRIC_VAN',
    capacityKg: 1500,
    currentLoadKg: 850,
    fuelType: 'ELECTRIC',
    emissionFactorKgCo2PerKm: 0.18,
    status: 'TRANSIT',
    halalCertified: true,
    cleaningLogDate: '2026-10-11 (Bebas Najis)',
    currentTempCelsius: 3.4,
    destination: 'Superindo Kemang (B2B Hub)',
    etaMinutes: 24
  },
  {
    id: 'VEH-02',
    plateNumber: 'B 9245 EV',
    type: 'ELECTRIC_VAN',
    capacityKg: 1500,
    currentLoadKg: 1200,
    fuelType: 'ELECTRIC',
    emissionFactorKgCo2PerKm: 0.18,
    status: 'LOADING',
    halalCertified: true,
    cleaningLogDate: '2026-10-12 (Tersertifikasi)',
    currentTempCelsius: 2.1,
    destination: 'Grand Lucky SCBD (B2B Wave 2)',
    etaMinutes: 45
  },
  {
    id: 'VEH-03',
    plateNumber: 'B 9801 TRK',
    type: 'DIESEL_TRUCK',
    capacityKg: 8000,
    currentLoadKg: 6400,
    fuelType: 'DIESEL',
    emissionFactorKgCo2PerKm: 0.82,
    status: 'TRANSIT',
    halalCertified: true,
    cleaningLogDate: '2026-10-09 (Audit Lengkap)',
    currentTempCelsius: -19.8,
    destination: 'Distribution Center Surabaya',
    etaMinutes: 180
  },
  {
    id: 'VEH-04',
    plateNumber: 'B 4108 ECO',
    type: 'CARGO_EBIKE',
    capacityKg: 200,
    currentLoadKg: 140,
    fuelType: 'ELECTRIC',
    emissionFactorKgCo2PerKm: 0.04,
    status: 'TRANSIT',
    halalCertified: true,
    cleaningLogDate: '2026-10-12 (Box Sanitized)',
    currentTempCelsius: 4.0,
    destination: 'Omnichannel E-Commerce Quick Drops (B2C)',
    etaMinutes: 12
  }
];

export const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'PO-2026-0881',
    poNumber: 'PO/HLX/2026/X/0881',
    supplierName: 'PT Nusantara Agro Halal Sejahtera',
    supplierHalalGrade: 'A',
    supplierCertNo: 'ID00210000045610821',
    items: [
      { sku: 'HLX-PALM-OIL-RSPO', name: 'Minyak Nabati Sawit Halal RSPO Refined', qty: 50, priceIdr: 18500000 }
    ],
    totalAmountIdr: 925000000,
    orderDate: '2026-10-08',
    deliveryDate: '2026-10-13',
    status: 'HALAL_VERIFIED'
  },
  {
    id: 'PO-2026-0882',
    poNumber: 'PO/HLX/2026/X/0882',
    supplierName: 'Global Meat Australia Ltd (Halal Div)',
    supplierHalalGrade: 'A',
    supplierCertNo: 'ID00410000213450923',
    items: [
      { sku: 'HLX-BEEF-AUS01', name: 'Daging Sapi Ribeye Halal Import', qty: 25, priceIdr: 165000000 }
    ],
    totalAmountIdr: 4125000000,
    orderDate: '2026-10-09',
    deliveryDate: '2026-10-16',
    status: 'INBOUND_INSPECTING'
  },
  {
    id: 'PO-2026-0883',
    poNumber: 'PO/HLX/2026/X/0883',
    supplierName: 'Sinochem Additives Non-Halal Corp',
    supplierHalalGrade: 'UNRATED',
    supplierCertNo: 'NO-BPJPH-CERT',
    items: [
      { sku: 'HLX-SUSP-IMPORT-GEL', name: 'Gelatin Impor Non-Halal Suspicious', qty: 10, priceIdr: 12000000 }
    ],
    totalAmountIdr: 120000000,
    orderDate: '2026-10-10',
    deliveryDate: '2026-10-11',
    status: 'REJECTED_NON_COMPLIANT',
    rejectionReason: 'Ditolak oleh Sistem: Tidak memiliki sertifikat Halal BPJPH dan mengandung turunan babi!'
  }
];

export const HCCP_RULES: HCCPRule[] = [
  {
    id: 'HCCP-1',
    principle: 1,
    title: 'Analisis Bahaya Kontaminasi Najis & Bahan Haram',
    hazardDescription: 'Masuknya bahan baku turunan babi, bangkai, darah, atau alkohol/khamr ke gudang halal',
    criticalLimit: '0% toleransi bahan non-halal di area penyimpanan halal',
    monitoringMethod: 'Pengecekan nomor sertifikat BPJPH & RFID barcode scanning saat inbound dock',
    correctiveAction: 'Penolakan masuk atau pemindahan seketika ke Karantina Q-01',
    frequency: 'Setiap lot penerimaan barang',
    regulationBasis: 'UU JPH No. 33/2014 Ps 21 & SNI 99004:2021 Klausul 6.2'
  },
  {
    id: 'HCCP-2',
    principle: 2,
    title: 'Penentuan Titik Kendali Kritis (CCP) Pergudangan',
    hazardDescription: 'Percampuran fisik antara produk halal dan barang non-halal/meragukan di rak',
    criticalLimit: 'Pemisahan fisik minimum 1.5 meter atau sekat dinding, rak bertingkat halal tidak boleh di bawah non-halal',
    monitoringMethod: 'WMS Slotting Rule Lock & Barcode Bay Location Verification',
    correctiveAction: 'Relokasi barang, penandaan ulang, dan isolasi rak bermasalah',
    frequency: 'Setiap proses put-away dan pemindahan barang',
    regulationBasis: 'HAS 23000 Kriteria Fasilitas Gudang & SNI 99004 Klausul 7.1'
  },
  {
    id: 'HCCP-3',
    principle: 3,
    title: 'Penetapan Batas Kritis Suhu Cold Chain & Integritas Kemasan',
    hazardDescription: 'Kenaikan suhu menyebabkan kerusakan daging atau kemasan pecah menimbulkan rembesan najis',
    criticalLimit: 'Frozen Meat: <= -18°C; Chilled: 0°C s/d 4°C; Kemasan utuh 100% tanpa bocor',
    monitoringMethod: 'IoT RTD Sensor real-time telemetry streaming setiap 10 detik',
    correctiveAction: 'Aktivasi chiller cadangan otomatis, karantina batch, uji mikrobiologis & audit halal',
    frequency: 'Kontinu real-time 24/7',
    regulationBasis: 'SNI 99004:2021 Klausul 7.4 & Pedoman Cold Chain Halal'
  },
  {
    id: 'HCCP-4',
    principle: 4,
    title: 'Peralatan Penanganan Material (MHE) Terdedikasi',
    hazardDescription: 'Forklift, hand pallet, atau trolley mengangkut barang haram lalu mencemari palet halal',
    criticalLimit: 'MHE Halal memiliki label hijau "KHUSUS PRODUK HALAL" dan dilarang masuk area non-halal',
    monitoringMethod: 'RFID Reader pada gerbang zona & visual logbook MHE',
    correctiveAction: 'Jika terjadi pelanggaran: Wajib prosedur pencucian Samak/Sertu sebelum digunakan kembali',
    frequency: 'Setiap pergerakan antar zona gudang',
    regulationBasis: 'HAS 23000 Kebijakan Bahan & Peralatan'
  },
  {
    id: 'HCCP-5',
    principle: 5,
    title: 'Protokol Sanitasi & Pensucian (Samak / Sertu)',
    hazardDescription: 'Tumpahan atau kontak langsung dengan najis Mughallazah (anjing/babi) pada fasilitas atau MHE',
    criticalLimit: 'Dicuci 7 kali dengan air bersih, salah satunya dicampur dengan tanah/debu suci yang bersih',
    monitoringMethod: 'Inspeksi Penyelia Halal tersertifikasi & dokumentasi Berita Acara Sertu',
    correctiveAction: 'Isolasi area selama 24 jam hingga Berita Acara Sertu disahkan Penyelia Halal',
    frequency: 'Setiap insiden dugaan kontaminasi najis berat',
    regulationBasis: 'Fatwa MUI No. 27/2013 & SNI 99004:2021 Klausul 8.3'
  },
  {
    id: 'HCCP-6',
    principle: 6,
    title: 'Prosedur Verifikasi & Traceability Blockchain',
    hazardDescription: 'Pemalsuan sertifikat halal supplier atau manipulasi dokumen logistik jalanan',
    criticalLimit: 'Kesesuaian 100% hash transaksi pada immutable blockchain ledger',
    monitoringMethod: 'Smart Contract auto-audit terhadap data SIHALAL BPJPH',
    correctiveAction: 'Blokir vendor otomatis pada e-procurement WMS',
    frequency: 'Setiap transaksi supply chain',
    regulationBasis: 'UU JPH No. 33/2014 Ps 44 (Ketertelusuran Produk Halal)'
  },
  {
    id: 'HCCP-7',
    principle: 7,
    title: 'Dokumentasi & Audit Kepatuhan Real-Time',
    hazardDescription: 'Kehilangan jejak rekam logistik saat audit mendadak BPJPH / LPPOM',
    criticalLimit: 'Semua log pergerakan, suhu, dan sertifikasi tersimpan minimal 2 tahun secara digital',
    monitoringMethod: 'WMS Data-Driven Compliance Index & Automated Audit Logger',
    correctiveAction: 'Audit internal berkala dan simulasi audit semesteran',
    frequency: 'Harian dan Mingguan',
    regulationBasis: 'HAS 23000 Kriteria Audit Internal & Kaji Ulang Manajemen'
  }
];

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: 'SCENARIO-1',
    title: 'Kasus 1: Peringatan Kenaikan Suhu Cold Chain Daging Sapi (Bay C-01)',
    category: 'IoT & Cold Chain',
    difficulty: 'Menengah',
    scenarioDescription: 'Sensor IoT SENS-01 di Bay C-01 mendeteksi suhu naik dari -20.4°C ke -8.5°C karena gangguan kompresor reefer sekunder. Daging sapi impor Ribeye bernilai tinggi berisiko mengalami pencairan (thawing) dan penurunan integritas halal bila batas kritis -18°C terlampaui selama > 2 jam.',
    triggerCondition: 'Suhu C-01 > -18°C selama 45 menit',
    initialBayAffected: 'bay-c1',
    tasks: [
      { id: 't1', description: 'Analisis pembacaan sensor IoT dan identifikasi batas kritis HCCP-3', completed: false, points: 25 },
      { id: 't2', description: 'Jalankan protokol pengalihan kompresor darurat atau evakuasi palet ke Bay Chiller cadangan', completed: false, points: 35 },
      { id: 't3', description: 'Periksa catatan blockchain untuk memverifikasi apakah terjadi kontaminasi eksternal', completed: false, points: 20 },
      { id: 't4', description: 'Buat laporan ketidaksesuaian (CAPA) untuk audit BPJPH', completed: false, points: 20 }
    ],
    correctResolutionId: 'action-evacuate-backup',
    options: [
      {
        id: 'action-ignore',
        actionLabel: 'Biarkan sistem berjalan karena suhu masih di bawah 0°C',
        explanation: 'SALAH: Batas kritis HCCP-3 untuk daging beku halal adalah -18°C. Suhu -8.5°C memicu risiko pembusukan bakteri dan pelanggaran standar penyimpanan halal SNI 99004.',
        isCorrect: false,
        scoreDelta: -20
      },
      {
        id: 'action-evacuate-backup',
        actionLabel: 'Aktivasi unit pendingin sekunder & pindahkan batch ke Bay C-02/cadangan dengan MHE Halal',
        explanation: 'BENAR: Tindakan tepat segera mengembalikan batas kritis cold chain, memindahkan kargo dengan forklift khusus halal, serta mencatat log kejadian ke blockchain ledger.',
        isCorrect: true,
        scoreDelta: 100
      },
      {
        id: 'action-mix-ambient',
        actionLabel: 'Pindahkan pallet sementara ke Bay A-01 (Ambient)',
        explanation: 'SALAH FATAL: Menaruh daging beku di ruang ambient bersuhu 24°C akan menyebabkan daging mencair, merusak kemasan, dan menimbulkan kontaminasi silang cairan.',
        isCorrect: false,
        scoreDelta: -50
      }
    ],
    learningOutcome: 'Mahasiswa memahami interaksi sensor IoT dengan batas kritis HCCP cold chain serta mitigasi cepat tanpa melanggar status integritas halal.'
  },
  {
    id: 'SCENARIO-2',
    title: 'Kasus 2: Kontaminasi Silang Inbound & Penanganan Najis Mughallazah',
    category: 'Halal Cross-Contamination',
    difficulty: 'Lanjutan',
    scenarioDescription: 'Satu truk kargo non-standar tiba di Dock 1 membawa palet gelatin tanpa sertifikat halal BPJPH yang bocor dan menetes ke jalur forklift F-02. Pengemudi tidak memiliki dokumen halal yang valid.',
    triggerCondition: 'Rembesan zat mencurigakan di jalur receiving',
    initialBayAffected: 'bay-q1',
    tasks: [
      { id: 't1', description: 'Hentikan proses inbound dan isolasi palet ke Karantina Q-01', completed: false, points: 25 },
      { id: 't2', description: 'Karantina Forklift F-02 dan cegah penggunaannya di area Halal Dedicated', completed: false, points: 25 },
      { id: 't3', description: 'Eksekusi Prosedur Samak / Sertu (7 kali bilasan termasuk 1 kali air tanah)', completed: false, points: 30 },
      { id: 't4', description: 'Penyelia Halal menerbitkan Berita Acara Penyucian sebelum membuka rute kembali', completed: false, points: 20 }
    ],
    correctResolutionId: 'action-sertu-quarantine',
    options: [
      {
        id: 'action-wipe-cloth',
        actionLabel: 'Cukup bersihkan forklift dengan lap basah deterjen biasa dan lanjutkan kerja',
        explanation: 'SALAH: Jika diduga terkena najis Mughallazah, pembersihan biasa tidak mencukupi menurut Fatwa MUI dan HAS 23000. Harus melalui prosedur Sertu dengan air dan tanah.',
        isCorrect: false,
        scoreDelta: -40
      },
      {
        id: 'action-sertu-quarantine',
        actionLabel: 'Isolasi pallet ke Karantina Q-01, karantina Forklift F-02, dan lakukan Prosedur Sertu 7 bilasan',
        explanation: 'BENAR: Sesuai UU JPH dan SNI 99004, produk diragukan wajib masuk karantina, dan MHE yang terkontaminasi wajib disucikan dengan ritual Sertu yang disaksikan Penyelia Halal.',
        isCorrect: true,
        scoreDelta: 100
      },
      {
        id: 'action-mix-putaway',
        actionLabel: 'Terima barang ke rak A-02 karena kemasan masih terlihat utuh',
        explanation: 'SALAH FATAL: Menempatkan barang tanpa sertifikat halal resmi ke area Halal Dedicated melanggar UU JPH Pasal 21 dan menggugurkan status kehalalan gudang.',
        isCorrect: false,
        scoreDelta: -100
      }
    ],
    learningOutcome: 'Mahasiswa mempraktikkan respon tanggap darurat kontaminasi najis mughallazah, SOP karantina WMS, dan pensucian sertu secara sah.'
  },
  {
    id: 'SCENARIO-3',
    title: 'Kasus 3: Optimalisasi E-Commerce Ramadhan Peak & Rute Distribusi Hijau',
    category: 'Green E-Commerce Peak',
    difficulty: 'Menengah',
    scenarioDescription: 'Menjelang Lebaran, pesanan e-commerce omnichannel untuk bahan makanan halal melonjak 320%. Manajer logistik harus menyeimbangkan kecepatan pemenuhan (wave picking) dengan target pengurangan emisi karbon (Green Logistics) menggunakan armada listrik EV & kemasan berkelanjutan.',
    triggerCondition: 'Lonjakan pesanan 1,500 order/jam',
    tasks: [
      { id: 't1', description: 'Lakukan analisis ABC Slotting untuk menempatkan fast-mover SKU di dekat packing station', completed: false, points: 25 },
      { id: 't2', description: 'Hitung ulang EOQ & Reorder Point dengan safety stock penyangga lonjakan permintaan', completed: false, points: 30 },
      { id: 't3', description: 'Prioritaskan Electric Cargo Van (B 9102 HLX) untuk mengurangi jejak karbon perkotaan', completed: false, points: 25 },
      { id: 't4', description: 'Terapkan kemasan biodegradable ramah lingkungan berlabel halal', completed: false, points: 20 }
    ],
    correctResolutionId: 'action-green-wave-slotting',
    options: [
      {
        id: 'action-all-diesel',
        actionLabel: 'Sewa armada truk diesel tua berkapasitas besar tanpa perhitungan emisi karbon',
        explanation: 'TIDAK OPTIMAL: Emisi karbon melonjak drastis (0.82 kg CO2e/km vs 0.18 kg CO2e/km pada EV), bertentangan dengan prinsip Green E-Logistics & ESG modern.',
        isCorrect: false,
        scoreDelta: 10
      },
      {
        id: 'action-green-wave-slotting',
        actionLabel: 'Re-slotting fast-mover ke Bay A-01/B-01, wave picking omnichannel, dan maksimalkan armada EV bersertifikat halal',
        explanation: 'SANGAT TEPAT: Kombinasi slotting cerdas memangkas waktu tempuh picker di gudang hingga 42%, sementara rute hijau EV memangkas emisi karbon rantai pasok hingga 78%.',
        isCorrect: true,
        scoreDelta: 100
      }
    ],
    learningOutcome: 'Mahasiswa mampu memadukan efisiensi operasional WMS (slotting/wave picking) dengan prinsip Green E-Logistics berkelanjutan.'
  },
  {
    id: 'SCENARIO-4',
    title: 'Kasus 4: Audit Kepatuhan Mendadak BPJPH & Verifikasi Jejak Blockchain',
    category: 'Regulatory Audit BPJPH',
    difficulty: 'Lanjutan',
    scenarioDescription: 'Auditor BPJPH dan LPPOM melakukan audit pengawasan berkala mendadak di gudang. Mereka meminta verifikasi ketertelusuran end-to-end untuk lot daging sapi LOT-2026-BF-091 mulai dari RPH asal hingga bay pendingin saat ini.',
    triggerCondition: 'Inspeksi Audit Lapangan BPJPH',
    tasks: [
      { id: 't1', description: 'Buka modul audit kepatuhan real-time dan tampilkan Halal Integrity Index', completed: false, points: 25 },
      { id: 't2', description: 'Verifikasi hash blok blockchain untuk memastikan tidak ada rekayasa data suhu di perjalanan', completed: false, points: 35 },
      { id: 't3', description: 'Tunjukkan logbook sanitasi MHE dan registrasi Penyelia Halal tersertifikasi', completed: false, points: 20 },
      { id: 't4', description: 'Ekspor Berita Acara Audit Resmi untuk diserahkan ke Auditor BPJPH', completed: false, points: 20 }
    ],
    correctResolutionId: 'action-present-blockchain-audit',
    options: [
      {
        id: 'action-manual-paper',
        actionLabel: 'Cari catatan kertas gudang di lemari arsip lama',
        explanation: 'LAMBAT: Audit mendadak membutuhkan verifikasi cepat data digital terintegrasi (WMS-ERP-Blockchain) sesuai SNI 99004 dan regulasi BPJPH.',
        isCorrect: false,
        scoreDelta: 20
      },
      {
        id: 'action-present-blockchain-audit',
        actionLabel: 'Tampilkan verifikasi QR Code blockchain, sertifikat SIHALAL aktif, dan log IoT telemetri realtime',
        explanation: 'SEMPURNA: Auditor BPJPH dapat memverifikasi integritas rantai dingin dan status sertifikat dalam hitungan detik secara transparan dan tak terbantahkan.',
        isCorrect: true,
        scoreDelta: 100
      }
    ],
    learningOutcome: 'Mahasiswa menguasai pembuktian audit kepatuhan berbasis data digital (Audit Trail) yang tak dapat dimanipulasi (immutable).'
  }
];

export const AUDIT_CHECKLIST: AuditChecklistItem[] = [
  {
    id: 'AUD-01',
    standardClause: 'UU JPH No. 33/2014 Ps 21 & SNI 99004 Klausul 5.1',
    requirement: 'Lokasi dan area penyimpanan produk halal terpisah secara fisik dari bahan yang tidak halal atau meragukan',
    evidenceType: 'Physical Inspection',
    currentStatus: 'COMPLIANT',
    score: 98,
    notes: 'Pemisahan zona ambient, cold chain, dan karantina memiliki dinding pembatas dan pintu masuk terpisah'
  },
  {
    id: 'AUD-02',
    standardClause: 'HAS 23000 Kriteria Bahan & PP 39/2021',
    requirement: 'Seluruh bahan baku yang diterima memiliki Sertifikat Halal BPJPH yang masih berlaku aktif',
    evidenceType: 'Digital Certificate',
    currentStatus: 'COMPLIANT',
    score: 95,
    notes: 'Integrasi API SIHALAL memverifikasi status keaktifan sertifikat secara otomatis saat PO dibuat'
  },
  {
    id: 'AUD-03',
    standardClause: 'SNI 99004 Klausul 7.4 (Cold Chain Halal)',
    requirement: 'Suhu penyimpanan dingin terpantau secara kontinyu tanpa pemutusan rantai dingin (cold chain interruption)',
    evidenceType: 'IoT Log',
    currentStatus: 'COMPLIANT',
    score: 96,
    notes: 'Sensor IoT merekam telemetri setiap 10 detik dengan alarm otomatis jika mendekati batas kritis'
  },
  {
    id: 'AUD-04',
    standardClause: 'HAS 23000 Kriteria Fasilitas & Alat Penanganan',
    requirement: 'Peralatan MHE (Forklift, Pallet Jack) diberi label khusus halal dan tidak digunakan untuk barang non-halal',
    evidenceType: 'SOP Document',
    currentStatus: 'COMPLIANT',
    score: 92,
    notes: 'Semua forklift halal memiliki stempel visual hijau dan beacon RFID'
  },
  {
    id: 'AUD-05',
    standardClause: 'SNI 99004 Klausul 8.3 & Fatwa MUI 27/2013',
    requirement: 'Tersedia prosedur dan sarana pensucian (Sertu/Samak) jika terjadi insiden najis Mughallazah',
    evidenceType: 'Cleaning Log',
    currentStatus: 'COMPLIANT',
    score: 100,
    notes: 'Tersedia fasilitas air suci dan tanah bersih terverifikasi, didampingi Penyelia Halal tersertifikasi'
  },
  {
    id: 'AUD-06',
    standardClause: 'UU JPH No. 33/2014 Ps 44 (Ketertelusuran)',
    requirement: 'Sistem mampu melacak jejak produk dari pemasok hingga konsumen akhir (traceability)',
    evidenceType: 'IoT Log',
    currentStatus: 'COMPLIANT',
    score: 97,
    notes: 'Didukung ledger blockchain terdistribusi dengan hash kriptografi anti-manipulasi'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Berdasarkan UU JPH No. 33/2014 dan SNI 99004:2021, apa prinsip utama pemisahan (segregasi) dalam gudang halal?',
    options: [
      'Produk halal boleh ditaruh di rak yang sama dengan non-halal asalkan dibungkus plastik tipis',
      'Area penyimpanan produk halal wajib terpisah secara fisik dengan tanda yang jelas dan tidak boleh terkontaminasi najis',
      'Pemisahan hanya berlaku saat ada inspeksi audit tahunan dari BPJPH',
      'Semua produk di gudang otomatis halal tanpa perlu pemeriksaan sertifikasi'
    ],
    correctIndex: 1,
    explanation: 'Sesuai regulasi UU JPH dan SNI 99004, produk halal wajib dipisahkan secara fisik dari produk non-halal dengan sistem penandaan tegas untuk menjamin bebas kontaminasi silang.'
  },
  {
    id: 2,
    question: 'Dalam rumus Economic Order Quantity (EOQ) = sqrt((2*D*S)/H), variabel "S" melambangkan apa?',
    options: [
      'Safety Stock (Persediaan Pengaman)',
      'Ordering Cost per order (Biaya Pemesanan)',
      'Storage Space (Kapasitas Gudang)',
      'Selling Price (Harga Jual Barang)'
    ],
    correctIndex: 1,
    explanation: 'Dalam manajemen persediaan, D adalah Permintaan Tahunan (Annual Demand), S adalah Biaya Pemesanan (Ordering Cost per Order), dan H adalah Biaya Penyimpanan (Holding Cost per Unit per Year).'
  },
  {
    id: 3,
    question: 'Bagaimana peran sensor IoT dalam mengendalikan Halal Critical Control Point (HCCP) pada cold storage halal?',
    options: [
      'Hanya mengukur suhu saat listrik padam',
      'Melakukan pemantauan suhu real-time terus menerus agar tidak melampaui batas kritis yang dapat merusak kehalalan produk',
      'Menggantikan sepenuhnya kewajiban sertifikasi halal BPJPH',
      'Mengubah bahan non-halal menjadi halal secara otomatis'
    ],
    correctIndex: 1,
    explanation: 'IoT memberikan telemetri suhu real-time 24/7. Kerusakan rantai dingin dapat memicu pembusukan, penurunan integritas kehalalan, atau pelanggaran batas kritis HCCP.'
  },
  {
    id: 4,
    question: 'Jika Material Handling Equipment (MHE) di gudang tanpa sengaja terkena tumpahan najis Mughallazah (turunan babi), prosedur apa yang wajib dilakukan sesuai syariat dan HAS 23000?',
    options: [
      'Cukup disemprot parfum ruangan beraroma segar',
      'Dibersihkan 7 kali basuhan dengan air bersih, di mana salah satu basuhannya dicampur dengan tanah/debu yang bersih (Sertu/Samak)',
      'Dibuang langsung ke tempat sampah dan tidak boleh diperbaiki',
      'Dibiarkan mengering sendiri di bawah sinar matahari'
    ],
    correctIndex: 1,
    explanation: 'Pensucian najis berat (Mughallazah) wajib dilakukan melalui prosedur Samak/Sertu: 7 kali pencucian dengan air, salah satunya menggunakan tanah suci, disahkan oleh Penyelia Halal.'
  },
  {
    id: 5,
    question: 'Mengapa teknologi Blockchain sangat relevan untuk ketertelusuran (traceability) rantai pasok halal modern?',
    options: [
      'Karena catatan transaksi bersifat terdesentralisasi, immutable (tidak dapat diubah sembarangan), dan dapat diverifikasi setiap titik rantai pasok',
      'Karena biaya server blockchain selalu bernilai nol',
      'Karena blockchain dapat memasak daging secara otomatis di perjalanan',
      'Karena blockchain meniadakan kebutuhan pengemasan barang'
    ],
    correctIndex: 0,
    explanation: 'Blockchain menyediakan buku besar digital yang transparan dan anti-manipulasi. Setiap aktor (peternakan, RPH, distributor, gudang) memvalidasi transaksi sehingga integritas halal terjamin dari hulu ke hilir.'
  },
  {
    id: 6,
    question: 'Dalam Green E-Logistics, faktor apa saja yang diperhitungkan untuk meminimalkan emisi CO2e pada last-mile delivery?',
    options: [
      'Hanya mempercepat laju kendaraan di jalan raya',
      'Pemilihan jenis armada (Electric Vehicle vs Diesel), optimasi rute terpendek/terefisien, dan konsolidasi muatan (load factor)',
      'Menghilangkan pengemudi dan berjalan tanpa bahan bakar',
      'Menambah jumlah perjalanan bolak-balik dengan muatan kosong'
    ],
    correctIndex: 1,
    explanation: 'Green logistics fokus pada efisiensi rute, pemilihan moda transportasi rendah karbon (seperti armada listrik/EV), peningkatan load factor, dan material kemasan ramah lingkungan.'
  },
  {
    id: 7,
    question: 'Apa fungsi utama sistem karantina (Quarantine Bay Q-01) dalam WMS pergudangan halal?',
    options: [
      'Tempat istirahat bagi pekerja gudang',
      'Mengisolasi barang yang dokumen kehalalannya diragukan, sertifikat kedaluwarsa, atau kemasannya rusak agar tidak mencemari barang halal lain',
      'Tempat penyimpanan produk yang paling laris (fast-moving)',
      'Gudang khusus untuk barang-barang curah tanpa palet'
    ],
    correctIndex: 1,
    explanation: 'Area karantina adalah titik kritis untuk mengisolasi setiap barang yang tidak memenuhi syarat kehalalan atau dalam status investigasi agar tidak terjadi kontaminasi silang.'
  },
  {
    id: 8,
    question: 'Lembaga resmi pemerintah di Indonesia yang menerbitkan Sertifikat Halal sesuai amanat UU JPH No. 33/2014 adalah:',
    options: [
      'Badan Penyelenggara Jaminan Produk Halal (BPJPH) Kementerian Agama RI',
      'Kementerian Perdagangan RI saja',
      'Badan POM RI secara tunggal',
      'Dewan Perwakilan Rakyat (DPR)'
    ],
    correctIndex: 0,
    explanation: 'Sejak berlakunya UU JPH No. 33/2014, penerbitan Sertifikat Halal resmi berada di bawah otoritas BPJPH Kemenag RI, bekerja sama dengan LPH (pemeriksa) dan MUI (fatwa kehalalan).'
  }
];
