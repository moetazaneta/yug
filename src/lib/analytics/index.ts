type AnalyticsEvent = "app_opened" | "entry_created" | "reminder_scheduled";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

export const analytics = {
  capture(_event: AnalyticsEvent, _properties?: AnalyticsProperties) {
    // PostHog is intentionally hidden behind this boundary. Configure the client
    // when the project has a real API key and privacy policy text.
  },
};
