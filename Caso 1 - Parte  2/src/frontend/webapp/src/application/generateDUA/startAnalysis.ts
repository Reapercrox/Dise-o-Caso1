import { trackEvent } from "@/infrastructure/observability/appInsights";
import type { PipelineStage } from "@/domain/dua/types";

/** Mediator-style coordinator: folder → analyze → (later) SSE subscription. */
export async function startAnalysis(fileNames: string[]): Promise<{
  jobId: string;
  initialStage: PipelineStage;
}> {
  trackEvent("generate_dua.analysis_started", { count: String(fileNames.length) });
  return { jobId: "local-dev-job", initialStage: "ingestion" };
}
