import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/presentation/layouts/AppShell";
import { DashboardPage } from "@/presentation/pages/Dashboard/DashboardPage";
import { GenerateDUAPage } from "@/presentation/pages/GenerateDUA/GenerateDUAPage";
import { ReportsPage } from "@/presentation/pages/Reports/ReportsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/generate" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/generate" element={<GenerateDUAPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
