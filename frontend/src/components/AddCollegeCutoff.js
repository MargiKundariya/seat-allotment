import { useState, useRef } from "react";
import "../assets/AddCollegeCutoff.css";
import axios from "axios";
import seatLogo from  "../assets/main_logo.png";
import { useNavigate } from "react-router-dom";

const SeatLogo = () => (
 <img 
    src={seatLogo} 
    alt="Seat Allocate Logo" 
    className="reg-logo-img"
  />
);

const COURSES = [
  "B.Tech – Computer Science",
  "B.Tech – Information Technology",
  "B.Tech – Electronics & Communication",
  "B.Tech – Mechanical Engineering",
  "B.Tech – Civil Engineering",
  "B.Sc – Data Science",
  "B.Sc – Physics",
  "B.Com – General",
  "B.Com – Honours",
  "BBA – Management",
  "MBA – Finance",
  "MBA – Marketing",
  "MCA – Computer Applications",
  "M.Tech – AI & ML",
];





export default function AddCollegeCutoff() {
  const [collegeName, setCollegeName] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [firstRank, setFirstRank] = useState("");
  const [lastRank, setLastRank] = useState("");
  const [quota, setquota] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();
 const navigate = useNavigate();

const handleLogout = () => {
// clear stored user
  navigate("/"); // or "/login"
};
  const hasName = collegeName.trim().length > 0;

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "xlsx", "xls"].includes(ext)) return alert("Only PDF or Excel files allowed.");
    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setSuccess(false);

    if (uploadedFile) {
  const formData = new FormData();
  formData.append("file", uploadedFile);

  await axios.post("https://seat-allotment-production.up.railway.app/api/cutoff/add-cutoff-file", formData);
} else {
  await axios.post("https://seat-allotment-production.up.railway.app/api/cutoff/add-cutoff-manual", {
    collegeName,
    course,
    category,
    firstRank,
    lastRank,
    quota
  });
}
    

    setSuccess(true);

    // Reset form
    setCollegeName("");
    setCourse("");
    setCategory("");
    setFirstRank("");
    setLastRank("");
    setquota("");
    setUploadedFile(null);

  } catch (error) {
    console.log("ERROR:", error.response?.data);
    alert(error.response?.data?.message || "Something went wrong");
  }

  setLoading(false);
};
  return (
    <>
      <div className="cc-root">
        {/* BG */}
        <div className="cc-bg-shape cc-bg-shape--1" />
        <div className="cc-bg-shape cc-bg-shape--2" />
        <div className="cc-bg-shape cc-bg-shape--3" />

        {/* HEADER */}
        <header className="cc-header">
          <div className="cc-header-brand">
            <div className="cc-header-logo"><SeatLogo/></div>
            <div className="cc-header-sysname">
              <span className="cc-header-sysname-main">Seat Allotment</span>
              <span className="cc-header-sysname-sub">system</span>
            </div>
          </div>
          <button className="cc-logout-btn">
            <span className="cc-logout-icon" onClick={handleLogout}>⎋</span>
            Logout
          </button>
        </header>

        {/* BODY */}
        <main className="cc-body">
          <div className="cc-page-title">
            <h2>Add College Cutoff</h2>
            <p>Upload a file or fill in the details manually below</p>
          </div>

          <div className="cc-card">
            <form className="cc-form" onSubmit={handleSubmit}>

              {/* Upload zone */}
              <div
                className={`cc-upload-zone${dragging ? " cc-upload-zone--drag" : ""}${uploadedFile ? " cc-upload-zone--uploaded" : ""}`}
                onClick={() => !uploadedFile && fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="cc-upload-input"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {uploadedFile ? (
                  <>
                    <span className="cc-upload-icon">✅</span>
                    <div className="cc-upload-title">File Ready</div>
                    <div className="cc-uploaded-file">
                      <span className="cc-uploaded-file-icon">
                        {uploadedFile.name.endsWith(".pdf") ? "📄" : "📊"}
                      </span>
                      <span className="cc-uploaded-file-name">{uploadedFile.name}</span>
                      <button
                        type="button"
                        className="cc-uploaded-remove"
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                        title="Remove file"
                      >✕</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="cc-upload-icon">☁️</span>
                    <div className="cc-upload-title">Drop your file here or click to browse</div>
                    <div className="cc-upload-sub">Supports PDF and Excel formats</div>
                    <div className="cc-upload-types">
                      <span className="cc-upload-type-badge cc-badge--pdf">PDF</span>
                      <span className="cc-upload-type-badge cc-badge--excel">XLSX / XLS</span>
                    </div>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="cc-divider">
                <div className="cc-divider-line" />
                <span className="cc-divider-text">or enter manually</span>
                <div className="cc-divider-line" />
              </div>

              {/* College Name */}
              <div className="cc-field-group">
                <label className="cc-label">
                  College Name
                  <span className="cc-label-badge">Required</span>
                </label>
                <input
                  className="cc-input"
                  type="text"
                  placeholder="e.g. IIT Bombay, NIT Surat…"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
              </div>

              {/* Unlock hint */}
              <div className={`cc-unlock-hint${hasName ? " cc-unlock-hint--hidden" : ""}`}>
                <span className="cc-unlock-icon">🔒</span>
                Start typing the college name to unlock more fields
              </div>

              {/* Extra fields — revealed when name is typed */}
              <div className={`cc-extra-fields${hasName ? " cc-extra-fields--visible" : ""}`}>

                {/* Course */}
                <div className="cc-field-group">
                  <label className="cc-label">Course / Programme</label>
                  <select
                    className="cc-select"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={!hasName}
                  >
                    <option value="">Select a course…</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="cc-field-group">
                  <label className="cc-label">Category</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"2px" }}>
                    {["GEN","TFWS","SC","ST","EWS","SEBC","OBC"].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        disabled={!hasName}
                        onClick={() => setCategory(prev => prev === cat ? "" : cat)}
                        style={{
                          padding:"7px 16px",
                          borderRadius:"30px",
                          border: category === cat ? "1.5px solid #0057B8" : "1.5px solid #d1d9e6",
                          background: category === cat ? "#0057B8" : "#f8faff",
                          color: category === cat ? "#fff" : "#374151",
                          fontSize:"13px",
                          fontWeight:600,
                          fontFamily:"'DM Sans',sans-serif",
                          cursor: hasName ? "pointer" : "not-allowed",
                          opacity: hasName ? 1 : 0.45,
                          transition:"all 0.18s",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Rank & Last Rank */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                  <div className="cc-field-group">
                    <label className="cc-label">First Rank</label>
                    <input
                      className="cc-input"
                      type="number"
                      min="1"
                      placeholder="e.g. 1"
                      value={firstRank}
                      onChange={(e) => setFirstRank(e.target.value)}
                      disabled={!hasName}
                    />
                  </div>
                  <div className="cc-field-group">
                    <label className="cc-label">Last Rank</label>
                    <input
                      className="cc-input"
                      type="number"
                      min="1"
                      placeholder="e.g. 4500"
                      value={lastRank}
                      onChange={(e) => setLastRank(e.target.value)}
                      disabled={!hasName}
                    />
                  </div>
                </div>
                 <div className="cc-field-group">
                    <label className="cc-label">Quota</label>
                    <input
                      className="cc-input"
                      type="text"
                      placeholder="e.g. Jee Based"
                      value={quota}
                      onChange={(e) => setquota(e.target.value)}
                      disabled={!hasName}
                    />
                  </div>

              </div>

              {/* Success */}
              {success && (
                <div className="cc-success-banner">
                  <span>🎉</span>
                  Cutoff added successfully!
                </div>
              )}

              {/* Submit */}
              <button
                className="cc-submit-btn"
                type="submit"
                disabled={loading || (!collegeName.trim() && !uploadedFile)}
              >
                {loading ? (
                  <span className="cc-spinner" />
                ) : (
                  <>
                    <span className="cc-submit-btn__text">Save Cutoff</span>
                    <span className="cc-submit-btn__icon">→</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </main>
      </div>
    </>
  );

}

