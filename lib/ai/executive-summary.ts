import Anthropic from "@anthropic-ai/sdk";
import { AllMetrics } from "../metrics/types";

const client = new Anthropic();

export async function generateExecutiveSummary(metrics: AllMetrics): Promise<string> {
  const metricsText = `
## Current RCM Metrics

### Days in A/R
- Average days to payment: ${metrics.days_in_ar.overall_avg_days} days
- Total A/R value: $${metrics.days_in_ar.total_ar_value.toLocaleString()}
- Pending claims: ${metrics.days_in_ar.pending_claim_count}
- Aging breakdown: ${JSON.stringify(metrics.days_in_ar.aging_buckets)}

### Denial Rate
- Overall denial rate: ${metrics.denial_rate.overall_rate}%
- Total denied: ${metrics.denial_rate.denied_count} of ${metrics.denial_rate.total_count} claims
- Denial value: $${metrics.denial_rate.denial_value.toLocaleString()}
- Top denial reasons: ${JSON.stringify(Object.fromEntries(Object.entries(metrics.denial_rate.by_reason).slice(0, 5)))}
- Denial rate by payer: ${JSON.stringify(Object.fromEntries(Object.entries(metrics.denial_rate.by_payer).slice(0, 5)))}

### Clean Claim Rate
- Overall rate: ${metrics.clean_claim_rate.overall_rate}%
- Clean claims: ${metrics.clean_claim_rate.clean_count} of ${metrics.clean_claim_rate.total_resolved}

### Collection Rate
- Overall rate: ${metrics.collection_rate.overall_rate}%
- Total charged: $${metrics.collection_rate.total_charged.toLocaleString()}
- Total collected: $${metrics.collection_rate.total_collected.toLocaleString()}

### Detected Anomalies
${metrics.anomalies.length > 0 ? JSON.stringify(metrics.anomalies, null, 2) : "No significant anomalies detected"}
`;

  const prompt = `You are an RCM (Revenue Cycle Management) analyst for a healthcare practice.
The practice manager needs a clear, executive summary of their revenue cycle health that can be sent via email.

Based on the following metrics, write a concise executive summary (3-4 paragraphs) that:
1. Opens with the overall health assessment (strong, needs attention, or concerning)
2. Highlights the most important metrics - good or bad
3. Calls out any anomalies or trends that need attention
4. Keeps it accessible for a non-technical practice manager

${metricsText}

Write the summary in a professional but conversational tone. Use specific numbers but explain what they mean in plain language.
Do NOT use markdown headers or formatting - write it as clean paragraphs suitable for email.
Keep it concise - no more than 4 paragraphs.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text;
    }

    return generateFallbackSummary(metrics);
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return generateFallbackSummary(metrics);
  }
}

function generateFallbackSummary(metrics: AllMetrics): string {
  const denialRate = metrics.denial_rate.overall_rate;
  const collectionRate = metrics.collection_rate.overall_rate;
  const daysAR = metrics.days_in_ar.overall_avg_days;

  let health = "needs attention";
  if (denialRate < 8 && collectionRate > 55 && daysAR < 35) {
    health = "healthy";
  } else if (denialRate > 15 || collectionRate < 45 || daysAR > 45) {
    health = "concerning";
  }

  let summary = `Your practice's revenue cycle health is ${health}. `;
  summary += `We analyzed ${metrics.denial_rate.total_count.toLocaleString()} claims totaling $${metrics.collection_rate.total_charged.toLocaleString()} in charges.\n\n`;

  summary += `Your current denial rate is ${denialRate}% (industry target: under 5%), `;
  summary += `with an average of ${daysAR} days to payment (target: under 30 days). `;
  summary += `Your clean claim rate stands at ${metrics.clean_claim_rate.overall_rate}%, `;
  summary += `and you're collecting ${collectionRate}% of billed charges.\n\n`;

  if (metrics.anomalies.length > 0) {
    summary += "We detected some issues that need your attention:\n";
    metrics.anomalies.slice(0, 3).forEach((anomaly) => {
      summary += `- ${anomaly.description}\n`;
    });
  }

  return summary;
}

export async function generateRecommendations(metrics: AllMetrics): Promise<string[]> {
  const prompt = `Based on these RCM metrics, provide exactly 3 specific, actionable recommendations.
Each should be one sentence and immediately actionable.

Metrics:
- Denial rate: ${metrics.denial_rate.overall_rate}% (${metrics.denial_rate.denied_count} claims, $${metrics.denial_rate.denial_value.toLocaleString()})
- Days in A/R: ${metrics.days_in_ar.overall_avg_days} days
- Clean claim rate: ${metrics.clean_claim_rate.overall_rate}%
- Collection rate: ${metrics.collection_rate.overall_rate}%
- Top denial reasons: ${JSON.stringify(Object.entries(metrics.denial_rate.by_reason).slice(0, 3))}
- Worst payers by denial: ${JSON.stringify(Object.entries(metrics.denial_rate.by_payer).slice(0, 3))}
- Claims over 90 days: ${metrics.days_in_ar.aging_buckets["90+ days"]}

Respond with exactly 3 recommendations, one per line, no numbering or bullets.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 3);
    }

    return generateFallbackRecommendations(metrics);
  } catch (error) {
    console.error("AI recommendations generation failed:", error);
    return generateFallbackRecommendations(metrics);
  }
}

function generateFallbackRecommendations(metrics: AllMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.denial_rate.overall_rate > 10) {
    const topReason = Object.keys(metrics.denial_rate.by_reason)[0];
    recommendations.push(`Focus on reducing "${topReason}" denials, which account for a significant portion of your ${metrics.denial_rate.overall_rate}% denial rate.`);
  }

  if (metrics.days_in_ar.aging_buckets["90+ days"] > 10) {
    recommendations.push(`Prioritize working the ${metrics.days_in_ar.aging_buckets["90+ days"]} claims over 90 days old before they become uncollectable.`);
  }

  const worstPayer = Object.entries(metrics.denial_rate.by_payer)[0];
  if (worstPayer && worstPayer[1] > 15) {
    recommendations.push(`Review your ${worstPayer[0]} claims process, as they have a ${worstPayer[1]}% denial rate.`);
  }

  if (recommendations.length < 3) {
    recommendations.push(`Monitor your ${metrics.days_in_ar.overall_avg_days}-day average A/R to prevent cash flow issues.`);
  }

  return recommendations.slice(0, 3);
}
