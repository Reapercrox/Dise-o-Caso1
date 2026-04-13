import { useTranslation } from "react-i18next";

export function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h1>{t("app.nav.dashboard")}</h1>
      <p className="card">Dashboard placeholder — KPIs and recent jobs go here.</p>
    </div>
  );
}
