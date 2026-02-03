import { Resend } from "resend";
import { AllMetrics } from "./metrics/types";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured - email sending disabled");
    return null;
  }
  return new Resend(apiKey);
}

interface SendReportEmailParams {
  to: string;
  executiveSummary: string;
  recommendations: string[];
  metrics: AllMetrics;
}

export async function sendReportEmail({
  to,
  executiveSummary,
  recommendations,
  metrics,
}: SendReportEmailParams): Promise<{ success: boolean; error?: string }> {
  const calcomLink = process.env.NEXT_PUBLIC_CALCOM_LINK || "https://cal.com";

  // Format metrics table
  const metricsTable = `
| Metric | Your Value | Industry Target |
|--------|-----------|-----------------|
| Denial Rate | ${metrics.denial_rate.overall_rate}% | <5% |
| Days in A/R | ${metrics.days_in_ar.overall_avg_days} days | <30 days |
| Clean Claim Rate | ${metrics.clean_claim_rate.overall_rate}% | >95% |
| Collection Rate | ${metrics.collection_rate.overall_rate}% | varies |
`;

  // Format recommendations
  const recommendationsList = recommendations
    .map((rec, i) => `${i + 1}. ${rec}`)
    .join("\n");

  // Plain text version
  const textContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEQUENCE | AI-Powered RCM Insights
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR RCM HEALTH SUMMARY

${executiveSummary}

KEY METRICS AT A GLANCE
${metricsTable}

TOP RECOMMENDATIONS

${recommendationsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

READY TO FIX THESE ISSUES?

Get personalized guidance from our RCM experts.

Book your free 30-minute consultation:
${calcomLink}

Your first month of Sequence is FREE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email was sent by Sequence (sequence-ai.com).
You received this because you requested an RCM analysis.
`;

  // HTML version
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your RCM Analysis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f7fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0066CC 0%, #00A5A8 100%); padding: 30px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Sequence</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">AI-Powered RCM Insights</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
      <h2 style="color: #1A365D; font-size: 22px; margin: 0 0 20px 0;">Your RCM Health Summary</h2>

      <div style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        ${executiveSummary.split("\n\n").map((p) => `<p style="margin: 0 0 15px 0;">${p}</p>`).join("")}
      </div>

      <!-- Metrics Table -->
      <h3 style="color: #1A365D; font-size: 18px; margin: 30px 0 15px 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">Key Metrics at a Glance</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background-color: #f7fafc;">
          <th style="text-align: left; padding: 12px; border: 1px solid #e2e8f0; color: #1A365D;">Metric</th>
          <th style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #1A365D;">Your Value</th>
          <th style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #1A365D;">Target</th>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">Denial Rate</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-weight: bold; color: ${metrics.denial_rate.overall_rate > 5 ? "#DC2626" : "#059669"};">${metrics.denial_rate.overall_rate}%</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #718096;">&lt;5%</td>
        </tr>
        <tr style="background-color: #f7fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0;">Days in A/R</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-weight: bold; color: ${metrics.days_in_ar.overall_avg_days > 30 ? "#DC2626" : "#059669"};">${metrics.days_in_ar.overall_avg_days} days</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #718096;">&lt;30 days</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">Clean Claim Rate</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-weight: bold; color: ${metrics.clean_claim_rate.overall_rate < 95 ? "#DC2626" : "#059669"};">${metrics.clean_claim_rate.overall_rate}%</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #718096;">&gt;95%</td>
        </tr>
        <tr style="background-color: #f7fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0;">Collection Rate</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-weight: bold;">${metrics.collection_rate.overall_rate}%</td>
          <td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; color: #718096;">varies</td>
        </tr>
      </table>

      <!-- Recommendations -->
      <h3 style="color: #1A365D; font-size: 18px; margin: 30px 0 15px 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">Top Recommendations</h3>
      <ol style="color: #4A5568; font-size: 14px; line-height: 1.7; padding-left: 20px; margin: 0;">
        ${recommendations.map((rec) => `<li style="margin-bottom: 10px;">${rec}</li>`).join("")}
      </ol>

      <!-- CTA -->
      <div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #f7fafc 0%, #e6f7f7 100%); border-radius: 8px; text-align: center;">
        <h3 style="color: #1A365D; font-size: 18px; margin: 0 0 10px 0;">Ready to Fix These Issues?</h3>
        <p style="color: #718096; font-size: 14px; margin: 0 0 20px 0;">Get personalized guidance from our RCM experts.</p>
        <a href="${calcomLink}" style="display: inline-block; background-color: #0066CC; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Book Free 30-Min Consultation</a>
        <p style="color: #00A5A8; font-size: 13px; margin: 15px 0 0 0; font-weight: 500;">Your first month of Sequence is FREE.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; text-align: center; font-size: 12px; color: #718096;">
      <p style="margin: 0;">This email was sent by <a href="https://sequence-ai.com" style="color: #0066CC; text-decoration: none;">Sequence</a></p>
      <p style="margin: 5px 0 0 0;">You received this because you requested an RCM analysis.</p>
    </div>
  </div>
</body>
</html>
`;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.log("Email sending skipped - Resend not configured");
      return { success: true }; // Return success to not block the flow
    }

    const { error } = await resend.emails.send({
      from: "Sequence <reports@sequence-ai.com>",
      to: [to],
      subject: "Your RCM Analysis is Ready",
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
