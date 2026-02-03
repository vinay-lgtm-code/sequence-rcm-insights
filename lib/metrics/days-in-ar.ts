import { ClaimData, DaysInARResult } from "./types";

function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateDaysInAR(claims: ClaimData[]): DaysInARResult {
  const today = new Date();

  // Calculate days to payment for paid/partial claims
  const paidClaims = claims.filter((c) => c.status === "Paid" || c.status === "Partial");
  const daysToPayByPayer: Record<string, number[]> = {};

  paidClaims.forEach((claim) => {
    if (claim.payment_date) {
      const serviceDate = new Date(claim.service_date);
      const paymentDate = new Date(claim.payment_date);
      const days = daysBetween(serviceDate, paymentDate);

      if (!daysToPayByPayer[claim.payer]) {
        daysToPayByPayer[claim.payer] = [];
      }
      daysToPayByPayer[claim.payer].push(days);
    }
  });

  // Calculate pending claim aging
  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const agingBuckets = {
    "0-30 days": 0,
    "31-60 days": 0,
    "61-90 days": 0,
    "90+ days": 0,
  };

  pendingClaims.forEach((claim) => {
    const serviceDate = new Date(claim.service_date);
    const daysOutstanding = daysBetween(serviceDate, today);

    if (daysOutstanding <= 30) {
      agingBuckets["0-30 days"]++;
    } else if (daysOutstanding <= 60) {
      agingBuckets["31-60 days"]++;
    } else if (daysOutstanding <= 90) {
      agingBuckets["61-90 days"]++;
    } else {
      agingBuckets["90+ days"]++;
    }
  });

  // Overall average
  const allDaysToPay = Object.values(daysToPayByPayer).flat();
  const overallAvgDays = allDaysToPay.length > 0
    ? allDaysToPay.reduce((a, b) => a + b, 0) / allDaysToPay.length
    : 0;

  // By payer
  const byPayer: Record<string, { avg_days: number; median_days: number; claim_count: number }> = {};
  for (const [payer, days] of Object.entries(daysToPayByPayer)) {
    const avg = days.reduce((a, b) => a + b, 0) / days.length;
    byPayer[payer] = {
      avg_days: Math.round(avg * 10) / 10,
      median_days: Math.round(median(days) * 10) / 10,
      claim_count: days.length,
    };
  }

  // Total AR value
  const totalARValue = pendingClaims.reduce((sum, c) => sum + c.charge_amount, 0);

  return {
    overall_avg_days: Math.round(overallAvgDays * 10) / 10,
    by_payer: byPayer,
    aging_buckets: agingBuckets,
    total_ar_value: Math.round(totalARValue * 100) / 100,
    pending_claim_count: pendingClaims.length,
  };
}
