import { ClaimData, CollectionRateResult } from "./types";

function getYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function calculateCollectionRate(claims: ClaimData[]): CollectionRateResult {
  // Overall
  const totalCharged = claims.reduce((sum, c) => sum + c.charge_amount, 0);
  const totalCollected = claims.reduce((sum, c) => sum + c.payment_amount, 0);
  const overallRate = totalCharged > 0 ? (totalCollected / totalCharged) * 100 : 0;

  // By payer
  const claimsByPayer: Record<string, ClaimData[]> = {};
  claims.forEach((claim) => {
    if (!claimsByPayer[claim.payer]) {
      claimsByPayer[claim.payer] = [];
    }
    claimsByPayer[claim.payer].push(claim);
  });

  const byPayer: Record<string, {
    collection_rate: number;
    total_charged: number;
    total_collected: number;
    claim_count: number;
  }> = {};

  for (const [payer, payerClaims] of Object.entries(claimsByPayer)) {
    const charged = payerClaims.reduce((sum, c) => sum + c.charge_amount, 0);
    const collected = payerClaims.reduce((sum, c) => sum + c.payment_amount, 0);
    byPayer[payer] = {
      collection_rate: charged > 0 ? Math.round((collected / charged) * 1000) / 10 : 0,
      total_charged: Math.round(charged * 100) / 100,
      total_collected: Math.round(collected * 100) / 100,
      claim_count: payerClaims.length,
    };
  }

  // Monthly trend
  const claimsByMonth: Record<string, ClaimData[]> = {};
  claims.forEach((claim) => {
    const month = getYearMonth(claim.service_date);
    if (!claimsByMonth[month]) {
      claimsByMonth[month] = [];
    }
    claimsByMonth[month].push(claim);
  });

  const monthlyTrend: Record<string, number> = {};
  for (const [month, monthClaims] of Object.entries(claimsByMonth)) {
    const monthCharged = monthClaims.reduce((sum, c) => sum + c.charge_amount, 0);
    const monthCollected = monthClaims.reduce((sum, c) => sum + c.payment_amount, 0);
    monthlyTrend[month] = monthCharged > 0
      ? Math.round((monthCollected / monthCharged) * 1000) / 10
      : 0;
  }

  // Sort payers by collection rate
  const payerRates = Object.entries(byPayer)
    .map(([payer, data]) => [payer, data.collection_rate] as [string, number])
    .sort(([, a], [, b]) => b - a);

  const topPayers = payerRates.slice(0, 3);
  const bottomPayers = payerRates.slice(-3).reverse();

  return {
    overall_rate: Math.round(overallRate * 10) / 10,
    total_charged: Math.round(totalCharged * 100) / 100,
    total_collected: Math.round(totalCollected * 100) / 100,
    by_payer: byPayer,
    monthly_trend: monthlyTrend,
    top_payers: topPayers,
    bottom_payers: bottomPayers,
  };
}
