import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import CityCard from "./CityCard";
import { topCities } from "@/data/cities";

interface TopCitiesProps {
  onCitySelect: (cityId: string) => void;
}

const TopCities = ({ onCitySelect }: TopCitiesProps) => {
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
          {topCities.map((city, i) => (
            <CityCard
              key={city.id}
              city={city}
              rank={i + 1}
              onClick={() => onCitySelect(city.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
