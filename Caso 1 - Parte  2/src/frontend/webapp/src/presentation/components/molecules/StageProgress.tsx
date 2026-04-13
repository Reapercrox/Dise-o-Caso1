import { useTranslation } from "react-i18next";
import type { PipelineStage } from "@/domain/dua/types";

const stages: PipelineStage[] = [
  "ingestion",
  "ocr",
  "extraction",
  "mapping",
  "validation",
  "export",
];

type Props = {
  current: PipelineStage | "idle";
  percent: number;
  logLine: string;
};

export function StageProgress({ current, percent, logLine }: Props) {
  const { t } = useTranslation();
  const idx = current === "idle" ? -1 : stages.indexOf(current);
  return (
    <div className="card">
      <h2>{t("generate.processing")}</h2>
      <div className="progress">
        <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
      <p>
        <strong>{percent}%</strong> — {current}
      </p>
      <ol>
        {stages.map((s, i) => (
          <li key={s} style={{ fontWeight: i <= idx ? 700 : 400 }}>
            {s}
          </li>
        ))}
      </ol>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>{logLine}</pre>
    </div>
  );
}
