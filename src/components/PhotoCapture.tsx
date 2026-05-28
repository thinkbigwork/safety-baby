"use client";

import { useRef } from "react";
import { Camera, RefreshCw } from "lucide-react";

interface PhotoCaptureProps {
  preview: string | null;
  onCapture: (file: File) => void;
  label: string;
  tip: string;
  roomEmoji: string;
}

export default function PhotoCapture({
  preview,
  onCapture,
  label,
  tip,
  roomEmoji,
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
    // Reset value so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="room-card">
      <div className="room-card__header">
        <div className="room-card__icon">{roomEmoji}</div>
        <div className="room-card__info">
          <div className="room-card__name">{label}</div>
          <div className="room-card__tip">{tip}</div>
        </div>
      </div>

      <div
        className={`photo-capture ${preview ? "photo-capture--has-photo" : ""}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Take photo of ${label}`}
        id={`photo-capture-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt={`Preview of ${label}`}
              className="photo-capture__preview"
            />
            <div style={{ position: "absolute", bottom: "var(--space-md)", right: "var(--space-md)" }}>
              <button
                className="btn btn--sm btn--secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <RefreshCw size={14} />
                Retake
              </button>
            </div>
          </>
        ) : (
          <>
            <Camera size={40} className="photo-capture__icon" />
            <span className="photo-capture__label">Tap to take photo</span>
          </>
        )}
      </div>
    </div>
  );
}
