"use client";

import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailCaptureProps {
  email: string;
  onEmailChange: (email: string) => void;
  disabled: boolean;
}

export function EmailCapture({ email, onEmailChange, disabled }: EmailCaptureProps) {
  return (
    <div className="w-full">
      <label htmlFor="email" className="block text-sm font-medium text-navy-500 mb-2">
        Email address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          id="email"
          type="email"
          placeholder="you@yourpractice.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
          className="pl-10"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        We&apos;ll send your analysis report to this email.
      </p>
    </div>
  );
}
