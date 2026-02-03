import { NextRequest, NextResponse } from "next/server";
import { parseExcelFile } from "@/lib/excel/parser";
import { getAllMetrics } from "@/lib/metrics";
import { generateExecutiveSummary, generateRecommendations } from "@/lib/ai/executive-summary";
import { sendReportEmail } from "@/lib/resend";
import { saveSubscriber, logAnalysis } from "@/lib/firebase";

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "Only .xlsx files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Parse Excel file
    const buffer = await file.arrayBuffer();
    const parseResult = parseExcelFile(buffer);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.errors.join("; ") },
        { status: 400 }
      );
    }

    const { claims, warnings } = parseResult;

    if (claims.length < 10) {
      return NextResponse.json(
        { error: "File must contain at least 10 valid claims for meaningful analysis" },
        { status: 400 }
      );
    }

    // Calculate all metrics
    const metrics = getAllMetrics(claims);

    // Generate AI insights (parallel)
    const [executiveSummary, recommendations] = await Promise.all([
      generateExecutiveSummary(metrics),
      generateRecommendations(metrics),
    ]);

    // Send email report
    const emailResult = await sendReportEmail({
      to: email,
      executiveSummary,
      recommendations,
      metrics,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      // Don't fail the request - we'll log it and continue
    }

    // Save subscriber and log analysis (non-blocking)
    Promise.all([
      saveSubscriber({
        email,
        source: "analysis",
        createdAt: new Date(),
      }),
      logAnalysis({
        email,
        claimCount: claims.length,
        metrics: {
          denialRate: metrics.denial_rate.overall_rate,
          daysInAR: metrics.days_in_ar.overall_avg_days,
          cleanClaimRate: metrics.clean_claim_rate.overall_rate,
          collectionRate: metrics.collection_rate.overall_rate,
        },
      }),
    ]).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Analysis complete. Check your email for results.",
      stats: {
        claimsAnalyzed: claims.length,
        warnings: warnings.length,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
