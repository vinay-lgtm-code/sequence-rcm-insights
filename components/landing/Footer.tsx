export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-navy-500">Sequence</h3>
            <p className="mt-1 text-sm text-gray-500">
              AI-powered RCM insights
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-navy-500 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-navy-500 transition-colors">
              Terms
            </a>
            <a href="mailto:hello@sequence-ai.com" className="hover:text-navy-500 transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Sequence. All rights reserved. Your data is processed in memory only.
          </p>
        </div>
      </div>
    </footer>
  );
}
