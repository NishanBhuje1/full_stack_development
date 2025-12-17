import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const CATALOG = {
  Apple: {
    "iPhone 13": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
    "iPhone 14": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
    "iPhone 15": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
  },
  Samsung: {
    "Galaxy S22": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
    "Galaxy S23": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
    "Galaxy A54": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
  },
  Google: {
    "Pixel 7": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
    "Pixel 8": ["Screen Replacement", "Battery Replacement", "Charging Port Repair"],
  },
};

// default pricing (fallback when DB has no override)
const PRICING = {
  "Screen Replacement": { base: 220, range: 60 },
  "Battery Replacement": { base: 120, range: 40 },
  "Charging Port Repair": { base: 140, range: 50 },
  "Charging Port": { base: 140, range: 50 }, // optional compatibility
};

function estimateFromDefault({ brand, model, issue }) {
  if (!brand || !model || !issue) return null;

  const price = PRICING[issue] || { base: 150, range: 50 };

  // small modifiers (example)
  const brandMultiplier = brand === "Apple" ? 1.15 : brand === "Google" ? 1.05 : 1.0;
  const modelBump =
    model.includes("15") || model.includes("S23") || model.includes("Pixel 8") ? 1.1 : 1.0;

  const base = Math.round(price.base * brandMultiplier * modelBump);
  const low = Math.max(50, base - price.range);
  const high = base + price.range;

  return { low, high, base };
}

async function fetchPricingOverride(brand, model, issue) {
  const url =
    `${API}/api/pricing?brand=${encodeURIComponent(brand)}` +
    `&model=${encodeURIComponent(model)}` +
    `&issue=${encodeURIComponent(issue)}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to fetch pricing");

  // backend returns { rules: [...] }
  return data.rules?.[0] || null;
}

export default function Quote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);

  // Step 1
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");

  // Step 2
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [overrideRule, setOverrideRule] = useState(null);

  // Step 3
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // If user came from ServicesList: /quote?issue=Screen%20Replacement
  useEffect(() => {
    const preIssue = searchParams.get("issue");
    if (preIssue) setIssue(preIssue);
  }, [searchParams]);

  const models = useMemo(() => (brand ? Object.keys(CATALOG[brand] || {}) : []), [brand]);
  const issues = useMemo(() => (brand && model ? CATALOG[brand]?.[model] || [] : []), [brand, model]);

  const defaultEstimate = useMemo(
    () => estimateFromDefault({ brand, model, issue }),
    [brand, model, issue]
  );

  // Final estimate uses override if available else default
  const finalEstimate = useMemo(() => {
    if (!brand || !model || !issue) return null;

    if (overrideRule) {
      const base = overrideRule.basePrice;
      const range = overrideRule.rangePrice;

      // keep your brand/model modifiers (optional)
      const brandMultiplier = brand === "Apple" ? 1.15 : brand === "Google" ? 1.05 : 1.0;
      const modelBump =
        model.includes("15") || model.includes("S23") || model.includes("Pixel 8") ? 1.1 : 1.0;

      const computedBase = Math.round(base * brandMultiplier * modelBump);
      const low = Math.max(50, computedBase - range);
      const high = computedBase + range;

      return { low, high, base: computedBase };
    }

    return defaultEstimate;
  }, [brand, model, issue, overrideRule, defaultEstimate]);

  const canGoStep2 = Boolean(brand && model && issue);
  const canGoStep3 = Boolean(finalEstimate && !loadingPrice);
  const canSubmit = Boolean(fullName && phone && preferredDate && preferredTime);

  function next() {
    setStep((s) => Math.min(3, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function resetModelAndIssue(nextBrand) {
    setBrand(nextBrand);
    setModel("");
    // keep issue if it exists in future; but safe reset:
    setIssue("");
    setOverrideRule(null);
    setPriceError("");
  }

  function resetIssue(nextModel) {
    setModel(nextModel);
    setIssue("");
    setOverrideRule(null);
    setPriceError("");
  }

  // When we enter Step 2, fetch override from DB (if exists)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (step !== 2) return;
      if (!brand || !model || !issue) return;

      setLoadingPrice(true);
      setPriceError("");
      setOverrideRule(null);

      try {
        const rule = await fetchPricingOverride(brand, model, issue);
        if (!cancelled) setOverrideRule(rule);
      } catch (err) {
        if (!cancelled) setPriceError(err.message || "Pricing fetch failed");
      } finally {
        if (!cancelled) setLoadingPrice(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [step, brand, model, issue]);

  async function handleBook(e) {
    e.preventDefault();

    try {
      const payload = {
        type: "Quote Booking",
        fullName,
        email: "", // add later if needed
        phone,
        brand,
        model,
        issue,
        preferredDate,
        preferredTime,
        estimateLow: finalEstimate?.low,
        estimateHigh: finalEstimate?.high,
        message: "",
      };

      const res = await fetch(`${API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit booking");

      alert("Appointment request submitted! We will contact you shortly.");
      navigate("/");
    } catch (err) {
      alert(err.message || "Booking failed. Please try again.");
    }
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
            <p className="text-[#334578]/80 mt-1">3 steps: Select → Estimate → Book</p>
          </div>
          <Link to="/" className="text-blue-700 hover:text-blue-800 font-semibold">
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
                    <option value="">{brand ? "Select model" : "Select brand first"}</option>
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Issue
                  </label>
                  <select
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    disabled={!brand || !model}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">{model ? "Select issue" : "Select model first"}</option>
                    {issues.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                {/* Custom quote link instead of tip */}
                <div className="text-sm text-[#334578]/80">
                  Can’t find your device?{" "}
                  <Link to="/custom-quote" className="text-blue-700 hover:text-blue-800 font-semibold">
                    Request a custom quote
                  </Link>
                  .
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
                <div className="text-[#334578]/80 text-sm mb-2">Your selection</div>
                <div className="text-lg font-semibold text-[#334578]">
                  {brand} • {model} • {issue}
                </div>

                <div className="mt-4">
                  {loadingPrice ? (
                    <div className="text-[#334578]/80">Loading pricing...</div>
                  ) : finalEstimate ? (
                    <>
                      <div className="text-[#334578]/80 text-sm">Estimated range</div>
                      <div className="text-3xl font-bold text-[#334578] mt-1">
                        ${finalEstimate.low} – ${finalEstimate.high}
                      </div>

                      <div className="text-sm text-[#334578]/70 mt-2">
                        This is a rough estimate. Final price depends on inspection and parts availability.
                      </div>

                      {overrideRule ? (
                        <div className="mt-3 text-sm text-green-700 font-semibold">
                          Using Admin pricing override from database.
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-[#334578]/70">
                          Using standard pricing (no override set).
                        </div>
                      )}

                      {priceError ? (
                        <div className="mt-3 text-sm text-red-600 font-semibold">
                          Pricing fetch issue: {priceError}. Using fallback.
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-red-600 font-semibold">
                      Missing details. Go back and select all fields.
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
                  {finalEstimate ? (
                    <span className="font-normal text-[#334578]/80">
                      (Est: ${finalEstimate.low}–${finalEstimate.high})
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
          Next step: connect bookings to calendar and send confirmation SMS/email.
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
