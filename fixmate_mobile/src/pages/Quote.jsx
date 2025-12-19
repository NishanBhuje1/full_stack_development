import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/**
 * FIXED PRICE TABLE (AUD)
 * Issue label mapping:
 * - LCD Price -> "Screen Replacement"
 * - Back Glass -> "Back Glass Replacement"
 * - Battery -> "Battery Replacement"
 * - Charging Port -> "Charging Port Repair"
 */
const PRICE_TABLE = {
  Apple: {
    "iPhone 7/8/SE/SE 2": {
      "Screen Replacement": 89,
      "Back Glass Replacement": 89,
      "Battery Replacement": 79,
      "Charging Port Repair": 89,
    },
    "iPhone X": {
      "Screen Replacement": 99,
      "Back Glass Replacement": 99,
      "Battery Replacement": 89,
      "Charging Port Repair": 99,
    },
    "iPhone Xs": {
      "Screen Replacement": 99,
      "Back Glass Replacement": 99,
      "Battery Replacement": 89,
      "Charging Port Repair": 99,
    },
    "iPhone Xs Max": {
      "Screen Replacement": 99,
      "Back Glass Replacement": 99,
      "Battery Replacement": 99,
      "Charging Port Repair": 99,
    },
    "iPhone 11": {
      "Screen Replacement": 109,
      "Back Glass Replacement": 119,
      "Battery Replacement": 109,
      "Charging Port Repair": 99,
    },
    "iPhone 11 Pro": {
      "Screen Replacement": 119,
      "Back Glass Replacement": 119,
      "Battery Replacement": 119,
      "Charging Port Repair": 129,
    },
    "iPhone 11 Pro Max": {
      "Screen Replacement": 129,
      "Back Glass Replacement": 129,
      "Battery Replacement": 129,
      "Charging Port Repair": 129,
    },
    "iPhone 12 / 12 Pro": {
      "Screen Replacement": 139,
      "Back Glass Replacement": 139,
      "Battery Replacement": 149,
      "Charging Port Repair": 129,
    },
    "iPhone 12 Pro Max": {
      "Screen Replacement": 159,
      "Back Glass Replacement": 139,
      "Battery Replacement": 159,
      "Charging Port Repair": 149,
    },
    "iPhone 13": {
      "Screen Replacement": 149,
      "Back Glass Replacement": 149,
      "Battery Replacement": 149,
      "Charging Port Repair": 129,
    },
    "iPhone 13 Pro": {
      "Screen Replacement": 189,
      "Back Glass Replacement": 169,
      "Battery Replacement": 159,
      "Charging Port Repair": 129,
    },
    "iPhone 13 Mini": {
      "Screen Replacement": 149,
      "Back Glass Replacement": 149,
      "Battery Replacement": 149,
      "Charging Port Repair": 129,
    },
    "iPhone 13 Pro Max": {
      "Screen Replacement": 199,
      "Back Glass Replacement": 179,
      "Battery Replacement": 159,
      "Charging Port Repair": 149,
    },
    "iPhone 14": {
      "Screen Replacement": 159,
      "Back Glass Replacement": 149,
      "Battery Replacement": 159,
      "Charging Port Repair": 159,
    },
    "iPhone 14 Plus": {
      "Screen Replacement": 169,
      "Back Glass Replacement": 159,
      "Battery Replacement": 159,
      "Charging Port Repair": 159,
    },
    "iPhone 14 Pro": {
      "Screen Replacement": 189,
      "Back Glass Replacement": 169,
      "Battery Replacement": 169,
      "Charging Port Repair": 169,
    },
    "iPhone 14 Pro Max": {
      "Screen Replacement": 229,
      "Back Glass Replacement": 179,
      "Battery Replacement": 169,
      "Charging Port Repair": 169,
    },
    "iPhone 15": {
      "Screen Replacement": 169,
      "Back Glass Replacement": 169,
      "Battery Replacement": 179,
      "Charging Port Repair": 169,
    },
    "iPhone 15 Plus": {
      "Screen Replacement": 189,
      "Back Glass Replacement": 169,
      "Battery Replacement": 179,
      "Charging Port Repair": 169,
    },
    "iPhone 15 Pro": {
      "Screen Replacement": 199,
      "Back Glass Replacement": 179,
      "Battery Replacement": 189,
      "Charging Port Repair": 179,
    },
    "iPhone 15 Pro Max": {
      "Screen Replacement": 229,
      "Back Glass Replacement": 189,
      "Battery Replacement": 189,
      "Charging Port Repair": 199,
    },
    "iPhone 16": {
      "Screen Replacement": 199,
      "Back Glass Replacement": 179,
      "Battery Replacement": 189,
      "Charging Port Repair": 189,
    },
    "iPhone 16 Plus": {
      "Screen Replacement": 219,
      "Back Glass Replacement": 189,
      "Battery Replacement": 189,
      "Charging Port Repair": 189,
    },
    "iPhone 16 Pro": {
      "Screen Replacement": 299,
      "Back Glass Replacement": 199,
      "Battery Replacement": 199,
      "Charging Port Repair": 199,
    },
    "iPhone 16 Pro Max": {
      "Screen Replacement": 319,
      "Back Glass Replacement": 199,
      "Battery Replacement": 199,
      "Charging Port Repair": 199,
    },
    "iPhone 16E": {
      "Screen Replacement": 189,
      "Back Glass Replacement": 159,
      "Battery Replacement": 169,
      // Charging Port price not provided in your list -> omitted intentionally
    },
  },
};

