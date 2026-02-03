import { Mail, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-500 py-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold">Sequence</h3>
            <p className="mt-2 text-gray-300 max-w-md">
              AI-powered RCM insights for healthcare practices. Stop guessing about
              your revenue cycle health. Start knowing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#upload" className="hover:text-white transition-colors">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:hello@sequence-ai.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-navy-400 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Sequence. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-400" />
              No PHI Stored
            </span>
            <span>|</span>
            <span>In-Memory Processing Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
