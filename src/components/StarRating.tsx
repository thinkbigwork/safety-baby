"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export default function StarRating({
  score,
  size = 24,
  showLabel = true,
}: StarRatingProps) {
  return (
    <div className="star-rating" aria-label={`Rating: ${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`star-rating__star ${
            star <= score ? "star-rating__star--filled" : ""
          }`}
          fill={star <= score ? "currentColor" : "none"}
          strokeWidth={star <= score ? 0 : 1.5}
        />
      ))}
      {showLabel && (
        <span
          style={{
            marginLeft: 8,
            fontWeight: 700,
            fontSize: size * 0.8,
            color: "var(--color-secondary)",
          }}
        >
          {score}/5
        </span>
      )}
    </div>
  );
}
