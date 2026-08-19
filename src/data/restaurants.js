// ============================================================
// FoodDash — Rich Mock Restaurant & Menu Data
// ============================================================

export const categories = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'chinese', name: 'Chinese', icon: '🥡' },
  { id: 'momos', name: 'Momos & Dim Sum', icon: '🥟' },
  { id: 'sushi', name: 'Sushi & Asian', icon: '🍣' },
  { id: 'shawarma', name: 'Shawarma & Rolls', icon: '🌯' },
  { id: 'pasta', name: 'Pasta & Italian', icon: '🍝' },
  { id: 'shakes', name: 'Shakes & Smoothies', icon: '🥤' },
  { id: 'mexican', name: 'Tacos & Mexican', icon: '🌮' },
  { id: 'street-food', name: 'Chaat & Street Food', icon: '🍛' },
  { id: 'bakery', name: 'Bakery & Waffles', icon: '🧇' },
  { id: 'desserts', name: 'Desserts & Sweets', icon: '🍰' },
  { id: 'south-indian', name: 'South Indian', icon: '🥘' },
  { id: 'thali', name: 'Thali & Meals', icon: '🍱' },
  { id: 'north-indian', name: 'North Indian', icon: '🫓' },
  { id: 'bbq', name: 'BBQ & Grills', icon: '🍗' },
  { id: 'ice-cream', name: 'Ice Cream', icon: '🍦' },
  { id: 'coffee', name: 'Café & Coffee', icon: '☕' },
  { id: 'healthy', name: 'Healthy Bowls', icon: '🥗' },
];

export const offers = [
  { code: 'WELCOME50', title: 'Flat ₹150 OFF', desc: 'On your first order above ₹299', color: 'purple' },
  { code: 'FREEDEL', title: 'Free Delivery', desc: 'No delivery charges on orders above ₹199', color: 'red' },
  { code: 'TASTY20', title: '20% OFF up to ₹120', desc: 'Valid on selected restaurants', color: 'green' },
  { code: 'PARTY40', title: '40% OFF up to ₹200', desc: 'On orders above ₹599 — party time!', color: 'orange' },
];

export const collections = [
  { id: 'dine-in', title: 'Table Booking', subtitle: 'Reserve seats & dine in style', icon: '🍽️', filter: r => true },
  { id: 'best-rated', title: 'Best Rated', subtitle: 'Top-rated places near you', icon: '⭐', filter: r => r.rating >= 4.4 },
  { id: 'budget-eats', title: 'Budget Eats', subtitle: 'Under ₹300 for two', icon: '💰', filter: r => r.priceForTwo <= 300 },
  { id: 'new-arrivals', title: 'New on FoodDash', subtitle: 'Just launched near you', icon: '🆕', filter: r => r.isNew },
  { id: 'quick-bites', title: 'Quick Bites', subtitle: 'Delivered in under 20 min', icon: '⚡', filter: r => parseInt(r.deliveryTime) <= 20 },
];

import { getFoodImage, getRestaurantCoverImage } from '../utils/foodImages.js';
import { HYDERABAD_FULL_RESTAURANTS, TOP_BRAND_CHAINS_FULL } from '../../server/fullMenusData.js';

const IMG = '/images';

let idGen = 10;
const formattedHyderabad = HYDERABAD_FULL_RESTAURANTS.map(r => ({
  id: idGen++,
  name: r.name,
  cuisines: r.cuisines,
  rating: r.rating,
  ratingCount: r.ratingCount,
  deliveryTime: r.deliveryTime,
  distance: "1.5 km",
  priceForTwo: r.priceForTwo,
  deliveryFee: r.deliveryFee,
  offer: r.offer,
  image: r.image,
  isVeg: r.isVeg,
  isPromoted: r.isPromoted,
  isNew: r.isNew,
  categories: r.categories,
  address: `${r.area}, Hyderabad`,
  menu: r.menu
}));

const formattedChains = TOP_BRAND_CHAINS_FULL.map(r => ({
  id: idGen++,
  name: r.namePrefix,
  cuisines: r.cuisines,
  rating: r.rating,
  ratingCount: r.ratingCount,
  deliveryTime: r.deliveryTime,
  distance: "1.0 km",
  priceForTwo: r.priceForTwo,
  deliveryFee: r.deliveryFee,
  offer: r.offer,
  image: r.image,
  isVeg: r.isVeg,
  isPromoted: r.isPromoted,
  isNew: r.isNew,
  categories: r.categories,
  address: `City Center Mall & Outlets`,
  menu: r.menu
}));

