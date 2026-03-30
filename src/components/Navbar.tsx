import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, PenLine } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-display font-bold text-foreground tracking-tight">
          Ville<span className="text-primary">Idéale</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/noter"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === "/noter"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span className="hidden sm:inline">Noter une ville</span>
          </Link>

          <button
            onClick={toggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors"
            aria-label="Changer de thème"
          >
            {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
