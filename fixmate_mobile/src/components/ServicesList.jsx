import { useNavigate } from "react-router-dom";

const SERVICES = [
  {
    title: "Screen Replacement",
    desc: "Cracked screen, touch issues, display not working.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Battery Replacement",
    desc: "Battery draining fast, phone shutting down, swelling.",
    image:
      "https://images.unsplash.com/photo-1525446517618-9a9e5430288b?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Charging Port Repair",
    desc: "Loose cable, not charging, intermittent charging.",
    image:
      "https://images.unsplash.com/photo-1741144837506-9986b01d8e27?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Camera Repair",
    desc: "Blurry camera, black screen, focus issues.",
    image:
      "https://images.unsplash.com/photo-1608540784621-e66c96a3271f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Water Damage Check",
    desc: "Inspection and cleaning to prevent corrosion.",
    image:
      "https://images.unsplash.com/photo-1550253594-4a24acce57eb?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Speaker / Microphone",
    desc: "Low sound, no audio, mic not working during calls.",
    image:
      "https://plus.unsplash.com/premium_vector-1683141463858-66d21bf627d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D",
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
                group relative overflow-hidden rounded-2xl border border-gray-200
                h-60 text-left shadow-sm hover:shadow-md
                transition-all focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              {/* Background image */}
              <div
                className="
                  absolute inset-0 bg-cover bg-center
                  transition-all duration-300
                  group-hover:blur-sm group-hover:scale-105
                "
                style={{ backgroundImage: `url(${s.image})` }}
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-white/90 mt-1 text-sm">{s.desc}</p>
                <p className="mt-3 font-semibold text-blue-200">
                  Get a quote →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
