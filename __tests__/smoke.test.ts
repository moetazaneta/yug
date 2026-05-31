import { theme } from "@/src/shared/theme/tokens";

describe("app stack", () => {
  it("has design tokens", () => {
    expect(theme.colors.tint).toBe("#5b8cff");
  });
});
