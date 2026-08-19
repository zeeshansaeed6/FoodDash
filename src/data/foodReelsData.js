// ============================================================
// FoodDash — Foodie Reels & Stories Dataset
// ============================================================
import { getFoodImage } from '../utils/foodImages.js';

export const foodReels = [
  {
    id: 'reel-1',
    creator: {
      name: 'Chef Marco Rossi',
      handle: '@marcopizza_blr',
      avatar: '👨‍🍳',
      verified: true
    },
    title: 'The Ultimate 48-Hour Sourdough Buffalo Cheese Pull 🧀🔥',
    caption: 'Wood-fired at 450°C! Listen to that golden crust crunch. Fresh buffalo mozzarella sourced daily. Would you share this slice? 👇',
    tags: ['#WoodFired', '#CheesePull', '#Sourdough', '#PizzaLovers'],
    likes: 14280,
    isLiked: false,
    commentsCount: 384,
    comments: [
      { user: 'Priya Sharma', avatar: '👩', text: 'That cheese stretch is insane! Just ordered one 🤤', time: '12m ago' },
      { user: 'Rahul Verma', avatar: '👨', text: 'Best pizza in Koramangala hands down!', time: '25m ago' },
      { user: 'Ananya Roy', avatar: '👩', text: 'The crust bubble charred perfection 🔥', time: '1h ago' }
    ],
    dish: {
      id: 201,
      name: 'Truffle & Buffalo Mozzarella Pizza',
      price: 449,
      restaurantId: 4,
      restaurantName: 'Toscano Artisanal Italian',
      rating: 4.8,
      isVeg: true,
      image: getFoodImage('Artisanal Truffle Pizza', 'Pizza', true)
    },
    audio: '🎵 Italian Street Accordion & Chill Beats • Original Audio'
  },
  {
    id: 'reel-2',
    creator: {
      name: 'Simran & Kabir Eats',
      handle: '@streetfood_diaries',
      avatar: '👫',
      verified: true
    },
    title: 'Triple Smash Wagyu-Style Burger Sizzle Stack 🍔🥩',
    caption: 'Listen to the caramelization! Double aged cheddar, caramelized balsamic onions, secret smoky sauce on buttered brioche.',
    tags: ['#SmashBurger', '#JuicyBite', '#BurgerGram', '#FoodPorn'],
    likes: 22940,
    isLiked: false,
    commentsCount: 512,
    comments: [
      { user: 'Karthik N', avatar: '👨', text: 'Ordered this last night, 10/10 flavor explosion!', time: '5m ago' },
      { user: 'Sneha Patel', avatar: '👩', text: 'That sauce drip at the end omg 😍', time: '40m ago' }
    ],
    dish: {
      id: 101,
      name: 'Gourmet Double Smash Truffle Burger',
      price: 349,
      restaurantId: 2,
      restaurantName: 'The Burger Club',
      rating: 4.9,
      isVeg: false,
      image: getFoodImage('Double Smash Burger', 'Burgers', false)
    },
    audio: '🎵 Sizzle ASMR & Lo-Fi Hop • Sound by FoodDash'
  },
  {
    id: 'reel-3',
    creator: {
      name: 'Nawabi Flavours',
      handle: '@dum_biryani_king',
      avatar: '👑',
      verified: true
    },
    title: 'Clay Handi Dum Biryani Seal Break Reveal! 🍚✨',
    caption: 'Slow-cooked for 4 hours with fragrant saffron basmati, marinated country chicken, and ghee-roasted cashews.',
    tags: ['#DumBiryani', '#Hyderabadi', '#Aromatic', '#NawabiFeast'],
    likes: 38400,
    isLiked: false,
    commentsCount: 890,
    comments: [
      { user: 'Farhan Zaidi', avatar: '👨', text: 'The aroma comes through the screen! Must try!', time: '18m ago' },
      { user: 'Deepa Rao', avatar: '👩', text: 'Meghana foods level spice kick. Loved it!', time: '2h ago' }
    ],
    dish: {
      id: 301,
      name: 'Royal Hyderabadi Mutton Dum Biryani',
      price: 420,
      restaurantId: 1,
      restaurantName: 'Meghana Foods',
      rating: 4.9,
      isVeg: false,
      image: getFoodImage('Hyderabadi Dum Biryani', 'Biryani', false)
    },
    audio: '🎵 Sufi Fusion & Flute Melodies • Royal Audio'
  },
  {
    id: 'reel-4',
    creator: {
      name: 'Chocoholic Studio',
      handle: '@sweet_cravings',
      avatar: '🍰',
      verified: true
    },
    title: 'Belgian Molten Chocolate Lava Cake Eruption 🍫🌋',
    caption: '70% dark Belgian cocoa center bursting with molten fudge. Paired with cold Tahitian vanilla bean gelato.',
    tags: ['#LavaCake', '#ChocolateLovers', '#DessertHeaven', '#SweetTooth'],
    likes: 19820,
    isLiked: false,
    commentsCount: 298,
    comments: [
      { user: 'Meera Iyer', avatar: '👩', text: 'My ultimate midnight dessert craving!', time: '30m ago' },
      { user: 'Vikram S', avatar: '👨', text: 'Best ₹240 spent this week!', time: '1h ago' }
    ],
    dish: {
      id: 401,
      name: 'Belgian Molten Chocolate Lava Cake',
      price: 240,
      restaurantId: 5,
      restaurantName: 'Milano Artisan Gelato & Desserts',
      rating: 4.95,
      isVeg: true,
      image: getFoodImage('Belgian Chocolate Lava Cake', 'Desserts', true)
    },
    audio: '🎵 Chill Acoustic Guitar • Sweet Melodies'
  },
  {
    id: 'reel-5',
    creator: {
      name: 'Tokyo Boba Lab',
      handle: '@bubbletea_blr',
      avatar: '🧋',
      verified: true
    },
    title: 'Brown Sugar Tiger Milk Boba Pour ASMR 🧋🐅',
    caption: 'Warm caramelized brown sugar tapioca pearls with organic cold milk and roasted crème brûlée foam on top!',
    tags: ['#BobaLife', '#TigerSugar', '#BubbleTea', '#Refreshment'],
    likes: 16750,
    isLiked: false,
    commentsCount: 210,
    comments: [
      { user: 'Rohan Joshi', avatar: '👨', text: 'Chewy pearls are top tier. 10/10', time: '1h ago' }
    ],
    dish: {
      id: 501,
      name: 'Brown Sugar Crème Brûlée Boba',
      price: 220,
      restaurantId: 7,
      restaurantName: 'Boba Bliss Cafe',
      rating: 4.8,
      isVeg: true,
      image: getFoodImage('Brown Sugar Tiger Boba', 'Beverages', true)
    },
    audio: '🎵 Pop Vibes & Ice Clinking • Boba Beats'
  }
];
