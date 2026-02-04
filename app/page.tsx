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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="text-xl font-semibold text-navy-500">
              Sequence
            </a>
            <a
              href="#upload"
              className="text-sm font-medium text-navy-500 hover:text-primary-500 transition-colors"
            >
              Get Started
            </a>
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
