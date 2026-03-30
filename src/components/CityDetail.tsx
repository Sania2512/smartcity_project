import { motion } from "framer-motion";
import { X, MapPin, Users } from "lucide-react";
import { TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles } from "lucide-react";
import StarRating from "./StarRating";
import { categories, type CityRating } from "@/data/cities";
import { AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles,
};

interface CityDetailProps {
  city: CityRating | null;
  onClose: () => void;
}

const CityDetail = ({ city, onClose }: CityDetailProps) => {
  if (!city) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={e => e.stopPropagation()}
          className="bg-card w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto"
        >
          <div className="relative h-52">
            <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div className="absolute bottom-4 left-5">
              <h2 className="text-3xl font-display text-primary-foreground">{city.name}</h2>
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>{city.department} · {city.region}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-4xl font-bold text-foreground font-display">{city.overallScore.toFixed(2)}</div>
                <div className="text-muted-foreground text-sm">sur 10</div>
              </div>
              <div className="text-right">
                <StarRating score={city.overallScore} size="lg" showValue={false} />
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1 justify-end">
                  <Users className="w-3.5 h-3.5" />
                  <span>{city.totalRatings} avis</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map(cat => {
                const score = city.scores[cat.key as keyof typeof city.scores];
                const Icon = iconMap[cat.lucideIcon];
                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {Icon && <Icon className="w-4 h-4 text-primary" />}
                    </div>
                    <span className="text-sm text-foreground flex-1 font-medium">{cat.label}</span>
                    <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 10) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-8 text-right tabular-nums">
                      {score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity font-body">
              Donner mon avis
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CityDetail;
