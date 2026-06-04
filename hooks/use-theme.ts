import { useCSSVariable } from "uniwind";

import { useAppStore } from "@/src/state/app-store";

export function useTheme() {
  const primary = useAppStore((state) => state.primaryColor);

  const surface1 = useCSSVariable("--color-white") as string;
  const surface2 = useCSSVariable("--color-neutral-100") as string;
  const surface3 = useCSSVariable("--color-neutral-200") as string;

  const text = useCSSVariable("--color-neutral-900") as string;
  const textDim = useCSSVariable("--color-neutral-600") as string;

  return {
    primary,
    primaryDim: `${primary}99`,
    surface1,
    surface2,
    surface3,
    text,
    textDim,
  } as const;
}
