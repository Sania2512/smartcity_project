import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import CityCard from "./CityCard";
import type { CityRating } from "@/data/cities";

interface TopCitiesProps {
  onCitySelect: (cityId: string) => void;
  cities?: CityRating[];
  loading?: boolean;
}

const TopCities = ({ onCitySelect, cities = [], loading = false }: TopCitiesProps) => {
  const topCities = [...cities]
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 6);

  const renderCities = () => {
    if (loading) {
      return [1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse h-96">
          <div className="w-full h-44 bg-muted" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ));
    }
    if (topCities.length > 0) {
      return topCities.map((city, i) => (
        <CityCard
          key={city.id}
          city={city}
          rank={i + 1}
          onClick={() => onCitySelect(city.id)}
        />
      ));
    }
    return <div className="col-span-full text-center py-12"><p className="text-muted-foreground">No cities available</p></div>;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Classement
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-3 tracking-wide">
            Les meilleures villes de France
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Basé sur les avis de milliers de résidents
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderCities()}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
