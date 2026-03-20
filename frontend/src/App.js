import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/Registration";
import AddCollegeCutoff from "./components/AddCollegeCutoff";
import CollegeCutoffSearch from "./components/Collegecutoffsearch";
import ForgotPassword from "./components/forgetpassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Login />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Other pages */}
        <Route path="/addcollegecutoff" element={<AddCollegeCutoff />} />
        <Route path="/collegecutoffsearch" element={<CollegeCutoffSearch />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
