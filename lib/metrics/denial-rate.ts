import { ClaimData, DenialRateResult } from "./types";

function getYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function calculateDenialRate(claims: ClaimData[]): DenialRateResult {
  const totalClaims = claims.length;
  const deniedClaims = claims.filter((c) => c.status === "Denied");
  const deniedCount = deniedClaims.length;

  // Overall denial rate
  const overallRate = totalClaims > 0 ? (deniedCount / totalClaims) * 100 : 0;

  // By payer
  const claimsByPayer: Record<string, ClaimData[]> = {};
  claims.forEach((claim) => {
    if (!claimsByPayer[claim.payer]) {
      claimsByPayer[claim.payer] = [];
    }
    claimsByPayer[claim.payer].push(claim);
  });

  const byPayer: Record<string, number> = {};
  for (const [payer, payerClaims] of Object.entries(claimsByPayer)) {
    const payerDenied = payerClaims.filter((c) => c.status === "Denied").length;
    byPayer[payer] = Math.round((payerDenied / payerClaims.length) * 1000) / 10;
  }

  // Sort by denial rate descending
  const sortedByPayer = Object.fromEntries(
    Object.entries(byPayer).sort(([, a], [, b]) => b - a)
  );

  // By denial reason
  const byReason: Record<string, number> = {};
  deniedClaims.forEach((claim) => {
    const reason = claim.denial_reason || "Unknown";
    byReason[reason] = (byReason[reason] || 0) + 1;
  });

  // By reason percentage
  const byReasonPct: Record<string, number> = {};
  for (const [reason, count] of Object.entries(byReason)) {
    byReasonPct[reason] = deniedCount > 0 ? Math.round((count / deniedCount) * 1000) / 10 : 0;
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
    const monthDenied = monthClaims.filter((c) => c.status === "Denied").length;
    monthlyTrend[month] = Math.round((monthDenied / monthClaims.length) * 1000) / 10;
  }

  // By CPT code
  const claimsByCPT: Record<string, ClaimData[]> = {};
  claims.forEach((claim) => {
    if (!claimsByCPT[claim.cpt_code]) {
      claimsByCPT[claim.cpt_code] = [];
    }
    claimsByCPT[claim.cpt_code].push(claim);
  });

  const byCPT: Record<string, number> = {};
  for (const [cpt, cptClaims] of Object.entries(claimsByCPT)) {
    const cptDenied = cptClaims.filter((c) => c.status === "Denied").length;
    byCPT[cpt] = Math.round((cptDenied / cptClaims.length) * 1000) / 10;
  }

  // Sort and limit to top 10
  const sortedByCPT = Object.fromEntries(
    Object.entries(byCPT)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  );

  // Financial impact
  const denialValue = deniedClaims.reduce((sum, c) => sum + c.charge_amount, 0);

  return {
    overall_rate: Math.round(overallRate * 10) / 10,
    denied_count: deniedCount,
    total_count: totalClaims,
    by_payer: sortedByPayer,
    by_reason: byReason,
    by_reason_pct: byReasonPct,
    monthly_trend: monthlyTrend,
    by_cpt: sortedByCPT,
    denial_value: Math.round(denialValue * 100) / 100,
  };
}
