import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoSection } from "@/components/landing/VideoSection";
import { UploadSection } from "@/components/upload/UploadSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="text-2xl font-bold text-navy-500">
              Sequence
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-navy-500 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-navy-500 transition-colors">
                How It Works
              </a>
              <a href="#video" className="text-sm text-gray-600 hover:text-navy-500 transition-colors">
                Demo
              </a>
              <a
                href="#upload"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
              >
                Get Free Analysis
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Page sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <VideoSection />
      <UploadSection />
      <Footer />
    </main>
  );
}
