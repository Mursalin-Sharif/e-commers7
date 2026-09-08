import type { CSSProperties } from "react";
import type { SiteSettings } from "@/lib/settings";

export function themeStyle(settings: Pick<SiteSettings, "primaryColor" | "secondaryColor">): CSSProperties {
  return {
    "--primary": settings.primaryColor,
    "--secondary": settings.secondaryColor,
  } as CSSProperties;
}
