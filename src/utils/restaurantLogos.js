// ============================================================
// FoodDash — Authentic Real Restaurant Brand Logo Engine
// ============================================================

const BRAND_LOGOS = [
  // Global Food Giants
  {
    keywords: ["mcdonald's", "mcdonalds", "mcd", "mc donalds"],
    name: "McDonald's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg",
    color: "#ffc72c",
    bg: "#da291c"
  },
  {
    keywords: ["kfc", "kentucky fried chicken"],
    name: "KFC",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/bf/KFC_logo.svg",
    color: "#e4002b",
    bg: "#ffffff"
  },
  {
    keywords: ["burger king", "bk"],
    name: "Burger King",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg",
    color: "#d62300",
    bg: "#f5ebdc"
  },
  {
    keywords: ["domino's", "dominos", "domino's pizza"],
    name: "Domino's Pizza",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg",
    color: "#0078ae",
    bg: "#ffffff"
  },
  {
    keywords: ["pizza hut", "pizzahut"],
    name: "Pizza Hut",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d2/Pizza_Hut_logo.svg",
    color: "#ee3124",
    bg: "#ffffff"
  },
  {
    keywords: ["subway"],
    name: "Subway",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg",
    color: "#008938",
    bg: "#ffffff"
  },
  {
    keywords: ["starbucks", "starbucks coffee"],
    name: "Starbucks",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg",
    color: "#006241",
    bg: "#ffffff"
  },
  {
    keywords: ["taco bell", "tacobell"],
    name: "Taco Bell",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b3/Taco_Bell_2016.svg",
    color: "#702082",
    bg: "#ffffff"
  },
  {
    keywords: ["dunkin", "dunkin donuts", "dunkin'"],
    name: "Dunkin'",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b8/Dunkin%27_logo.svg",
    color: "#ff671f",
    bg: "#ffffff"
  },
  {
    keywords: ["popeyes", "popeyes louisiana kitchen"],
    name: "Popeyes",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Popeyes_logo_2020.svg",
    color: "#ff7800",
    bg: "#ffffff"
  },

  // Indian Legendary & Popular Brands
  {
    keywords: ["meghana", "meghana foods"],
    name: "Meghana Foods",
    logo: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=150&auto=format&fit=crop&q=80",
    color: "#ff6b00",
    bg: "#7f1d1d",
    badge: "👑 MEGHANA"
  },
  {
    keywords: ["paradise", "paradise biryani"],
    name: "Paradise Biryani",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80",
    color: "#f59e0b",
    bg: "#1e1b4b",
    badge: "👑 PARADISE"
  },
  {
    keywords: ["bawarchi", "bawarchi restaurant"],
    name: "Bawarchi",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80",
    color: "#dc2626",
    bg: "#451a03",
    badge: "⭐ BAWARCHI"
  },
  {
    keywords: ["haldiram", "haldiram's", "haldirams"],
    name: "Haldiram's",
    logo: "https://images.unsplash.com/photo-1605197147779-12ebbf9e86c0?w=150&auto=format&fit=crop&q=80",
    color: "#dc2626",
    bg: "#fef08a",
    badge: "🫓 HALDIRAM'S"
  },
  {
    keywords: ["bikanervala", "bikaner"],
    name: "Bikanervala",
    logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=80",
    color: "#ea580c",
    bg: "#fef3c7",
    badge: "⚜️ BIKANERVALA"
  },
  {
    keywords: ["saravana", "saravana bhavan", "saravanabhavan"],
    name: "Saravana Bhavan",
    logo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&auto=format&fit=crop&q=80",
    color: "#16a34a",
    bg: "#f0fdf4",
    badge: "🌿 SARAVANA"
  },
  {
    keywords: ["behrouz", "behrouz biryani"],
    name: "Behrouz Biryani",
    logo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80",
    color: "#f59e0b",
    bg: "#09090b",
    badge: "👑 BEHROUZ"
  },
  {
    keywords: ["wow momo", "wow! momo", "wow momos"],
    name: "Wow! Momo",
    logo: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=150&auto=format&fit=crop&q=80",
    color: "#eab308",
    bg: "#dc2626",
    badge: "🥟 WOW! MOMO"
  },
  {
    keywords: ["chai point", "chaipoint"],
    name: "Chai Point",
    logo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
    color: "#15803d",
    bg: "#fef9c3",
    badge: "☕ CHAI POINT"
  },
  {
    keywords: ["faasos"],
    name: "Faasos",
    logo: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=150&auto=format&fit=crop&q=80",
    color: "#7c3aed",
    bg: "#fff7ed",
    badge: "🌯 FAASOS"
  },
  {
    keywords: ["karachi bakery", "karachi"],
    name: "Karachi Bakery",
    logo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=80",
    color: "#b45309",
    bg: "#fef3c7",
    badge: "🍪 KARACHI 1953"
  },
  {
    keywords: ["theobroma", "theo"],
    name: "Theobroma",
    logo: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=150&auto=format&fit=crop&q=80",
    color: "#ec4899",
    bg: "#fdf2f8",
    badge: "🧁 THEOBROMA"
  },
  {
    keywords: ["baskin", "baskin robbins", "baskin-robbins"],
    name: "Baskin Robbins",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Baskin-Robbins_2022_logo.svg",
    color: "#db2777",
    bg: "#ffffff"
  },
  {
    keywords: ["naturals", "natural ice cream", "naturals ice cream"],
    name: "Naturals Ice Cream",
    logo: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=150&auto=format&fit=crop&q=80",
    color: "#16a34a",
    bg: "#ffffff",
    badge: "🍨 NATURALS"
  },
  {
    keywords: ["mainland china"],
    name: "Mainland China",
    logo: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=150&auto=format&fit=crop&q=80",
    color: "#dc2626",
    bg: "#18181b",
    badge: "🐉 MAINLAND CHINA"
  },
  {
    keywords: ["shadab", "hotel shadab"],
    name: "Hotel Shadab",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80",
    color: "#f59e0b",
    bg: "#18181b",
    badge: "👑 SHADAB 1953"
  },
  {
    keywords: ["pista house", "pista"],
    name: "Pista House",
    logo: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=150&auto=format&fit=crop&q=80",
    color: "#22c55e",
    bg: "#022c22",
    badge: "🌿 PISTA HOUSE"
  },
  {
    keywords: ["shah ghouse", "shahghouse"],
    name: "Shah Ghouse Hotel",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80",
    color: "#ef4444",
    bg: "#450a0a",
    badge: "⭐ SHAH GHOUSE"
  },
  {
    keywords: ["niloufer", "cafe niloufer"],
    name: "Cafe Niloufer & Bakers",
    logo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
    color: "#d97706",
    bg: "#451a03",
    badge: "☕ NILOUFER 1978"
  },
  {
    keywords: ["chutneys"],
    name: "Chutneys",
    logo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&auto=format&fit=crop&q=80",
    color: "#16a34a",
    bg: "#f0fdf4",
    badge: "🥘 CHUTNEYS"
  },
  {
    keywords: ["rayalaseema ruchulu", "rayalaseema"],
    name: "Rayalaseema Ruchulu",
    logo: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=150&auto=format&fit=crop&q=80",
    color: "#dc2626",
    bg: "#fef2f2",
    badge: "🌶️ RAYALASEEMA"
  },
  {
    keywords: ["fiza", "fiza mandi", "mandi @ 36", "mandi"],
    name: "Fiza Arabian Mandi",
    logo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80",
    color: "#eab308",
    bg: "#0a0a0a",
    badge: "🌙 ARABIAN MANDI"
  },
  {
    keywords: ["minerva", "minerva coffee house"],
    name: "Minerva Coffee House",
    logo: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=80",
    color: "#b45309",
    bg: "#fffbeb",
    badge: "☕ MINERVA"
  },
  {
    keywords: ["mehfil", "mehfil restaurant"],
    name: "Mehfil Restaurant",
    logo: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=150&auto=format&fit=crop&q=80",
    color: "#ea580c",
    bg: "#1c1917",
    badge: "👑 MEHFIL"
  },
  {
    keywords: ["kritunga", "kritunga restaurant"],
    name: "Kritunga Restaurant",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80",
    color: "#b91c1c",
    bg: "#450a0a",
    badge: "🔥 KRITUNGA"
  },
  {
    keywords: ["santosh dhaba", "santosh"],
    name: "Santosh Dhaba Exclusive",
    logo: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=150&auto=format&fit=crop&q=80",
    color: "#16a34a",
    bg: "#064e3b",
    badge: "🌱 SANTOSH DHABA"
  },
  {
    keywords: ["pulla reddy", "g. pulla reddy", "pullareddy"],
    name: "G. Pulla Reddy Sweets",
    logo: "https://images.unsplash.com/photo-1605197147779-12ebbf9e86c0?w=150&auto=format&fit=crop&q=80",
    color: "#ca8a04",
    bg: "#451a03",
    badge: "🫓 PULLA REDDY"
  },
  {
    keywords: ["absolute barbecues", "ab's", "barbeque nation", "bbq"],
    name: "Absolute Barbecues",
    logo: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80",
    color: "#ea580c",
    bg: "#18181b",
    badge: "🍢 ABSOLUTE BBQ"
  },
  {
    keywords: ["goli vada pav", "goli"],
    name: "Goli Vada Pav",
    logo: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=150&auto=format&fit=crop&q=80",
    color: "#f59e0b",
    bg: "#78350f",
    badge: "🍔 GOLI VADA PAV"
  },
  {
    keywords: ["vidyarthi bhavan", "vidyarthi"],
    name: "Vidyarthi Bhavan",
    logo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&auto=format&fit=crop&q=80",
    color: "#ca8a04",
    bg: "#451a03",
    badge: "🧈 VB 1943"
  },
  {
    keywords: ["toscano", "toscano italian"],
    name: "Toscano Artisanal Italian",
    logo: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=150&auto=format&fit=crop&q=80",
    color: "#dc2626",
    bg: "#1e1b4b",
    badge: "🇮🇹 TOSCANO"
  },
  {
    keywords: ["the burger club", "burger club"],
    name: "The Burger Club",
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80",
    color: "#f97316",
    bg: "#0f172a",
    badge: "🍔 BURGER CLUB"
  }
];

