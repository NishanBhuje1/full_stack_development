import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#f1f9f8] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#334578] leading-tight mb-6">
              Expert Care for Your Device
            </h1>
            <p className="text-xl md:text-2xl text-[#334578] mb-8">
              Your Trusted Phone Repair Partner
            </p>

            <button
              onClick={() => navigate("/quote")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Get Help NOW!
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full">
            <img
              src="https://ext.same-assets.com/657843969/818504829.jpeg"
              alt="Phone repair tools and disassembled phone"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Let's Chat Button */}
      <button className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors z-40">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l.917-3.917A6.987 6.987 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
        Let's Chat!
      </button>
    </section>
  );
}
