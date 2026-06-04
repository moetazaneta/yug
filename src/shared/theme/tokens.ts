import { APP_PRIMARY_COLOR_DEFAULT } from "@/src/shared/theme/colors";

export const theme = {
  radius: {
    card: 28,
    control: 18,
  },
  spacing: {
    screen: 20,
  },
  colors: {
    tint: APP_PRIMARY_COLOR_DEFAULT,
    backgroundLight: "#f7f8ff",
    backgroundDark: "#090a10",
  },
} as const;
