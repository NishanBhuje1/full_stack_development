import { useState } from "react";
import { Link } from "react-router-dom";

const LS_LEADS = "fixmate_leads_v1";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function CustomQuote() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    model: "",
    issue: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Required field validation (message is optional)
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.model ||
      !form.issue
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Replace with API / email / backend integration later
    console.log("Custom Quote Request:", form);
    // Save to localStorage as a mock "database"
    const existing = readJSON(LS_LEADS, []);
    existing.push({
      type: "Custom Quote",
      createdAt: new Date().toISOString(),
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      brand: "",
      model: form.model,
      issue: form.issue,
      estimate: null,
      preferredDate: "",
      preferredTime: "",
      message: form.message || "",
    });
    writeJSON(LS_LEADS, existing);

    alert(
      "Your custom quote request has been submitted. We’ll contact you shortly."
    );

    // Reset form
    setForm({
      fullName: "",
      email: "",
      phone: "",
      model: "",
      issue: "",
      message: "",
    });
  }

  return (
    <div className="min-h-screen bg-[#f1f9f8]">
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-[#334578] mb-2">
          Request a Custom Quote
        </h1>
        <p className="text-[#334578]/80 mb-6">
          Can’t find your device? Fill out the form below and we’ll get back to
          you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="04xx xxx xxx"
              required
            />
          </div>

          {/* Device Model */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Device Model *
            </label>
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. iPhone 12 Pro, Galaxy Note 10"
              required
            />
          </div>

          {/* Issue */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Issue *
            </label>
            <input
              type="text"
              name="issue"
              value={form.issue}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Describe the issue briefly"
              required
            />
          </div>

          {/* Message (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-[#334578] mb-1">
              Additional Message (optional)
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Any extra details you’d like us to know"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link to="/quote" className="text-[#334578]/80 hover:underline">
              Back to quote
            </Link>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
