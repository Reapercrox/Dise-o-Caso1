/**
 * Facade over AWS Application Insights SDK.
 * All telemetry calls in the app go through this single module.
 */

type Properties = Record<string, string | number | boolean>;

class AppInsights {
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    // In production, initialize the AWS RUM (Real User Monitoring) client here
    // import { AwsRum } from 'aws-rum-web';
    this.initialized = true;
    this.log('AppInsights initialized');
  }

  trackEvent(name: string, properties?: Properties): void {
    if (!this.initialized) return;
    this.log(`[event] ${name}`, properties);
    // awsRum.recordEvent(name, properties ?? {});
  }

  trackPageView(page: string): void {
    if (!this.initialized) return;
    this.log(`[pageview] ${page}`);
    // awsRum.recordPageView(page);
  }

  trackDependency(url: string, durationMs: number, success: boolean): void {
    if (!this.initialized) return;
    this.log(`[dependency] ${url} | ${durationMs}ms | success=${success}`);
  }

  trackError(error: Error, properties?: Properties): void {
    if (!this.initialized) return;
    console.error(`[error] ${error.message}`, properties);
    // awsRum.recordError(error);
  }

  private log(message: string, data?: unknown): void {
    if (import.meta.env.DEV) {
      console.debug(`[AppInsights] ${message}`, data ?? '');
    }
  }
}

export const appInsights = new AppInsights();
