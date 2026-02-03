"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "./FileDropzone";
import { EmailCapture } from "./EmailCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <section id="upload" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
            Get Your Free Analysis
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Upload your claims data and receive an AI-powered executive summary
            in your inbox within minutes.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upload Claims Data</CardTitle>
              <CardDescription>
                Export your claims from your practice management system as .xlsx
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileDropzone
                onFileAccepted={setFile}
                isUploading={isUploading}
              />

              <div className="border-t border-gray-200 pt-6">
                <EmailCapture
                  email={email}
                  onEmailChange={setEmail}
                  disabled={isUploading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
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

              <p className="text-center text-xs text-gray-500">
                By uploading, you agree to our{" "}
                <a href="/privacy" className="text-primary-500 hover:underline">
                  Privacy Policy
                </a>
                . Your data is processed in memory only and never stored.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
