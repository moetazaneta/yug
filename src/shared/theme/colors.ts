export const APP_PRIMARY_COLOR_DEFAULT = "#0A84FF";

export const appPrimaryColorOptions = [
  "#0A84FF",
  "#34C759",
  "#FF9F0A",
  "#FF375F",
  "#AF52DE",
  "#64D2FF",
] as const;

export const colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: APP_PRIMARY_COLOR_DEFAULT,
    tabIconDefault: "#ccc",
    tabIconSelected: APP_PRIMARY_COLOR_DEFAULT,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: APP_PRIMARY_COLOR_DEFAULT,
    tabIconDefault: "#ccc",
    tabIconSelected: APP_PRIMARY_COLOR_DEFAULT,
  },
} as const;

export default colors;
