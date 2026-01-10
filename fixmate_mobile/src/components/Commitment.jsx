import { motion } from "framer-motion";
import { Star, ShieldCheck, Wrench, HeartHandshake, Quote } from "lucide-react";

// --- Review Data (Static for now) ---
const REVIEWS = [
  {
    name: "Nishan Bhujel",
    text: "I had a great experience at this mobile repair shop. The staff were professional, knowledgeable, efficient. Pricing was fair, and the turnaround time was faster than expected.",
    stars: 5,
  },
  {
    name: "Josephine Flecknoe",

    text: "Very helpful and trustworthy service from the salesperson, plus great product knowledge. Thanks Wayne.",
    stars: 5,
  },
  {
    name: "Neil Fereday",

    text: "Great service and plenty of choice. Highly recommended!",
    stars: 5,
  },
  {
    name: "Daya shankar Pathak",

    text: "Good Service and very professional.",
    stars: 5,
  },
];

export default function Commitment() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f1f9f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PART 1: OUR COMMITMENT (Split Layout) */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" /> Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#334578] mb-6 leading-tight">
              Committed to <span className="text-blue-600">Excellence</span> in
              Every Repair
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At FixMate Mobile, we don't just fix screens; we restore
              connections. We value clear communication, precise quotes, and
              genuine care for your device. Our goal is to build trust through
              transparency and quality workmanship.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <FeatureItem
                icon={<Wrench />}
                text="Expert technicians with years of experience"
              />
              <FeatureItem
                icon={<ShieldCheck />}
                text="Premium quality parts & warranty"
              />
              <FeatureItem
                icon={<HeartHandshake />}
                text="Honest advice, no hidden fees"
              />
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10"></div>
            <img
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop" // Changed to a cleaner Unsplash repair image
              alt="Technician repairing phone"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[400px] md:h-[500px]"
            />
          </motion.div>
        </div>

        {/* PART 2: TESTIMONIALS */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif text-[#334578] mb-4">
              Loved by Locals
            </h3>
            <div className="flex justify-center items-center gap-2 text-amber-500 mb-2">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
            </div>
            <p className="text-gray-500">Based on our Google Reviews</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} review={review} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Sub-components ---

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        {/* Clone element to force size consistency */}
        <div className="w-5 h-5">{icon}</div>
      </div>
      <span className="text-[#334578] font-medium">{text}</span>
    </div>
  );
}

function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow"
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4 text-amber-400">
        {[...Array(review.stars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>

      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-blue-100 fill-current" />
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
        "{review.text}"
      </p>

      {/* Author */}
      <div className="mt-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          {review.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-[#334578]">{review.name}</div>
          <div className="text-xs text-gray-400">{review.date}</div>
        </div>
      </div>
    </motion.div>
  );
}
