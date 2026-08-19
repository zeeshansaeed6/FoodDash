// ============================================================
// Intelligent Food Item Image Resolver
// Matches every dish name, cuisine, and category to authentic photos
// ============================================================

export function getFoodImage(name = '', category = '', isVeg = false) {
  const n = (name + ' ' + (category || '')).toLowerCase();

  // Biryani & Rice Dishes
  if (n.includes('mutton biryani') || n.includes('lamb biryani')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80';
  if (n.includes('biryani') || n.includes('zafrani') || n.includes('dum biryani')) return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80';
  if (n.includes('mandi') || n.includes('arabian')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80';
  if (n.includes('pulao') || n.includes('rice') || n.includes('fried rice')) return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80';
  if (n.includes('haleem')) return 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80';

  // Indian Curries & Gravies
  if (n.includes('butter chicken')) return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80';
  if (n.includes('chicken 65') || n.includes('chili chicken') || n.includes('chilli chicken') || n.includes('dragon')) return 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80';
  if (n.includes('dal makhani') || n.includes('dal tadka') || n.includes('lentil')) return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80';
  if (n.includes('palak paneer') || n.includes('paneer butter') || n.includes('kadai paneer') || n.includes('paneer')) return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80';
  if (n.includes('korma') || n.includes('curry') || n.includes('rogan josh') || n.includes('pulusu') || n.includes('gravy')) return 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80';
  if (n.includes('prawn') || n.includes('royyala') || n.includes('fish') || n.includes('seafood')) return 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80';

  // Tandoori & Kebabs
  if (n.includes('paneer tikka')) return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80';
  if (n.includes('tandoori') || n.includes('malai tikka') || n.includes('tangdi') || n.includes('kebab') || n.includes('tikka')) return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80';
  if (n.includes('mushroom')) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80';

  // Breads & Rotis
  if (n.includes('naan') || n.includes('garlic naan') || n.includes('butter naan') || n.includes('paratha') || n.includes('kulcha') || n.includes('bread') || n.includes('roti') || n.includes('poori')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80';

  // Pizzas
  if (n.includes('margherita') || (n.includes('pizza') && isVeg)) return 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80';
  if (n.includes('pepperoni')) return 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80';
  if (n.includes('bbq') || n.includes('pizza')) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80';

  // Pastas & Italian Sides
  if (n.includes('pasta') || n.includes('penne') || n.includes('alfredo') || n.includes('arrabiata') || n.includes('spaghetti') || n.includes('carbonara')) return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80';
  if (n.includes('garlic bread')) return 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80';

  // Burgers & Fries
  if (n.includes('bacon') || (n.includes('burger') && !isVeg)) return 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80';
  if (n.includes('burger') || n.includes('smash') || n.includes('patty')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80';
  if (n.includes('fries') || n.includes('french fries') || n.includes('finger')) return 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80';

  // Asian, Chinese & Dim Sum
  if (n.includes('noodle') || n.includes('hakka') || n.includes('chow mein') || n.includes('ramen')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80';
  if (n.includes('dim sum') || n.includes('momo') || n.includes('dumpling')) return 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=80';
  if (n.includes('sushi') || n.includes('maki') || n.includes('nigiri') || n.includes('japanese')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80';
  if (n.includes('manchurian') || n.includes('wok') || n.includes('thai')) return 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=80';

  // South Indian
  if (n.includes('dosa') || n.includes('pesarattu') || n.includes('masala dosa')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80';
  if (n.includes('idli') || n.includes('vada') || n.includes('sambar') || n.includes('upma')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80';

  // Beverages & Coffee & Tea
  if (n.includes('filter coffee') || n.includes('davarah') || n.includes('cappuccino') || n.includes('espresso')) return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80';
  if (n.includes('cold coffee') || n.includes('frappe') || n.includes('shake') || n.includes('latte')) return 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80';
  if (n.includes('chai') || n.includes('tea') || n.includes('irani chai') || n.includes('zafrani chai')) return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80';
  if (n.includes('soda') || n.includes('lime') || n.includes('beverage') || n.includes('juice') || n.includes('drink') || n.includes('mojito') || n.includes('smoothie')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80';

  // Desserts & Sweets
  if (n.includes('waffle')) return 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80';
  if (n.includes('red velvet') || n.includes('cake') || n.includes('pastry')) return 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&auto=format&fit=crop&q=80';
  if (n.includes('brownie') || n.includes('fudge') || n.includes('chocolate')) return 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=80';
  if (n.includes('double ka meetha') || n.includes('gulab jamun') || n.includes('kheer') || n.includes('halwa') || n.includes('sweet') || n.includes('rasgulla')) return 'https://images.unsplash.com/photo-1605197147779-12ebbf9e86c0?w=500&auto=format&fit=crop&q=80';
  if (n.includes('ice cream') || n.includes('sundae') || n.includes('kulfi') || n.includes('gelato')) return 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80';
  if (n.includes('biscuit') || n.includes('cookie') || n.includes('bun') || n.includes('bakery') || n.includes('croissant')) return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80';

  // Street Food & Chaat
  if (n.includes('pani puri') || n.includes('golgappa') || n.includes('chaat') || n.includes('sev puri') || n.includes('bhel')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80';
  if (n.includes('vada pav')) return 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=80';
  if (n.includes('pav bhaji')) return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80';
  if (n.includes('roll') || n.includes('kathi') || n.includes('shawarma') || n.includes('wrap') || n.includes('burrito') || n.includes('taco')) return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80';

  // Healthy & Bowls & Thali
  if (n.includes('quinoa') || n.includes('salad') || n.includes('bowl') || n.includes('tofu') || n.includes('healthy') || n.includes('keto')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80';
  if (n.includes('thali')) return 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80';

  // Default fallback
  return isVeg 
    ? 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80' 
    : 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80';
}

export function getRestaurantCoverImage(name = '', cuisines = []) {
  const text = (name + ' ' + cuisines.join(' ')).toLowerCase();

  if (text.includes('biryani') || text.includes('hyderabadi') || text.includes('bawarchi') || text.includes('paradise')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('pizza') || text.includes('italian') || text.includes('pasta')) {
    return 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('burger') || text.includes('american') || text.includes('barn')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('chinese') || text.includes('asian') || text.includes('wok') || text.includes('momo') || text.includes('dragon')) {
    return 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('south indian') || text.includes('dosa') || text.includes('chutneys') || text.includes('minerva')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('dessert') || text.includes('bakery') || text.includes('niloufer') || text.includes('karachi') || text.includes('sweet')) {
    return 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('healthy') || text.includes('salad') || text.includes('bowl') || text.includes('green')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('mandi') || text.includes('arabian') || text.includes('fiza')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('street') || text.includes('chaat') || text.includes('bites')) {
    return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80';
  }
  if (text.includes('north indian') || text.includes('spice') || text.includes('mughlai')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80';
  }

  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
}
