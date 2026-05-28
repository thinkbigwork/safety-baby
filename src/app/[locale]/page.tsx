"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 3;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const startEvaluation = () => {
    router.push("/evaluate");
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  return (
    <div className="onboarding" id="onboarding-page">
      {/* Welcome Hero (only on slide 0) */}
      {currentSlide === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-xl"
        >
          <p
            className="text-body"
            style={{ fontSize: "var(--text-lg)", marginBottom: 4 }}
          >
            {t("welcome")}
          </p>
          <h1
            className="heading-display text-gradient"
            style={{ fontSize: "var(--text-5xl)" }}
          >
            {t("brandName")}
          </h1>
          <p className="text-body mt-md">{t("tagline")}</p>
        </motion.div>
      )}

      {/* Slides */}
      <AnimatePresence mode="wait" custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="onboarding__slide"
        >
          {/* Slide 1: Statistics */}
          {currentSlide === 0 && (
            <div>
              <h2 className="heading-2 mb-lg">
                <Sparkles
                  size={20}
                  style={{
                    display: "inline",
                    marginRight: 8,
                    color: "var(--color-secondary)",
                  }}
                />
                {t("slide1.title")}
              </h2>
              <div className="stat-grid">
                <motion.div
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="stat-value stat-value--blue">
                    {t("slide1.stat1")}
                  </div>
                  <div className="stat-label">{t("slide1.stat1Label")}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="stat-value stat-value--amber">
                    {t("slide1.stat2")}
                  </div>
                  <div className="stat-label">{t("slide1.stat2Label")}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="stat-value stat-value--red">
                    {t("slide1.stat3")}
                  </div>
                  <div className="stat-label">{t("slide1.stat3Label")}</div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Slide 2: Prevention */}
          {currentSlide === 1 && (
            <div>
              <h2 className="heading-2 mb-md">
                <AlertTriangle
                  size={20}
                  style={{
                    display: "inline",
                    marginRight: 8,
                    color: "var(--color-warning)",
                  }}
                />
                {t("slide2.title")}
              </h2>
              <p className="text-body mb-lg">{t("slide2.description")}</p>
              <div className="hazard-list">
                <motion.div
                  className="hazard-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="hazard-icon hazard-icon--kitchen">🍳</div>
                  <span className="hazard-text">{t("slide2.point1")}</span>
                </motion.div>
                <motion.div
                  className="hazard-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="hazard-icon hazard-icon--bathroom">🚿</div>
                  <span className="hazard-text">{t("slide2.point2")}</span>
                </motion.div>
                <motion.div
                  className="hazard-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="hazard-icon hazard-icon--bedroom">🛏️</div>
                  <span className="hazard-text">{t("slide2.point3")}</span>
                </motion.div>
                <motion.div
                  className="hazard-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="hazard-icon hazard-icon--living">🛋️</div>
                  <span className="hazard-text">{t("slide2.point4")}</span>
                </motion.div>
              </div>
            </div>
          )}

          {/* Slide 3: CTA */}
          {currentSlide === 2 && (
            <div>
              <h2 className="heading-2 mb-md">
                <ShieldCheck
                  size={20}
                  style={{
                    display: "inline",
                    marginRight: 8,
                    color: "var(--color-success)",
                  }}
                />
                {t("slide3.title")}
              </h2>
              <p className="text-body mb-xl">{t("slide3.description")}</p>
              <div className="steps-list">
                <motion.div
                  className="step-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="step-number">1</div>
                  <span className="step-text">{t("slide3.step1")}</span>
                </motion.div>
                <motion.div
                  className="step-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="step-number">2</div>
                  <span className="step-text">{t("slide3.step2")}</span>
                </motion.div>
                <motion.div
                  className="step-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="step-number">3</div>
                  <span className="step-text">{t("slide3.step3")}</span>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-xl"
              >
                <button
                  className="btn btn--primary btn--full btn--lg"
                  onClick={startEvaluation}
                  id="start-evaluation-cta"
                >
                  <ShieldCheck size={20} />
                  {t("slide3.cta")}
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="onboarding__nav">
        {currentSlide > 0 ? (
          <button
            className="btn btn--ghost"
            onClick={prevSlide}
            id="onboarding-back"
          >
            <ChevronLeft size={18} />
            {t("back")}
          </button>
        ) : (
          <button
            className="btn btn--ghost"
            onClick={startEvaluation}
            id="onboarding-skip"
          >
            {t("skip")}
          </button>
        )}

        {/* Progress dots */}
        <div className="progress-dots">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`progress-dot ${
                i === currentSlide ? "progress-dot--active" : ""
              }`}
            />
          ))}
        </div>

        {currentSlide < totalSlides - 1 ? (
          <button
            className="btn btn--ghost"
            onClick={nextSlide}
            id="onboarding-next"
          >
            {t("next")}
            <ChevronRight size={18} />
          </button>
        ) : (
          <div style={{ width: 80 }} />
        )}
      </div>
    </div>
  );
}
