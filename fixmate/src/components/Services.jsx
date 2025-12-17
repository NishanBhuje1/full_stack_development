export default function Services() {
  const services = [
    {
      id: 1,
      title: "Battery Replacement",
      price: "$80",
      image: "https://ext.same-assets.com/657843969/3166280470.jpeg",
    },
    {
      id: 2,
      title: "Screen Repair",
      price: "$100",
      image: "https://ext.same-assets.com/657843969/3521867939.jpeg",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-serif text-[#334578] mb-4">Services</h2>
        <p className="text-lg text-gray-600 mb-12">Service Information</p>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="border-2 border-[#334578] rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-serif text-[#334578] mb-2 border-b-2 border-[#334578] pb-2">
                  {service.title}
                </h3>
                <p className="text-xl text-[#334578] mb-6 mt-4">{service.price}</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
