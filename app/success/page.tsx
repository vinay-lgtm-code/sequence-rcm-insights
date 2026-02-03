"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your inbox";

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-navy-500">
              Sequence
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {/* Success icon */}
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-navy-500 sm:text-4xl">
            Analysis Complete!
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            Your RCM health report is on its way to{" "}
            <span className="font-medium text-navy-500">{email}</span>
          </p>

          <Card className="mb-8 text-left">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold text-navy-500 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary-500" />
                What to Expect
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                    1
                  </div>
                  <span>Executive summary of your revenue cycle health</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                    2
                  </div>
                  <span>Key metrics compared to industry benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                    3
                  </div>
                  <span>Specific recommendations your team can act on today</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                    4
                  </div>
                  <span>Link to book a free consultation with our RCM experts</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
            <Clock className="h-4 w-4" />
            <span>Email typically arrives within 2-3 minutes</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/#upload">
              <Button size="lg" className="group">
                Analyze Another File
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Don&apos;t see the email? Check your spam folder or{" "}
            <a href="mailto:support@sequence-ai.com" className="text-primary-500 hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
