/**
 * Mathematical models & algorithms for Logistics Engineering & Halal WMS
 */

export function calculateEOQ(annualDemand: number, orderingCost: number, holdingCost: number): number {
  if (holdingCost <= 0 || orderingCost <= 0 || annualDemand <= 0) return 0;
  return Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost));
}

export function calculateSafetyStock(zScore: number, demandStdDev: number, leadTimeDays: number): number {
  return Math.round(zScore * demandStdDev * Math.sqrt(leadTimeDays));
}

export function calculateROP(dailyDemand: number, leadTimeDays: number, safetyStock: number): number {
  return Math.round((dailyDemand * leadTimeDays) + safetyStock);
}

export function calculateCarbonEmissionsKg(distanceKm: number, emissionFactor: number, payloadFactor: number = 1.0): number {
  return +(distanceKm * emissionFactor * payloadFactor).toFixed(2);
}

// Educational crypto hashing simulation for blockchain demonstrations
export function calculateSimpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Generate realistic 64-char hex-like string deterministically
  const positiveHex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = "9e3779b97f4a7c15f83b2e5d1a4c90ef2a45b6c7d8e9f0123456789abcdef0123";
  let result = "";
  for (let i = 0; i < 64; i++) {
    const charCode = (positiveHex.charCodeAt(i % positiveHex.length) + salt.charCodeAt(i)) % 16;
    result += charCode.toString(16);
  }
  return result;
}

export function calculateHalalComplianceScore(metrics: {
  tempAdherencePct: number;
  segregationCompliancePct: number;
  certValidityPct: number;
  cleaningLogPct: number;
  mheDedicationPct: number;
}): number {
  // Weighted according to HAS 23000 & SNI 99004 criteria
  const score = (
    metrics.tempAdherencePct * 0.25 +
    metrics.segregationCompliancePct * 0.30 +
    metrics.certValidityPct * 0.20 +
    metrics.cleaningLogPct * 0.15 +
    metrics.mheDedicationPct * 0.10
  );
  return Math.round(score);
}
