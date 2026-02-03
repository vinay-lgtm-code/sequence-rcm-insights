import { ClaimData, CleanClaimRateResult } from "./types";

function getYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function calculateCleanClaimRate(claims: ClaimData[]): CleanClaimRateResult {
  // Exclude pending claims for clean claim rate calculation
  const resolvedClaims = claims.filter((c) => c.status !== "Pending");
  const cleanClaims = claims.filter((c) => c.status === "Paid");

  const totalResolved = resolvedClaims.length;
  const cleanCount = cleanClaims.length;

  // Overall rate
  const overallRate = totalResolved > 0 ? (cleanCount / totalResolved) * 100 : 0;

  // By payer
  const resolvedByPayer: Record<string, ClaimData[]> = {};
  resolvedClaims.forEach((claim) => {
    if (!resolvedByPayer[claim.payer]) {
      resolvedByPayer[claim.payer] = [];
    }
    resolvedByPayer[claim.payer].push(claim);
  });

  const byPayer: Record<string, number> = {};
  for (const [payer, payerClaims] of Object.entries(resolvedByPayer)) {
    const payerClean = payerClaims.filter((c) => c.status === "Paid").length;
    byPayer[payer] = Math.round((payerClean / payerClaims.length) * 1000) / 10;
  }

  // Sort by clean claim rate descending
  const sortedByPayer = Object.fromEntries(
    Object.entries(byPayer).sort(([, a], [, b]) => b - a)
  );

  // By provider
  const resolvedByProvider: Record<string, ClaimData[]> = {};
  resolvedClaims.forEach((claim) => {
    if (!resolvedByProvider[claim.provider]) {
      resolvedByProvider[claim.provider] = [];
    }
    resolvedByProvider[claim.provider].push(claim);
  });

  const byProvider: Record<string, number> = {};
  for (const [provider, providerClaims] of Object.entries(resolvedByProvider)) {
    const providerClean = providerClaims.filter((c) => c.status === "Paid").length;
    byProvider[provider] = Math.round((providerClean / providerClaims.length) * 1000) / 10;
  }

  // Sort by clean claim rate descending
  const sortedByProvider = Object.fromEntries(
    Object.entries(byProvider).sort(([, a], [, b]) => b - a)
  );

  // Monthly trend
  const resolvedByMonth: Record<string, ClaimData[]> = {};
  resolvedClaims.forEach((claim) => {
    const month = getYearMonth(claim.service_date);
    if (!resolvedByMonth[month]) {
      resolvedByMonth[month] = [];
    }
    resolvedByMonth[month].push(claim);
  });

  const monthlyTrend: Record<string, number> = {};
  for (const [month, monthClaims] of Object.entries(resolvedByMonth)) {
    const monthClean = monthClaims.filter((c) => c.status === "Paid").length;
    monthlyTrend[month] = Math.round((monthClean / monthClaims.length) * 1000) / 10;
  }

  return {
    overall_rate: Math.round(overallRate * 10) / 10,
    clean_count: cleanCount,
    total_resolved: totalResolved,
    by_payer: sortedByPayer,
    by_provider: sortedByProvider,
    monthly_trend: monthlyTrend,
  };
}
