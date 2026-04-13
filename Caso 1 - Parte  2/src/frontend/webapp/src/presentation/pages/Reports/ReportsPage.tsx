import { useTranslation } from "react-i18next";

export function ReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h1>{t("app.nav.reports")}</h1>
      <p className="card">Reports placeholder — exports and audit views.</p>
    </div>
  );
}
