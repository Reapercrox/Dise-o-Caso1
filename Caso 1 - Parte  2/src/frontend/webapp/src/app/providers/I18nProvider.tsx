import type { ReactNode } from "react";
import { useEffect } from "react";
import i18n from "@/i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onLang = (lng: string) => {
      document.documentElement.lang = lng;
    };
    onLang(i18n.language);
    i18n.on("languageChanged", onLang);
    return () => {
      i18n.off("languageChanged", onLang);
    };
  }, []);
  return children;
}
