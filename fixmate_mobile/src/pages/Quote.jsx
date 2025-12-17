import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const LS_PRICING = "fixmate_pricing_overrides_v1";
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

const CATALOG = {
  Apple: {
    "iPhone 17": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "iPhone 17 Pro": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "iPhone 17 Pro Max": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
  },
  Samsung: {
    "Galaxy S25+": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "Galaxy S25 Ultra": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "Galaxy 25 Edge": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
  },
  Google: {
    "Pixel 10": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "Pixel 10 Pro": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
    "Pixel 10 Pro XL": [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Camera Repair",
      "Water Damage Check",
      "Speaker / Microphone",
    ],
  },
};

// Simple estimate table (adjust to your real pricing)
const PRICING = {
  "Screen Replacement": { base: 220, range: 60 },
  "Battery Replacement": { base: 120, range: 40 },
  "Charging Port Repair": { base: 140, range: 50 },
  "Camera Repair": { base: 180, range: 60 },
  "Water Damage Check": { base: 90, range: 40 },
  "Speaker / Microphone": { base: 160, range: 50 },
};

function estimateCost({ brand, model, issue }) {
  if (!brand || !model || !issue) return null;

  const overrides = readJSON(LS_PRICING, {});
  const overrideKey = `${brand}__${model}__${issue}`;
  const override = overrides[overrideKey];

  const price = override || PRICING[issue] || { base: 150, range: 50 };

  const brandMultiplier =
    brand === "Apple" ? 1.15 : brand === "Google" ? 1.05 : 1.0;
  const modelBump =
    model.includes("15") || model.includes("S23") || model.includes("Pixel 8")
      ? 1.1
      : 1.0;

  const base = Math.round(price.base * brandMultiplier * modelBump);
  const low = Math.max(50, base - price.range);
  const high = base + price.range;

  return { low, high, base };
}

