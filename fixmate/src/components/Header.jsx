import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#welcome", label: "Welcome" },
  { href: "#services", label: "Service List" },
  { href: "#about", label: "About" },
];

const MORE_LINKS = [
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optional: close menus on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        setIsMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            onClick={closeMobile}
            aria-label="Go to FixMate Mobile home"
          >
            <img
              src="https://ext.same-assets.com/657843969/2994605673.jpeg"
              alt="FixMate Mobile"
              className="h-14 w-auto"
              loading="eager"
              decoding="async"
            />
            <span className="hidden sm:block text-lg font-semibold text-[#334578]">
              FixMate Mobile
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#334578] hover:text-[#4a5f99] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
              >
                {link.label}
              </a>
            ))}

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[#334578] hover:text-[#4a5f99] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMoreOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg p-2"
                  role="menu"
                >
                  {MORE_LINKS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm text-[#334578] hover:bg-gray-50 hover:text-[#4a5f99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      role="menuitem"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Login */}
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 text-[#334578] hover:text-[#4a5f99] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="font-medium">Log In</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#334578] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div id="mobile-menu" className="md:hidden pb-4">
            <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-white shadow-sm p-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="px-3 py-2 rounded-lg text-[#334578] hover:bg-gray-50 hover:text-[#4a5f99] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#334578] hover:bg-gray-50 hover:text-[#4a5f99] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Log In</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
