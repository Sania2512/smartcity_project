import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import StarRating from "./StarRating";
import type { CityRating } from "@/data/cities";

interface CityCardProps {
  city: CityRating;
  rank: number;
  onClick?: () => void;
}

const CityCard = ({ city, rank, onClick }: CityCardProps) => {
  const medalColors: Record<number, string> = {
    1: "bg-amber-400 text-amber-950",
    2: "bg-gray-300 text-gray-700",
    3: "bg-amber-600 text-amber-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.08 }}
      onClick={onClick}
      className="group bg-card rounded-2xl overflow-hidden cursor-pointer border border-border hover:border-primary/30 transition-all duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-card-hover)" }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${medalColors[rank] || "bg-muted text-foreground"}`}>
          {rank}
        </div>
        <div className="absolute bottom-3 left-4">
          <h3 className="text-xl font-display text-primary-foreground">{city.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{city.department}</span>
        </div>

        <StarRating score={city.overallScore} />

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-3">
          <Users className="w-3.5 h-3.5" />
          <span>{city.totalRatings} avis</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CityCard;
