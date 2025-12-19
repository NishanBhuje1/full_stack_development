import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

// localStorage key (keep consistent)
const LS_ADMIN_TOKEN = "fixmate_admin_token_v1";

// ---- token helpers ----
function getToken() {
  return localStorage.getItem(LS_ADMIN_TOKEN) || "";
}
function setToken(token) {
  localStorage.setItem(LS_ADMIN_TOKEN, token);
}
function clearToken() {
  localStorage.removeItem(LS_ADMIN_TOKEN);
}

// Always read token at request time (prevents stale token headers)
async function apiJson(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export default function AdminDashboard() {
  // auth state
  const [authed, setAuthed] = useState(Boolean(getToken()));

  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // view tab
  const [tab, setTab] = useState("pricing"); // "pricing" | "leads"

  // pricing rules
  const [rules, setRules] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [saving, setSaving] = useState(false);

  // leads
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // build unique lists from DB so you can use datalist suggestions
  const suggestions = useMemo(() => {
    const brands = new Set();
    const models = new Set();
    const issues = new Set();
    for (const r of rules) {
      if (r.brand) brands.add(r.brand);
      if (r.model) models.add(r.model);
      if (r.issue) issues.add(r.issue);
    }
    return {
      brands: [...brands].sort(),
      models: [...models].sort(),
      issues: [...issues].sort(),
    };
  }, [rules]);

  async function login(e) {
    e.preventDefault();
    setAuthError("");

    try {
      const data = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d?.error || "Login failed");
        return d;
      });

      setToken(data.token);
      setAuthed(true);
      setUsername("");
      setPassword("");
    } catch (err) {
      setAuthError(err.message || "Login failed");
    }
  }

  function logout() {
    clearToken();
    setAuthed(false);
    setRules([]);
    setLeads([]);
    setTotalLeads(0);
  }

  async function loadPricing() {
    const data = await apiJson("/api/admin/pricing", { method: "GET" });
    setRules(data.rules || []);
  }

  async function loadLeads(nextPage = 1) {
    const params = new URLSearchParams({
      page: String(nextPage),
      pageSize: String(pageSize),
    });

    const data = await apiJson(`/api/admin/leads?${params.toString()}`, {
      method: "GET",
    });

    setLeads(data.items || []);
    setTotalLeads(Number(data.total || 0));
    setPage(Number(data.page || nextPage));
  }

  // Initial load after auth
  useEffect(() => {
    if (!authed) return;

    (async () => {
      try {
        await loadPricing();
        await loadLeads(1);
      } catch (err) {
        // token invalid/expired
        logout();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function upsertFixedPrice() {
    const price = Number(fixedPrice);

    if (!brand.trim() || !model.trim() || !issue.trim()) {
      alert("Brand, Model, and Service are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      alert("Enter a valid fixed price (e.g. 159).");
      return;
    }

    setSaving(true);
    try {
      // store as basePrice + rangePrice=0 for fixed quotes
      await apiJson("/api/admin/pricing", {
        method: "PUT",
        body: JSON.stringify({
          brand: brand.trim(),
          model: model.trim(),
          issue: issue.trim(),
          basePrice: price,
          rangePrice: 0,
        }),
      });

      await loadPricing();

      // keep inputs, but you can clear them if you want
      // setBrand(""); setModel(""); setIssue(""); setFixedPrice("");
      alert("Saved.");
    } catch (err) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeRule(r) {
    if (!confirm(`Delete rule?\n${r.brand} / ${r.model} / ${r.issue}`)) return;

    const params = new URLSearchParams({
      brand: r.brand,
      model: r.model,
      issue: r.issue,
    });

    try {
      await apiJson(`/api/admin/pricing?${params.toString()}`, {
        method: "DELETE",
      });
      await loadPricing();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));

  // ------------------- LOGIN -------------------
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

            <form onSubmit={login} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="••••••••"
                />
              </div>

              {authError ? (
                <div className="text-red-600 font-semibold">{authError}</div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full"
              >
                Login
              </button>

              <p className="text-xs text-[#334578]/60">
                If you changed token keys earlier, clear site
                storage/localStorage and login again.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- DASHBOARD -------------------
  return (
    <div className="min-h-screen bg-[#f1f9f8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-[#334578]">
              Admin Dashboard
            </h1>
            <p className="text-[#334578]/75 mt-2">Fixed pricing + leads</p>
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
              Home
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab("pricing")}
            className={`px-5 py-2 rounded-full font-semibold border ${
              tab === "pricing"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-[#334578] border-gray-200"
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-2 rounded-full font-semibold border ${
              tab === "leads"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-[#334578] border-gray-200"
            }`}
          >
            Leads
          </button>
        </div>

        {tab === "pricing" ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#334578]">
                  Add / Update Fixed Price
                </h2>
                <p className="text-[#334578]/70 mt-1">
                  Type brand/model/service to create new ones. Price is fixed
                  (no range).
                </p>
              </div>
              <button
                onClick={loadPricing}
                className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold"
              >
                Refresh
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Brand
                </label>
                <input
                  list="brands"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="Apple"
                />
                <datalist id="brands">
                  {suggestions.brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Model
                </label>
                <input
                  list="models"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="iPhone 15 Pro"
                />
                <datalist id="models">
                  {suggestions.models.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Service
                </label>
                <input
                  list="issues"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="Screen Replacement"
                />
                <datalist id="issues">
                  {suggestions.issues.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#334578] mb-2">
                  Fixed Price (AUD)
                </label>
                <input
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="159"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={upsertFixedPrice}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-full"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#334578]">
                Existing Rules
              </h3>
              <div className="mt-3 overflow-auto border border-gray-200 rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="p-3 font-semibold text-[#334578]">
                        Brand
                      </th>
                      <th className="p-3 font-semibold text-[#334578]">
                        Model
                      </th>
                      <th className="p-3 font-semibold text-[#334578]">
                        Service
                      </th>
                      <th className="p-3 font-semibold text-[#334578]">
                        Price
                      </th>
                      <th className="p-3 font-semibold text-[#334578]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.length === 0 ? (
                      <tr>
                        <td className="p-4 text-[#334578]/70" colSpan={5}>
                          No pricing rules yet.
                        </td>
                      </tr>
                    ) : (
                      rules.map((r) => (
                        <tr
                          key={`${r.brand}-${r.model}-${r.issue}`}
                          className="border-t border-gray-200"
                        >
                          <td className="p-3 text-[#334578]/80">{r.brand}</td>
                          <td className="p-3 text-[#334578]/80">{r.model}</td>
                          <td className="p-3 text-[#334578]/80">{r.issue}</td>
                          <td className="p-3 text-[#334578]/80">
                            ${Number(r.basePrice).toFixed(2)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => removeRule(r)}
                              className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#334578]/60 mt-3">
                Note: Quote page must call a public pricing endpoint if you want
                customers to see DB prices. Keep admin routes protected.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#334578]">Leads</h2>
                <p className="text-[#334578]/70 mt-1">
                  Latest customer requests
                </p>
              </div>
              <button
                onClick={() => loadLeads(page)}
                className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-[#334578] font-semibold"
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 text-sm text-[#334578]/70">
              Total: <span className="font-semibold">{totalLeads}</span> • Page{" "}
              <span className="font-semibold">{page}</span> /{" "}
              <span className="font-semibold">
                {Math.max(1, Math.ceil(totalLeads / pageSize))}
              </span>
            </div>

            <div className="mt-5 overflow-auto border border-gray-200 rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-3 font-semibold text-[#334578]">Date</th>
                    <th className="p-3 font-semibold text-[#334578]">Name</th>
                    <th className="p-3 font-semibold text-[#334578]">Phone</th>
                    <th className="p-3 font-semibold text-[#334578]">Device</th>
                    <th className="p-3 font-semibold text-[#334578]">Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td className="p-4 text-[#334578]/70" colSpan={5}>
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l.id} className="border-t border-gray-200">
                        <td className="p-3 text-[#334578]/80">
                          {new Date(l.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-[#334578]/80">
                          {l.fullName || "-"}
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

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => loadLeads(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-5 py-2 rounded-full border border-gray-200 text-[#334578] font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => loadLeads(page + 1)}
                disabled={page >= Math.max(1, Math.ceil(totalLeads / pageSize))}
                className="px-5 py-2 rounded-full border border-gray-200 text-[#334578] font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
