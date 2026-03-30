import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { allCities } from "@/data/cities";

interface HeroSearchProps {
  onCitySelect: (cityId: string) => void;
}

const HeroSearch = ({ onCitySelect }: HeroSearchProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = query.length >= 2
    ? allCities.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.department.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl text-primary-foreground mb-4 tracking-tight">
            Trouvez votre ville idéale
          </h1>
          <p className="text-primary-foreground/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-body">
            Découvrez les notes et avis de milliers de villes françaises, et partagez votre expérience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto relative"
        >
          <div className={`relative rounded-2xl bg-primary-foreground transition-shadow duration-300 ${focused ? "shadow-[var(--shadow-hero)]" : "shadow-lg"}`}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Rechercher une ville ou un code postal..."
              className="w-full pl-14 pr-5 py-5 rounded-2xl text-foreground bg-transparent text-lg focus:outline-none font-body placeholder:text-muted-foreground"
            />
          </div>

          {focused && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50"
            >
              {filtered.map(city => (
                <button
                  key={city.id}
                  onClick={() => { onCitySelect(city.id); setQuery(city.name); setFocused(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-secondary transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{city.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">{city.department}</span>
                  </div>
                  <span className="ml-auto text-sm font-bold text-primary">{city.overallScore.toFixed(1)}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {["Angers", "Lyon", "Bordeaux", "Nantes", "Strasbourg"].map(city => (
            <button
              key={city}
              onClick={() => { setQuery(city); }}
              className="px-4 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground/90 text-sm font-medium hover:bg-primary-foreground/25 transition-colors font-body"
            >
              {city}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSearch;
