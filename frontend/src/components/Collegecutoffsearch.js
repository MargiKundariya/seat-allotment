import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Collegecutoffsearch.css"
import seatLogo from  "../assets/main_logo.png";
import { useNavigate } from "react-router-dom";
const SeatLogo = () => (
 <img 
    src={seatLogo} 
    alt="Seat Allocate Logo" 
    className="reg-logo-img"
  />
);


const CATEGORIES = ["GEN","TFWS","SC","ST","EWS","SEBC","OBC"];

export default function CollegeCutoffSearch() {
  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [maths, setMaths] = useState("");
  const [total, setTotal] = useState("");
  const pcm = (physics && chemistry && maths)
    ? String(parseFloat(physics) + parseFloat(chemistry) + parseFloat(maths))
    : (physics || chemistry || maths)
      ? String([physics, chemistry, maths].filter(Boolean).reduce((a,b)=>parseFloat(a)+parseFloat(b),0))
      : "";
  const [institute, setInstitute] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [courses, setCourses] = useState([]);
  const hasAnyInput = physics || chemistry || maths || total || institute || course || category;
  const isExactSearch = (pcm || total) && institute && course && category;

  const navigate = useNavigate();

const handleLogout = () => {
// clear stored user
  navigate("/"); // or "/login"
};

 useEffect(() => {
  fetch("https://seat-allotment-production.up.railway.app/api/cutoff/display")
    .then(res => res.json())
    .then(response => {
      console.log("API DATA:", response);

      const apiData = response.data;   // 👈 FIX HERE

      setCutoffData(apiData);

      const uniqueInstitutes = [
        ...new Set(apiData.map(item => item.collegeName))
      ];
      setInstitutes(uniqueInstitutes);

      const uniqueCourses = [
        ...new Set(
          apiData
            .filter(item => item.course)
            .map(item => item.course)
        )
      ];
      setCourses(uniqueCourses);
    })
    .catch(err => {
      console.error("Error fetching cutoff data:", err);
    });
}, []);
  const handleSearch = async (e) => {
  e.preventDefault();
    if (!hasAnyInput) {
    alert("Please enter at least one field");
    return;
  }

  setLoading(true);
  setResults(null);

  try {
    const response = await axios.post(
      "https://seat-allotment-production.up.railway.app/api/searchcutoff/search",
      {
        physics,
        chemistry,
        maths,
        gujcetMarks: total
      }
    );

    const backendData = response.data.data;

    // 🔥 FRONTEND FILTERING ON TOP OF BACKEND RESULT
    const filtered = backendData.filter(row => {

      if (
        institute &&
        row.collegeName &&
        !row.collegeName.toLowerCase().includes(institute.toLowerCase())
      ) return false;

      if (course && row.course !== course) return false;

      if (category && row.category !== category) return false;

      return true;
    });

    setResults(filtered);
    setSearched(true);

  } catch (error) {
    console.error("Search Error:", error);
    alert("Error fetching results");
  }

  setLoading(false);
};

  const handleReset = () => {
    setPhysics(""); setChemistry(""); setMaths(""); setTotal(""); setInstitute("");
    setCourse(""); setCategory("");
    setResults(null); setSearched(false);
  };

  const isEligible = () => true;
  return (
    <>
      <div className="cs-root">
        <div className="cs-bg-shape cs-bg-shape--1" />
        <div className="cs-bg-shape cs-bg-shape--2" />
        <div className="cs-bg-shape cs-bg-shape--3" />

        {/* HEADER */}
        <header className="cs-header">
          <div className="cs-header-brand">
            <div className="cs-header-logo"><SeatLogo /></div>
            <div className="cs-header-sysname">
              <span className="cs-header-sysname-main">Seat Allotment</span>
              <span className="cs-header-sysname-sub">system</span>
            </div>
          </div>
          <button className="cs-logout-btn"  onClick={handleLogout}>⎋ Logout</button>
        </header>

        <main className="cs-body">
          {/* Page title */}
          <div className="cs-page-title">
            <h2>Check Eligibility & Search</h2>
            <p>Enter any combination of fields — we'll find all matching colleges</p>
          </div>

          {/* Search Card */}
          <div className="cs-card">
            <form className="cs-form" onSubmit={handleSearch}>

              {/* PCM Marks — 3 separate boxes */}
              <div className="cs-field-group">
                <label className="cs-label">PCM Marks <span className="cs-label-opt">optional</span></label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                  {[
                    { label:"Physics",   val: physics,   set: setPhysics },
                    { label:"Chemistry", val: chemistry, set: setChemistry },
                    { label:"Maths",     val: maths,     set: setMaths },
                  ].map(({ label, val, set }) => (
                    <div key={label} style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                      <span style={{ fontSize:"11.5px", fontWeight:600, color:"#6b7a99", letterSpacing:"0.3px" }}>{label}</span>
                      <input
                        className="cs-input"
                        type="number"
                        min="0" max="100"
                        placeholder="/100"
                        value={val}
                        onChange={e => set(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                {pcm && (
                  <div style={{ fontSize:"12px", color:"#0057B8", fontWeight:600, marginTop:"4px" }}>
                    Total PCM: {pcm} / 300
                  </div>
                )}
              </div>

              {/* GUJCET*/}
              <div className="cs-field-group">
                <label className="cs-label">GUJCET Marks <span className="cs-label-opt">optional</span></label>
                <input
                  className="cs-input"
                  type="number"
                  min="0" max="120"
                  placeholder="e.g. 90 (out of 120)"
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                />
              </div>

              <div className="cs-divider">
                <div className="cs-divider-line" />
                <span className="cs-divider-text">filter by</span>
                <div className="cs-divider-line" />
              </div>

              {/* Institute */}
              <div className="cs-field-group">
                <label className="cs-label">Institute Name <span className="cs-label-opt">optional</span></label>
                <input
                  className="cs-input"
                  type="text"
                  list="cs-institutes"
                  placeholder="Search institute name…"
                  value={institute}
                  onChange={e => setInstitute(e.target.value)}
                />
                <datalist id="cs-institutes">
                  {institutes.map(i => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              {/* Course */}
              <div className="cs-field-group">
                <label className="cs-label">Course / Programme <span className="cs-label-opt">optional</span></label>
                <select className="cs-select" value={course} onChange={e => setCourse(e.target.value)}>
                  <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                </select>
              </div>

              {/* Category */}
              <div className="cs-category-group">
                <label className="cs-label">Category <span className="cs-label-opt">optional</span></label>
                <div className="cs-category-pills">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`cs-pill${category === cat ? " cs-pill--active" : ""}`}
                      onClick={() => setCategory(prev => prev === cat ? "" : cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hint */}
              {!hasAnyInput && (
                <div className="cs-hint">
                  💡 Enter at least one field to search. More fields = more accurate results.
                </div>
              )}

              {/* Buttons */}
              <div style={{ display:"flex", gap:"12px" }}>
                <button
                  type="submit"
                  className="cs-search-btn"
                  disabled={!hasAnyInput || loading}
                  style={{ flex: 3 }}
                >
                  {loading
                    ? <span className="cs-spinner" />
                    : <><span className="cs-search-btn__text">Search Colleges</span><span className="cs-search-btn__icon">🔍</span></>
                  }
                </button>
                {searched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      flex:1, height:"52px", borderRadius:"12px",
                      border:"1.5px solid #d1d9e6", background:"#f8faff",
                      fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                      fontSize:"14px", color:"#374151", cursor:"pointer",
                      transition:"all 0.2s", marginTop:"8px"
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* RESULTS */}
          {results !== null && (
            <div className="cs-results">
              <div className="cs-results-header">
                <div className="cs-results-title">Results</div>
                <div className="cs-results-count">{results.length} match{results.length !== 1 ? "es" : ""} found</div>
              </div>

              {/* If exact search — show single eligibility banner */}
              {isExactSearch && results.length > 0 && (() => {
                const row = results[0];
                const eligible = isEligible(row);
                return (
                  <div className={`cs-eligible-banner cs-eligible-banner--${eligible ? "yes" : "no"}`}>
                    <span className="cs-eligible-icon">{eligible ? "🎉" : "❌"}</span>
                    <div className="cs-eligible-body">
                      <span className="cs-eligible-label">Eligibility Status</span>
                      <span>
                        {eligible
                          ? `Yes! You are eligible for ${row.course} at ${row.collegeName} under ${row.category} category.`
                          : `No. Your marks don't meet the cutoff for ${row.collegeName} at ${row.collegeName} under ${row.category}.`
                        }
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* No results */}
              {results.length === 0 && (
                <div className="cs-no-results">
                  <div className="cs-no-results-icon">🔍</div>
                  <div className="cs-no-results-title">No Matches Found</div>
                  <div className="cs-no-results-sub">Try relaxing your filters or entering different marks.</div>
                </div>
              )}

              {/* Result cards */}
              {results.map((row, idx) => {
                const eligible = isEligible(row);
                return (
                  <div
                    key={row.id}
                    className={`cs-result-card cs-result-card--${eligible ? "eligible" : "noteligible"}`}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    <div className="cs-result-left">
                      <div className="cs-result-institute">{row.collegeName}</div>
                      <div className="cs-result-course">{row.course}</div>
                      <div className="cs-result-meta">
                        <span className="cs-meta-badge cs-badge-cat">{row.category}</span>
                        <span className="cs-meta-badge cs-badge-cutoff">
  Rank: {row.firstRank} - {row.lastRank}
</span>
                      </div>
                    </div>
                    <div className="cs-result-right">
                      <span className={`cs-eligible-tag cs-eligible-tag--${eligible ? "yes" : "no"}`}>
                        {eligible ? "✓ Eligible" : "✗ Not Eligible"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );

}

