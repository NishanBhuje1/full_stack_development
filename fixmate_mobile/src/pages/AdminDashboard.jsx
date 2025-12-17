import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/** ======= CONFIG: ONE ADMIN USER ======= */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "FixMate@123";

/** localStorage keys */
const LS_PRICING = "fixmate_pricing_overrides_v1";
const LS_LEADS = "fixmate_leads_v1";
const LS_ADMIN_SESSION = "fixmate_admin_session_v1";

/** Services list must match your Quote page issues */
const SERVICES = [
  "Screen Replacement",
  "Battery Replacement",
  "Charging Port Repair",
  "Camera Repair",
  "Water Damage Check",
  "Speaker / Microphone",
];

/** Must match your Quote page models (keep in sync) */
const CATALOG = {
  Apple: ["iPhone 13", "iPhone 14", "iPhone 15"],
  Samsung: ["Galaxy S22", "Galaxy S23", "Galaxy A54"],
  Google: ["Pixel 7", "Pixel 8"],
};

/** ---------- helpers ---------- */
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

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCSV(rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return `"${s.replaceAll('"', '""')}"`;
    }
    return s;
  };

  const headers = [
    "createdAt",
    "type",
    "fullName",
    "email",
    "phone",
    "brand",
    "model",
    "issue",
    "preferredDate",
    "preferredTime",
    "estimateLow",
    "estimateHigh",
    "message",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          if (h === "estimateLow") return escape(r.estimate?.low ?? "");
          if (h === "estimateHigh") return escape(r.estimate?.high ?? "");
          return escape(r[h] ?? "");
        })
        .join(",")
    ),
  ];

  return lines.join("\n");
}

