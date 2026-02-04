"use client";

import { Input } from "@/components/ui/input";

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
      <Input
        id="email"
        type="email"
        placeholder="you@practice.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
