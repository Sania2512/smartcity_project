import { useState } from "react";
import HeroSearch from "@/components/HeroSearch";
import TopCities from "@/components/TopCities";
import CategoryOverview from "@/components/CategoryOverview";
import CityDetail from "@/components/CityDetail";
import Footer from "@/components/Footer";
import { allCities } from "@/data/cities";

const Index = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const selectedCity = allCities.find(c => c.id === selectedCityId) || null;

  return (
    <div className="min-h-screen">
      <HeroSearch onCitySelect={setSelectedCityId} />
      <TopCities onCitySelect={setSelectedCityId} />
      <CategoryOverview />
      <Footer />
      <CityDetail city={selectedCity} onClose={() => setSelectedCityId(null)} />
    </div>
  );
};

export default Index;
