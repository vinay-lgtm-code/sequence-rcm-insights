"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";

export function Hero() {
  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-50 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Zap className="mr-2 h-4 w-4" />
            AI-Powered RCM Analytics
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-navy-500 sm:text-5xl lg:text-6xl">
            Stop Guessing.{" "}
            <span className="bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent">
              Start Knowing.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Upload your claims data and get instant AI-powered insights into your
            practice&apos;s revenue cycle health. Find hidden revenue leaks and
            fix them before they cost you.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" onClick={scrollToUpload} className="group">
              Analyze Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() =>
                document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-500" />
              <span>HIPAA-Safe Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-500" />
              <span>No Data Stored</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-500" />
              <span>Results in Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
