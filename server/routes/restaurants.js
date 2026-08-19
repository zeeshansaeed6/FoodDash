// ============================================================
// Restaurant & Menu Router (Dynamic Per Location)
// ============================================================
import express from 'express';
import { generateRestaurantsForCity, categories, offers, db } from '../db.js';

const router = express.Router();

// In-memory city restaurant cache
const cityCache = new Map();

function getRestaurantsForLocation(cityId = 'bangalore', cityName = 'Bangalore', area = '') {
  const key = `${cityId}_${cityName}_${area}`;
  if (!cityCache.has(key)) {
    const list = generateRestaurantsForCity(cityId, cityName, area);
    cityCache.set(key, list);
  }
  const baseList = cityCache.get(key);
  const custom = db.getCustomRestaurants().filter(r => 
    r.cityId === cityId || r.cityName.toLowerCase() === cityName.toLowerCase() || cityId === 'all'
  );
  return [...custom, ...baseList];
}

// 1. Get Restaurants (with full multi-parameter filtering & search)
router.get('/', (req, res) => {
  const {
    cityId = 'bangalore',
    cityName = 'Bangalore',
    area = '',
    search = '',
    category = '',
    vegOnly = 'false',
    offersOnly = 'false',
    fastOnly = 'false',
    minRating = '0',
    maxPrice = '9999',
    sort = 'relevance'
  } = req.query;

  let list = [...getRestaurantsForLocation(cityId, cityName, area)];

  // Text search query
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some(c => c.toLowerCase().includes(q)) ||
      Object.values(r.menu).some(section =>
        section.some(item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
      )
    );
  }

  // Category filter
  if (category) {
    list = list.filter(r => r.categories.includes(category));
  }

  // Veg only
  if (vegOnly === 'true') {
    list = list.filter(r => r.isVeg);
  }

  // Offers only
  if (offersOnly === 'true') {
    list = list.filter(r => Boolean(r.offer));
  }

  // Fast delivery only
  if (fastOnly === 'true') {
    list = list.filter(r => parseInt(r.deliveryTime) <= 20);
  }

  // Rating
  const ratingNum = parseFloat(minRating);
  if (ratingNum > 0) {
    list = list.filter(r => r.rating >= ratingNum);
  }

  // Max price
  const priceNum = parseInt(maxPrice);
  if (priceNum < 9999) {
    list = list.filter(r => r.priceForTwo <= priceNum);
  }

  // Sort
  switch (sort) {
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'delivery':
      list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      break;
    case 'costLow':
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
      break;
    case 'costHigh':
      list.sort((a, b) => b.priceForTwo - a.priceForTwo);
      break;
    default:
      break;
  }

  res.json({
    success: true,
    location: { cityId, cityName, area },
    count: list.length,
    restaurants: list
  });
});

// 2. Get Restaurant by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { cityId = 'bangalore', cityName = 'Bangalore', area = '' } = req.query;

  const list = getRestaurantsForLocation(cityId, cityName, area);
  const restaurant = list.find(r => r.id === parseInt(id));

  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  res.json({
    success: true,
    restaurant
  });
});

// 3. Get Categories
router.get('/meta/categories', (req, res) => {
  res.json({ success: true, categories });
});

// 5. Merchant: Register New Restaurant
router.post('/', (req, res) => {
  const { name, cuisines, cityName, cityId, area, priceForTwo, deliveryTime, deliveryFee, offer, image, isVeg } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Restaurant name is required' });
  }

  const restaurant = db.addRestaurant({
    name,
    cuisines,
    cityName: cityName || 'Bangalore',
    cityId: cityId || (cityName ? cityName.toLowerCase().replace(/\s+/g, '_') : 'bangalore'),
    area: area || 'Downtown',
    priceForTwo: priceForTwo || 400,
    deliveryTime: deliveryTime || '25-30 min',
    deliveryFee: deliveryFee || 0,
    offer: offer || '20% OFF',
    image: image || '/images/rest1.jpg',
    isVeg: Boolean(isVeg)
  });

  res.status(201).json({
    success: true,
    message: 'Restaurant registered successfully!',
    restaurant
  });
});

