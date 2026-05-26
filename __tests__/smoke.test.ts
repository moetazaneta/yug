import { theme } from "@/src/theme/tokens";

describe("app stack", () => {
  it("has design tokens", () => {
    expect(theme.colors.tint).toBe("#5b8cff");
  });
});
