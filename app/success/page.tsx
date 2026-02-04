"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your inbox";

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="text-xl font-semibold text-navy-500">
              Sequence
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          {/* Success icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-semibold text-navy-500">
            Analysis Complete
          </h1>

          <p className="mt-4 text-gray-500">
            Your RCM health report is on its way to{" "}
            <span className="font-medium text-navy-500">{email}</span>
          </p>

          <div className="mt-10">
            <Link href="/#upload">
              <Button size="lg">
                Analyze Another File
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Don't see the email? Check your spam folder.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
