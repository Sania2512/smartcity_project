import { useState, useEffect } from "react";
import HeroSearch from "@/components/HeroSearch";
import TopCities from "@/components/TopCities";
import CategoryOverview from "@/components/CategoryOverview";
import CityDetail from "@/components/CityDetail";
import Footer from "@/components/Footer";
import cityAPI from "@/services/cityAPI";
import type { CityRating } from "@/data/cities";

const Index = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [allCities, setAllCities] = useState<CityRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoading(true);
        const cities = await cityAPI.getAllCities();
        setAllCities(cities);
        setError(null);
      } catch (err) {
        console.error("Failed to load cities:", err);
        setError("Failed to load cities. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  const selectedCity = allCities.find(c => c.id === selectedCityId) || null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-muted-foreground">Make sure the backend API is running on http://localhost:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSearch onCitySelect={setSelectedCityId} cities={allCities} />
      <TopCities onCitySelect={setSelectedCityId} cities={allCities} loading={loading} />
      <CategoryOverview />
      <Footer />
      <CityDetail city={selectedCity} onClose={() => setSelectedCityId(null)} />
    </div>
  );
};

export default Index;
