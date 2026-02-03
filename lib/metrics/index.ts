import { ClaimData, AllMetrics } from "./types";
import { calculateDaysInAR } from "./days-in-ar";
import { calculateDenialRate } from "./denial-rate";
import { calculateCleanClaimRate } from "./clean-claim-rate";
import { calculateCollectionRate } from "./collection-rate";
import { detectAnomalies } from "./anomalies";

export * from "./types";
export { calculateDaysInAR } from "./days-in-ar";
export { calculateDenialRate } from "./denial-rate";
export { calculateCleanClaimRate } from "./clean-claim-rate";
export { calculateCollectionRate } from "./collection-rate";
export { detectAnomalies } from "./anomalies";

export function getAllMetrics(claims: ClaimData[]): AllMetrics {
  const serviceDates = claims.map((c) => c.service_date).sort();

  return {
    days_in_ar: calculateDaysInAR(claims),
    denial_rate: calculateDenialRate(claims),
    clean_claim_rate: calculateCleanClaimRate(claims),
    collection_rate: calculateCollectionRate(claims),
    anomalies: detectAnomalies(claims),
    summary: {
      total_claims: claims.length,
      total_charged: Math.round(claims.reduce((sum, c) => sum + c.charge_amount, 0) * 100) / 100,
      total_collected: Math.round(claims.reduce((sum, c) => sum + c.payment_amount, 0) * 100) / 100,
      date_range: {
        start: serviceDates[0] || "",
        end: serviceDates[serviceDates.length - 1] || "",
      },
    },
  };
}
