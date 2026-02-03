export interface ClaimData {
  claim_id: string;
  patient_id: string;
  service_date: string;
  submission_date: string;
  cpt_code: string;
  cpt_description: string;
  icd_code: string;
  payer: string;
  charge_amount: number;
  payment_amount: number;
  status: "Paid" | "Denied" | "Pending" | "Partial";
  denial_reason: string | null;
  payment_date: string | null;
  provider: string;
}

export interface DaysInARResult {
  overall_avg_days: number;
  by_payer: Record<string, { avg_days: number; median_days: number; claim_count: number }>;
  aging_buckets: {
    "0-30 days": number;
    "31-60 days": number;
    "61-90 days": number;
    "90+ days": number;
  };
  total_ar_value: number;
  pending_claim_count: number;
}

export interface DenialRateResult {
  overall_rate: number;
  denied_count: number;
  total_count: number;
  by_payer: Record<string, number>;
  by_reason: Record<string, number>;
  by_reason_pct: Record<string, number>;
  monthly_trend: Record<string, number>;
  by_cpt: Record<string, number>;
  denial_value: number;
}

export interface CleanClaimRateResult {
  overall_rate: number;
  clean_count: number;
  total_resolved: number;
  by_payer: Record<string, number>;
  by_provider: Record<string, number>;
  monthly_trend: Record<string, number>;
}

export interface CollectionRateResult {
  overall_rate: number;
  total_charged: number;
  total_collected: number;
  by_payer: Record<string, {
    collection_rate: number;
    total_charged: number;
    total_collected: number;
    claim_count: number;
  }>;
  monthly_trend: Record<string, number>;
  top_payers: [string, number][];
  bottom_payers: [string, number][];
}

export interface Anomaly {
  type: string;
  severity: "high" | "medium" | "low";
  entity: string;
  current_value: number;
  baseline_value: number;
  description: string;
}

export interface AllMetrics {
  days_in_ar: DaysInARResult;
  denial_rate: DenialRateResult;
  clean_claim_rate: CleanClaimRateResult;
  collection_rate: CollectionRateResult;
  anomalies: Anomaly[];
  summary: {
    total_claims: number;
    total_charged: number;
    total_collected: number;
    date_range: {
      start: string;
      end: string;
    };
  };
}
