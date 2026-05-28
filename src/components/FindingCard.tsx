"use client";

import { useTranslations } from "next-intl";
import type { Finding } from "@/lib/types";
import RiskBadge from "./RiskBadge";
import { Lock, AlertTriangle, HeartPulse, Shield } from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  locked?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  accident: <AlertTriangle size={16} color="var(--color-danger)" />,
  disease: <HeartPulse size={16} color="var(--color-accent)" />,
  general: <Shield size={16} color="var(--color-primary)" />,
};

export default function FindingCard({
  finding,
  locked = false,
}: FindingCardProps) {
  const t = useTranslations("results");

  if (locked) {
    return (
      <div className="finding-card finding-card--locked" id={`finding-${finding.id}-locked`}>
        <div className="finding-card__header">
          <div className="finding-card__title">
            <span className={`severity-dot severity-dot--medium`} />
            Hidden finding details
          </div>
          <RiskBadge level="medium" />
        </div>
        <p className="finding-card__description">
          This finding contains important safety information about your home...
        </p>
        <div className="finding-card__recommendation">
          Unlock the full report to see this recommendation.
        </div>
        <div className="finding-card__lock-overlay">
          <Lock size={20} />
          <span>Unlock Full Report</span>
        </div>
      </div>
    );
  }

  return (
    <div className="finding-card" id={`finding-${finding.id}`}>
      <div className="finding-card__header">
        <div>
          <div className="finding-card__title">
            {categoryIcons[finding.category]}
            {finding.title}
          </div>
          <span className="finding-card__category">
            {t(`category.${finding.category}`)}
          </span>
        </div>
        <RiskBadge level={finding.severity} />
      </div>
      <p className="finding-card__description">{finding.description}</p>
      <div className="finding-card__recommendation">
        💡 {finding.recommendation}
      </div>
    </div>
  );
}
