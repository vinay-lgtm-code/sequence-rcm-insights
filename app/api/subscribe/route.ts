import { NextRequest, NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 }
      );
    }

    // Save to Firestore
    await saveSubscriber({
      email,
      source: "subscribe",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