export default function Quote() {
  const [searchParams] = useSearchParams();
  const issueFromUrl = searchParams.get("issue") || "";

  const [step, setStep] = useState(1);

  // Step 1
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");

  // Step 3
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Prefill Issue from ServicesList redirect
  useEffect(() => {
    if (issueFromUrl) {
      setIssue(issueFromUrl);
    }
  }, [issueFromUrl]);

  const models = useMemo(
    () => (brand ? Object.keys(CATALOG[brand] || {}) : []),
    [brand]
  );

  // Ensure issueFromUrl appears in dropdown even if not in the model list yet
  const issues = useMemo(() => {
    const list = brand && model ? CATALOG[brand]?.[model] || [] : [];
    if (issueFromUrl && !list.includes(issueFromUrl))
      return [issueFromUrl, ...list];
    return list;
  }, [brand, model, issueFromUrl]);

  const estimate = useMemo(
    () => estimateCost({ brand, model, issue }),
    [brand, model, issue]
  );

  const canGoStep2 = Boolean(brand && model && issue);
  const canGoStep3 = Boolean(estimate);
  const canSubmit = Boolean(
    fullName && phone && preferredDate && preferredTime
  );

  function next() {
    setStep((s) => Math.min(3, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function resetModelAndIssue(nextBrand) {
    setBrand(nextBrand);
    setModel("");
    // keep issue if it came from URL so user doesn't lose the selected service
    setIssue(issueFromUrl || "");
  }

  function resetIssue(nextModel) {
    setModel(nextModel);
    // keep issue if it came from URL and is still valid, otherwise reset
    const validList = CATALOG[brand]?.[nextModel] || [];
    if (issueFromUrl && validList.includes(issueFromUrl)) {
      setIssue(issueFromUrl);
    } else if (issueFromUrl && !validList.includes(issueFromUrl)) {
      // still keep it (user can proceed, estimate will be based on pricing table)
      setIssue(issueFromUrl);
    } else {
      setIssue("");
    }
  }

  function handleBook(e) {
    const existing = readJSON(LS_LEADS, []);
    existing.push({
      type: "Quote Booking",
      createdAt: new Date().toISOString(),
      fullName,
      email: "", // you don't collect email in Quote page currently
      phone,
      brand,
      model,
      issue,
      estimate,
      preferredDate,
      preferredTime,
      message: "",
    });
    writeJSON(LS_LEADS, existing);

    e.preventDefault();

    console.log("Booking details:", {
      brand,
      model,
      issue,
      estimate,
      fullName,
      phone,
      preferredDate,
      preferredTime,
    });

    alert("Appointment request submitted! We will contact you shortly.");
  }

  return (
    <div className="min-h-screen bg-[#f1f9f8]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#334578]">
              Get a Repair Quote
            </h1>
            <p className="text-[#334578]/80 mt-1">
              3 steps: Select → Estimate → Book
            </p>
            {issueFromUrl ? (
              <p className="text-sm text-[#334578]/70 mt-1">
                Selected service:{" "}
                <span className="font-semibold">{issueFromUrl}</span>
              </p>
            ) : null}
          </div>

          <Link
            to="/"
            className="text-blue-700 hover:text-blue-800 font-semibold"
          >
            Back to Home
          </Link>
        </div>

        {/* Step indicator */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            <StepPill active={step === 1} done={step > 1} label="1. Select" />
            <div className="h-px flex-1 bg-gray-200" />
            <StepPill active={step === 2} done={step > 2} label="2. Estimate" />
            <div className="h-px flex-1 bg-gray-200" />
            <StepPill active={step === 3} done={false} label="3. Book" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#334578] mb-4">
                Step 1: Select your device
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => resetModelAndIssue(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select brand</option>
                    {Object.keys(CATALOG).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => resetIssue(e.target.value)}
                    disabled={!brand}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      {brand ? "Select model" : "Select brand first"}
                    </option>
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Issue / Service
                  </label>
                  <select
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      {brand && model
                        ? "Select issue"
                        : "You can pick issue now or after selecting model"}
                    </option>

                    {/* If no brand/model yet, still allow selecting the service prefilled from URL */}
                    {(!brand || !model) && issueFromUrl ? (
                      <option value={issueFromUrl}>{issueFromUrl}</option>
                    ) : null}

                    {issues.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>

                  {brand &&
                  model &&
                  issue &&
                  !(CATALOG[brand]?.[model] || []).includes(issue) ? (
                    <p className="text-xs text-[#334578]/70 mt-2">
                      Note: This service may not be listed for the selected
                      model. You can still request a booking.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#334578]/80">
                  Can’t find your device or issue?{" "}
                  <Link
                    to="/custom-quote"
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Request a custom quote
                  </Link>
                </div>

                <button
                  onClick={next}
                  disabled={!canGoStep2}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#334578] mb-4">
                Step 2: Estimated cost
              </h2>

              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="text-[#334578]/80 text-sm mb-2">
                  Your selection
                </div>
                <div className="text-lg font-semibold text-[#334578]">
                  {brand} • {model} • {issue}
                </div>

                <div className="mt-4">
                  {estimate ? (
                    <>
                      <div className="text-[#334578]/80 text-sm">
                        Estimated range
                      </div>
                      <div className="text-3xl font-bold text-[#334578] mt-1">
                        ${estimate.low} – ${estimate.high}
                      </div>
                      <div className="text-sm text-[#334578]/70 mt-2">
                        Rough estimate. Final price depends on inspection and
                        parts availability.
                      </div>
                    </>
                  ) : (
                    <div className="text-red-600 font-semibold">
                      Missing details. Go back and select brand, model, and
                      issue.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={back}
                  className="px-6 py-3 rounded-full border border-gray-200 font-semibold text-[#334578] hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={next}
                  disabled={!canGoStep3}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Book appointment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#334578] mb-4">
                Step 3: Book appointment
              </h2>

              <div className="rounded-2xl border border-gray-200 p-5 mb-5">
                <div className="text-sm text-[#334578]/80">Summary</div>
                <div className="mt-1 font-semibold text-[#334578]">
                  {brand} • {model} • {issue}{" "}
                  {estimate ? (
                    <span className="font-normal text-[#334578]/80">
                      (Est: ${estimate.low}–${estimate.high})
                    </span>
                  ) : null}
                </div>
              </div>

              <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Full name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Phone number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="04xx xxx xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Preferred date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Preferred time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select time</option>
                    <option value="Morning">Morning (9am–12pm)</option>
                    <option value="Afternoon">Afternoon (12pm–4pm)</option>
                    <option value="Evening">Evening (4pm–7pm)</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={back}
                    className="px-6 py-3 rounded-full border border-gray-200 font-semibold text-[#334578] hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                  >
                    Confirm booking
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <p className="text-sm text-[#334578]/70 mt-5">
          Next step: connect this form to your backend (email, database, or
          booking system).
        </p>
      </div>
    </div>
  );
}

function StepPill({ active, done, label }) {
  const base = "px-4 py-2 rounded-full text-sm font-semibold transition-colors";
  const cls = done
    ? `${base} bg-green-50 text-green-700`
    : active
    ? `${base} bg-blue-600 text-white`
    : `${base} bg-gray-100 text-gray-600`;
  return <div className={cls}>{label}</div>;
}
