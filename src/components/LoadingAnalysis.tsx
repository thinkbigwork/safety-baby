"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface LoadingAnalysisProps {
  onComplete?: () => void;
}

const STEPS = [
  "scanning",
  "identifying",
  "evaluating",
  "generating",
  "finalizing",
] as const;

export default function LoadingAnalysis({ onComplete }: LoadingAnalysisProps) {
  const t = useTranslations("analysis.loading");
  const [currentStep, setCurrentStep] = useState(0);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < STEPS.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const intervals = [2000, 3000, 2500, 3000, 2000];
    let timeout: NodeJS.Timeout;

    const scheduleNext = (step: number) => {
      if (step < STEPS.length - 1) {
        timeout = setTimeout(() => {
          advanceStep();
          scheduleNext(step + 1);
        }, intervals[step]);
      }
    };

    scheduleNext(0);

    return () => clearTimeout(timeout);
  }, [advanceStep]);

  return (
    <div className="loading-spinner">
      <motion.div
        className="loading-orb"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <h2 className="heading-2 text-center">{t("title")}</h2>

      <div className="flex-col gap-md" style={{ width: "100%", maxWidth: 300 }}>
        <AnimatePresence>
          {STEPS.map((step, index) => (
            <motion.div
              key={step}
              className={`loading-step ${
                index === currentStep
                  ? "loading-step--active"
                  : index < currentStep
                  ? "loading-step--done"
                  : ""
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {index < currentStep ? (
                <Check size={16} color="var(--color-success)" />
              ) : index === currentStep ? (
                <Loader2
                  size={16}
                  className="loading-step--active"
                  style={{ animation: "orb-spin 1s linear infinite" }}
                />
              ) : (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--bg-tertiary)",
                    display: "inline-block",
                  }}
                />
              )}
              {t(`steps.${step}`)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
