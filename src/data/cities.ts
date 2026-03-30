export type CityRating = {
  id: string;
  name: string;
  department: string;
  region: string;
  overallScore: number;
  totalRatings: number;
  scores: {
    environment: number;
    transport: number;
    security: number;
    health: number;
    sports: number;
    culture: number;
    education: number;
    shops: number;
    quality: number;
  };
  image: string;
};

export const categories = [
  { key: "environment", label: "Environnement", lucideIcon: "TreePine" },
  { key: "transport", label: "Transports", lucideIcon: "TrainFront" },
  { key: "security", label: "Sécurité", lucideIcon: "ShieldCheck" },
  { key: "health", label: "Santé", lucideIcon: "HeartPulse" },
  { key: "sports", label: "Sports & Loisirs", lucideIcon: "Dumbbell" },
  { key: "culture", label: "Culture", lucideIcon: "Palette" },
  { key: "education", label: "Éducation", lucideIcon: "GraduationCap" },
  { key: "shops", label: "Commerces", lucideIcon: "ShoppingBag" },
  { key: "quality", label: "Qualité de vie", lucideIcon: "Sparkles" },
] as const;

export const topCities: CityRating[] = [
  {
    id: "antony",
    name: "Antony",
    department: "Hauts-de-Seine (92)",
    region: "Île-de-France",
    overallScore: 8.27,
    totalRatings: 210,
    scores: { environment: 8.5, transport: 8.8, security: 8.0, health: 8.2, sports: 7.9, culture: 8.1, education: 8.6, shops: 8.4, quality: 8.5 },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
  },
  {
    id: "sceaux",
    name: "Sceaux",
    department: "Hauts-de-Seine (92)",
    region: "Île-de-France",
    overallScore: 8.21,
    totalRatings: 156,
    scores: { environment: 9.0, transport: 7.8, security: 8.5, health: 7.9, sports: 8.0, culture: 8.4, education: 8.7, shops: 7.6, quality: 8.8 },
    image: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600&q=80",
  },
  {
    id: "aix-les-bains",
    name: "Aix-les-Bains",
    department: "Savoie (73)",
    region: "Auvergne-Rhône-Alpes",
    overallScore: 8.20,
    totalRatings: 189,
    scores: { environment: 9.2, transport: 6.8, security: 8.3, health: 8.0, sports: 9.0, culture: 7.5, education: 7.8, shops: 7.4, quality: 9.1 },
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: "angers",
    name: "Angers",
    department: "Maine-et-Loire (49)",
    region: "Pays de la Loire",
    overallScore: 7.84,
    totalRatings: 200,
    scores: { environment: 8.2, transport: 7.5, security: 7.3, health: 7.8, sports: 8.0, culture: 8.5, education: 8.1, shops: 7.6, quality: 8.0 },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  },
  {
    id: "paris-15",
    name: "Paris 15e",
    department: "Paris (75)",
    region: "Île-de-France",
    overallScore: 7.57,
    totalRatings: 170,
    scores: { environment: 6.8, transport: 9.2, security: 7.0, health: 8.5, sports: 7.2, culture: 9.0, education: 8.8, shops: 9.1, quality: 7.0 },
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80",
  },
  {
    id: "tours",
    name: "Tours",
    department: "Indre-et-Loire (37)",
    region: "Centre-Val de Loire",
    overallScore: 6.77,
    totalRatings: 200,
    scores: { environment: 7.2, transport: 6.8, security: 5.9, health: 7.0, sports: 6.5, culture: 7.8, education: 7.5, shops: 7.0, quality: 6.8 },
    image: "https://images.unsplash.com/photo-1568684333877-4d39f2c709a8?w=600&q=80",
  },
];

export const allCities: CityRating[] = [
  ...topCities,
  {
    id: "lyon",
    name: "Lyon",
    department: "Rhône (69)",
    region: "Auvergne-Rhône-Alpes",
    overallScore: 7.12,
    totalRatings: 350,
    scores: { environment: 7.0, transport: 8.0, security: 6.2, health: 7.8, sports: 7.5, culture: 8.5, education: 8.0, shops: 8.2, quality: 7.0 },
    image: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=600&q=80",
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    department: "Gironde (33)",
    region: "Nouvelle-Aquitaine",
    overallScore: 7.35,
    totalRatings: 280,
    scores: { environment: 7.8, transport: 7.2, security: 6.5, health: 7.5, sports: 7.8, culture: 8.2, education: 7.9, shops: 7.8, quality: 7.6 },
    image: "https://images.unsplash.com/photo-1560983073-c29bff7438ef?w=600&q=80",
  },
  {
    id: "nantes",
    name: "Nantes",
    department: "Loire-Atlantique (44)",
    region: "Pays de la Loire",
    overallScore: 7.48,
    totalRatings: 245,
    scores: { environment: 7.9, transport: 7.5, security: 6.8, health: 7.6, sports: 7.8, culture: 8.0, education: 8.2, shops: 7.5, quality: 7.8 },
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
  },
  {
    id: "strasbourg",
    name: "Strasbourg",
    department: "Bas-Rhin (67)",
    region: "Grand Est",
    overallScore: 7.22,
    totalRatings: 190,
    scores: { environment: 7.8, transport: 8.2, security: 6.0, health: 7.5, sports: 7.0, culture: 8.5, education: 8.3, shops: 7.2, quality: 7.2 },
    image: "https://images.unsplash.com/photo-1574618364789-eb0de789ef3f?w=600&q=80",
  },
];
