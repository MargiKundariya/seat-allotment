import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/Registration";
import AddCollegeCutoff from "./components/AddCollegeCutoff";
import CollegeCutoffSearch from "./components/Collegecutoffsearch";
import ForgotPassword from "./components/forgetpassword";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/addcollegecutoff" element={<AddCollegeCutoff />} />
        <Route path="/collegecutoffsearch" element={<CollegeCutoffSearch />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

      </Routes>
    </Router>
  );
}

export default App;