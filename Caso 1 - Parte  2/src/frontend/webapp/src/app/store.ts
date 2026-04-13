import { create } from "zustand";
import type { PipelineStage } from "@/domain/dua/types";
import type { DetectedFile } from "@/shared/types/files";

export type JobState = {
  jobId: string | null;
  stage: PipelineStage | "idle";
  percent: number;
  logLine: string;
  files: DetectedFile[];
};

type AppStore = {
  job: JobState;
  setJob: (partial: Partial<JobState>) => void;
  resetJob: () => void;
};

const initialJob: JobState = {
  jobId: null,
  stage: "idle",
  percent: 0,
  logLine: "",
  files: [],
};

export const useAppStore = create<AppStore>((set) => ({
  job: initialJob,
  setJob: (partial) => set((s) => ({ job: { ...s.job, ...partial } })),
  resetJob: () => set({ job: initialJob }),
}));
