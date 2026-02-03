import { ClaimData, Anomaly } from "./types";

function getYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function detectAnomalies(claims: ClaimData[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Group claims by month
  const claimsByMonth: Record<string, ClaimData[]> = {};
  claims.forEach((claim) => {
    const month = getYearMonth(claim.service_date);
    if (!claimsByMonth[month]) {
      claimsByMonth[month] = [];
    }
    claimsByMonth[month].push(claim);
  });

  const months = Object.keys(claimsByMonth).sort();
  if (months.length < 3) {
    return anomalies;
  }

  // Split into recent (last 2 months) and historical (before that)
  const recentMonths = months.slice(-2);
  const historicalMonths = months.slice(0, -2);

  const recentClaims = claims.filter((c) => recentMonths.includes(getYearMonth(c.service_date)));
  const historicalClaims = claims.filter((c) => historicalMonths.includes(getYearMonth(c.service_date)));

  // 1. Check for denial rate spikes by payer
  const payers = [...new Set(claims.map((c) => c.payer))];

  for (const payer of payers) {
    const recentPayer = recentClaims.filter((c) => c.payer === payer);
    const historicalPayer = historicalClaims.filter((c) => c.payer === payer);

    if (recentPayer.length < 10 || historicalPayer.length < 20) {
      continue;
    }

    const recentDenialRate = recentPayer.filter((c) => c.status === "Denied").length / recentPayer.length;
    const historicalDenialRate = historicalPayer.filter((c) => c.status === "Denied").length / historicalPayer.length;

    if (recentDenialRate > historicalDenialRate * 1.5 && recentDenialRate > 0.15) {
      anomalies.push({
        type: "denial_spike",
        severity: "high",
        entity: payer,
        current_value: Math.round(recentDenialRate * 1000) / 10,
        baseline_value: Math.round(historicalDenialRate * 1000) / 10,
        description: `${payer} denial rate spiked to ${Math.round(recentDenialRate * 1000) / 10}% (was ${Math.round(historicalDenialRate * 1000) / 10}%)`,
      });
    }
  }

  // 2. Check for CPT code denial patterns
  const cptCodes = [...new Set(claims.map((c) => c.cpt_code))];

  for (const cpt of cptCodes) {
    const recentCPT = recentClaims.filter((c) => c.cpt_code === cpt);
    const historicalCPT = historicalClaims.filter((c) => c.cpt_code === cpt);

    if (recentCPT.length < 10 || historicalCPT.length < 20) {
      continue;
    }

    const recentDenialRate = recentCPT.filter((c) => c.status === "Denied").length / recentCPT.length;
    const historicalDenialRate = historicalCPT.filter((c) => c.status === "Denied").length / historicalCPT.length;

    if (recentDenialRate > historicalDenialRate * 1.5 && recentDenialRate > 0.15) {
      anomalies.push({
        type: "cpt_denial_spike",
        severity: "medium",
        entity: cpt,
        current_value: Math.round(recentDenialRate * 1000) / 10,
        baseline_value: Math.round(historicalDenialRate * 1000) / 10,
        description: `CPT ${cpt} denial rate increased to ${Math.round(recentDenialRate * 1000) / 10}% (was ${Math.round(historicalDenialRate * 1000) / 10}%)`,
      });
    }
  }

  // 3. Check for days-to-pay increases
  const recentPaid = recentClaims.filter((c) => c.status === "Paid" || c.status === "Partial");
  const historicalPaid = historicalClaims.filter((c) => c.status === "Paid" || c.status === "Partial");

  if (recentPaid.length > 20 && historicalPaid.length > 50) {
    const recentDays = recentPaid
      .filter((c) => c.payment_date)
      .map((c) => daysBetween(new Date(c.service_date), new Date(c.payment_date!)));
    const historicalDays = historicalPaid
      .filter((c) => c.payment_date)
      .map((c) => daysBetween(new Date(c.service_date), new Date(c.payment_date!)));

    if (recentDays.length > 0 && historicalDays.length > 0) {
      const recentAvg = recentDays.reduce((a, b) => a + b, 0) / recentDays.length;
      const historicalAvg = historicalDays.reduce((a, b) => a + b, 0) / historicalDays.length;

      if (recentAvg > historicalAvg * 1.3 && recentAvg > 30) {
        anomalies.push({
          type: "payment_delay",
          severity: "medium",
          entity: "Overall",
          current_value: Math.round(recentAvg * 10) / 10,
          baseline_value: Math.round(historicalAvg * 10) / 10,
          description: `Average days to payment increased to ${Math.round(recentAvg * 10) / 10} days (was ${Math.round(historicalAvg * 10) / 10} days)`,
        });
      }
    }
  }

  // 4. Check for specific denial reason spikes
  const recentDenials = recentClaims.filter((c) => c.status === "Denied");
  const historicalDenials = historicalClaims.filter((c) => c.status === "Denied");

  if (recentDenials.length > 10 && historicalDenials.length > 20) {
    const recentReasons: Record<string, number> = {};
    const historicalReasons: Record<string, number> = {};

    recentDenials.forEach((c) => {
      const reason = c.denial_reason || "Unknown";
      recentReasons[reason] = (recentReasons[reason] || 0) + 1;
    });

    historicalDenials.forEach((c) => {
      const reason = c.denial_reason || "Unknown";
      historicalReasons[reason] = (historicalReasons[reason] || 0) + 1;
    });

    for (const reason of Object.keys(recentReasons)) {
      const recentPct = recentReasons[reason] / recentDenials.length;
      const historicalPct = (historicalReasons[reason] || 0) / historicalDenials.length;

      if (recentPct > historicalPct * 1.5 && recentPct > 0.2) {
        anomalies.push({
          type: "denial_reason_spike",
          severity: "medium",
          entity: reason,
          current_value: Math.round(recentPct * 1000) / 10,
          baseline_value: Math.round(historicalPct * 1000) / 10,
          description: `'${reason}' denials increased to ${Math.round(recentPct * 1000) / 10}% of denials (was ${Math.round(historicalPct * 1000) / 10}%)`,
        });
      }
    }
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  anomalies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return anomalies;
}
