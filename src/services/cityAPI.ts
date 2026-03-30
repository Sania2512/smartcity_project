/**
 * API Service - Consomme l'API backend
 * Remplace les données mockées statiques
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class CityAPI {
  async getAllCities() {
    const response = await fetch(`${API_BASE_URL}/api/cities`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return response.json();
  }

  async getTopCities() {
    const response = await fetch(`${API_BASE_URL}/api/cities/top`);
    if (!response.ok) throw new Error('Failed to fetch top cities');
    return response.json();
  }

  async getCityById(id) {
    const response = await fetch(`${API_BASE_URL}/api/cities/${id}`);
    if (!response.ok) throw new Error('City not found');
    return response.json();
  }

  async searchCities(query) {
    if (query.length < 2) return [];
    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }

  async submitRating(cityId, scores, comment = '') {
    const response = await fetch(`${API_BASE_URL}/api/cities/${cityId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, comment })
    });
    if (!response.ok) throw new Error('Failed to submit rating');
    return response.json();
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new CityAPI();