const CATALOG = {
  Apple: Object.keys(PRICE_TABLE.Apple),
};

// Optional: keep DB override (admin pricing). If you don’t want DB overrides, you can delete this.
async function fetchPricingOverride(brand, model, issue) {
  const url =
    `${API}/api/pricing?brand=${encodeURIComponent(brand)}` +
    `&model=${encodeURIComponent(model)}` +
    `&issue=${encodeURIComponent(issue)}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to fetch pricing");

  return data.rules?.[0] || null;
}

function getIssuesFor(brand, model) {
  const issuesObj = PRICE_TABLE?.[brand]?.[model] || {};
  // return only issues that have a numeric price
  return Object.entries(issuesObj)
    .filter(([, price]) => typeof price === "number" && Number.isFinite(price))
    .map(([issue]) => issue);
}

function getFixedPrice(brand, model, issue) {
  const price = PRICE_TABLE?.[brand]?.[model]?.[issue];
  return typeof price === "number" ? price : null;
}

export default function Quote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);

  // Step 1
  const [brand, setBrand] = useState("Apple");
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
  const [email, setEmail] = useState("");

  // If user came from ServicesList: /quote?issue=Battery%20Replacement
  useEffect(() => {
    const preIssue = searchParams.get("issue");
    if (preIssue) setIssue(preIssue);
  }, [searchParams]);

  const models = useMemo(
    () => (brand ? Object.keys(PRICE_TABLE[brand] || {}) : []),
    [brand]
  );
  const issues = useMemo(
    () => (brand && model ? getIssuesFor(brand, model) : []),
    [brand, model]
  );

  // Fixed base price from your table
  const fixedBasePrice = useMemo(() => {
    if (!brand || !model || !issue) return null;
    return getFixedPrice(brand, model, issue);
  }, [brand, model, issue]);

  // Final price uses override if admin set it; otherwise uses fixed table price
  const finalPrice = useMemo(() => {
    if (!brand || !model || !issue) return null;

    // If override exists, use override basePrice (treat as fixed)
    if (overrideRule && typeof overrideRule.basePrice === "number") {
      return overrideRule.basePrice;
    }

    return fixedBasePrice;
  }, [brand, model, issue, overrideRule, fixedBasePrice]);

  const canGoStep2 = Boolean(brand && model && issue);
  const canGoStep3 = Boolean(finalPrice != null && !loadingPrice);
  const canSubmit = Boolean(
    fullName && phone && email && preferredDate && preferredTime
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
        // If override fails, we still show fixed price from table
        if (!cancelled)
          setPriceError(
            err.message || "Pricing fetch failed (using fixed list)."
          );
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
        email,
        phone,
        brand,
        model,
        issue,
        preferredDate,
        preferredTime,
        estimateLow: finalPrice, // fixed quote -> low = high = same
        estimateHigh: finalPrice,
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
            <p className="text-[#334578]/80 mt-1">
              3 steps: Select → Price → Book
            </p>
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
            <StepPill active={step === 2} done={step > 2} label="2. Price" />
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select model</option>
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334578] mb-2">
                    Repair Type
                  </label>
                  <select
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    disabled={!model}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      {model ? "Select repair type" : "Select model first"}
                    </option>
                    {issues.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                <div className="text-sm text-[#334578]/80">
                  Can’t find your device?{" "}
                  <Link
                    to="/custom-quote"
                    className="text-blue-700 hover:text-blue-800 font-semibold"
                  >
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
                Step 2: Fixed price
              </h2>

              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="text-[#334578]/80 text-sm mb-2">
                  Your selection
                </div>
                <div className="text-lg font-semibold text-[#334578]">
                  {brand} • {model} • {issue}
                </div>

                <div className="mt-4">
                  {loadingPrice ? (
                    <div className="text-[#334578]/80">Loading pricing...</div>
                  ) : finalPrice != null ? (
                    <>
                      <div className="text-[#334578]/80 text-sm">
                        Fixed price
                      </div>
                      <div className="text-3xl font-bold text-[#334578] mt-1">
                        ${finalPrice}
                      </div>

                      <div className="text-sm text-[#334578]/70 mt-2">
                        Final price may change only if inspection finds
                        additional damage or parts are unavailable.
                      </div>

                      {overrideRule ? (
                        <div className="mt-3 text-sm text-green-700 font-semibold">
                          Using Admin pricing override from database.
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-[#334578]/70">
                          Using your fixed price list.
                        </div>
                      )}

                      {priceError ? (
                        <div className="mt-3 text-sm text-red-600 font-semibold">
                          Pricing fetch issue: {priceError}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-red-600 font-semibold">
                      No price found for this selection. Please go back or use
                      custom quote.
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
                  {finalPrice != null ? (
                    <span className="font-normal text-[#334578]/80">
                      (Price: ${finalPrice})
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="you@example.com"
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
          Next step: connect bookings to calendar and send confirmation
          SMS/email.
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
