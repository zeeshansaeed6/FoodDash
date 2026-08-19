// ============================================================
// Location Router — Universal Multi-City & Global Search Engine
// ============================================================
import express from 'express';
import { cities } from '../db.js';

const router = express.Router();

// 1. Get List of Popular Cities
router.get('/', (req, res) => {
  res.json({
    success: true,
    cities: cities.map(c => ({
      id: c.id,
      name: c.name,
      state: c.state,
      country: c.country,
      areas: c.areas
    }))
  });
});

// 2. Search Any Location, City, Locality or Landmark Worldwide
router.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, results: [] });
  }

  const results = [];

  // Match known cities & areas
  cities.forEach(city => {
    if (city.name.toLowerCase().includes(query) || city.state.toLowerCase().includes(query)) {
      results.push({
        id: `city_${city.id}`,
        cityId: city.id,
        cityName: city.name,
        title: `${city.name}, ${city.state}`,
        subtitle: `${city.country} • Popular food hub`,
        type: 'city'
      });
    }

    city.areas.forEach(area => {
      if (area.toLowerCase().includes(query)) {
        results.push({
          id: `area_${city.id}_${area.toLowerCase().replace(/\s+/g, '_')}`,
          cityId: city.id,
          cityName: city.name,
          title: `${area}, ${city.name}`,
          subtitle: `${city.state}, ${city.country}`,
          type: 'area'
        });
      }
    });
  });

  // If user entered a custom location not in preset list, dynamically support it!
  if (results.length === 0 || !results.some(r => r.title.toLowerCase().includes(query))) {
    const capitalized = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    results.unshift({
      id: `custom_${Date.now()}`,
      cityId: 'custom',
      cityName: capitalized,
      title: capitalized,
      subtitle: 'Custom delivery address',
      type: 'custom'
    });
  }

  res.json({
    success: true,
    query,
    count: results.length,
    results: results.slice(0, 10)
  });
});

// 3. Auto-Detect Current Location (Simulated GPS / GeoIP)
router.get('/detect', (req, res) => {
  res.json({
    success: true,
    location: {
      cityId: 'bangalore',
      cityName: 'Bangalore',
      area: 'Koramangala 4th Block',
      title: 'Koramangala 4th Block, Bangalore',
      coords: { lat: 12.9352, lng: 77.6245 }
    }
  });
});

export default router;
