"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "./FileDropzone";
import { EmailCapture } from "./EmailCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle } from "lucide-react";

export function UploadSection() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = file && isValidEmail(email) && !isUploading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      router.push(`/success?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <section id="upload" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-500">
            Get Your Free Analysis
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Upload your claims data and receive an AI-powered executive summary.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 space-y-5">
              <FileDropzone
                onFileAccepted={setFile}
                isUploading={isUploading}
              />

              <EmailCapture
                email={email}
                onEmailChange={setEmail}
                disabled={isUploading}
              />

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze My Data
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                Your data is processed in memory only and never stored.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
