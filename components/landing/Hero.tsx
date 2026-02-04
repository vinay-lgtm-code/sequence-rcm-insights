"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-white pt-20 pb-24 lg:pt-32 lg:pb-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Main headline */}
          <h1 className="text-4xl font-semibold tracking-tight text-navy-500 sm:text-5xl lg:text-6xl">
            Stop Guessing.
            <br />
            Start Knowing.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-xl text-lg text-gray-500 leading-relaxed">
            Upload your claims data and get instant AI-powered insights into your
            practice's revenue cycle health.
          </p>

          {/* Single CTA */}
          <div className="mt-12">
            <Button size="xl" onClick={scrollToUpload} className="group">
              Get Free Analysis
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
