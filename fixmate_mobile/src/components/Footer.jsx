import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Subscribe:", subscribe);
    alert("Thanks! You’re subscribed.");
    setEmail("");
    setSubscribe(false);
  };

  return (
    <footer className="bg-[#f1f9f8] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Contact Form Section */}
        <div className="max-w-md mx-auto mb-16">
          <h3 className="text-3xl font-serif text-[#334578] mb-6 text-center">
            Connect with Us
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[#334578] mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-[#334578]"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="subscribe"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="subscribe" className="text-[#334578] text-sm">
                Yes, subscribe me to your newsletter.{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Company Info and Social Links */}
        <div className="grid md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-300">
          <div>
            <h4 className="text-2xl font-serif text-[#334578] mb-4">
              FixMate Mobile
            </h4>
            <div className="space-y-2 text-gray-700">
              <p>(03) 8820 8183</p>
              <p>
                <a
                  href="mailto:info@mysite.com"
                  className="hover:text-[#334578]"
                >
                  info@mysite.com
                </a>
              </p>
              <p>
                Eastland Shopping Centre,
                <br />
                175 Maroondah Hwy, Ringwood,
                <br />
                VIC 3134
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-serif text-[#334578] mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75"
              >
                <img
                  src="https://ext.same-assets.com/657843969/2961112558.png"
                  alt="Facebook"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75"
              >
                <img
                  src="https://ext.same-assets.com/657843969/2619992834.png"
                  alt="Instagram"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75"
              >
                <img
                  src="https://ext.same-assets.com/657843969/1168425046.png"
                  alt="X"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75"
              >
                <img
                  src="https://ext.same-assets.com/657843969/3707911403.png"
                  alt="TikTok"
                  className="w-8 h-8"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <a href="#privacy" className="text-[#334578] hover:underline">
            Privacy Policy
          </a>
          <a href="#accessibility" className="text-[#334578] hover:underline">
            Accessibility Statement
          </a>
          <a href="#terms" className="text-[#334578] hover:underline">
            Terms & Conditions
          </a>

          {/* Admin Dashboard Button */}
          <Link
            to="/admin"
            className="text-[#334578] hover:underline font-semibold"
          >
            Admin Dashboard
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2035 by FixMate Mobile.</p>
        </div>
      </div>
    </footer>
  );
}
