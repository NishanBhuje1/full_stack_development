import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "font-semibold transition-colors",
          isActive ? "text-blue-700" : "text-[#334578] hover:text-[#4a5f99]",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobile = () => setIsOpen(false);

  return (
    <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              navigate("/");
              closeMobile();
            }}
            className="flex items-center"
            aria-label="Go to home"
          >
            <img
              src="https://ext.same-assets.com/657843969/2994605673.jpeg"
              alt="FixMate Mobile"
              className="h-14 w-auto"
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/" label="Home" />
            <NavItem to="/welcome" label="Welcome" />
            <NavItem to="/contact" label="Contact" />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#334578] p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
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

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="flex flex-col gap-4">
              <NavItem to="/" label="Home" onClick={closeMobile} />
              <NavItem to="/welcome" label="Welcome" onClick={closeMobile} />
              <NavItem to="/contact" label="Contact" onClick={closeMobile} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
