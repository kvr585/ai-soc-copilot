import { Route, Routes, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage.jsx";
import IncidentsPage from "./pages/IncidentsPage.jsx";
import IncidentDetailsPage from "./pages/IncidentDetailsPage.jsx";
import InvestigatePage from "./pages/InvestigatePage.jsx";
import ThreatIntelPage from "./pages/ThreatIntelPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-soc-background text-slate-100">
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={<DashboardPage />}
        />

        {/* Investigate */}
        <Route
          path="/investigate"
          element={<InvestigatePage />}
        />

        {/* Threat Intel */}
        <Route
          path="/threat-intel"
          element={<ThreatIntelPage />}
        />

        {/* Investigation Repository */}
        <Route
          path="/incidents"
          element={<IncidentsPage />}
        />

        {/* Investigation Details */}
        <Route
          path="/incidents/:incidentId"
          element={<IncidentDetailsPage />}
        />

        {/* Redirect unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;