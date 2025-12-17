import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-[70vh] bg-[#f1f9f8]">
      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#334578]">
            Welcome to FixMate Mobile
          </h1>
          <p className="text-[#334578]/80 mt-4 text-lg leading-relaxed">
            We’re here to make phone repair simple, stress-free, and reliable.
            Whether it’s a cracked screen, battery issue, or charging problem—our team
            will guide you clearly and treat your device with care.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl border border-gray-200 p-5">
              <div className="font-semibold text-[#334578]">Friendly Support</div>
              <p className="text-[#334578]/75 mt-1">Clear advice and honest recommendations.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5">
              <div className="font-semibold text-[#334578]">Reliable Repairs</div>
              <p className="text-[#334578]/75 mt-1">Careful handling and quality workmanship.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5">
              <div className="font-semibold text-[#334578]">Fast & Simple</div>
              <p className="text-[#334578]/75 mt-1">Get a quote, then book in minutes.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to="/quote"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full text-center transition-colors"
            >
              Get a Quote
            </Link>
            <Link
              to="/contact"
              className="border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold px-6 py-3 rounded-full text-center transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
