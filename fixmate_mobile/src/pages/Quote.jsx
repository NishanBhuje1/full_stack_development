import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Wrench, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  CheckCircle2,
  Loader2,
  Receipt,
  ArrowRight
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function centsToAud(cents) {
  if (cents == null) return null;
  return (Number(cents) / 100).toFixed(2);
}

async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export default function Quote() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // --- Data State ---
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [brands, setBrands] = useState([]);
  const [modelsByBrand, setModelsByBrand] = useState({});
  const [issuesByBrandModel, setIssuesByBrandModel] = useState({});

  // --- Selection State ---
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");

  // --- Pricing State ---
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceCents, setPriceCents] = useState(null);

  // --- Booking Form State ---
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // --- Initial Data Load ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const res = await fetchWithTimeout(`${API}/api/catalog`, {}, 10000);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load catalog");
        if (cancelled) return;

        setBrands(data.brands || []);
        setModelsByBrand(data.modelsByBrand || {});
        setIssuesByBrandModel(data.issuesByBrandModel || {});

        // Defaults
        const firstBrand = (data.brands || [])[0] || "";
        setBrand(firstBrand);
      } catch (e) {
        if (!cancelled) setCatalogError(e.message || "Catalog failed");
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // --- Computed Lists ---
  const models = useMemo(() => (brand ? modelsByBrand[brand] || [] : []), [brand, modelsByBrand]);
  const issues = useMemo(() => {
    if (!brand || !model) return [];
    return issuesByBrandModel[`${brand}||${model}`] || [];
  }, [brand, model, issuesByBrandModel]);

  // --- Cascading Select Logic ---
  useEffect(() => {
    if (!brand) return;
    const m = (modelsByBrand[brand] || [])[0] || "";
    setModel(m);
  }, [brand, modelsByBrand]);

  useEffect(() => {
    if (!brand || !model) return;
    const i = (issuesByBrandModel[`${brand}||${model}`] || [])[0] || "";
    setIssue(i);
  }, [brand, model, issuesByBrandModel]);

  // --- Navigation Handlers ---
  function next() { setStep((s) => Math.min(3, s + 1)); }
  function back() { setStep((s) => Math.max(1, s - 1)); }

  // --- Price Fetching ---
  useEffect(() => {
    let cancelled = false;
    async function loadPrice() {
      if (step !== 2) return;
      if (!brand || !model || !issue) return;

      setLoadingPrice(true);
      setPriceError("");
      setPriceCents(null);

      try {
        const url = `${API}/api/pricing?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&issue=${encodeURIComponent(issue)}`;
        const res = await fetchWithTimeout(url, {}, 8000);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Price not found");
        if (!cancelled) setPriceCents(Number(data.price));
      } catch (e) {
        if (!cancelled) setPriceError(e.message || "Failed to fetch price");
      } finally {
        if (!cancelled) setLoadingPrice(false);
      }
    }
    loadPrice();
    return () => { cancelled = true; };
  }, [step, brand, model, issue]);

  // --- Validation ---
  const canGoStep2 = Boolean(brand && model && issue);
  const canGoStep3 = Boolean(priceCents != null && !loadingPrice);
  const canSubmit = Boolean(fullName && phone && email && preferredDate && preferredTime && priceCents != null);

  // --- Submission ---
  async function handleBook(e) {
    e.preventDefault();
    try {
      const payload = {
        type: "Quote Booking",
        fullName, email, phone, brand, model, issue,
        preferredDate: preferredDate ? new Date(preferredDate).toISOString() : null,
        preferredTime,
        estimatedPrice: priceCents,
        message: "",
      };

      const res = await fetchWithTimeout(`${API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, 10000);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit booking");

      alert("Appointment request submitted! We will contact you shortly.");
      navigate("/");
    } catch (err) {
      alert(err.message || "Booking failed. Please try again.");
    }
  }

  return (
    // FIX APPLIED HERE:
    // 1. Removed 'min-h-screen' (which forced it to be too tall).
    // 2. Added 'min-h-[60vh]' (keeps it decent sized but flexible).
    // 3. Changed padding to 'py-12 md:py-20' to balance top and bottom space equally.
    <div className="min-h-[60vh] bg-[#f1f9f8] flex justify-center items-start py-12 md:py-20 px-4 overflow-hidden relative">
       
       {/* Ambient Background */}
       <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
       <div className="absolute top-[10%] right-[-200px] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
       <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#334578]">Get a Quote</h1>
            <p className="text-[#334578]/70 mt-2">Diagnose, Price, and Book in seconds.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#334578] hover:text-blue-600 transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back Home
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          
          {/* Progress Bar */}
          <ProgressBar currentStep={step} />

          <div className="p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-[#334578] mb-6">Device Details</h2>
                  
                  {catalogLoading ? (
                    <div className="flex items-center justify-center h-40 gap-3 text-[#334578]/60">
                      <Loader2 className="animate-spin w-6 h-6" /> Loading catalog...
                    </div>
                  ) : catalogError ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl">{catalogError}</div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                      <SelectField 
                        label="Brand" 
                        icon={<Smartphone className="w-5 h-5" />}
                        value={brand} 
                        onChange={(e) => setBrand(e.target.value)} 
                        options={brands} 
                      />
                      <SelectField 
                        label="Model" 
                        icon={<Smartphone className="w-5 h-5" />}
                        value={model} 
                        onChange={(e) => setModel(e.target.value)} 
                        options={models} 
                        disabled={!brand}
                      />
                      <SelectField 
                        label="Issue" 
                        icon={<Wrench className="w-5 h-5" />}
                        value={issue} 
                        onChange={(e) => setIssue(e.target.value)} 
                        options={issues} 
                        disabled={!model}
                      />
                    </div>
                  )}

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={next}
                      disabled={!canGoStep2}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                    >
                      Check Price <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PRICE */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl mx-auto text-center"
                >
                  <h2 className="text-2xl font-bold text-[#334578] mb-8">Estimated Cost</h2>

                  <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8 overflow-hidden group">
                    {/* Ticket Decor */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#f1f9f8] rounded-full" />
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#f1f9f8] rounded-full" />
                    
                    <div className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Total Repair Cost</div>
                    
                    {loadingPrice ? (
                      <div className="h-20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : priceCents != null ? (
                      <div className="text-5xl md:text-6xl font-bold text-[#334578] tracking-tight">
                        ${centsToAud(priceCents)}
                      </div>
                    ) : (
                       <div className="text-red-500 font-medium py-6">{priceError || "Unavailable"}</div>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[#334578]/70 text-sm">
                      <Receipt className="w-4 h-4" />
                      <span>{brand} {model} - {issue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button onClick={back} className="px-6 py-3 text-[#334578] font-semibold hover:bg-gray-50 rounded-xl transition-colors">
                      Change Device
                    </button>
                    <button
                      onClick={next}
                      disabled={!canGoStep3}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 transition-all"
                    >
                      Book Appointment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BOOK */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#334578]">Finalize Booking</h2>
                    <div className="hidden md:block text-sm font-medium bg-blue-50 text-blue-800 px-3 py-1 rounded-lg">
                      Quote: ${centsToAud(priceCents)}
                    </div>
                  </div>

                  <form onSubmit={handleBook}>
                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                      <InputField 
                        label="Full Name" 
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        icon={<User className="w-4 h-4" />} 
                        placeholder="Your Name"
                      />
                      <InputField 
                        label="Phone Number" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        icon={<Phone className="w-4 h-4" />} 
                        placeholder="0400 000 000"
                      />
                      <InputField 
                        label="Email Address" 
                        value={email} 
                        type="email"
                        onChange={e => setEmail(e.target.value)} 
                        icon={<Mail className="w-4 h-4" />} 
                        placeholder="you@email.com"
                      />
                      
                      {/* Date & Time Group */}
                      <div className="md:col-span-2 grid grid-cols-2 gap-5">
                         <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Preferred Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                              <input 
                                type="date"
                                value={preferredDate}
                                onChange={e => setPreferredDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                              />
                            </div>
                         </div>
                         <div className="relative">
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Time Slot</label>
                           <div className="relative">
                              <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                              <select 
                                value={preferredTime}
                                onChange={e => setPreferredTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
                              >
                                <option value="">Select...</option>
                                <option value="Morning">Morning (9am-12pm)</option>
                                <option value="Afternoon">Afternoon (12pm-4pm)</option>
                                <option value="Evening">Evening (4pm-7pm)</option>
                              </select>
                              <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                              </div>
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <button type="button" onClick={back} className="px-6 py-3 text-[#334578] font-semibold hover:bg-gray-50 rounded-xl transition-colors">
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="bg-[#334578] hover:bg-[#253259] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 transform hover:-translate-y-0.5 transition-all"
                      >
                         Confirm Booking <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS for Clean UI ---

function ProgressBar({ currentStep }) {
  return (
    <div className="w-full bg-gray-50 border-b border-gray-100 px-6 py-4">
      <div className="relative flex items-center justify-between max-w-lg mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>

        {/* Steps */}
        <StepIndicator num={1} label="Select" current={currentStep} />
        <StepIndicator num={2} label="Price" current={currentStep} />
        <StepIndicator num={3} label="Book" current={currentStep} />
      </div>
    </div>
  );
}

function StepIndicator({ num, label, current }) {
  const isActive = current >= num;
  const isCurrent = current === num;
  
  return (
    <div className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 px-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-white border border-gray-300 text-gray-400"
      }`}>
        {isActive && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : num}
      </div>
      <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
        isActive ? "text-blue-700" : "text-gray-400"
      }`}>
        {label}
      </span>
    </div>
  );
}

function SelectField({ label, icon, value, onChange, options, disabled }) {
  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl py-3 pl-11 pr-10 text-[#334578] font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
        >
          <option value="">Select {label}...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-transparent rounded-xl py-3 pl-11 pr-4 text-[#334578] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}