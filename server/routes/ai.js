// ============================================================
// FoodDash — AI Food Concierge & Natural Language Search API
// ============================================================
import express from 'express';
import { generateRestaurantsForCity, db } from '../db.js';

const router = express.Router();

// Natural Language AI Concierge query processing
router.post('/concierge', (req, res) => {
  try {
    const { prompt = '', cityId = 'bangalore', cityName = 'Bangalore', area = '' } = req.body;
    const cleanPrompt = (prompt || '').toLowerCase().trim();

    if (!cleanPrompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required' });
    }

    // Retrieve all restaurants in current city
    const baseRestaurants = generateRestaurantsForCity(cityId, cityName, area);
    const customRestaurants = db.getCustomRestaurants().filter(r =>
      r.cityId === cityId || r.cityName?.toLowerCase() === cityName.toLowerCase() || cityId === 'all'
    );
    const allRestaurants = [...customRestaurants, ...baseRestaurants];

    // Detect Intent Attributes
    const isVegQuery = cleanPrompt.includes('veg') || cleanPrompt.includes('vegetarian') || cleanPrompt.includes('jain') || cleanPrompt.includes('paneer') || cleanPrompt.includes('salad');
    const isFastQuery = cleanPrompt.includes('fast') || cleanPrompt.includes('quick') || cleanPrompt.includes('urgent') || cleanPrompt.includes('20 min') || cleanPrompt.includes('express');
    const isBudgetQuery = cleanPrompt.includes('cheap') || cleanPrompt.includes('budget') || cleanPrompt.includes('under') || cleanPrompt.includes('less than');
    
    // Extract budget limit if present (e.g. "under 300" / "under 500")
    const priceMatch = cleanPrompt.match(/under\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) || cleanPrompt.match(/(\d+)\s*(?:rs|rupees|bucks)/i);
    const budgetLimit = priceMatch ? parseInt(priceMatch[1]) : 9999;

    // Detect Cuisines
    const cuisines = [
      { key: 'biryani', label: 'Biryani' },
      { key: 'pizza', label: 'Pizza' },
      { key: 'burger', label: 'Burgers' },
      { key: 'italian', label: 'Italian' },
      { key: 'chinese', label: 'Chinese' },
      { key: 'north indian', label: 'North Indian' },
      { key: 'south indian', label: 'South Indian' },
      { key: 'dosa', label: 'South Indian' },
      { key: 'sushi', label: 'Japanese' },
      { key: 'dessert', label: 'Desserts' },
      { key: 'ice cream', label: 'Desserts' },
      { key: 'cake', label: 'Bakery' },
      { key: 'kebab', label: 'Mughlai & Grills' },
      { key: 'healthy', label: 'Healthy Food' },
      { key: 'salad', label: 'Salads & Bowls' }
    ];

    const matchedCuisines = cuisines.filter(c => cleanPrompt.includes(c.key)).map(c => c.label);

    // Search and rank matching dishes across all restaurants
    const matchingDishes = [];
    const matchingRestaurants = [];

    allRestaurants.forEach(rest => {
      let restScore = 0;

      // Check cuisine match
      if (matchedCuisines.length > 0) {
        if (rest.cuisines.some(c => matchedCuisines.includes(c))) restScore += 5;
      }

      if (isVegQuery && rest.isVeg) restScore += 3;
      if (isFastQuery && parseInt(rest.deliveryTime) <= 25) restScore += 3;
      if (rest.rating >= 4.5) restScore += 2;

      // Scan menu items
      Object.entries(rest.menu || {}).forEach(([category, items]) => {
        (items || []).forEach(item => {
          let itemScore = 0;
          const itemName = item.name.toLowerCase();
          const itemDesc = (item.desc || '').toLowerCase();

          // Direct keyword match in dish title
          const promptTokens = cleanPrompt.split(/\s+/).filter(t => t.length > 2);
          promptTokens.forEach(token => {
            if (itemName.includes(token)) itemScore += 4;
            if (itemDesc.includes(token)) itemScore += 2;
          });

          if (isVegQuery && item.isVeg) itemScore += 2;
          if (item.price <= budgetLimit) itemScore += 2;
          if (item.isBestseller) itemScore += 1;

          if (itemScore >= 3 || (matchedCuisines.length > 0 && restScore > 0 && item.price <= budgetLimit)) {
            matchingDishes.push({
              dish: item,
              restaurant: {
                id: rest.id,
                name: rest.name,
                rating: rest.rating,
                deliveryTime: rest.deliveryTime,
                image: rest.image,
                area: rest.area || cityName
              },
              score: itemScore + restScore
            });
          }
        });
      });

      if (restScore >= 3) {
        matchingRestaurants.push(rest);
      }
    });

    // Sort dishes by relevance score
    matchingDishes.sort((a, b) => b.score - a.score);
    const topDishes = matchingDishes.slice(0, 6);

    // Generate Natural Language Conversational Response
    let aiMessage = '';
    if (topDishes.length > 0) {
      const topDish = topDishes[0];
      const restCount = new Set(topDishes.map(d => d.restaurant.id)).size;
      aiMessage = `I found ${topDishes.length} delicious options matching "${prompt}". Top recommendation is ${topDish.dish.name} (₹${topDish.dish.price}) from ${topDish.restaurant.name}, delivered in ${topDish.restaurant.deliveryTime}!`;
    } else {
      aiMessage = `I searched restaurants in ${cityName} for "${prompt}". Here are some popular top-rated dishes you might love right now!`;
      // Fallback to top rated dishes
      allRestaurants.slice(0, 3).forEach(rest => {
        const firstCategory = Object.values(rest.menu || {})[0] || [];
        if (firstCategory[0]) {
          topDishes.push({
            dish: firstCategory[0],
            restaurant: { id: rest.id, name: rest.name, rating: rest.rating, deliveryTime: rest.deliveryTime, image: rest.image, area: rest.area },
            score: 1
          });
        }
      });
    }

    res.json({
      success: true,
      query: prompt,
      aiMessage,
      topDishes,
      recommendedRestaurants: matchingRestaurants.slice(0, 4),
      tags: {
        isVeg: isVegQuery,
        budgetLimit: budgetLimit < 9999 ? `₹${budgetLimit}` : null,
        cuisines: matchedCuisines
      }
    });

  } catch (err) {
    console.error('Error processing AI concierge query:', err);
    res.status(500).json({ success: false, message: 'AI Concierge could not process your query' });
  }
});

export default router;
