import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { startAnalysis } from "@/application/generateDUA/startAnalysis";
import { useAppStore } from "@/app/store";
import type { DetectedFile, FileKind } from "@/shared/types/files";
import { StageProgress } from "@/presentation/components/molecules/StageProgress";
import { Badge } from "@/presentation/components/atoms/Badge";
import type { DuaFieldView } from "@/domain/dua/types";

function guessKind(name: string): FileKind {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "xlsx";
  if (/\.(png|jpg|jpeg|tif|tiff|webp)$/.test(lower)) return "img";
  return "other";
}

const demoFields: DuaFieldView[] = [
  {
    key: "invoice_total",
    labelKey: "Invoice total",
    value: "12,450.00",
    level: "high",
    confidencePct: 92,
    source: { file: "invoice.pdf", page: 1, snippet: "Total USD 12,450.00" },
  },
  {
    key: "incoterm",
    labelKey: "Incoterm",
    value: "FOB",
    level: "medium",
    confidencePct: 68,
    source: { file: "invoice.pdf", page: 1, snippet: "Terms: FOB Miami" },
  },
];

export function GenerateDUAPage() {
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const job = useAppStore((s) => s.job);
  const setJob = useAppStore((s) => s.setJob);

  const files = job.files;

  const summary = useMemo(() => {
    const g = demoFields.filter((f) => f.level === "high").length;
    const y = demoFields.filter((f) => f.level === "medium").length;
    const r = demoFields.filter((f) => f.level === "low").length;
    return { g, y, r };
  }, []);

  async function onPickFolder() {
    inputRef.current?.click();
  }

  async function onFilesPicked(list: FileList | null) {
    if (!list?.length) return;
    const detected: DetectedFile[] = Array.from(list).map((f) => ({
      name: f.name,
      size: f.size,
      kind: guessKind(f.name),
    }));
    setJob({ files: detected, logLine: t("generate.selectFolder") + ": " + detected.length });
  }

  async function onAnalyze() {
    setBusy(true);
    setJob({ stage: "ingestion", percent: 5, logLine: "Starting…" });
    try {
      const res = await startAnalysis(files.map((f) => f.name));
      setJob({
        jobId: res.jobId,
        stage: res.initialStage,
        percent: 15,
        logLine: `job=${res.jobId} stage=${res.initialStage}`,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1>{t("app.nav.generate")}</h1>

      <div className="card row">
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => void onFilesPicked(e.target.files)}
        />
        <button type="button" className="btn" onClick={() => void onPickFolder()}>
          {t("generate.selectFolder")}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!files.length || busy}
          onClick={() => void onAnalyze()}
        >
          {t("generate.analyze")}
        </button>
        <label style={{ marginLeft: "auto", fontSize: "0.875rem" }}>
          {i18n.language.toUpperCase()}
          <select
            style={{ marginLeft: "0.5rem" }}
            value={i18n.language}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </label>
      </div>

      {!!files.length && (
        <div className="card">
          <h3>Files</h3>
          <ul>
            {files.map((f) => (
              <li key={f.name}>
                {f.name} — {f.kind} — {(f.size / 1024).toFixed(1)} KB
              </li>
            ))}
          </ul>
        </div>
      )}

      <StageProgress current={job.stage} percent={job.percent} logLine={job.logLine} />

      <div className="grid-2">
        <div className="card">
          <h2>{t("generate.review")}</h2>
          {demoFields.map((f) => (
            <div key={f.key} style={{ marginBottom: "0.75rem" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{f.labelKey}</strong>
                <Badge variant={f.level === "high" ? "green" : f.level === "medium" ? "yellow" : "red"}>
                  {f.confidencePct}%
                </Badge>
              </div>
              <div>{f.value}</div>
              {f.source && (
                <div style={{ fontSize: "0.875rem", color: "#475569" }}>
                  {f.source.file} p.{f.source.page ?? "—"} — {f.source.snippet}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="card">
          <h2>{t("generate.issues")}</h2>
          <p style={{ fontSize: "0.9rem" }}>
            Demo: currency cross-check not run (connect backend validation for real issues).
          </p>
        </div>
      </div>

      <div className="card row" style={{ justifyContent: "space-between" }}>
        <div>
          <button type="button" className="btn btn-primary">
            {t("generate.export")}
          </button>
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          Summary: <Badge variant="green">{summary.g} high</Badge>{" "}
          <Badge variant="yellow">{summary.y} medium</Badge>{" "}
          <Badge variant="red">{summary.r} low</Badge>
        </div>
      </div>
    </div>
  );
}