/** ---------- component ---------- */
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => {
    const session = readJSON(LS_ADMIN_SESSION, null);
    return Boolean(session?.authed);
  });

  // Login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Pricing
  const [pricingOverrides, setPricingOverrides] = useState(() =>
    readJSON(LS_PRICING, {})
  );
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState(CATALOG["Apple"][0]);
  const [service, setService] = useState(SERVICES[0]);
  const [base, setBase] = useState("");
  const [range, setRange] = useState("");

  // Leads
  const [leads, setLeads] = useState(() => readJSON(LS_LEADS, []));
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    setModel(CATALOG[brand]?.[0] || "");
  }, [brand]);

  const currentKey = useMemo(
    () => `${brand}__${model}__${service}`,
    [brand, model, service]
  );

  useEffect(() => {
    const existing = pricingOverrides[currentKey];
    if (existing) {
      setBase(String(existing.base ?? ""));
      setRange(String(existing.range ?? ""));
    } else {
      setBase("");
      setRange("");
    }
  }, [currentKey, pricingOverrides]);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .slice()
      .reverse()
      .filter((l) => (typeFilter === "All" ? true : l.type === typeFilter))
      .filter((l) => {
        if (!q) return true;
        const hay = [
          l.type,
          l.fullName,
          l.email,
          l.phone,
          l.brand,
          l.model,
          l.issue,
          l.message,
          l.preferredDate,
          l.preferredTime,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [leads, query, typeFilter]);

  /** ---------- auth ---------- */
  function handleLogin(e) {
    e.preventDefault();
    setAuthError("");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      writeJSON(LS_ADMIN_SESSION, { authed: true, at: Date.now() });
      setAuthed(true);
      setUsername("");
      setPassword("");
      return;
    }

    setAuthError("Invalid username or password.");
  }

  function logout() {
    writeJSON(LS_ADMIN_SESSION, { authed: false, at: Date.now() });
    setAuthed(false);
  }

  /** ---------- pricing ---------- */
  function savePrice() {
    const b = Number(base);
    const r = Number(range);

    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(r) || r < 0) {
      alert("Please enter valid numbers for base and range.");
      return;
    }

    const next = { ...pricingOverrides, [currentKey]: { base: b, range: r } };
    setPricingOverrides(next);
    writeJSON(LS_PRICING, next);
    alert("Price saved.");
  }

  function removeOverride() {
    const next = { ...pricingOverrides };
    delete next[currentKey];
    setPricingOverrides(next);
    writeJSON(LS_PRICING, next);
    alert("Override removed.");
  }

  /** ---------- leads ---------- */
  function refreshLeads() {
    setLeads(readJSON(LS_LEADS, []));
  }

  function clearLeads() {
    if (!confirm("Clear all leads? This cannot be undone.")) return;
    writeJSON(LS_LEADS, []);
    setLeads([]);
  }

  function exportCSV() {
    const csv = toCSV(filteredLeads);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`fixmate-leads-${stamp}.csv`, csv);
  }

  /** ---------- login screen ---------- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#f1f9f8]">
        <div className="max-w-lg mx-auto px-4 py-14">
          <div className="bg-white rounded-2xl shadow-sm p-7">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif text-[#334578]">
                Admin Login
              </h1>
              <Link
                to="/"
                className="text-blue-700 hover:text-blue-800 font-semibold"
              >
                Back
              </Link>
            </div>

            <p className="text-[#334578]/80 mt-2">
              Enter your admin username and password.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="••••••••"
                />
              </div>

              {authError ? (
                <div className="text-red-600 font-semibold">{authError}</div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Login
              </button>
            </form>

            <p className="text-xs text-[#334578]/60 mt-4">
              Note: This is client-side only (not secure for production). Use a
              backend for real security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /** ---------- dashboard ---------- */
  return (
    <div className="min-h-screen bg-[#f1f9f8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-[#334578]">
              Admin Dashboard
            </h1>
            <p className="text-[#334578]/75 mt-2">
              Manage pricing and track website leads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-5 py-2 rounded-full border border-gray-200 text-[#334578] font-semibold hover:bg-gray-50"
            >
              Logout
            </button>
            <Link
              to="/"
              className="text-blue-700 hover:text-blue-800 font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-[#334578]">
              Pricing Manager
            </h2>
            <p className="text-[#334578]/75 mt-1">
              Set custom pricing for each model + service (stored locally).
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
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
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                >
                  {(CATALOG[brand] || []).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Base price
                </label>
                <input
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="e.g. 220"
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Range (+/-)
                </label>
                <input
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="e.g. 60"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={savePrice}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Save
              </button>

              <button
                onClick={removeOverride}
                className="border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Remove override
              </button>
            </div>

            <div className="mt-5 text-sm text-[#334578]/70">
              Stored key: <span className="font-mono">{currentKey}</span>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#334578]">Leads</h2>
                <p className="text-[#334578]/75 mt-1">
                  Search, filter, export leads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshLeads}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold"
                >
                  Refresh
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Export CSV
                </button>
                <button
                  onClick={clearLeads}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
                placeholder="Search name, phone, model, issue..."
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              >
                <option value="All">All types</option>
                <option value="Quote Booking">Quote Booking</option>
                <option value="Custom Quote">Custom Quote</option>
              </select>
            </div>

            <div className="mt-5 overflow-auto border border-gray-200 rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-3 font-semibold text-[#334578]">Date</th>
                    <th className="p-3 font-semibold text-[#334578]">Type</th>
                    <th className="p-3 font-semibold text-[#334578]">Name</th>
                    <th className="p-3 font-semibold text-[#334578]">Email</th>
                    <th className="p-3 font-semibold text-[#334578]">Phone</th>
                    <th className="p-3 font-semibold text-[#334578]">Device</th>
                    <th className="p-3 font-semibold text-[#334578]">Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td className="p-4 text-[#334578]/70" colSpan={7}>
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="p-3 text-[#334578]/80">
                          {new Date(l.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-[#334578]/80">{l.type}</td>
                        <td className="p-3 text-[#334578]/80">
                          {l.fullName || "-"}
                        </td>
                        <td className="p-3 text-[#334578]/80">
                          {l.email || "-"}
                        </td>
                        <td className="p-3 text-[#334578]/80">
                          {l.phone || "-"}
                        </td>
                        <td className="p-3 text-[#334578]/80">
                          {l.brand
                            ? `${l.brand} ${l.model || ""}`
                            : l.model || "-"}
                        </td>
                        <td className="p-3 text-[#334578]/80">
                          {l.issue || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[#334578]/60 mt-3">
              Stored in localStorage (browser-only). For real persistence,
              connect a backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
