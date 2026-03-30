import { motion } from "framer-motion";
import { TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles } from "lucide-react";
import { categories } from "@/data/cities";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TreePine, TrainFront, ShieldCheck, HeartPulse, Dumbbell, Palette, GraduationCap, ShoppingBag, Sparkles,
};

const CategoryOverview = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-3">
            9 critères pour noter votre ville
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Des transports à la culture, évaluez chaque aspect de votre quotidien
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.lucideIcon];
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {Icon && <Icon className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryOverview;
