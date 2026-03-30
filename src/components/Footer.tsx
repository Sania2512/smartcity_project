const Footer = () => (
  <footer className="py-12 bg-muted dark:bg-card border-t">
    <div className="container mx-auto px-4 text-center">
      <div className="text-foreground text-2xl font-display mb-2">VilleIdéale</div>
      <p className="text-muted-foreground text-sm font-body">
        Découvrez et notez les villes de France · © {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
