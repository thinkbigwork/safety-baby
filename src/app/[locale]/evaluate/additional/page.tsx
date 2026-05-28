"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Camera, ChevronRight, SkipForward, Info } from "lucide-react";
import type { AdditionalPhotoRequest, AnalysisResult } from "@/lib/types";

export default function AdditionalPhotosPage() {
  const t = useTranslations("additional");
  const locale = useLocale();
  const router = useRouter();
  const [requests, setRequests] = useState<AdditionalPhotoRequest[]>([]);
  const [photos, setPhotos] = useState<Record<number, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("safetyBabyResult");
    if (stored) {
      try {
        const result: AnalysisResult = JSON.parse(stored);
        if (
          result.additionalPhotosNeeded &&
          result.additionalPhotosNeeded.length > 0
        ) {
          setRequests(result.additionalPhotosNeeded);
        } else {
          router.push("/evaluate/results");
        }
      } catch {
        router.push("/evaluate");
      }
    } else {
      router.push("/evaluate");
    }
  }, [router]);

  const handleCapture = (index: number, file: File) => {
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [index]: preview }));
  };

  const handleSkip = () => {
    router.push("/evaluate/results");
  };

  const handleSubmit = () => {
    // In a full implementation, these photos would be sent for re-analysis
    // For now, just go to results
    router.push("/evaluate/results");
  };

  const capturedCount = Object.values(photos).filter(Boolean).length;

  return (
    <div id="additional-photos-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-1 text-center mb-sm">{t("title")}</h1>
        <p className="text-body text-center mb-2xl">{t("subtitle")}</p>
      </motion.div>

      <div className="flex-col gap-xl mb-2xl">
        {requests.map((req, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="card"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-md)",
                marginBottom: "var(--space-md)",
              }}
            >
              <Camera size={20} color="var(--color-secondary)" />
              <h3 className="heading-3" style={{ margin: 0 }}>
                {req.area}
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-sm)",
                marginBottom: "var(--space-lg)",
                padding: "var(--space-sm) var(--space-md)",
                background: "rgba(14, 165, 233, 0.08)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Info
                size={16}
                color="var(--color-primary)"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-small">{req.reason}</span>
            </div>

            {photos[index] ? (
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  aspectRatio: "4/3",
                }}
              >
                <img
                  src={photos[index]!}
                  alt={req.area}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <button
                  className="btn btn--sm btn--secondary"
                  style={{
                    position: "absolute",
                    bottom: "var(--space-md)",
                    right: "var(--space-md)",
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.capture = "environment";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleCapture(index, file);
                    };
                    input.click();
                  }}
                >
                  Retake
                </button>
              </div>
            ) : (
              <button
                className="btn btn--secondary btn--full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.capture = "environment";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleCapture(index, file);
                  };
                  input.click();
                }}
                id={`additional-photo-${index}`}
              >
                <Camera size={18} />
                {t("takePhoto")}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex-col gap-md">
        {capturedCount > 0 && (
          <button
            className="btn btn--primary btn--full btn--lg"
            onClick={handleSubmit}
            id="submit-additional"
          >
            {t("submit")}
            <ChevronRight size={20} />
          </button>
        )}
        <button
          className="btn btn--ghost btn--full"
          onClick={handleSkip}
          id="skip-additional"
        >
          <SkipForward size={18} />
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
