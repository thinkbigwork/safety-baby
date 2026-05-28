"use client";

import { useTranslations } from "next-intl";
import type { RiskLevel, Severity } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel | Severity;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const t = useTranslations("results");

  const labelMap: Record<string, string> = {
    low: t("severity.low"),
    medium: t("severity.medium"),
    high: t("severity.high"),
    critical: t("severity.critical"),
  };

  return (
    <span className={`risk-badge risk-badge--${level}`}>
      <span className={`severity-dot severity-dot--${level}`} />
      {labelMap[level] || level}
    </span>
  );
}
