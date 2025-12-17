import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Contact form:", form);
    alert("Thanks! We received your message and will reply soon.");

    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-[70vh] bg-[#f1f9f8]">
      <div className="max-w-xl mx-auto px-4 py-14">
        <h1 className="text-4xl font-serif text-[#334578] mb-2">Contact Us</h1>
        <p className="text-[#334578]/80 mb-6">
          Send us a message and we’ll get back to you as soon as possible.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