export function getRestaurantLogo(restaurantName = '') {
  const nameLower = (restaurantName || '').toLowerCase().trim();

  // Find exact or substring brand match
  for (const b of BRAND_LOGOS) {
    if (b.keywords.some(k => nameLower.includes(k))) {
      return {
        isKnownBrand: true,
        name: b.name,
        logoUrl: b.logo,
        color: b.color,
        bgColor: b.bg || '#ffffff',
        badge: b.badge || `★ ${b.name.toUpperCase()}`
      };
    }
  }

  // Fallback for custom or independent outlets
  const words = (restaurantName || 'Gourmet Kitchen').split(' ').filter(Boolean);
  const initials = words.length >= 2 
    ? (words[0][0] + words[1][0]).toUpperCase() 
    : (words[0] ? words[0].slice(0, 2).toUpperCase() : 'FD');

  const colorPalette = [
    { color: '#ff6b00', bg: '#1c1917' },
    { color: '#ec4899', bg: '#18181b' },
    { color: '#3b82f6', bg: '#0f172a' },
    { color: '#10b981', bg: '#064e3b' },
    { color: '#8b5cf6', bg: '#1e1b4b' }
  ];

  const charCode = (restaurantName || 'A').charCodeAt(0);
  const theme = colorPalette[charCode % colorPalette.length];

  return {
    isKnownBrand: false,
    name: restaurantName,
    initials,
    logoUrl: null,
    color: theme.color,
    bgColor: theme.bg,
    badge: `🏪 ${restaurantName.slice(0, 16)}`
  };
}
