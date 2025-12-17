import { useNavigate } from "react-router-dom";

const SERVICES = [
  {
    title: "Screen Replacement",
    desc: "Cracked screen, touch issues, display not working.",
  },
  {
    title: "Battery Replacement",
    desc: "Battery draining fast, phone shutting down, swelling.",
  },
  {
    title: "Charging Port Repair",
    desc: "Loose cable, not charging, intermittent charging.",
  },
  {
    title: "Camera Repair",
    desc: "Blurry camera, black screen, focus issues.",
  },
  {
    title: "Water Damage Check",
    desc: "Inspection and cleaning to prevent corrosion.",
  },
  {
    title: "Speaker / Microphone",
    desc: "Low sound, no audio, mic not working during calls.",
  },
];

export default function ServicesList() {
  const navigate = useNavigate();

  function goToQuote(serviceTitle) {
    navigate(`/quote?issue=${encodeURIComponent(serviceTitle)}`);
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-18">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#334578]">
            Services We Provide
          </h2>
          <p className="text-[#334578]/80 mt-2">
            Click a service to get a quote and book an appointment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <button
              key={s.title}
              onClick={() => goToQuote(s.title)}
              className="
                text-left rounded-2xl border border-gray-200 p-6
                shadow-sm hover:shadow-md hover:border-blue-500
                transition-all focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <h3 className="text-xl font-semibold text-[#334578]">
                {s.title}
              </h3>
              <p className="text-[#334578]/75 mt-2">{s.desc}</p>

              <p className="mt-4 text-blue-600 font-semibold">
                Get a quote →
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
