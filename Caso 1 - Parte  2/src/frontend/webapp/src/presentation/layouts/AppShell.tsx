import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="layout">
      <header className="top-nav">
        <strong>{t("app.title")}</strong>
        <NavLink to="/generate" className={({ isActive }) => (isActive ? "active" : "")}>
          {t("app.nav.generate")}
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          {t("app.nav.dashboard")}
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
          {t("app.nav.reports")}
        </NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
