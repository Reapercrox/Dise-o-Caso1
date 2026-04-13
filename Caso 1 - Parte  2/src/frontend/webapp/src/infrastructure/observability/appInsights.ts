/** Facade for Application Insights / analytics events. */

export function trackEvent(name: string, properties?: Record<string, string>) {
  if (import.meta.env.DEV) {
    console.debug("[telemetry]", name, properties);
  }
}
