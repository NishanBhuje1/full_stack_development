import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

// token storage key
const LS_ADMIN_TOKEN = "fixmate_admin_token_v1";

// Must match your Quote page services
const SERVICES = [
  "Screen Replacement",
  "Battery Replacement",
  "Charging Port Repair",
  "Camera Repair",
  "Water Damage Check",
  "Speaker / Microphone",
];

// Must match your Quote page models (keep in sync)
const CATALOG = {
  Apple: ["iPhone 13", "iPhone 14", "iPhone 15"],
  Samsung: ["Galaxy S22", "Galaxy S23", "Galaxy A54"],
  Google: ["Pixel 7", "Pixel 8"],
};

function getToken() {
  return localStorage.getItem(LS_ADMIN_TOKEN) || "";
}

function setToken(token) {
  localStorage.setItem(LS_ADMIN_TOKEN, token);
}

function clearToken() {
  localStorage.removeItem(LS_ADMIN_TOKEN);
}

async function apiJson(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || "Request failed";
    throw new Error(msg);
  }
  return data;
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
          if (h === "estimateLow") return escape(r.estimateLow ?? "");
          if (h === "estimateHigh") return escape(r.estimateHigh ?? "");
          return escape(r[h] ?? "");
        })
        .join(",")
    ),
  ];

  return lines.join("\n");
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(Boolean(getToken()));

  // Login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Pricing
  const [pricingRules, setPricingRules] = useState([]);
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState(CATALOG["Apple"][0]);
  const [issue, setIssue] = useState(SERVICES[0]);
  const [basePrice, setBasePrice] = useState("");
  const [rangePrice, setRangePrice] = useState("");

  // Leads
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const authHeaders = useMemo(() => {
    const token = getToken();
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  }, [authed]);

  // keep model valid
  useEffect(() => {
    setModel(CATALOG[brand]?.[0] || "");
  }, [brand]);

  // When selecting brand+model+issue, load current override into inputs (if exists)
  useEffect(() => {
    const existing = pricingRules.find(
      (r) => r.brand === brand && r.model === model && r.issue === issue
    );
    if (existing) {
      setBasePrice(String(existing.basePrice));
      setRangePrice(String(existing.rangePrice));
    } else {
      setBasePrice("");
      setRangePrice("");
    }
  }, [brand, model, issue, pricingRules]);

  async function login(e) {
    e.preventDefault();
    setAuthError("");

    try {
      const data = await apiJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      setToken(data.token);
      setAuthed(true);
      setUsername("");
      setPassword("");
      await Promise.all([loadPricing(), loadLeads(1, q, typeFilter)]);
    } catch (err) {
      setAuthError(err.message || "Login failed");
    }
  }

  function logout() {
    clearToken();
    setAuthed(false);
    setPricingRules([]);
    setLeads([]);
    setTotalLeads(0);
  }

  async function loadPricing() {
    const data = await apiJson("/api/admin/pricing", {
      headers: authHeaders,
    });
    setPricingRules(data.rules || []);
  }

  async function loadLeads(nextPage = 1, search = "", type = "All") {
    const params = new URLSearchParams();
    if (search?.trim()) params.set("q", search.trim());
    if (type && type !== "All") params.set("type", type);
    params.set("page", String(nextPage));
    params.set("pageSize", String(pageSize));

    const data = await apiJson(`/api/admin/leads?${params.toString()}`, {
      headers: authHeaders,
    });

    setLeads(data.items || []);
    setTotalLeads(Number(data.total || 0));
    setPage(Number(data.page || nextPage));
  }

  async function initLoad() {
    try {
      await Promise.all([loadPricing(), loadLeads(1, q, typeFilter)]);
    } catch (err) {
      // token may be expired/invalid
      logout();
    }
  }

  useEffect(() => {
    if (authed) initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function savePricing() {
    const b = Number(basePrice);
    const r = Number(rangePrice);

    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(r) || r < 0) {
      alert("Please enter valid numbers for base and range.");
      return;
    }

    await apiJson("/api/admin/pricing", {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        brand,
        model,
        issue,
        basePrice: b,
        rangePrice: r,
      }),
    });

    await loadPricing();
    alert("Price saved.");
  }

  async function deletePricing() {
    if (!confirm("Remove this pricing override?")) return;

    const params = new URLSearchParams({
      brand,
      model,
      issue,
    });

    await apiJson(`/api/admin/pricing?${params.toString()}`, {
      method: "DELETE",
      headers: { Authorization: authHeaders.Authorization || "" },
    });

    await loadPricing();
    alert("Override removed.");
  }

  function exportCSV() {
    const csv = toCSV(leads);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`fixmate-leads-${stamp}-page${page}.csv`, csv);
  }

  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));

  // ---------- LOGIN UI ----------
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
              Login with your admin username and password
              (backend-authenticated).
            </p>

            <form onSubmit={login} className="space-y-4 mt-6">
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
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD UI ----------
  return (
    <div className="min-h-screen bg-[#f1f9f8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-[#334578]">
              Admin Dashboard
            </h1>
            <p className="text-[#334578]/75 mt-2">
              Pricing & lead management (from database).
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
              Upsert pricing overrides stored in PostgreSQL.
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
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
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
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
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
                  value={rangePrice}
                  onChange={(e) => setRangePrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="e.g. 60"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={savePricing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Save
              </button>

              <button
                onClick={deletePricing}
                className="border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Remove override
              </button>
            </div>

            <div className="mt-5 text-sm text-[#334578]/70">
              Tip: Overrides are unique by{" "}
              <span className="font-mono">brand + model + issue</span>.
            </div>

            {/* Optional: show existing rules count */}
            <div className="mt-3 text-sm text-[#334578]/70">
              Current overrides in DB:{" "}
              <span className="font-semibold">{pricingRules.length}</span>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#334578]">Leads</h2>
                <p className="text-[#334578]/75 mt-1">
                  Search/filter leads from DB.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadLeads(page, q, typeFilter)}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold"
                >
                  Refresh
                </button>

                <button
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Export CSV (page)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-5">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
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

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => loadLeads(1, q, typeFilter)}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Search
              </button>

              <div className="text-sm text-[#334578]/70">
                Total: <span className="font-semibold">{totalLeads}</span> •
                Page <span className="font-semibold">{page}</span> /{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
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
                  {leads.length === 0 ? (
                    <tr>
                      <td className="p-4 text-[#334578]/70" colSpan={7}>
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l.id} className="border-t border-gray-200">
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => loadLeads(Math.max(1, page - 1), q, typeFilter)}
                disabled={page <= 1}
                className="px-5 py-2 rounded-full border border-gray-200 text-[#334578] font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  loadLeads(Math.min(totalPages, page + 1), q, typeFilter)
                }
                disabled={page >= totalPages}
                className="px-5 py-2 rounded-full border border-gray-200 text-[#334578] font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#334578]/60 mt-6">
          Note: Admin token is stored in localStorage. For production, consider
          httpOnly cookies.
        </p>
      </div>
    </div>
  );
}
