"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { BabyStage } from "@/lib/types";

const stages: { key: BabyStage; emoji: string }[] = [
  { key: "pregnancy", emoji: "🤰" },
  { key: "newborn", emoji: "👶" },
  { key: "firstSteps", emoji: "🚶" },
];

export default function EvaluatePage() {
  const t = useTranslations("stages");
  const router = useRouter();
  const [selected, setSelected] = useState<BabyStage | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push(`/evaluate/photos?stage=${selected}`);
    }
  };

  return (
    <div id="stage-selection-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading-1 text-center mb-sm">{t("title")}</h1>
        <p className="text-body text-center mb-2xl">{t("subtitle")}</p>
      </motion.div>

      <div className="flex-col gap-lg mb-2xl">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div
              className={`card card--interactive stage-card ${
                selected === stage.key ? "card--selected" : ""
              }`}
              onClick={() => setSelected(stage.key)}
              role="button"
              tabIndex={0}
              id={`stage-${stage.key}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(stage.key);
              }}
            >
              <div className="stage-card__emoji">{stage.emoji}</div>
              <div className="stage-card__title">
                {t(`${stage.key}.title`)}
              </div>
              {stage.key !== "pregnancy" && (
                <div className="stage-card__age">
                  {t(`${stage.key}.age`)}
                </div>
              )}
              <div className="stage-card__description">
                {t(`${stage.key}.description`)}
              </div>
              <div className="stage-card__details">
                {t(`${stage.key}.details`)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.4 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className="btn btn--primary btn--full btn--lg"
          onClick={handleContinue}
          disabled={!selected}
          id="stage-continue"
        >
          {t("continue")}
          <ChevronRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
