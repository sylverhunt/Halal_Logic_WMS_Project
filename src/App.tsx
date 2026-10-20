import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WarehouseDigitalTwin } from './components/WarehouseDigitalTwin';
import { TelemetryIoTView } from './components/TelemetryIoTView';
import { InventoryPlanningView } from './components/InventoryPlanningView';
import { OmnichannelGreenView } from './components/OmnichannelGreenView';
import { BlockchainLedgerView } from './components/BlockchainLedgerView';
import { HalalRegulationHCCPView } from './components/HalalRegulationHCCPView';
import { RealTimeAuditView } from './components/RealTimeAuditView';
import { StudentLabScenarios } from './components/StudentLabScenarios';
import { StudentQuizModal } from './components/StudentQuizModal';
import { SystemIntegrationModal } from './components/SystemIntegrationModal';
import { ScenarioDataStudio } from './components/ScenarioDataStudio';

import { 
  INITIAL_BAYS, 
  INITIAL_INVENTORY, 
  INITIAL_SENSORS, 
  INITIAL_BLOCKCHAIN, 
  INITIAL_FLEET, 
  INITIAL_POS, 
  AUDIT_CHECKLIST,
  LAB_SCENARIOS
} from './data/mockData';

import { 
  WarehouseBay, 
  InventoryItem, 
  IoTSensorNode, 
  BlockchainBlock, 
  VehicleFleet, 
  PurchaseOrder, 
  AuditChecklistItem,
  LabScenario
} from './types/logistics';

