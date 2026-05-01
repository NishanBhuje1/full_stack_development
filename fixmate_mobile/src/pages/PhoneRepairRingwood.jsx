import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight, Wrench, ShieldCheck, Clock, Smartphone } from "lucide-react";

const services = [
  { icon: <Smartphone className="w-5 h-5 text-blue-600" />, label: "Screen Replacement" },
  { icon: <Wrench className="w-5 h-5 text-indigo-600" />, label: "Battery Replacement" },
  { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, label: "Charging Port Repair" },
  { icon: <Wrench className="w-5 h-5 text-purple-600" />, label: "Water Damage Repair" },
  { icon: <Smartphone className="w-5 h-5 text-blue-600" />, label: "Camera Repair" },
  { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, label: "Software Diagnostics" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70 } },
};

export default function PhoneRepairRingwood() {
  return (
    <div className="min-h-screen bg-[#f1f9f8] text-[#334578]">

      {/* Hero Section */}
      <section className="bg-[#334578] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/80 text-xs font-bold tracking-wide uppercase mb-4">
              Ringwood • Melbourne • VIC
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Phone Repair Shop in Ringwood
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              FixMate Mobile is Ringwood's trusted in-store phone repair shop. Located inside
              Eastland Shopping Centre, we fix iPhones, Samsung, and all major brands — while you wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#334578] font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/visit-store"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors"
              >
                Store Hours & Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >

          {/* About Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#334578] mb-4">
              Ringwood's Local Phone Repair Specialists
            </h2>
            <div className="space-y-4 text-[#334578]/80 leading-relaxed text-base md:text-lg">
              <p>
                Looking for a <strong>phone repair shop in Ringwood</strong>? FixMate Mobile is a
                physical, walk-in repair shop based inside Eastland Shopping Centre on Maroondah
                Highway. We serve customers across Ringwood and surrounding Melbourne suburbs
                including Croydon, Mitcham, Nunawading, and Bayswater.
              </p>
              <p>
                As a <strong>local phone shop in Ringwood</strong>, we specialise in fast, affordable
                repairs for all major smartphone brands. Whether you need an <strong>iPhone repair in
                Ringwood</strong>, a Samsung screen fix, or a battery replacement, our technicians
                carry out every job in-store — no shipping required, no waiting days for a courier.
              </p>
              <p>
                We are <em>not</em> an online-only or remote technical support service. Every repair
                is performed at our physical Ringwood store after a face-to-face inspection. You bring
                your device in, we diagnose it, give you a price, and fix it — often same day.
              </p>
              <p>
                Our phone repair services cover screen replacements, battery swaps, charging port
                repairs, water damage recovery, camera fixes, and general diagnostics. We use quality
                parts and back our work with a limited warranty. No fix, no fee — just honest, local service.
              </p>
              <p>
                FixMate Mobile has built a reputation in the Ringwood community for transparent pricing,
                quick turnaround times, and friendly in-store support. Whether your screen is cracked,
                your battery dies in an hour, or your phone won't charge — come visit our phone shop
                in Ringwood and we'll get it sorted.
              </p>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-serif font-bold text-[#334578] mb-6">
              In-Store Repair Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-5 flex items-center gap-3 shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <span className="font-medium text-sm text-[#334578]">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact / Address Card */}
          <motion.div variants={itemVariants} className="bg-[#334578] text-white rounded-3xl p-8 md:p-10 shadow-md">
            <h2 className="text-2xl font-serif font-bold mb-6">Visit Our Phone Shop in Ringwood</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-white/70 text-sm mt-0.5">
                    K129/175 Maroondah Highway<br />
                    Ringwood VIC 3134<br />
                    (Inside Eastland Shopping Centre)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+61388208183" className="text-white/70 text-sm hover:text-white transition-colors">
                    (03) 8820 8183
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:support@fixmatemobile.com" className="text-white/70 text-sm hover:text-white transition-colors">
                    support@fixmatemobile.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Opening Hours</p>
                  <div className="text-white/70 text-sm mt-0.5 space-y-0.5">
                    <p>Mon–Wed: 9:00 AM – 5:30 PM</p>
                    <p>Thu–Fri: 9:00 AM – 9:00 PM</p>
                    <p>Saturday: 9:00 AM – 5:00 PM</p>
                    <p>Sunday: 10:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#334578] font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/visit-store"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                View Map & Full Hours
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}
