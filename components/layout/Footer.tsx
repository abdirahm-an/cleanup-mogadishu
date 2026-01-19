import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Cleanup Mogadishu</span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-md">
              Working together to create a cleaner, greener Mogadishu for future generations. 
              Join us in our mission to restore our beautiful city.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm sm:text-base text-gray-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm sm:text-base text-gray-600 hover:text-primary-600 transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-sm sm:text-base text-gray-600 hover:text-primary-600 transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <p>Mogadishu, Somalia</p>
              <p>info@cleanupmogadishu.org</p>
              <p>+252 XX XXX XXXX</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-sm text-center sm:text-left">
            © {currentYear} Cleanup Mogadishu. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
