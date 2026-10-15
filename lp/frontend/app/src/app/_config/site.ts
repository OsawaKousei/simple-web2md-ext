const configuredSiteRoot = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kupac.co.jp";

export const SITE_ROOT = configuredSiteRoot.replace(/\/$/, "");
export const COMPANY_NAME_JA = "合同会社KUPAC";
export const COMPANY_NAME_EN = "KUPAC LLC";
