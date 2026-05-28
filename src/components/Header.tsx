"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Shield, Globe } from "lucide-react";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="header" id="main-header">
      <div className="header__inner">
        <a href={`/${locale}`} className="header__brand">
          <div className="header__brand-icon">
            <Shield size={18} color="white" />
          </div>
          {t("brand")}
        </a>
        <div className="header__actions">
          <button
            className="lang-switch"
            onClick={switchLocale}
            id="language-switcher"
            aria-label="Switch language"
          >
            <Globe size={14} />
            {t("language")}
          </button>
        </div>
      </div>
    </header>
  );
}
