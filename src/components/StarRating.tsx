import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-5.5 h-5.5",
};

const StarRating = ({ score, maxScore = 10, size = "md", showValue = true }: StarRatingProps) => {
  const normalized = (score / maxScore) * 5;
  const fullStars = Math.floor(normalized);
  const hasHalf = normalized - fullStars >= 0.25;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${sizeMap[size]} ${
              i < fullStars
                ? "fill-star text-star"
                : i === fullStars && hasHalf
                ? "fill-star/50 text-star"
                : "fill-star-empty text-star-empty"
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
