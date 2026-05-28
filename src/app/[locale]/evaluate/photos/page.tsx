"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import PhotoCapture from "@/components/PhotoCapture";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import type { BabyStage, RoomType, RoomPhoto, AnalysisResult } from "@/lib/types";

const ROOMS: { key: RoomType; emoji: string }[] = [
  { key: "bedroom", emoji: "🛏️" },
  { key: "kitchen", emoji: "🍳" },
  { key: "bathroom", emoji: "🚿" },
  { key: "living", emoji: "🛋️" },
];

const MAX_IMAGE_SIZE = 1280; // max width/height in pixels
const JPEG_QUALITY = 0.7;

function compressAndConvert(file: File): Promise<{ base64: string; preview: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        let { width, height } = img;

        // Scale down if needed
        if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
          const ratio = Math.min(MAX_IMAGE_SIZE / width, MAX_IMAGE_SIZE / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG base64
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        const base64 = dataUrl.split(",")[1];

        // Use the compressed dataUrl as preview too
        resolve({ base64, preview: dataUrl });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}

export default function PhotosPage() {
  const t = useTranslations("photos");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stage = (searchParams.get("stage") as BabyStage) || "newborn";

  const [photos, setPhotos] = useState<RoomPhoto[]>(
    ROOMS.map((r) => ({
      room: r.key,
      file: null,
      preview: null,
      base64: null,
    }))
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(
    async (roomKey: RoomType, file: File) => {
      try {
        // Compress and convert to base64
        const { base64, preview } = await compressAndConvert(file);

        setPhotos((prev) =>
          prev.map((p) =>
            p.room === roomKey ? { ...p, file, preview, base64 } : p
          )
        );
      } catch (err) {
        console.error("Error processing image:", err);
      }
    },
    []
  );

  const allPhotosReady = photos.every((p) => p.base64 !== null);
  const photosReady = photos.filter((p) => p.base64 !== null).length;

  const handleAnalyze = async () => {
    if (!allPhotosReady) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const payload = {
        stage,
        locale,
        photos: photos.map((p) => ({
          room: p.room,
          base64: p.base64!,
          mimeType: "image/jpeg",
        })),
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: AnalysisResult = await response.json();

      // Store result in sessionStorage for the results page
      sessionStorage.setItem("safetyBabyResult", JSON.stringify(result));
      sessionStorage.setItem("safetyBabyStage", stage);

      router.push("/evaluate/results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during analysis"
      );
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <LoadingAnalysis />;
  }

  return (
    <div id="photos-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading-1 text-center mb-sm">{t("title")}</h1>
        <p className="text-body text-center mb-lg">{t("subtitle")}</p>

        {/* Progress */}
        <div className="mb-xl">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span className="text-small">
              {t("step", { current: photosReady, total: ROOMS.length })}
            </span>
            <span className="text-small" style={{ color: "var(--color-primary-light)" }}>
              {Math.round((photosReady / ROOMS.length) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${(photosReady / ROOMS.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Room Photos */}
      <div className="flex-col gap-2xl mb-2xl">
        {ROOMS.map((room, index) => (
          <motion.div
            key={room.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <PhotoCapture
              preview={photos.find((p) => p.room === room.key)?.preview || null}
              onCapture={(file) => handleCapture(room.key, file)}
              label={t(`rooms.${room.key}`)}
              tip={t(`roomTips.${room.key}`)}
              roomEmoji={room.emoji}
            />
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card mb-lg"
          style={{
            borderColor: "var(--color-danger)",
            background: "var(--color-danger-bg)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--color-danger)", fontWeight: 500 }}>
            {error}
          </p>
          <p className="text-small mt-sm">
            Please check your API key configuration and try again.
          </p>
        </motion.div>
      )}

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: allPhotosReady ? 1 : 0.4 }}
      >
        <button
          className="btn btn--primary btn--full btn--lg"
          onClick={handleAnalyze}
          disabled={!allPhotosReady}
          id="analyze-button"
        >
          {t("analyze")}
          <ChevronRight size={20} />
        </button>
      </motion.div>

      {!allPhotosReady && (
        <p className="text-small text-center mt-md" style={{ color: "var(--color-secondary)" }}>
          📷 {ROOMS.length - photosReady} room{ROOMS.length - photosReady !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
}
