"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Share2,
  Lock,
  ChevronRight,
  Camera,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import StarRating from "@/components/StarRating";
import RiskBadge from "@/components/RiskBadge";
import FindingCard from "@/components/FindingCard";
import PaywallModal from "@/components/PaywallModal";
import type { AnalysisResult, Finding, RoomType } from "@/lib/types";

const ROOM_EMOJIS: Record<RoomType, string> = {
  bedroom: "🛏️",
  kitchen: "🍳",
  bathroom: "🚿",
  living: "🛋️",
};

const FREE_FINDINGS_LIMIT = 5;

export default function ResultsPage() {
  const t = useTranslations("results");
  const tPhotos = useTranslations("photos");
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("safetyBabyResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        router.push("/evaluate");
      }
    } else {
      router.push("/evaluate");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="loading-spinner">
        <div className="loading-orb" />
      </div>
    );
  }

  // Collect and sort all findings
  const allFindings: Finding[] = result.rooms
    .flatMap((room) => room.findings)
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  const freeFindings = allFindings.slice(0, FREE_FINDINGS_LIMIT);
  const lockedFindings = allFindings.slice(FREE_FINDINGS_LIMIT);
  const hasLockedFindings = lockedFindings.length > 0 && !isUnlocked;

  return (
    <div id="results-page" className="app-container--wide" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2xl"
      >
        <h1 className="heading-1 mb-lg">{t("title")}</h1>

        {/* Overall Score */}
        <div className="card card--glass text-center mb-lg">
          <p
            className="text-small mb-sm"
            style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            {t("overallScore")}
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "var(--space-md)",
            }}
          >
            <StarRating score={result.overallScore} size={36} />
          </motion.div>
        </div>
      </motion.div>

      {/* Room Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2xl"
      >
        <h2 className="heading-3 mb-lg">{t("roomScores")}</h2>
        <div className="flex-col gap-md">
          {result.rooms.map((room, index) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="room-score"
            >
              <div className="room-score__left">
                <span className="room-score__emoji">
                  {ROOM_EMOJIS[room.name]}
                </span>
                <span className="room-score__name">
                  {tPhotos(`rooms.${room.name}`)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <StarRating score={room.score} size={18} showLabel={false} />
                <RiskBadge level={room.riskLevel} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Photos Needed */}
      {result.additionalPhotosNeeded && result.additionalPhotosNeeded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-2xl"
        >
          <div
            className="card"
            style={{
              borderColor: "rgba(245, 158, 11, 0.3)",
              background: "rgba(245, 158, 11, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
              <Camera size={20} color="var(--color-secondary)" />
              <h3 className="heading-3">{t("additionalPhotos")}</h3>
            </div>
            <p className="text-small mb-lg">{t("additionalPhotosDesc")}</p>
            <div className="flex-col gap-md">
              {result.additionalPhotosNeeded.map((req, i) => (
                <div key={i} className="hazard-item">
                  <div className="hazard-icon hazard-icon--kitchen">📷</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBottom: 4 }}>
                      {req.area}
                    </div>
                    <div className="text-small">{req.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Findings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-2xl"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
          <h2 className="heading-3">{t("findings")}</h2>
          <span className="text-small">
            {t("findingsCount", {
              free: isUnlocked ? allFindings.length : Math.min(FREE_FINDINGS_LIMIT, allFindings.length),
              total: allFindings.length,
            })}
          </span>
        </div>

        <div className="flex-col gap-md">
          {/* Free findings */}
          {freeFindings.map((finding, index) => (
            <motion.div
              key={finding.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index + 0.5 }}
            >
              <FindingCard finding={finding} />
            </motion.div>
          ))}

          {/* Locked findings */}
          {hasLockedFindings &&
            lockedFindings.map((finding, index) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index + 0.7 }}
              >
                <FindingCard finding={finding} locked={true} />
              </motion.div>
            ))}

          {/* Unlocked findings (after payment) */}
          {isUnlocked &&
            lockedFindings.map((finding, index) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <FindingCard finding={finding} />
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Paywall Banner */}
      {hasLockedFindings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-2xl"
        >
          <div className="paywall-banner">
            <Lock size={28} color="var(--color-accent)" />
            <h3 className="heading-2 mt-md">{t("unlock.title")}</h3>
            <p className="text-body mt-sm">
              {t("unlock.description", {
                free: FREE_FINDINGS_LIMIT,
                total: allFindings.length,
              })}
            </p>
            <div className="paywall-banner__price">{t("unlock.price")}</div>

            <div className="paywall-features">
              <div className="paywall-feature">
                <Sparkles size={16} className="paywall-feature__icon" />
                <span>
                  {t("unlock.features.allFindings", {
                    total: allFindings.length,
                  })}
                </span>
              </div>
              <div className="paywall-feature">
                <ClipboardList size={16} className="paywall-feature__icon" />
                <span>{t("unlock.features.detailed")}</span>
              </div>
              <div className="paywall-feature">
                <Share2 size={16} className="paywall-feature__icon" />
                <span>{t("unlock.features.printable")}</span>
              </div>
              <div className="paywall-feature">
                <ChevronRight size={16} className="paywall-feature__icon" />
                <span>{t("unlock.features.priority")}</span>
              </div>
            </div>

            <button
              className="btn btn--accent btn--full btn--lg"
              onClick={() => setShowPaywall(true)}
              id="unlock-report-button"
            >
              <Lock size={18} />
              {t("unlock.cta")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Other Evaluations */}
      {result.otherEvaluations && result.otherEvaluations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-2xl"
        >
          <h2 className="heading-3 mb-lg">{t("otherEvaluations")}</h2>
          <div className="flex-col gap-md">
            {result.otherEvaluations.map((evaluation, index) => (
              <div key={index} className="card" style={{ padding: "var(--space-lg)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)" }}>
                  <ClipboardList size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="text-body" style={{ margin: 0 }}>
                    {evaluation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex-col gap-md mb-xl"
      >
        <button
          className="btn btn--secondary btn--full"
          onClick={() => {
            sessionStorage.removeItem("safetyBabyResult");
            sessionStorage.removeItem("safetyBabyStage");
            router.push("/evaluate");
          }}
          id="new-evaluation"
        >
          <RotateCcw size={18} />
          {t("newEvaluation")}
        </button>
      </motion.div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUnlock={() => setIsUnlocked(true)}
        totalFindings={allFindings.length}
        freeFindings={FREE_FINDINGS_LIMIT}
      />
    </div>
  );
}
