import { store } from '../../app/store';
import { httpClient } from '../../infrastructure/api/httpClient';
import { advanceStage, appendLog, setError } from './workflowSlice';
import { setDocument } from '../../domain/dua/duaSlice';
import type { WorkflowStage } from './workflowSlice';

const POLL_INTERVAL_MS = 3000;

interface JobStatusResponse {
  stage: WorkflowStage;
  log?: string;
  dua?: unknown;
}

class WorkflowSubscription {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private socket: WebSocket | null = null;

  subscribe(jobId: string): void {
    // Prefer WebSocket; fall back to polling
    if (typeof WebSocket !== 'undefined') {
      this.connectWebSocket(jobId);
    } else {
      this.startPolling(jobId);
    }
  }

  unsubscribe(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private connectWebSocket(jobId: string): void {
    const wsUrl = `${import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000'}/jobs/${jobId}/status`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      this.handleStatusUpdate(JSON.parse(event.data) as JobStatusResponse);
    };

    ws.onerror = () => {
      ws.close();
      this.startPolling(jobId); // fall back to polling
    };

    ws.onclose = () => {
      this.socket = null;
    };

    this.socket = ws;
  }

  private startPolling(jobId: string): void {
    this.intervalId = setInterval(async () => {
      try {
        const status = await httpClient.get<JobStatusResponse>(
          `/api/jobs/${jobId}/status`
        );
        this.handleStatusUpdate(status);

        if (status.stage === 'complete' || status.stage === 'failed') {
          this.unsubscribe();
        }
      } catch (err: unknown) {
        store.dispatch(setError((err as Error).message));
        this.unsubscribe();
      }
    }, POLL_INTERVAL_MS);
  }

  private handleStatusUpdate(status: JobStatusResponse): void {
    store.dispatch(advanceStage(status.stage));

    if (status.log) {
      store.dispatch(appendLog(status.log));
    }

    if (status.dua) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store.dispatch(setDocument(status.dua as any));
    }
  }
}

export const workflowSubscription = new WorkflowSubscription();
