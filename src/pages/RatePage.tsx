import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Send, CheckCircle, TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles,
};
import { allCities, categories, type CityRating } from "@/data/cities";
import { useToast } from "@/hooks/use-toast";

const RatePage = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityRating | null>(null);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(categories.map(c => [c.key, 5]))
  );
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filtered = query.length >= 2
    ? allCities.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.department.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une ville", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Merci !", description: `Votre avis sur ${selectedCity.name} a été enregistré.` });
  };

  const resetForm = () => {
    setSelectedCity(null);
    setQuery("");
    setScores(Object.fromEntries(categories.map(c => [c.key, 5])));
    setComment("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-foreground mb-3">Merci pour votre avis !</h2>
          <p className="text-muted-foreground mb-8">
            Votre notation de <strong className="text-foreground">{selectedCity?.name}</strong> a bien été prise en compte.
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Noter une autre ville
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl text-foreground mb-3">Noter une ville</h1>
          <p className="text-muted-foreground text-lg">
            Partagez votre expérience en notant votre ville sur 9 critères
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* City search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <label className="block text-sm font-semibold text-foreground mb-2">Ville</label>
            {selectedCity ? (
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground">{selectedCity.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">{selectedCity.department}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCity(null); setQuery(""); }}
                  className="text-sm text-primary hover:underline"
                >
                  Changer
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  placeholder="Rechercher une ville..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body placeholder:text-muted-foreground"
                />
                {focused && filtered.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-card rounded-xl shadow-lg border border-border overflow-hidden z-10">
                    {filtered.map(city => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => { setSelectedCity(city); setQuery(city.name); setFocused(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                      >
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{city.name}</span>
                        <span className="text-muted-foreground text-sm">{city.department}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Scores */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <label className="block text-sm font-semibold text-foreground">Vos notes</label>
            {categories.map(cat => (
              <div key={cat.key} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {(() => { const Icon = iconMap[cat.lucideIcon]; return Icon ? <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div> : null; })()}
                    <span className="font-medium text-foreground text-sm">{cat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    {scores[cat.key]}/10
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setScores(s => ({ ...s, [cat.key]: i + 1 }))}
                      className="flex-1 group"
                    >
                      <div
                        className={`h-3 rounded-full transition-all ${
                          i < scores[cat.key]
                            ? "bg-primary group-hover:bg-primary/80"
                            : "bg-muted group-hover:bg-muted-foreground/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Comment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-foreground mb-2">Commentaire (optionnel)</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Décrivez votre expérience dans cette ville..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body placeholder:text-muted-foreground resize-none"
            />
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-4.5 h-4.5" />
              Envoyer mon avis
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default RatePage;