const rawRestaurants = [
  ...formattedHyderabad,
  ...formattedChains,
  {
    id: 1, name: "Meghana Foods", cuisines: ["Andhra", "Biryani", "South Indian", "Chicken"], rating: 4.7, ratingCount: 42000,
    deliveryTime: "20-30 min", distance: "1.2 km", priceForTwo: 500, deliveryFee: 0, offer: "FLAT ₹150 OFF",
    image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false, categories: ['biryani', 'south-indian', 'north-indian'],
    address: "123, 5th Cross, Koramangala 5th Block, Bangalore",
    menu: {
      "Legendary Andhra Biryanis": [
        { id: 101, name: "Meghana Special Chicken Biryani", price: 340, desc: "Aromatic basmati rice topped with fiery boneless Andhra chicken fry & spiced gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 102, name: "Meghana Paneer Biryani", price: 290, desc: "Fragrant rice layered with tender paneer cubes tossed in spicy green chili paste", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 103, name: "Andhra Chilli Chicken (Dry)", price: 310, desc: "Iconic green-chili spiced crispy chicken with onions and curry leaves", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 104, name: "Chicken 555", price: 320, desc: "Crispy fried chicken tossed in rich creamy garlic sauce and cashews", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Starters & Breads": [
        { id: 105, name: "Paneer 65", price: 250, desc: "Marinated cottage cheese cubes tossed in spicy yogurt curd temper", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 106, name: "Butter Naan", price: 65, desc: "Fluffy leavened tandoor bread brushed with melted butter", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ]
    }
  },
  {
    id: 2, name: "Vidyarthi Bhavan 1943", cuisines: ["South Indian", "Breakfast", "Filter Coffee"], rating: 4.8, ratingCount: 38000,
    deliveryTime: "15-25 min", distance: "0.8 km", priceForTwo: 200, deliveryFee: 0, offer: "HERITAGE ICONIC",
    image: `${IMG}/rest5.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['south-indian', 'healthy'],
    address: "32, Gandhi Bazaar, Basavanagudi, Bangalore",
    menu: {
      "Heritage South Indian": [
        { id: 201, name: "Legendary Crispy Masala Dosa", price: 95, desc: "Thick golden crispy dosa roasted in pure desi ghee with spicy potato filling", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 202, name: "Ghee Rava Vada (2 pcs)", price: 75, desc: "Crunchy semolina fritters with coconut chutney and piping hot sambar", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 203, name: "Authentic Filter Coffee", price: 45, desc: "Rich and frothy traditional South Indian decoction coffee", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 204, name: "Kesari Bath (Pineapple Sweet)", price: 60, desc: "Semolina pudding cooked with real saffron, ghee, and cashew nuts", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` }
      ]
    }
  },
  {
    id: 3, name: "Truffles Burger & Cafe", cuisines: ["American", "Burgers", "Pasta", "Desserts"], rating: 4.6, ratingCount: 49000,
    deliveryTime: "20-30 min", distance: "1.5 km", priceForTwo: 450, deliveryFee: 0, offer: "20% OFF ON COMBOS",
    image: `${IMG}/rest3.jpg`, isVeg: false, isPromoted: true, isNew: false, categories: ['burgers', 'desserts', 'pizza'],
    address: "28, St. Marks Road, Bangalore",
    menu: {
      "Monster Burgers": [
        { id: 301, name: "All American Cheese Burger", price: 240, desc: "Grilled double patty loaded with cheddar, lettuce, onions, and secret relish", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 302, name: "Peri Peri Chicken Burger", price: 230, desc: "Crispy fried fillet dusted in fiery peri peri seasoning with garlic mayo", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 303, name: "Peri Peri Cheesy Fries", price: 150, desc: "Golden fries drenched in warm jalapeño cheese and peri peri seasoning", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 304, name: "Ferrero Rocher Thick Shake", price: 190, desc: "Rich chocolate hazelnut milkshake topped with whipped cream and crushed nuts", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    id: 4, name: "Empire Restaurant", cuisines: ["North Indian", "Mughlai", "Biryani", "Kebabs"], rating: 4.5, ratingCount: 31000,
    deliveryTime: "20-30 min", distance: "1.8 km", priceForTwo: 500, deliveryFee: 0, offer: "LATE NIGHT SPECIAL",
    image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['north-indian', 'biryani'],
    address: "36, Church Street, Bangalore",
    menu: {
      "Empire Classics": [
        { id: 401, name: "Empire Special Ghee Rice with Chicken Kebab", price: 299, desc: "Fragrant basmati ghee rice served with 4 pcs signature red chicken kebabs and gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 402, name: "Empire Butter Chicken", price: 320, desc: "Velvety butter chicken in rich cashew-tomato gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 403, name: "Kerala Parotta (2 pcs)", price: 60, desc: "Layered flaky parotta cooked on tawa with butter", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ]
    }
  },
  {
    id: 5, name: "Corner House Ice Cream", cuisines: ["Ice Cream", "Desserts", "Sundaes"], rating: 4.9, ratingCount: 52000,
    deliveryTime: "15-20 min", distance: "0.9 km", priceForTwo: 300, deliveryFee: 0, offer: "BUY 1 GET 1 SUNDAE",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: true, isNew: false, categories: ['desserts', 'ice-cream'],
    address: "4, Residency Road, Bangalore",
    menu: {
      "Signature Sundaes": [
        { id: 501, name: "Death By Chocolate (DBC)", price: 240, desc: "Warm gooey chocolate fudge cake topped with vanilla ice cream, hot chocolate fudge, and roasted peanuts", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 502, name: "Hot Fudge Sundae", price: 180, desc: "Triple scoop vanilla ice cream swimming in thick bubbling hot fudge sauce", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 503, name: "Brownie Bomb Sundae", price: 210, desc: "Fudge brownie with chocolate sauce and vanilla cream", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    id: 6, name: "Toit Brewpub & Kitchen", cuisines: ["Italian", "Pizza", "Continental", "Finger Food"], rating: 4.8, ratingCount: 36000,
    deliveryTime: "25-35 min", distance: "2.4 km", priceForTwo: 800, deliveryFee: 25, offer: "15% OFF ON WOODFIRED PIZZAS",
    image: `${IMG}/rest2.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['pizza', 'healthy'],
    address: "298, 100ft Road, Indiranagar, Bangalore",
    menu: {
      "Wood-Fired Pizzas": [
        { id: 601, name: "Toit Tintin Wood-Fired Margherita", price: 380, desc: "Fresh basil, buffalo mozzarella, and San Marzano tomato reduction on hand-tossed dough", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 602, name: "BBQ Smoked Chicken Pizza", price: 440, desc: "Hickory smoked chicken, caramelised onions, and jalapeños", isVeg: false, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 603, name: "Baked Cheesy Nachos Supreme", price: 260, desc: "Crispy corn tortillas loaded with salsa, sour cream, and molten cheese", isVeg: true, isBestseller: false, image: `${IMG}/rest2.jpg` }
      ]
    }
  },
  {
    id: 4, name: "Dragon Wok", cuisines: ["Chinese", "Thai", "Asian"], rating: 4.4, ratingCount: 1560,
    deliveryTime: "30-35 min", distance: "2.1 km", priceForTwo: 550, deliveryFee: 35, offer: "30% OFF up to ₹150",
    image: `${IMG}/rest4.jpg`, isVeg: false, isPromoted: true, isNew: false, categories: ['chinese'],
    address: "201, 100ft Road, HSR Layout, Bangalore",
    menu: {
      "Chef's Specials": [
        { id: 401, name: "Dragon Chili Chicken", price: 290, desc: "Crispy chicken tossed in fiery dragon sauce with dried chilies", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 402, name: "Kung Pao Prawns", price: 380, desc: "Wok-tossed prawns with peanuts, dried chilies, and Sichuan pepper", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
      ],
      "Noodles & Rice": [
        { id: 403, name: "Hakka Noodles", price: 200, desc: "Stir-fried noodles with vegetables and Indo-Chinese spices", isVeg: true, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 404, name: "Schezwan Fried Rice", price: 220, desc: "Fiery fried rice with schezwan paste and mixed vegetables", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` },
        { id: 405, name: "Thai Basil Rice", price: 260, desc: "Fragrant jasmine rice with Thai basil and chili sauce", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` },
      ],
      "Dim Sums": [
        { id: 406, name: "Steamed Veg Momos", price: 160, desc: "Delicate steamed dumplings filled with seasoned vegetables", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` },
        { id: 407, name: "Chicken Dim Sum", price: 220, desc: "Crystal-skin dumplings with minced chicken filling", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 408, name: "Pan-Fried Gyoza", price: 240, desc: "Crispy bottom dumplings with pork and ginger", isVeg: false, isBestseller: false, image: `${IMG}/rest4.jpg` },
      ],
      "Soups": [
        { id: 409, name: "Hot & Sour Soup", price: 150, desc: "Spicy and tangy soup with tofu and mushrooms", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` },
        { id: 410, name: "Tom Yum Soup", price: 180, desc: "Thai lemongrass soup with prawns and galangal", isVeg: false, isBestseller: false, image: `${IMG}/rest4.jpg` },
      ],
    },
  },
  {
    id: 5, name: "Dosa Factory", cuisines: ["South Indian", "Dosa", "Idli"], rating: 4.6, ratingCount: 4120,
    deliveryTime: "20-25 min", distance: "1.5 km", priceForTwo: 250, deliveryFee: 10, offer: "₹100 OFF above ₹249",
    image: `${IMG}/rest5.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['south-indian'],
    address: "88, BTM Layout 2nd Stage, Bangalore",
    menu: {
      "Popular Dosas": [
        { id: 501, name: "Masala Dosa", price: 120, desc: "Crispy rice crepe filled with spiced potato masala, served with sambar & chutneys", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 502, name: "Mysore Masala Dosa", price: 140, desc: "Dosa with spicy red chutney spread and potato filling", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 503, name: "Rava Dosa", price: 130, desc: "Semolina-based crispy dosa with a unique lacy texture", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 504, name: "Paper Roast Dosa", price: 110, desc: "Extra thin and crispy plain dosa — the classic", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 505, name: "Cheese Dosa", price: 160, desc: "Dosa generously topped with melted cheese", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
      ],
      "Idli & Vada": [
        { id: 506, name: "Idli (3 pcs)", price: 80, desc: "Steamed rice cakes served with sambar and chutneys", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 507, name: "Medu Vada (2 pcs)", price: 90, desc: "Crispy urad dal fritters served with sambar and coconut chutney", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 508, name: "Mini Tiffin Combo", price: 150, desc: "2 idli + 1 vada + sambar + 3 chutneys", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
      ],
      "Beverages": [
        { id: 511, name: "Filter Coffee", price: 50, desc: "Traditional South Indian filter coffee in a steel tumbler", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 512, name: "Buttermilk", price: 40, desc: "Spiced, chilled buttermilk with curry leaves and ginger", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
      ],
    },
  },
  {
    id: 6, name: "Sweet Surrender", cuisines: ["Desserts", "Ice Cream", "Bakery"], rating: 4.7, ratingCount: 5200,
    deliveryTime: "15-20 min", distance: "0.6 km", priceForTwo: 300, deliveryFee: 0, offer: "BUY 1 GET 1 FREE",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['desserts', 'ice-cream'],
    address: "15, Residency Road, Bangalore",
    menu: {
      "Signature Desserts": [
        { id: 601, name: "Chocolate Lava Cake", price: 220, desc: "Warm molten chocolate cake with a gooey center, served with vanilla ice cream", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 602, name: "Gulab Jamun (4 pcs)", price: 120, desc: "Golden fried milk dumplings soaked in cardamom-rose syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 603, name: "Rasmalai (3 pcs)", price: 160, desc: "Soft paneer patties in saffron-cardamom flavored milk", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
      ],
      "Ice Cream": [
        { id: 604, name: "Belgian Chocolate Sundae", price: 199, desc: "Rich dark chocolate ice cream with brownie bits, fudge, and whipped cream", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
        { id: 605, name: "Mango Sorbet", price: 149, desc: "Fresh Alphonso mango sorbet — refreshing and dairy-free", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
      "Cakes & Pastries": [
        { id: 607, name: "Red Velvet Pastry", price: 140, desc: "Layered red velvet cake with cream cheese frosting", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
        { id: 608, name: "Tiramisu", price: 260, desc: "Italian classic with mascarpone, espresso, and cocoa", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
      ],
    },
  },
  {
    id: 7, name: "Royal Biryani House", cuisines: ["Biryani", "Mughlai", "Kebabs"], rating: 4.6, ratingCount: 6700,
    deliveryTime: "30-40 min", distance: "2.5 km", priceForTwo: 500, deliveryFee: 30, offer: "FLAT ₹200 OFF",
    image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: true, isNew: false, categories: ['biryani', 'north-indian'],
    address: "67, Jayanagar 4th Block, Bangalore",
    menu: {
      "Biryanis": [
        { id: 1201, name: "Lucknowi Chicken Biryani", price: 320, desc: "Fragrant dum biryani with saffron, kewra, and tender chicken", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1202, name: "Mutton Biryani", price: 380, desc: "Rich, flavorful biryani with succulent mutton pieces", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1203, name: "Paneer Biryani", price: 260, desc: "Aromatic vegetarian biryani with marinated paneer", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 1204, name: "Egg Biryani", price: 220, desc: "Classic egg biryani with boiled eggs in spiced rice", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
      ],
      "Kebabs": [
        { id: 1207, name: "Seekh Kebab (4 pcs)", price: 280, desc: "Minced lamb kebabs grilled on skewers with aromatic spices", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1208, name: "Galouti Kebab (4 pcs)", price: 340, desc: "Melt-in-mouth minced meat kebabs — a Lucknowi delicacy", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
      ],
      "Sides": [
        { id: 1205, name: "Boondi Raita", price: 60, desc: "Yogurt with crispy boondi pearls and spices", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 1206, name: "Mirchi Ka Salan", price: 100, desc: "Hyderabadi chili curry — the perfect biryani companion", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
      ],
    },
  },
  {
    id: 8, name: "Wrapster", cuisines: ["Rolls", "Wraps", "Fast Food"], rating: 4.0, ratingCount: 890,
    deliveryTime: "10-15 min", distance: "0.3 km", priceForTwo: 250, deliveryFee: 0, offer: "FLAT ₹100 OFF",
    image: `${IMG}/rest10.jpg`, isVeg: false, isPromoted: false, isNew: true, categories: ['rolls'],
    address: "3, 1st Main, Koramangala 6th Block, Bangalore",
    menu: {
      "Signature Rolls": [
        { id: 801, name: "Chicken Tikka Roll", price: 160, desc: "Juicy chicken tikka wrapped in flaky paratha with mint chutney and onions", isVeg: false, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 802, name: "Paneer Tikka Roll", price: 140, desc: "Grilled paneer wrapped with onions and green chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 803, name: "Egg Roll", price: 100, desc: "Classic Kolkata-style egg roll with onions and lemon", isVeg: false, isBestseller: false, image: `${IMG}/rest10.jpg` },
        { id: 804, name: "Double Chicken Roll", price: 200, desc: "Extra loaded with double chicken filling and cheese", isVeg: false, isBestseller: false, image: `${IMG}/rest10.jpg` },
      ],
      "Wraps": [
        { id: 805, name: "Falafel Wrap", price: 180, desc: "Crispy falafel with hummus, tahini, and fresh veggies in a tortilla", isVeg: true, isBestseller: false, image: `${IMG}/rest10.jpg` },
        { id: 806, name: "Shawarma Wrap", price: 190, desc: "Marinated chicken shawarma with garlic sauce and pickled turnip", isVeg: false, isBestseller: true, image: `${IMG}/rest10.jpg` },
      ],
    },
  },
  {
    id: 9, name: "Thali Express", cuisines: ["North Indian", "Thali", "Home Style"], rating: 4.3, ratingCount: 1480,
    deliveryTime: "25-30 min", distance: "1.0 km", priceForTwo: 400, deliveryFee: 20, offer: "20% OFF up to ₹100",
    image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['thali', 'north-indian'],
    address: "9, Bannerghatta Road, Bangalore",
    menu: {
      "Thalis": [
        { id: 901, name: "Rajasthani Thali", price: 299, desc: "Dal baati churma, gatte ki sabji, ker sangri, bajra roti, rice, 2 desserts", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 902, name: "Punjabi Non-Veg Thali", price: 399, desc: "Butter chicken, dal makhani, naan, rice, raita, salad, gulab jamun", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 903, name: "South Indian Thali", price: 249, desc: "Sambar, rasam, kootu, poriyal, rice, papad, payasam", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 904, name: "Gujarati Thali", price: 279, desc: "Dhokla, undhiyu, rotli, dal, rice, kadhi, shrikhand", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
      "Add-ons": [
        { id: 905, name: "Extra Roti (3 pcs)", price: 40, desc: "Fresh tandoori rotis", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 906, name: "Buttermilk", price: 30, desc: "Chilled spiced buttermilk", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
    },
  },
  {
    id: 10, name: "Brew & Bite Café", cuisines: ["Café", "Coffee", "Continental"], rating: 4.5, ratingCount: 2100,
    deliveryTime: "15-20 min", distance: "0.7 km", priceForTwo: 400, deliveryFee: 10, offer: "FREE COOKIE with coffee",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['coffee'],
    address: "101, Brigade Road, Bangalore",
    menu: {
      "Coffee": [
        { id: 1001, name: "Caramel Latte", price: 220, desc: "Smooth espresso with steamed milk and caramel drizzle", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1002, name: "Hazelnut Cappuccino", price: 200, desc: "Classic cappuccino with hazelnut flavor", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
        { id: 1003, name: "Cold Brew", price: 180, desc: "Slow-steeped 12-hour cold brew coffee with a smooth finish", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
      ],
      "Snacks": [
        { id: 1004, name: "Avocado Toast", price: 250, desc: "Sourdough toast with smashed avocado, cherry tomatoes, and microgreens", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1005, name: "French Croissant", price: 120, desc: "Buttery, flaky French croissant — freshly baked", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
    },
  },
  {
    id: 11, name: "Green Bowl", cuisines: ["Healthy", "Salads", "Bowls"], rating: 4.4, ratingCount: 780,
    deliveryTime: "20-25 min", distance: "1.3 km", priceForTwo: 450, deliveryFee: 20, offer: "15% OFF",
    image: `${IMG}/rest8.jpg`, isVeg: true, isPromoted: false, isNew: true, categories: ['healthy'],
    address: "55, Cunningham Road, Bangalore",
    menu: {
      "Bowls": [
        { id: 1101, name: "Quinoa Power Bowl", price: 320, desc: "Quinoa, roasted veggies, avocado, chickpeas, tahini dressing", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` },
        { id: 1102, name: "Teriyaki Tofu Bowl", price: 290, desc: "Grilled tofu with teriyaki glaze, edamame, and brown rice", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` },
      ],
      "Salads": [
        { id: 1103, name: "Caesar Salad", price: 250, desc: "Romaine lettuce, croutons, parmesan, classic Caesar dressing", isVeg: true, isBestseller: false, image: `${IMG}/rest8.jpg` },
        { id: 1104, name: "Mediterranean Bowl", price: 280, desc: "Falafel, hummus, tabbouleh, olives, and pita chips", isVeg: true, isBestseller: false, image: `${IMG}/rest8.jpg` },
      ],
      "Smoothies": [
        { id: 1105, name: "Green Detox", price: 180, desc: "Spinach, banana, apple, ginger, and chia seeds", isVeg: true, isBestseller: false, image: `${IMG}/rest8.jpg` },
        { id: 1106, name: "Berry Blast", price: 200, desc: "Mixed berries, yogurt, honey, and oats", isVeg: true, isBestseller: false, image: `${IMG}/rest8.jpg` },
      ],
    },
  },
  {
    id: 12, name: "Momo Hub", cuisines: ["Chinese", "Momos", "Tibetan"], rating: 4.0, ratingCount: 2300,
    deliveryTime: "15-20 min", distance: "0.9 km", priceForTwo: 200, deliveryFee: 0, offer: "₹50 OFF",
    image: `${IMG}/rest9.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['chinese'],
    address: "12, Lalbagh Road, Bangalore",
    menu: {
      "Steamed Momos": [
        { id: 1301, name: "Classic Chicken Momos (8 pcs)", price: 140, desc: "Steamed dumplings with seasoned chicken filling", isVeg: false, isBestseller: true, image: `${IMG}/rest9.jpg` },
        { id: 1302, name: "Veg Momos (8 pcs)", price: 110, desc: "Steamed vegetable dumplings with spicy red chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest9.jpg` },
      ],
      "Fried Momos": [
        { id: 1303, name: "Fried Chicken Momos", price: 160, desc: "Crispy fried momos with schezwan dip", isVeg: false, isBestseller: false, image: `${IMG}/rest9.jpg` },
        { id: 1304, name: "Tandoori Momos", price: 180, desc: "Momos grilled with tandoori marinade — smoky and spicy", isVeg: false, isBestseller: true, image: `${IMG}/rest9.jpg` },
      ],
      "Specials": [
        { id: 1305, name: "Kurkure Momos", price: 170, desc: "Extra crispy momos coated in crunchy cornflake batter", isVeg: true, isBestseller: false, image: `${IMG}/rest9.jpg` },
        { id: 1306, name: "Afghani Momos", price: 190, desc: "Creamy Afghani-style momos in white cashew sauce", isVeg: false, isBestseller: false, image: `${IMG}/rest9.jpg` },
      ],
    },
  },
  {
    id: 13, name: "Mumbai Street Kitchen", cuisines: ["Street Food", "Chaat", "Mumbai Style"], rating: 4.1, ratingCount: 3600,
    deliveryTime: "15-20 min", distance: "0.8 km", priceForTwo: 200, deliveryFee: 0, offer: "FLAT ₹50 OFF",
    image: `${IMG}/rest10.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['rolls'],
    address: "28, Commercial Street, Bangalore",
    menu: {
      "Chaat": [
        { id: 1901, name: "Pani Puri (8 pcs)", price: 80, desc: "Crispy puris filled with spicy tangy water, potato, and chickpeas", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 1902, name: "Bhel Puri", price: 90, desc: "Puffed rice mixed with chutneys, sev, onions, and tomatoes", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 1903, name: "Dahi Puri (6 pcs)", price: 110, desc: "Puris filled with potato, yogurt, and sweet chutney", isVeg: true, isBestseller: false, image: `${IMG}/rest10.jpg` },
      ],
      "Mumbai Specials": [
        { id: 1904, name: "Vada Pav", price: 50, desc: "Mumbai's iconic spiced potato fritter in a bun with garlic chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 1905, name: "Pav Bhaji", price: 130, desc: "Mashed vegetable curry with butter-toasted pav", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 1906, name: "Misal Pav", price: 120, desc: "Spicy sprouted moth bean curry with farsan and pav", isVeg: true, isBestseller: false, image: `${IMG}/rest10.jpg` },
      ],
    },
  },
  {
    id: 14, name: "The Waffle House", cuisines: ["Desserts", "Waffles", "Café"], rating: 4.3, ratingCount: 1200,
    deliveryTime: "20-25 min", distance: "1.1 km", priceForTwo: 350, deliveryFee: 15, offer: "20% OFF up to ₹80",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: true, categories: ['desserts', 'coffee'],
    address: "77, MG Road, Bangalore",
    menu: {
      "Waffles": [
        { id: 1401, name: "Classic Belgian Waffle", price: 180, desc: "Crispy golden waffle with maple syrup and butter", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1402, name: "Nutella Waffle", price: 220, desc: "Warm waffle drizzled with Nutella and roasted hazelnuts", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1403, name: "Strawberry Cheesecake Waffle", price: 260, desc: "Topped with strawberry compote and cream cheese", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
      "Pancakes": [
        { id: 1404, name: "Blueberry Pancakes", price: 200, desc: "Fluffy pancakes with fresh blueberries and whipped cream", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
        { id: 1405, name: "Banana Caramel Pancakes", price: 220, desc: "Caramelized banana pancakes with butterscotch sauce", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
    },
  },
  {
    id: 15, name: "Tandoor Tales", cuisines: ["North Indian", "Tandoori", "Mughlai"], rating: 4.4, ratingCount: 2800,
    deliveryTime: "30-40 min", distance: "2.0 km", priceForTwo: 550, deliveryFee: 30, offer: "₹120 OFF above ₹399",
    image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['north-indian'],
    address: "45, Whitefield Main Road, Bangalore",
    menu: {
      "Tandoori Specials": [
        { id: 1501, name: "Tandoori Chicken (Full)", price: 450, desc: "Whole chicken marinated in yogurt & spices, cooked in clay oven for 45 minutes", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1502, name: "Fish Tikka", price: 340, desc: "Boneless fish pieces marinated in spicy yogurt, chargrilled", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 1503, name: "Paneer Malai Tikka", price: 260, desc: "Creamy, mildly spiced paneer grilled in tandoor", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
      ],
      "Curries": [
        { id: 1504, name: "Murgh Makhani", price: 340, desc: "Classic butter chicken in velvety tomato-cashew gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1505, name: "Kadhai Paneer", price: 260, desc: "Paneer cooked with bell peppers in spicy kadhai masala", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
      "Breads": [
        { id: 1506, name: "Cheese Naan", price: 80, desc: "Naan stuffed with mozzarella and cheddar cheese", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 1507, name: "Amritsari Kulcha", price: 90, desc: "Stuffed kulcha with spiced potato filling", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
    },
  },
  {
    id: 16, name: "Noodle Nirvana", cuisines: ["Chinese", "Thai", "Pan-Asian"], rating: 3.9, ratingCount: 670,
    deliveryTime: "20-30 min", distance: "1.6 km", priceForTwo: 350, deliveryFee: 20, offer: "FREE DELIVERY",
    image: `${IMG}/rest4.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['chinese'],
    address: "33, Sarjapur Road, Bangalore",
    menu: {
      "Noodles": [
        { id: 1601, name: "Chilli Garlic Noodles", price: 190, desc: "Wok-tossed egg noodles with garlic, chili, and vegetables", isVeg: true, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 1602, name: "Pad Thai", price: 260, desc: "Classic Thai stir-fried rice noodles with peanuts, bean sprouts and lime", isVeg: true, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 1603, name: "Chicken Chow Mein", price: 230, desc: "Egg noodles stir-fried with chicken and seasonal veggies", isVeg: false, isBestseller: false, image: `${IMG}/rest4.jpg` },
      ],
      "Rice Bowls": [
        { id: 1604, name: "Thai Green Curry Rice", price: 280, desc: "Coconut green curry with jasmine rice and fresh basil", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` },
        { id: 1605, name: "Chicken Fried Rice", price: 220, desc: "Classic Chinese-style chicken fried rice with egg", isVeg: false, isBestseller: false, image: `${IMG}/rest4.jpg` },
      ],
    },
  },
  {
    id: 17, name: "Scoops & Shakes", cuisines: ["Ice Cream", "Shakes", "Desserts"], rating: 4.5, ratingCount: 4100,
    deliveryTime: "10-15 min", distance: "0.4 km", priceForTwo: 250, deliveryFee: 0, offer: "BUY 2 GET 1 FREE",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['ice-cream', 'desserts'],
    address: "2, Koramangala 1st Block, Bangalore",
    menu: {
      "Ice Cream": [
        { id: 1701, name: "Death by Chocolate", price: 180, desc: "Dark chocolate ice cream with fudge, brownies, and choco chips", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1702, name: "Cookie Dough Scoop", price: 160, desc: "Vanilla ice cream loaded with cookie dough chunks", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1703, name: "Mango Lassi Kulfi", price: 140, desc: "Indian-style frozen mango yogurt dessert on a stick", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
      "Shakes": [
        { id: 1704, name: "Oreo Milkshake", price: 180, desc: "Thick milkshake with crushed Oreos and whipped cream", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1705, name: "Ferrero Rocher Shake", price: 220, desc: "Luxurious hazelnut chocolate milkshake with real Ferrero", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
      ],
    },
  },
  {
    id: 18, name: "Chennai Express", cuisines: ["South Indian", "Tamil", "Chettinad"], rating: 4.2, ratingCount: 1900,
    deliveryTime: "25-35 min", distance: "1.9 km", priceForTwo: 350, deliveryFee: 25, offer: "₹80 OFF above ₹299",
    image: `${IMG}/rest5.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['south-indian'],
    address: "90, JP Nagar 2nd Phase, Bangalore",
    menu: {
      "Chettinad Specials": [
        { id: 1801, name: "Chettinad Chicken", price: 320, desc: "Fiery chicken curry with freshly ground spices from Chettinad", isVeg: false, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 1802, name: "Pepper Chicken", price: 300, desc: "Dry chicken preparation with crushed black pepper and curry leaves", isVeg: false, isBestseller: false, image: `${IMG}/rest5.jpg` },
      ],
      "Tiffin Items": [
        { id: 1803, name: "Podi Dosa", price: 110, desc: "Dosa sprinkled with spicy gun powder (milagai podi) and ghee", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 1804, name: "Ghee Roast Dosa", price: 130, desc: "Extra crispy dosa roasted in pure ghee — golden and aromatic", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
      ],
      "Rice Varieties": [
        { id: 1805, name: "Lemon Rice", price: 130, desc: "Tangy lemon-flavored rice with peanuts and curry leaves", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 1806, name: "Curd Rice", price: 100, desc: "Comfort food — rice mixed with fresh curd, mustard and pomegranate", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
      ],
    },
  },
  {
    id: 19, name: "The Great Indian Dhaba", cuisines: ["Punjabi", "North Indian", "Dhaba Style"], rating: 4.3, ratingCount: 2450,
    deliveryTime: "25-35 min", distance: "1.4 km", priceForTwo: 400, deliveryFee: 20, offer: "25% OFF up to ₹150",
    image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: false, isNew: false, categories: ['north-indian', 'thali'],
    address: "56, Marathahalli, Bangalore",
    menu: {
      "Dhaba Specials": [
        { id: 2001, name: "Sarson Ka Saag + Makki Roti", price: 220, desc: "Mustard greens curry with corn flour flatbread — a Punjabi classic", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2002, name: "Chole Bhature", price: 160, desc: "Spicy chickpea curry with deep-fried bread", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2003, name: "Rajma Chawal", price: 150, desc: "Kidney beans in thick gravy served with steamed rice", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
      "Non-Veg Curries": [
        { id: 2004, name: "Chicken Dhaba Style", price: 280, desc: "Rustic, spicy chicken curry cooked the highway dhaba way", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2005, name: "Egg Curry", price: 180, desc: "Boiled eggs in onion-tomato masala gravy", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
      "Parathas": [
        { id: 2006, name: "Aloo Paratha", price: 80, desc: "Stuffed potato paratha served with butter, curd, and pickle", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2007, name: "Paneer Paratha", price: 100, desc: "Cottage cheese stuffed whole wheat paratha with curd", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 2008, name: "Gobi Paratha", price: 80, desc: "Cauliflower stuffed paratha with aachar on the side", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
      ],
    },
  },
  {
    id: 20, name: "Kebab Central", cuisines: ["Mughlai", "Kebabs", "BBQ"], rating: 4.2, ratingCount: 1670,
    deliveryTime: "25-35 min", distance: "1.8 km", priceForTwo: 600, deliveryFee: 30, offer: "₹75 OFF above ₹349",
    image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: false, isNew: true, categories: ['north-indian'],
    address: "14, Lavelle Road, Bangalore",
    menu: {
      "Kebabs": [
        { id: 701, name: "Seekh Kebab (4 pcs)", price: 260, desc: "Minced lamb kebabs grilled on skewers with aromatic spices", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 702, name: "Galouti Kebab (4 pcs)", price: 320, desc: "Melt-in-mouth minced meat kebabs — a Lucknowi delicacy", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 703, name: "Hara Bhara Kebab (4 pcs)", price: 180, desc: "Spinach, pea, and potato vegetarian kebabs — crispy outside", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` },
      ],
      "Curries": [
        { id: 704, name: "Nihari", price: 380, desc: "Slow-cooked overnight meat stew with warming spices and naan", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 705, name: "Keema Matar", price: 290, desc: "Minced meat cooked with green peas in rich onion-tomato gravy", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
      ],
      "Breads": [
        { id: 706, name: "Sheermal", price: 80, desc: "Sweet saffron-flavored Mughlai bread", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 707, name: "Roomali Roti", price: 50, desc: "Thin, soft handkerchief bread — paper thin", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` },
      ],
    },
  },
  {
    id: 21, name: "Tokyo Sushi & Dim Sum House", cuisines: ["Sushi", "Japanese", "Dim Sum", "Asian"], rating: 4.8, ratingCount: 3890,
    deliveryTime: "25-35 min", distance: "2.2 km", priceForTwo: 900, deliveryFee: 0, offer: "FLAT ₹150 OFF",
    image: `${IMG}/rest4.jpg`, isVeg: false, isPromoted: true, isNew: true, categories: ['sushi', 'momos', 'chinese'],
    address: "80 Feet Rd, Indiranagar, Bangalore",
    menu: {
      "Signature Sushi Rolls": [
        { id: 2101, name: "Salmon Avocado Uramaki (8 pcs)", price: 490, desc: "Fresh Norwegian salmon, Haas avocado, toasted sesame & spicy mayo", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2102, name: "Crunchy Tempura Prawn Roll (8 pcs)", price: 460, desc: "Golden fried tiger prawn tempura with sweet eel glaze & tobiko", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2103, name: "Avocado Cream Cheese Roll (8 pcs)", price: 380, desc: "Ripe avocado, Philadelphia cheese, cucumber & Japanese ponzu", isVeg: true, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2104, name: "Crispy Asparagus & Shiitake Roll (8 pcs)", price: 360, desc: "Tender tempura asparagus, braised wild mushrooms & spicy truffle soy", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` }
      ],
      "Handcrafted Dim Sum & Momos": [
        { id: 2105, name: "Truffle Edamame Dumplings (6 pcs)", price: 340, desc: "Silky crystal skin filled with smashed edamame & white truffle oil", isVeg: true, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2106, name: "Steamed Prawn Har Gau (6 pcs)", price: 380, desc: "Translucent pleated dumplings filled with juicy succulent bamboo shoot prawns", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2107, name: "Fiery Schezwan Chicken Momos (8 pcs)", price: 260, desc: "Steamed chicken momos tossed in wok-fried hot chili garlic butter", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` },
        { id: 2108, name: "Pan-Fried Cheese Corn Momos (8 pcs)", price: 230, desc: "Crispy potstickers filled with sweet corn and melting mozzarella", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` }
      ]
    }
  },
  {
    id: 22, name: "Beirut Shawarma & Falafel Co.", cuisines: ["Lebanese", "Shawarma", "Middle Eastern", "Wraps"], rating: 4.6, ratingCount: 5200,
    deliveryTime: "15-25 min", distance: "1.1 km", priceForTwo: 350, deliveryFee: 0, offer: "30% OFF UPTO ₹100",
    image: `${IMG}/rest2.jpg`, isVeg: false, isPromoted: true, isNew: false, categories: ['shawarma', 'rolls', 'healthy'],
    address: "Koramangala 4th Block, Bangalore",
    menu: {
      "Authentic Shawarmas": [
        { id: 2201, name: "Classic Lebanese Chicken Shawarma", price: 180, desc: "Spiced spit-roasted chicken wrapped in Kuboos with signature Toum garlic whip & pickled gherkins", isVeg: false, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 2202, name: "Jumbo Cheese Loaded Chicken Shawarma", price: 230, desc: "Double portion of spiced meat with melted mozzarella and fries stuffed inside", isVeg: false, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 2203, name: "Crispy Falafel Hummus Wrap", price: 160, desc: "Golden fried chickpea patties with creamy tahini hummus and fresh parsley salad", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 2204, name: "Paneer Shawarma Roll", price: 170, desc: "Grilled cottage cheese ribbons tossed in sumac spices with garlic cream", isVeg: true, isBestseller: false, image: `${IMG}/rest2.jpg` }
      ],
      "Mezze & Platters": [
        { id: 2205, name: "Grand Mezze Platter", price: 340, desc: "Falafel (4 pcs), Classic Hummus, Baba Ganoush, Pita Bread (3 pcs), Pickles", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 2206, name: "Spicy Peri Peri Hummus with Pita", price: 190, desc: "Smooth chickpea dip infused with roasted peri peri chili oil and olive oil", isVeg: true, isBestseller: false, image: `${IMG}/rest2.jpg` }
      ]
    }
  },
  {
    id: 23, name: "Little Italy Trattoria & Pasta Bar", cuisines: ["Italian", "Pasta", "Pizza", "Continental"], rating: 4.7, ratingCount: 4120,
    deliveryTime: "25-35 min", distance: "1.9 km", priceForTwo: 700, deliveryFee: 0, offer: "FLAT 20% OFF",
    image: `${IMG}/rest3.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['pasta', 'pizza', 'bakery'],
    address: "100 Feet Road, HAL 2nd Stage, Bangalore",
    menu: {
      "Artisanal Pastas": [
        { id: 2301, name: "Creamy Truffle Fettuccine Alfredo", price: 360, desc: "Fresh handmade pasta in rich parmesan truffle cream with sautéed mushrooms", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 2302, name: "Spicy Penne All'Arrabbiata", price: 310, desc: "Penne in San Marzano tomato sauce infused with garlic, red chili flakes, and extra virgin olive oil", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 2303, name: "Pesto Genovese Fusilli", price: 340, desc: "Fresh basil pesto, toasted pine nuts, extra virgin olive oil and buffalo parmesan", isVeg: true, isBestseller: false, image: `${IMG}/rest3.jpg` },
        { id: 2304, name: "Four Cheese Baked Mac & Cheese", price: 350, desc: "Elbow pasta tossed in cheddar, gouda, mozzarella, and parmesan with garlic herb crust", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` }
      ],
      "Starters & Breads": [
        { id: 2305, name: "Cheesy Garlic Breadsticks with Marinara", price: 180, desc: "Crispy freshly baked dough topped with mozzarella, garlic butter, and Italian herbs", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 2306, name: "Classic Tomato Basil Bruschetta", price: 210, desc: "Toasted ciabatta slices topped with diced Roma tomatoes, fresh basil, and balsamic reduction", isVeg: true, isBestseller: false, image: `${IMG}/rest3.jpg` }
      ]
    }
  },
  {
    id: 24, name: "Amigos Taqueria & Burrito Co.", cuisines: ["Mexican", "Tacos", "Burritos", "Nachos"], rating: 4.6, ratingCount: 2900,
    deliveryTime: "20-30 min", distance: "1.6 km", priceForTwo: 500, deliveryFee: 0, offer: "FLAT ₹100 OFF",
    image: `${IMG}/rest5.jpg`, isVeg: false, isPromoted: false, isNew: true, categories: ['mexican', 'burgers', 'healthy'],
    address: "Church Street, MG Road, Bangalore",
    menu: {
      "Tacos & Burritos": [
        { id: 2401, name: "Smoky Chipotle Chicken Tacos (3 pcs)", price: 270, desc: "Warm soft corn tortillas with shredded chipotle chicken, pico de gallo, and sour cream", isVeg: false, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 2402, name: "Crispy Avocado & Bean Tacos (3 pcs)", price: 240, desc: "Golden panko avocado slices, black beans, jalapeño crema, and Monterey Jack cheese", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 2403, name: "Grande Mission Burrito Bowl", price: 310, desc: "Cilantro lime rice, pinto beans, grilled chicken or fajita veg, guacamole, salsa and sour cream", isVeg: false, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 2404, name: "Loaded Cheesy Nachos Supreme", price: 250, desc: "Crispy tortilla chips smothered in warm queso sauce, jalapeños, olives, and fresh salsa", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ]
    }
  },
  {
    id: 25, name: "The Shake Factory & Smoothie Bar", cuisines: ["Beverages", "Shakes", "Smoothies", "Desserts"], rating: 4.7, ratingCount: 4600,
    deliveryTime: "15-25 min", distance: "1.0 km", priceForTwo: 300, deliveryFee: 0, offer: "BUY 1 GET 1 50% OFF",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['shakes', 'desserts', 'ice-cream', 'healthy'],
    address: "HSR Layout Sector 3, Bangalore",
    menu: {
      "Monster Thickshakes": [
        { id: 2501, name: "Belgian Dark Chocolate Overload Shake", price: 210, desc: "Rich 70% dark Belgian cocoa blended with chocolate gelato and brownie crumble", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2502, name: "Nutella Ferrero Rocher Indulgence Shake", price: 240, desc: "Creamy hazelnut spread, whole Ferrero Rocher, and vanilla soft serve", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2503, name: "Salted Caramel Lotus Biscoff Shake", price: 230, desc: "Lotus Biscoff butter blended with sea salt caramel syrup and crunchy biscuits", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2504, name: "Alphonso Mango Real Fruit Smoothie", price: 190, desc: "Fresh Ratnagiri mango pulp with Greek yogurt and honey", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ],
      "Healthy Fruit Bowls & Juices": [
        { id: 2505, name: "Acai Berry Superfood Smoothie Bowl", price: 280, desc: "Pure organic acai blend topped with chia seeds, fresh strawberries, kiwi, and toasted granola", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2506, name: "Cold-Pressed Detox Green Glow Juice", price: 150, desc: "Spinach, green apple, cucumber, mint, and lemon — 100% natural cold pressed", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    id: 26, name: "Old Delhi Chaat & Street Eats", cuisines: ["Street Food", "Chaat", "North Indian", "Snacks"], rating: 4.5, ratingCount: 6800,
    deliveryTime: "15-20 min", distance: "0.8 km", priceForTwo: 200, deliveryFee: 0, offer: "FLAT ₹50 OFF",
    image: `${IMG}/rest1.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['street-food', 'north-indian', 'south-indian'],
    address: "Commercial Street, Tasker Town, Bangalore",
    menu: {
      "Legendary Chaats": [
        { id: 2601, name: "Delhi Special Dahi Puri (6 pcs)", price: 90, desc: "Crispy puris filled with spiced potatoes, chilled sweet curd, saunth chutney, and nylon sev", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2602, name: "Crispy Aloo Tikki Chaat (2 pcs)", price: 110, desc: "Golden shallow-fried spiced potato patties served with warm chole, curd, and green chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2603, name: "Bombay Bhel Puri with Extra Sev", price: 80, desc: "Puffed rice, diced potatoes, onions, tossed in sweet tangy tamarind & spicy mint water", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2604, name: "Pani Puri Family Feast (20 pcs Pack)", price: 140, desc: "20 puris packed with spiced potato black gram masala, tangy mint water & sweet tamarind pani", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 2605, name: "Pav Bhaji (2 Butter Pavs)", price: 130, desc: "Mashed vegetable curry simmered in special spices and Amul butter with toasted pavs", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ]
    }
  },
  {
    id: 27, name: "The Belgian Waffle & Bakehouse", cuisines: ["Bakery", "Waffles", "Desserts", "Pastries"], rating: 4.8, ratingCount: 7800,
    deliveryTime: "15-25 min", distance: "1.3 km", priceForTwo: 350, deliveryFee: 0, offer: "20% OFF UPTO ₹80",
    image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false, categories: ['bakery', 'desserts', 'coffee'],
    address: "Koramangala 5th Block, Bangalore",
    menu: {
      "Waffles & Pancakes": [
        { id: 2701, name: "Triple Chocolate Waffle", price: 170, desc: "Crispy warm waffle layered with milk, dark, and white Belgian chocolate ganache", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2702, name: "Warm Red Velvet Waffle with Cream Cheese", price: 180, desc: "Red velvet waffle with white chocolate filling and sweet cream cheese spread", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2703, name: "Nutella Almond Waffle", price: 195, desc: "Generously smothered in authentic hazelnut Nutella and roasted almond flakes", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 2704, name: "Fluffy Japanese Souffle Pancakes (3 pcs)", price: 230, desc: "Ultra-fluffy melt-in-mouth souffle pancakes served with maple syrup and whipped butter", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    id: 28, name: "Smoke & Grill Barbecue Co.", cuisines: ["BBQ", "Grills", "American", "Smoked Meats"], rating: 4.7, ratingCount: 3100,
    deliveryTime: "25-35 min", distance: "2.5 km", priceForTwo: 800, deliveryFee: 0, offer: "FLAT ₹150 OFF",
    image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: false, isNew: true, categories: ['bbq', 'burgers', 'north-indian'],
    address: "Outer Ring Road, Bellandur, Bangalore",
    menu: {
      "Hickory Smoked BBQ": [
        { id: 2801, name: "Smoked BBQ Chicken Wings (6 pcs)", price: 290, desc: "Slow hickory-smoked wings glazed in sticky sweet Texas barbecue sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 2802, name: "Char-Grilled Paneer Tikka Skewers", price: 260, desc: "Marinated cottage cheese, bell peppers, and red onions grilled over open coals", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 2803, name: "Slow Smoked Pulled Chicken Slider Duo", price: 320, desc: "Brioche buns filled with 8-hour smoked chicken, apple cider slaw, and jalapeños", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 2804, name: "Grilled BBQ Corn Ribs with Herb Butter", price: 190, desc: "Charred sweet corn ribs brushed with cajun spice and melted garlic herb butter", isVeg: true, isBestseller: false, image: `${IMG}/rest7.jpg` }
      ]
    }
  },
];

// Enriched restaurants with accurate food items
export const restaurants = rawRestaurants.map(r => {
  const cover = getRestaurantCoverImage(r.name, r.cuisines || []);
  const enrichedMenu = {};
  if (r.menu) {
    Object.keys(r.menu).forEach(cat => {
      enrichedMenu[cat] = (r.menu[cat] || []).map(item => ({
        ...item,
        image: getFoodImage(item.name, cat, item.isVeg)
      }));
    });
  }
  return {
    ...r,
    image: cover,
    menu: enrichedMenu
  };
});

// Search utility
export function searchAll(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { restaurants: [], dishes: [] };

  const matchedRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.cuisines.some(c => c.toLowerCase().includes(q))
  );

  const matchedDishes = [];
  restaurants.forEach(r => {
    Object.values(r.menu).forEach(section => {
      section.forEach(item => {
        if (item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)) {
          matchedDishes.push({ ...item, restaurantId: r.id, restaurantName: r.name });
        }
      });
    });
  });

  return { restaurants: matchedRestaurants, dishes: matchedDishes };
}
