"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/navigation";

const navItems = [
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Header({ japaneseOnly = false }: { japaneseOnly?: boolean }) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand" aria-label={t("homeLabel")}>
          <Image src="/KUPACLLC_logo.png" alt={t("logoAlt")} width={48} height={48} priority />
          <span>{t("companyName")}</span>
        </Link>
        <nav className="desktop-nav" aria-label={t("navLabel")}>
          {navItems.map((item) => <a key={item.key} href={`/${locale}${item.href}`}>{t(item.key)}</a>)}
        </nav>
        <div className="header-actions">
          {!japaneseOnly && <div className="language-switcher" aria-label={t("languageLabel")}>
            <Link href={pathname} locale="ja" aria-current={locale === "ja" ? "page" : undefined}>JP</Link>
            <span aria-hidden="true">/</span>
            <Link href={pathname} locale="en" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
          </div>}
          <button className="menu-button" type="button" aria-label={isOpen ? t("closeMenu") : t("openMenu")} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="mobile-nav" aria-label={t("navLabel")}>
          {navItems.map((item) => <a key={item.key} href={`/${locale}${item.href}`} onClick={() => setIsOpen(false)}>{t(item.key)}</a>)}
        </nav>
      )}
    </header>
  );
}
