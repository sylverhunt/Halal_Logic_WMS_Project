export type HalalZone = 'HALAL_AMBIENT' | 'HALAL_COLD_CHAIN' | 'QUARANTINE' | 'NON_HALAL_SEGREGATED' | 'STAGING_RECEIVING' | 'DISPATCH_DOCK';

export type CertificationAuthority = 'BPJPH' | 'LPPOM_MUI' | 'JAKIM' | 'MUIS' | 'CICOT' | 'UNVERIFIED';

export interface HalalCertificate {
  certNumber: string;
  issuer: CertificationAuthority;
  validUntil: string;
  standard: 'HAS 23000' | 'SNI 99004:2021' | 'UU JPH No. 33/2014' | 'SMIIC 1';
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED';
  slaughterhouseCode?: string;
  auditorNotes: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Raw Material' | 'Meat & Poultry' | 'Dairy & Fats' | 'Beverages' | 'Seasoning & Flavour' | 'Packaging';
  quantity: number; // pallet count or units
  unit: string;
  bayId: string;
  zone: HalalZone;
  weightKg: number;
  temperatureRequired: {
    min: number;
    max: number;
  };
  halalCert: HalalCertificate;
  hccpCriticality: 'CRITICAL_HIGH' | 'CRITICAL_MEDIUM' | 'STANDARD';
  allergenAlert?: string;
  batchLot: string;
  expiryDate: string;
  inboundDate: string;
  dailyDemand: number;
  leadTimeDays: number;
  unitCostIdr: number;
  holdingCostPerUnitIdr: number;
  orderCostIdr: number;
  rfidTag: string;
}

export interface WarehouseBay {
  id: string;
  code: string; // e.g. "A-01", "C-02"
  zone: HalalZone;
  capacityPallets: number;
  occupiedPallets: number;
  temperature: number; // in Celsius
  targetTemp: { min: number; max: number };
  humidity: number; // in %
  airCirculationClean: boolean;
  mheDedicatedHalal: boolean;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL_CONTAMINATION' | 'CLEANING_SAMAK';
  items: InventoryItem[];
}

export interface IoTSensorNode {
  id: string;
  name: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'RFID_GATE' | 'AGV_TELEMETRY' | 'AIR_QUALITY' | 'DOOR_SEAL';
  location: string;
  value: number | string;
  unit: string;
  status: 'NOMINAL' | 'WARNING' | 'ALERT';
  lastUpdated: string;
  history: number[];
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  data: {
    action: string;
    product: string;
    batchLot: string;
    actor: string;
    location: string;
    halalCertNo: string;
    tempLog: number;
    signature: string;
  };
  previousHash: string;
  hash: string;
  nonce: number;
  smartContractStatus: 'VERIFIED' | 'TAMPERED' | 'HALAL_LOCKED';
}

export interface VehicleFleet {
  id: string;
  plateNumber: string;
  type: 'ELECTRIC_VAN' | 'DIESEL_TRUCK' | 'HYBRID_REEFER' | 'CARGO_EBIKE';
  capacityKg: number;
  currentLoadKg: number;
  fuelType: 'ELECTRIC' | 'DIESEL' | 'HYBRID';
  emissionFactorKgCo2PerKm: number; // kg CO2e per km
  status: 'IDLE' | 'TRANSIT' | 'LOADING' | 'SANITIZING';
  halalCertified: boolean;
  cleaningLogDate: string;
  currentTempCelsius?: number;
  destination: string;
  etaMinutes: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierHalalGrade: 'A' | 'B' | 'C' | 'UNRATED';
  supplierCertNo: string;
  items: {
    sku: string;
    name: string;
    qty: number;
    priceIdr: number;
  }[];
  totalAmountIdr: number;
  orderDate: string;
  deliveryDate: string;
  status: 'SUBMITTED' | 'HALAL_VERIFIED' | 'INBOUND_INSPECTING' | 'ACCEPTED' | 'REJECTED_NON_COMPLIANT';
  rejectionReason?: string;
}

export interface HCCPRule {
  id: string;
  principle: number;
  title: string;
  hazardDescription: string;
  criticalLimit: string;
  monitoringMethod: string;
  correctiveAction: string;
  frequency: string;
  regulationBasis: string;
}

export interface LabScenario {
  id: string;
  title: string;
  category: 'IoT & Cold Chain' | 'Halal Cross-Contamination' | 'Green E-Commerce Peak' | 'Regulatory Audit BPJPH';
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  scenarioDescription: string;
  triggerCondition: string;
  initialBayAffected?: string;
  tasks: {
    id: string;
    description: string;
    completed: boolean;
    points: number;
  }[];
  correctResolutionId: string;
  options: {
    id: string;
    actionLabel: string;
    explanation: string;
    isCorrect: boolean;
    scoreDelta: number;
  }[];
  learningOutcome: string;
}

export interface AuditChecklistItem {
  id: string;
  standardClause: string;
  requirement: string;
  evidenceType: 'IoT Log' | 'Physical Inspection' | 'Digital Certificate' | 'SOP Document' | 'Cleaning Log';
  currentStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'ATTENTION' | 'NEEDS_CORRECTION';
  status?: 'COMPLIANT' | 'NON_COMPLIANT' | 'ATTENTION' | 'NEEDS_CORRECTION';
  score: number; // 0 - 100
  notes: string;
}