import { calculateHalalComplianceScore, calculateSimpleHash } from './utils/logisticsFormulas';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('warehouse');
  const [bays, setBays] = useState<WarehouseBay[]>(INITIAL_BAYS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sensors, setSensors] = useState<IoTSensorNode[]>(INITIAL_SENSORS);
  const [blockchain, setBlockchain] = useState<BlockchainBlock[]>(INITIAL_BLOCKCHAIN);
  const [fleet, setFleet] = useState<VehicleFleet[]>(INITIAL_FLEET);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [checklist, setChecklist] = useState<AuditChecklistItem[]>(AUDIT_CHECKLIST);
  const [scenarios, setScenarios] = useState<LabScenario[]>(LAB_SCENARIOS);

  // Simulation controls
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Modals
  const [showLabModal, setShowLabModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState<boolean>(false);

  // Compute live Halal Compliance Index
  const coldBay1 = bays.find(b => b.id === 'bay-c1');
  const isColdViolated = coldBay1 ? coldBay1.temperature > -15 : false;
  const isQuarantineMixed = bays.find(b => b.zone === 'HALAL_AMBIENT' && b.items.some(i => i.zone === 'QUARANTINE'));

  const halalScore = calculateHalalComplianceScore({
    tempAdherencePct: isColdViolated ? 60 : 98,
    segregationCompliancePct: isQuarantineMixed ? 50 : 99,
    certValidityPct: 96,
    cleaningLogPct: 100,
    mheDedicationPct: 95
  });

  // Real-time sensor simulation ticks
  useEffect(() => {
    if (!simulationRunning) return;

    const intervalTime = Math.max(800, 2500 / simulationSpeed);
    const interval = setInterval(() => {
      setSensors(prevSensors =>
        prevSensors.map(sensor => {
          if (sensor.type === 'TEMPERATURE' && typeof sensor.value === 'number') {
            const jitter = +( (Math.random() - 0.5) * 0.2 ).toFixed(1);
            const newValue = +(sensor.value + jitter).toFixed(1);
            return {
              ...sensor,
              value: newValue,
              history: [...sensor.history.slice(1), newValue],
              lastUpdated: 'Baru saja'
            };
          }
          if (sensor.type === 'HUMIDITY' && typeof sensor.value === 'number') {
            const jitter = +( (Math.random() - 0.5) * 0.4 ).toFixed(1);
            const newValue = +(sensor.value + jitter).toFixed(1);
            return {
              ...sensor,
              value: newValue,
              history: [...sensor.history.slice(1), newValue],
              lastUpdated: 'Baru saja'
            };
          }
          return sensor;
        })
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);

  // Handlers
  const handleUpdateBay = (bayId: string, updates: Partial<WarehouseBay>) => {
    setBays(prev => prev.map(b => (b.id === bayId ? { ...b, ...updates } : b)));
  };

  const handleRelocateItem = (itemId: string, sourceBayId: string, targetBayId: string) => {
    const itemToMove = inventory.find(i => i.id === itemId);
    if (!itemToMove) return;

    setBays(prev =>
      prev.map(bay => {
        if (bay.id === sourceBayId) {
          return {
            ...bay,
            occupiedPallets: Math.max(0, bay.occupiedPallets - itemToMove.quantity),
            items: bay.items.filter(it => it.id !== itemId)
          };
        }
        if (bay.id === targetBayId) {
          return {
            ...bay,
            occupiedPallets: bay.occupiedPallets + itemToMove.quantity,
            items: [...bay.items, { ...itemToMove, bayId: targetBayId }]
          };
        }
        return bay;
      })
    );
  };

  const handleTriggerAnomaly = (type: 'COLD_CHAIN' | 'QUARANTINE_SPILL' | 'EXPIRED_CERT') => {
    if (type === 'COLD_CHAIN') {
      handleUpdateBay('bay-c1', { temperature: -6.5, status: 'WARNING' });
      setSensors(prev =>
        prev.map(s => (s.id === 'SENS-01' ? { ...s, value: -6.5, status: 'ALERT' } : s))
      );
      setActiveTab('telemetry');
    } else if (type === 'QUARANTINE_SPILL') {
      handleUpdateBay('bay-q1', { status: 'CRITICAL_CONTAMINATION' });
      setActiveTab('warehouse');
    }
  };

  const handleResetSensors = () => {
    setSensors(INITIAL_SENSORS);
    handleUpdateBay('bay-c1', { temperature: -20.4, status: 'OPTIMAL' });
    handleUpdateBay('bay-q1', { status: 'WARNING' });
  };

  const handleTamperBlock = (blockIndex: number, newTemp: number) => {
    setBlockchain(prev => {
      const updated = [...prev];
      if (updated[blockIndex]) {
        const tamperedData = {
          ...updated[blockIndex].data,
          tempLog: newTemp,
          signature: '0xTAMPERED_INVALID_SIGNATURE'
        };
        const newHash = calculateSimpleHash(JSON.stringify(tamperedData));
        updated[blockIndex] = {
          ...updated[blockIndex],
          data: tamperedData,
          hash: newHash,
          smartContractStatus: 'TAMPERED'
        };
      }
      return updated;
    });
    setActiveTab('blockchain');
  };

  const handleRestoreBlockchain = () => {
    setBlockchain(INITIAL_BLOCKCHAIN);
  };

  const handleCreatePO = (newPO: PurchaseOrder) => {
    setPurchaseOrders(prev => [newPO, ...prev]);
  };

  const handleDispatchFleet = (vehicleId: string) => {
    setFleet(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, status: 'TRANSIT', etaMinutes: Math.max(5, v.etaMinutes - 5) } : v))
    );
  };

  // --- Scenario Studio Handlers ---
  const handleAddNewItem = (newItem: InventoryItem, targetBayId: string) => {
    setInventory(prev => [newItem, ...prev]);
    setBays(prev =>
      prev.map(bay => {
        if (bay.id === targetBayId) {
          return {
            ...bay,
            occupiedPallets: Math.min(bay.capacityPallets, bay.occupiedPallets + newItem.quantity),
            items: [newItem, ...bay.items]
          };
        }
        return bay;
      })
    );
  };

  const handleAddNewScenario = (newScenario: LabScenario) => {
    setScenarios(prev => [newScenario, ...prev]);
    setShowLabModal(true);
  };

  const handleLoadPreset = (presetKey: string) => {
    if (presetKey === 'cold_chain_crisis') {
      handleUpdateBay('bay-c1', { temperature: -6.5, status: 'WARNING' });
      setSensors(prev =>
        prev.map(s => (s.id === 'SENS-01' ? { ...s, value: -6.5, status: 'ALERT' } : s))
      );
      setActiveTab('warehouse');
    } else if (presetKey === 'spill_sertu') {
      handleUpdateBay('bay-q1', { status: 'CRITICAL_CONTAMINATION' });
      handleUpdateBay('bay-a1', { status: 'WARNING' });
      setActiveTab('warehouse');
    } else if (presetKey === 'ramadhan_green') {
      setActiveTab('omnichannel');
    } else if (presetKey === 'blockchain_audit') {
      handleTamperBlock(2, 8.0);
      setActiveTab('blockchain');
    } else if (presetKey === 'biopharm_vaccine') {
      handleUpdateBay('bay-c1', { temperature: -24.0, status: 'OPTIMAL' });
      setActiveTab('warehouse');
    }
  };

  const handleImportFullState = (jsonState: any) => {
    if (jsonState.bays) setBays(jsonState.bays);
    if (jsonState.inventory) setInventory(jsonState.inventory);
    if (jsonState.scenarios) setScenarios(jsonState.scenarios);
    setActiveTab('warehouse');
  };

  const handleResetToDefault = () => {
    setBays(INITIAL_BAYS);
    setInventory(INITIAL_INVENTORY);
    setSensors(INITIAL_SENSORS);
    setBlockchain(INITIAL_BLOCKCHAIN);
    setFleet(INITIAL_FLEET);
    setPurchaseOrders(INITIAL_POS);
    setChecklist(AUDIT_CHECKLIST);
    setScenarios(LAB_SCENARIOS);
  };

  const handleRunScenarioInApp = (category: LabScenario['category']) => {
    setShowLabModal(false);
    if (category === 'IoT & Cold Chain') {
      handleTriggerAnomaly('COLD_CHAIN');
    } else if (category === 'Halal Cross-Contamination') {
      handleTriggerAnomaly('QUARANTINE_SPILL');
    } else if (category === 'Green E-Commerce Peak') {
      setActiveTab('omnichannel');
    } else if (category === 'Regulatory Audit BPJPH') {
      handleTamperBlock(2, 6.5);
    } else {
      setActiveTab('warehouse');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top 3-Zone Compliant Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLab={() => setShowLabModal(true)}
        onOpenQuiz={() => setShowQuizModal(true)}
        onOpenIntegration={() => setShowIntegrationModal(true)}
        halalScore={halalScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'warehouse' && (
          <WarehouseDigitalTwin
            bays={bays}
            onUpdateBay={handleUpdateBay}
            onRelocateItem={handleRelocateItem}
            onTriggerAnomaly={handleTriggerAnomaly}
            simulationRunning={simulationRunning}
            simulationSpeed={simulationSpeed}
            setSimulationSpeed={setSimulationSpeed}
            toggleSimulation={() => setSimulationRunning(prev => !prev)}
            onOpenLab={() => setShowLabModal(true)}
            onOpenStudio={() => setActiveTab('studio')}
            onResetWarehouseSimulation={handleResetSensors}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryIoTView
            sensors={sensors}
            onTriggerAnomaly={handleTriggerAnomaly}
            onResetSensors={handleResetSensors}
          />
        )}

        {activeTab === 'planning' && (
          <InventoryPlanningView
            inventory={inventory}
            purchaseOrders={purchaseOrders}
            onCreatePO={handleCreatePO}
          />
        )}

        {activeTab === 'omnichannel' && (
          <OmnichannelGreenView
            fleet={fleet}
            onDispatchFleet={handleDispatchFleet}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainLedgerView
            blocks={blockchain}
            onTamperBlock={handleTamperBlock}
            onRestoreBlockchain={handleRestoreBlockchain}
            onAddNewBlock={(newBlock) => setBlockchain(prev => [...prev, newBlock])}
          />
        )}

        {activeTab === 'regulation' && (
          <HalalRegulationHCCPView />
        )}

        {activeTab === 'audit' && (
          <RealTimeAuditView
            checklist={checklist}
            halalScore={halalScore}
          />
        )}

        {activeTab === 'studio' && (
          <ScenarioDataStudio
            bays={bays}
            inventory={inventory}
            scenarios={scenarios}
            onAddNewItem={handleAddNewItem}
            onAddNewScenario={handleAddNewScenario}
            onLoadPreset={handleLoadPreset}
            onImportFullState={handleImportFullState}
            onResetToDefault={handleResetToDefault}
            onOpenLab={() => setShowLabModal(true)}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>HalalLogix WMS · Platform Edukasi Simulasi Teknik Logistik & Rantai Pasok Halal</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>UU JPH No. 33/2014</span>
            <span>·</span>
            <span>SNI 99004:2021</span>
            <span>·</span>
            <span>HAS 23000</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLabModal && (
        <StudentLabScenarios
          scenarios={scenarios}
          onClose={() => setShowLabModal(false)}
          onAddNewScenario={handleAddNewScenario}
          onDeleteScenario={(id) => setScenarios(prev => prev.filter(s => s.id !== id))}
          onOpenStudio={() => setActiveTab('studio')}
          onRunScenarioInApp={handleRunScenarioInApp}
        />
      )}

      {showQuizModal && (
        <StudentQuizModal
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {showIntegrationModal && (
        <SystemIntegrationModal
          onClose={() => setShowIntegrationModal(false)}
        />
      )}
    </div>
  );
}
