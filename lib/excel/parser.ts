import * as XLSX from "xlsx";
import { ClaimData } from "../metrics/types";

// Required columns for claims data
const REQUIRED_COLUMNS = [
  "claim_id",
  "service_date",
  "cpt_code",
  "payer",
  "charge_amount",
  "payment_amount",
  "status",
];

// Column name aliases for flexibility
const COLUMN_ALIASES: Record<string, string[]> = {
  claim_id: ["claim_id", "claimid", "claim id", "claim number", "claim_number"],
  patient_id: ["patient_id", "patientid", "patient id", "patient_number", "pt_id"],
  service_date: ["service_date", "servicedate", "service date", "dos", "date_of_service"],
  submission_date: ["submission_date", "submissiondate", "submission date", "submit_date"],
  cpt_code: ["cpt_code", "cptcode", "cpt code", "cpt", "procedure_code"],
  cpt_description: ["cpt_description", "cpt_desc", "description", "procedure_description"],
  icd_code: ["icd_code", "icdcode", "icd code", "icd", "diagnosis_code"],
  payer: ["payer", "payer_name", "insurance", "insurance_name", "carrier"],
  charge_amount: ["charge_amount", "chargeamount", "charge amount", "charges", "billed_amount"],
  payment_amount: ["payment_amount", "paymentamount", "payment amount", "payment", "paid_amount"],
  status: ["status", "claim_status", "claimstatus", "claim status"],
  denial_reason: ["denial_reason", "denialreason", "denial reason", "denial_code"],
  payment_date: ["payment_date", "paymentdate", "payment date", "paid_date"],
  provider: ["provider", "provider_name", "rendering_provider", "physician"],
};

function normalizeColumnName(name: string): string {
  const normalized = name.toLowerCase().trim();
  for (const [standard, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(normalized)) {
      return standard;
    }
  }
  return normalized;
}

function parseDate(value: unknown): string {
  if (!value) return "";

  // Handle Excel serial date numbers
  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  }

  // Handle string dates
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
    return value;
  }

  return "";
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function parseStatus(value: unknown): ClaimData["status"] {
  const status = String(value || "").toLowerCase().trim();

  if (status.includes("paid") && !status.includes("partial")) return "Paid";
  if (status.includes("denied") || status.includes("reject")) return "Denied";
  if (status.includes("partial")) return "Partial";
  if (status.includes("pending") || status.includes("open") || status.includes("submitted")) return "Pending";

  return "Pending"; // Default
}

export interface ParseResult {
  success: boolean;
  claims: ClaimData[];
  errors: string[];
  warnings: string[];
}

export function parseExcelFile(buffer: ArrayBuffer): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const claims: ClaimData[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: "array" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { success: false, claims: [], errors: ["No sheets found in Excel file"], warnings: [] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

    if (rawData.length < 2) {
      return { success: false, claims: [], errors: ["File has no data rows"], warnings: [] };
    }

    // Parse header row
    const headerRow = rawData[0] as string[];
    const columnMap: Record<string, number> = {};

    headerRow.forEach((col, index) => {
      if (col) {
        const normalized = normalizeColumnName(String(col));
        columnMap[normalized] = index;
      }
    });

    // Check for required columns
    const missingColumns = REQUIRED_COLUMNS.filter((col) => columnMap[col] === undefined);
    if (missingColumns.length > 0) {
      return {
        success: false,
        claims: [],
        errors: [`Missing required columns: ${missingColumns.join(", ")}`],
        warnings: [],
      };
    }

    // Parse data rows
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.every((cell) => !cell)) {
        continue; // Skip empty rows
      }

      const getValue = (colName: string): unknown => {
        const index = columnMap[colName];
        return index !== undefined ? row[index] : undefined;
      };

      try {
        const claim: ClaimData = {
          claim_id: String(getValue("claim_id") || `ROW_${i}`),
          patient_id: String(getValue("patient_id") || "UNKNOWN"),
          service_date: parseDate(getValue("service_date")),
          submission_date: parseDate(getValue("submission_date")) || parseDate(getValue("service_date")),
          cpt_code: String(getValue("cpt_code") || ""),
          cpt_description: String(getValue("cpt_description") || ""),
          icd_code: String(getValue("icd_code") || ""),
          payer: String(getValue("payer") || "Unknown"),
          charge_amount: parseNumber(getValue("charge_amount")),
          payment_amount: parseNumber(getValue("payment_amount")),
          status: parseStatus(getValue("status")),
          denial_reason: getValue("denial_reason") ? String(getValue("denial_reason")) : null,
          payment_date: parseDate(getValue("payment_date")) || null,
          provider: String(getValue("provider") || "Unknown"),
        };

        // Validate required fields
        if (!claim.service_date) {
          warnings.push(`Row ${i + 1}: Missing service date, skipped`);
          continue;
        }

        if (!claim.cpt_code) {
          warnings.push(`Row ${i + 1}: Missing CPT code, skipped`);
          continue;
        }

        claims.push(claim);
      } catch (rowError) {
        warnings.push(`Row ${i + 1}: Parse error, skipped`);
      }
    }

    if (claims.length === 0) {
      return {
        success: false,
        claims: [],
        errors: ["No valid claims data found"],
        warnings,
      };
    }

    return {
      success: true,
      claims,
      errors: [],
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      claims: [],
      errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`],
      warnings: [],
    };
  }
}
