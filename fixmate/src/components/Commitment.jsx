export default function Commitment() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-[#98abb3]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Video/Image Area */}
        <div className="mb-12">
          <img
            src="https://ext.same-assets.com/657843969/1954722475.jpeg"
            alt="Our Commitment"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Commitment Content */}
        <div className="bg-white/90 backdrop-blur rounded-lg p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#334578] mb-8 text-center">
            Our Commitment
          </h2>

          <div className="flex justify-center gap-8 mb-8">
            <img
              src="https://ext.same-assets.com/657843969/4070350632.svg"
              alt="Icon 1"
              className="w-16 h-16"
            />
            <img
              src="https://ext.same-assets.com/657843969/178086224.svg"
              alt="Icon 2"
              className="w-16 h-16"
            />
            <img
              src="https://ext.same-assets.com/657843969/3935028852.svg"
              alt="Icon 3"
              className="w-16 h-16"
            />
          </div>

          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
            At FixMate Mobile, we excel in mobile device repairs, providing precise repair quotes
            and valuing customer feedback through testimonials. Our goal is to enhance our online
            presence by detailing our services and ensuring customer trust. We're here to serve
            your repair needs efficiently.
          </p>
        </div>
      </div>
    </section>
  );
}