// 6. Merchant: Add Dish / Menu Item to Restaurant
router.post('/:id/menu', (req, res) => {
  const { id } = req.params;
  const { category = 'Recommended', name, price, desc, isVeg, isBestseller, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Dish name and price are required' });
  }

  const result = db.addMenuItem(id, category, {
    name,
    price: parseInt(price),
    desc,
    isVeg: Boolean(isVeg),
    isBestseller: Boolean(isBestseller),
    image: image || '/images/rest2.jpg'
  });

  res.json({
    success: true,
    message: 'Dish added to restaurant menu!',
    item: result.item
  });
});

// 7. Merchant: Delete Dish
router.delete('/:id/menu/:itemId', (req, res) => {
  const { id, itemId } = req.params;
  const success = db.deleteMenuItem(id, itemId);
  res.json({ success, message: success ? 'Dish deleted' : 'Could not delete dish' });
});

// 8. Reviews: Get restaurant customer reviews
router.get('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const reviews = db.getReviewsForRestaurant(id);
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 4.5;

  res.json({
    success: true,
    restaurantId: parseInt(id),
    averageRating: parseFloat(avgRating),
    count: reviews.length,
    reviews
  });
});

// 9. Reviews: Post a new customer review
router.post('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment, dishes } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required' });
  }

  const review = db.addReview(id, { userName, rating, comment, dishes });
  res.status(201).json({
    success: true,
    message: 'Review posted successfully!',
    review
  });
});

// 10. Favorites: Get all favorite restaurant IDs
router.get('/user/favorites', (req, res) => {
  const userKey = req.session?.userId || 'guest';
  const favorites = db.getFavorites(userKey);
  res.json({ success: true, favorites });
});

// 11. Favorites: Toggle favorite restaurant
router.post('/user/favorites/:id', (req, res) => {
  const { id } = req.params;
  const userKey = req.session?.userId || 'guest';
  const result = db.toggleFavorite(userKey, id);
  res.json({ success: true, ...result });
});

// 12. Merchant: Get all merchant restaurants
router.get('/merchant/all', (req, res) => {
  res.json({
    success: true,
    restaurants: db.getCustomRestaurants()
  });
});

// 13. Merchant: Get Outlet Operational Settings (Cooking Time, Surge, Kitchen Status)
router.get('/:id/settings', (req, res) => {
  try {
    const settings = db.getOutletSettings(req.params.id);
    res.json({
      success: true,
      restaurantId: req.params.id,
      settings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve outlet settings' });
  }
});

// 14. Merchant: Update Outlet Operational Settings
router.put('/:id/settings', (req, res) => {
  try {
    const updated = db.updateOutletSettings(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Outlet operational settings updated successfully',
      settings: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update outlet settings' });
  }
});

// 15. Merchant: Toggle Menu Item In-Stock / Sold-Out Live Status
router.put('/:id/stock', (req, res) => {
  try {
    const { itemId, isOutOfStock } = req.body;
    if (itemId === undefined) {
      return res.status(400).json({ success: false, message: 'itemId is required' });
    }
    const updated = db.toggleItemStock(req.params.id, itemId, Boolean(isOutOfStock));
    res.json({
      success: true,
      message: isOutOfStock ? 'Item marked as Out of Stock (86\'d)' : 'Item restored to In Stock',
      settings: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle item stock' });
  }
});

// 16. Merchant: Kitchen Revenue, Order Volume & Performance Analytics
router.get('/:id/analytics', (req, res) => {
  try {
    const analytics = db.getRestaurantAnalytics(req.params.id);
    res.json(analytics);
  } catch (err) {
    console.error('Error computing analytics:', err);
    res.status(500).json({ success: false, message: 'Failed to compute kitchen analytics' });
  }
});

export default router;

