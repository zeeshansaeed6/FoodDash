// ============================================================
// FoodDash — Master Real Restaurant Menus & Outlets Database
// Authentic Real Menus with 15-30+ items per restaurant
// ============================================================

const IMG = '/images';

export const HYDERABAD_FULL_RESTAURANTS = [
  {
    name: "Bawarchi Restaurant",
    area: "RTC X Roads, Chikkadpally",
    cuisines: ["Hyderabadi", "Biryani", "Mughlai", "Kebabs", "Tandoori"],
    rating: 4.8, ratingCount: 48900, deliveryTime: "25-35 min", priceForTwo: 450, deliveryFee: 0,
    offer: "FLAT ₹125 OFF", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'north-indian', 'chicken'],
    menu: {
      "World Famous Biryanis": [
        { id: 101, name: "Special Chicken Dum Biryani", price: 340, desc: "Authentic dum-cooked basmati rice with tender spiced chicken, served with Mirchi Ka Salan and Raita", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 102, name: "Hyderabadi Mutton Dum Biryani", price: 390, desc: "Succulent pieces of tender baby goat meat slow-cooked on dum with saffron basmati rice", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 103, name: "Bawarchi Chicken Biryani (Family Pack)", price: 780, desc: "Jumbo pack serves 4-5 with extra chicken pieces, 2 boiled eggs, Salan & Raita", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 104, name: "Mutton Kheema Biryani", price: 410, desc: "Spiced minced mutton cooked with fragrant basmati rice and fried onions", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 105, name: "Egg Dum Biryani (2 Eggs)", price: 240, desc: "Hard-boiled eggs roasted in masala layered with aromatic dum rice", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 106, name: "Hyderabadi Veg Dum Biryani", price: 230, desc: "Fresh garden vegetables, paneer, and aromatic basmati rice cooked with saffron", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Iconic Starters & Kebabs": [
        { id: 107, name: "Hyderabadi Chicken 65", price: 280, desc: "Iconic spicy deep-fried chicken tempered with curry leaves, green chilies, and yogurt", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 108, name: "Bawarchi Chilli Chicken", price: 290, desc: "Crisp chicken chunks tossed in spicy garlic soy sauce with green chilies", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 109, name: "Apollo Fish", price: 350, desc: "Boneless fish fillets marinated in spiced red yogurt temper and deep fried", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 110, name: "Chicken Pepper Fry", price: 290, desc: "Dry roasted chicken tossed with freshly crushed black pepper and onions", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 111, name: "Tangdi Kebab (3 pcs)", price: 310, desc: "Juicy chicken drumsticks chargrilled in tandoor with aromatic spice crust", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 112, name: "Tandoori Chicken (Full)", price: 440, desc: "Whole chicken marinated in hung curd and red Kashmiri mirch, clay oven roasted", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 113, name: "Paneer Tikka (6 pcs)", price: 260, desc: "Tandoor-grilled cottage cheese cubes with bell peppers and onions", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Main Course Curries & Handis": [
        { id: 114, name: "Butter Chicken", price: 330, desc: "Tender tandoori chicken simmered in rich creamy tomato and butter gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 115, name: "Chicken Kadai Masala", price: 310, desc: "Chicken cooked in a wok with freshly ground coriander, tomatoes, and capsicum", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 116, name: "Mutton Rogan Josh", price: 390, desc: "Kashmiri style aromatic mutton gravy with ratan jot and cardamom", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 117, name: "Paneer Butter Masala", price: 260, desc: "Cottage cheese cubes in velvety mild tomato cream gravy", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 118, name: "Dal Tadka", price: 190, desc: "Yellow lentils tempered with cumin, garlic, and dried red chilies in desi ghee", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Tandoori Breads & Accompaniments": [
        { id: 119, name: "Butter Naan", price: 65, desc: "Puffy leavened tandoor bread brushed with melted butter", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 120, name: "Garlic Naan", price: 75, desc: "Naan topped with chopped garlic, butter, and fresh coriander", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 121, name: "Rumali Roti (2 pcs)", price: 50, desc: "Handkerchief-thin soft bread cooked on inverted wok", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 122, name: "Extra Mirchi Ka Salan (Big Bowl)", price: 60, desc: "Traditional peanut, sesame seed, coconut, and green chili gravy", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Desserts & Drinks": [
        { id: 123, name: "Double Ka Meetha", price: 120, desc: "Classic Hyderabadi bread pudding fried in pure ghee soaked in saffron rabdi", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 124, name: "Qubani Ka Meetha with Ice Cream", price: 140, desc: "Stewed dried apricots sweet delicacy topped with vanilla scoop and almonds", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 125, name: "Thums Up (750ml)", price: 50, desc: "Chilled bottle of Thums Up", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Paradise Biryani",
    area: "MG Road, Secunderabad",
    cuisines: ["Biryani", "Hyderabadi", "Mughlai", "Desserts", "Kebabs"],
    rating: 4.7, ratingCount: 65000, deliveryTime: "20-30 min", priceForTwo: 500, deliveryFee: 0,
    offer: "20% OFF UPTO ₹100", image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'desserts', 'chicken'],
    menu: {
      "Royal Biryanis Since 1953": [
        { id: 201, name: "Paradise Royal Chicken Dum Biryani", price: 360, desc: "Since 1953, the iconic chicken dum biryani with layered spices, saffron, and tender meat", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 202, name: "Royal Mutton Dum Biryani", price: 420, desc: "Rich mutton pieces slow-simmered in aromatic rice with royal condiments", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 203, name: "Paradise Special Chicken Biryani (Serves 2-3)", price: 590, desc: "Extra rice, double chicken pieces, and boiled eggs with Mirchi Salan & Raita", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 204, name: "Royal Veg Dum Biryani", price: 260, desc: "Fragrant saffron rice with beans, carrots, cauliflower, paneer, and fried cashews", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 205, name: "Egg Biryani Combo", price: 290, desc: "Egg biryani served with Gulab Jamun and beverage", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` }
      ],
      "Nizam's Kebabs & Starters": [
        { id: 206, name: "Chicken Reshmi Kebab (6 pcs)", price: 340, desc: "Silky melt-in-mouth chicken marinated in cashew cream and char-grilled", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 207, name: "Chicken Tikka (6 pcs)", price: 320, desc: "Boneless chicken marinated with mustard oil and Kashmiri degi mirch", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 208, name: "Kalmi Kebab (2 pcs)", price: 290, desc: "Chicken thighs marinated in spiced yogurt and grilled to juicy tenderness", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 209, name: "Mutton Seekh Kebab (4 pcs)", price: 370, desc: "Minced spiced lamb skewers roasted over hot charcoal embers", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 210, name: "Veg Manchurian Dry", price: 230, desc: "Crispy vegetable balls tossed in ginger garlic soy sauce", isVeg: true, isBestseller: false, image: `${IMG}/rest4.jpg` }
      ],
      "Royal Curries & Handis": [
        { id: 211, name: "Paradise Butter Chicken", price: 340, desc: "Creamy rich tomato gravy with tender roasted chicken chunks", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 212, name: "Mutton Rogan Josh", price: 410, desc: "Slow-cooked mutton in rich Kashmiri spices and yogurt gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 213, name: "Kadai Paneer", price: 270, desc: "Paneer cubes tossed with capsicum, onion, and coarse coriander spices", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 214, name: "Yellow Dal Fry", price: 180, desc: "Homestyle tempered yellow lentils with cumin and ghee", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Breads & Desserts": [
        { id: 215, name: "Butter Naan", price: 65, desc: "Crisp and buttery tandoori flatbread", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 216, name: "Rumali Roti", price: 45, desc: "Soft and thin handkerchief roti", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 217, name: "Paradise Double Ka Meetha", price: 130, desc: "Fried bread slices steeped in sweetened saffron rabdi with pistachios", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 218, name: "Gulab Jamun (2 pcs)", price: 80, desc: "Warm soft mawa dumplings in rose cardamom syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 219, name: "Royal Falooda with Kulfi", price: 160, desc: "Rose syrup, basil seeds, vermicelli, chilled milk, and malai kulfi", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Hotel Shadab",
    area: "Ghansi Bazaar, Near High Court & Charminar",
    cuisines: ["Hyderabadi", "Mughlai", "Biryani", "Nihari", "Paya"],
    rating: 4.8, ratingCount: 52000, deliveryTime: "25-35 min", priceForTwo: 500, deliveryFee: 0,
    offer: "HERITAGE 1953 ORIGINAL", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'north-indian', 'chicken'],
    menu: {
      "Old City Heritage Biryanis": [
        { id: 301, name: "Shadab Special Mutton Biryani", price: 390, desc: "The legendary Old City dum biryani with ultra-tender lamb and aromatic saffron long-grain rice", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 302, name: "Shadab Chicken Dum Biryani", price: 330, desc: "Spiced chicken dum biryani cooked in large copper degchis", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 303, name: "Mutton Biryani (Jumbo Family Pack)", price: 820, desc: "Serves 4-5 persons with extra mutton pieces, boiled eggs, Salan and Raita", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Authentic Hyderabadi Morning & Evening Delicacies": [
        { id: 304, name: "Shadab Special Mutton Nihari", price: 320, desc: "Slow-simmered rich bone marrow and shank stew seasoned with royal spices", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 305, name: "Shadab Mutton Paya Shorba", price: 290, desc: "Traditional lamb trotters soup slow-cooked for 10 hours with kulcha", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 306, name: "Tala Hua Gosht (Fried Mutton)", price: 340, desc: "Crispy fried spiced boneless mutton with curry leaves and green chilies", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 307, name: "Mutton Shikampur Kebab (4 pcs)", price: 310, desc: "Shallow fried spiced minced mutton patties with hung curd and mint stuffing", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 308, name: "Bheja Fry (Brain Masala)", price: 280, desc: "Spiced goat brain pan-fried with black pepper and fresh coriander", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 309, name: "Hyderabadi Chicken 65", price: 270, desc: "Deep-fried spicy chicken morsels with yogurt temper", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Gravies, Breads & Desserts": [
        { id: 310, name: "Dum Ka Murgh", price: 320, desc: "Chicken slow-cooked on dum in creamy cashew and poppy seed gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 311, name: "Shahi Sheermal (Saffron Bread)", price: 75, desc: "Traditional sweet leavened bread brushed with saffron milk", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 312, name: "Rumali Roti (2 pcs)", price: 50, desc: "Fresh hot rumali rotis", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 313, name: "Shadab Double Ka Meetha", price: 110, desc: "Rich royal bread pudding soaked in saffron milk and dry fruits", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 314, name: "Zafrani Irani Chai", price: 50, desc: "Saffron infused rich milk tea", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ]
    }
  },
  {
    name: "Cafe Niloufer & Bakers",
    area: "Red Hills, Lakdikapul / Banjara Hills",
    cuisines: ["Tea", "Bakery", "Fast Food", "Cafe", "Desserts"],
    rating: 4.9, ratingCount: 38000, deliveryTime: "15-20 min", priceForTwo: 200, deliveryFee: 0,
    offer: "BUY 1 GET 1 ON CHAI", image: `${IMG}/rest5.jpg`, isVeg: true, isPromoted: true, isNew: false,
    categories: ['desserts', 'coffee', 'healthy'],
    menu: {
      "Legendary Chai & Hot Beverages": [
        { id: 401, name: "Niloufer Special Irani Chai (Serves 2)", price: 90, desc: "Legendary thick, creamy, slow-brewed Hyderabadi Irani Chai in insulated thermal flask", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 402, name: "Niloufer Zafrani Chai Flask (Serves 2)", price: 120, desc: "Kashmiri saffron and green cardamom infused royal tea in insulated flask", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 403, name: "Green Tea with Honey & Lemon", price: 70, desc: "Antioxidant rich refreshing hot green tea", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 404, name: "Filter Coffee (Flask Serves 2)", price: 110, desc: "Strong South Indian chicory blend filter coffee", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ],
      "World Famous Biscuits & Bakes": [
        { id: 405, name: "Osmania Biscuits (Box of 12)", price: 110, desc: "Authentic melt-in-mouth sweet & salty royal biscuits since 1978", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 406, name: "Osmania Biscuits (Family Tin 500g)", price: 230, desc: "Freshly baked crunchy Osmania biscuits in signature tin", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 407, name: "Fruit Biscuits (Pack of 12)", price: 120, desc: "Crispy cookies studded with candied papaya tutti-frutti & cashews", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 408, name: "Fine Pista Cookies (250g)", price: 160, desc: "Rich butter cookies baked with crushed Iranian pistachios", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ],
      "Maska Buns, Puffs & Quick Bites": [
        { id: 409, name: "Maska Bun with Malai", price: 70, desc: "Soft fresh sourdough bun with homemade sweet white butter and thick cream", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 410, name: "Jam Maska Bun", price: 75, desc: "Bun toasted with butter and mixed fruit jam", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` },
        { id: 411, name: "Chicken Tikka Puff", price: 65, desc: "Flaky golden puff pastry stuffed with spicy chicken tikka masala", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 412, name: "Paneer Butter Masala Puff", price: 55, desc: "Crisp puff pastry packed with seasoned paneer filling", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 413, name: "Egg Puff", price: 45, desc: "Crispy pastry stuffed with spiced hard-boiled egg half", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Cakes & Pastries": [
        { id: 414, name: "Hyderabadi Dilkush (Coconut & Tutti Frutti)", price: 80, desc: "Sweet bread stuffed with sweetened desiccated coconut and candied cherries", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 415, name: "Belgian Dark Chocolate Pastry", price: 110, desc: "Rich ganache layered chocolate sponge pastry", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 416, name: "Red Velvet Jar Cake", price: 140, desc: "Layers of red velvet sponge and cream cheese in a glass jar", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Pista House",
    area: "Charminar / Gachibowli",
    cuisines: ["Hyderabadi", "Mughlai", "Biryani", "Haleem", "Bakery"],
    rating: 4.7, ratingCount: 42000, deliveryTime: "25-35 min", priceForTwo: 450, deliveryFee: 20,
    offer: "FLAT 15% OFF", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'north-indian', 'desserts'],
    menu: {
      "GI-Tagged Haleem & Royal Biryanis": [
        { id: 501, name: "GI Tagged Authentic Mutton Haleem", price: 290, desc: "Slow-cooked for 12 hours with pounded wheat, meat, lentils, pure ghee, topped with fried onions, cashew, and lemon", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 502, name: "Zafrani Chicken Dum Biryani", price: 330, desc: "Saffron infused dum biryani with succulent chicken pieces, Mirchi Salan & Raita", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 503, name: "Pista House Special Mutton Biryani", price: 390, desc: "Aromatic basmati rice layered with baby lamb pieces and whole spices", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 504, name: "Special Veg Biryani", price: 240, desc: "Fragrant biryani with seasonal vegetables and paneer", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Kebabs & Starters": [
        { id: 505, name: "Pathar Ka Gosht", price: 380, desc: "Thin lamb fillets marinated with spices and cooked on a heated granite stone slab", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 506, name: "Mutton Shikampuri Kebab (4 pcs)", price: 320, desc: "Stuffed minced mutton patties pan-fried in ghee", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 507, name: "Chicken 65", price: 270, desc: "Classic spicy red chicken fry with curry leaves", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 508, name: "Apollo Fish", price: 340, desc: "Crispy fried boneless fish tossed in chili garlic seasoning", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Curries, Breads & Desserts": [
        { id: 509, name: "Kadai Gosht", price: 390, desc: "Spiced mutton cooked in iron wok with bell peppers and tomatoes", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 510, name: "Butter Chicken", price: 320, desc: "Classic boneless chicken in sweet and creamy tomato butter sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 511, name: "Butter Naan", price: 60, desc: "Fresh butter naan from tandoor", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 512, name: "Kaddu Ki Kheer", price: 99, desc: "Chilled bottle gourd and condensed milk sweet delicacy with almonds", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 513, name: "Pista House Assorted Baklava (Box of 4)", price: 220, desc: "Crispy flaky pastry layered with chopped pistachios and honey syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Shah Ghouse Hotel & Restaurant",
    area: "Tolichowki / Gachibowli",
    cuisines: ["Biryani", "Mughlai", "Kebabs", "Chinese", "Haleem"],
    rating: 4.6, ratingCount: 38000, deliveryTime: "20-30 min", priceForTwo: 400, deliveryFee: 0,
    offer: "FLAT ₹50 OFF", image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['biryani', 'chicken', 'chinese'],
    menu: {
      "Shah Ghouse Special Biryanis": [
        { id: 601, name: "Shah Ghouse Special Mutton Biryani", price: 380, desc: "Extra spicy, flavorful Hyderabadi mutton biryani with caramelized onions and saffron", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 602, name: "Special Chicken Dum Biryani", price: 320, desc: "Authentic dum biryani with marinated juicy chicken", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 603, name: "Mutton Haleem (Seasonal Special)", price: 280, desc: "Pure ghee cooked mutton haleem topped with fried cashew and mint", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Old City Starters & Non-Veg Specials": [
        { id: 604, name: "Bheja Fry (Brain Masala)", price: 260, desc: "Pan-fried sheep brain seasoned with freshly crushed black pepper and green chilies", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 605, name: "Gurda Kaleji Fry (Kidney & Liver)", price: 280, desc: "Spicy pan-roasted mutton kidney and liver fry", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 606, name: "Tangdi Kebab (3 pcs)", price: 290, desc: "Tandoori chicken drumsticks with mint chutney", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 607, name: "Dragon Chicken", price: 280, desc: "Indo-Chinese fiery wok-tossed crispy chicken strips", isVeg: false, isBestseller: true, image: `${IMG}/rest4.jpg` }
      ],
      "Curries & Breads": [
        { id: 608, name: "Chicken Handi", price: 310, desc: "Chicken slow-cooked in earthen handi pot with yogurt and coriander", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 609, name: "Mutton Korma", price: 370, desc: "Rich almond and fried onion gravy with tender mutton chunks", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 610, name: "Rumali Roti (2 pcs)", price: 50, desc: "Soft thin rumali rotis", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 611, name: "Kaddu Ki Kheer", price: 90, desc: "Chilled bottle gourd pudding with dry fruits", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ]
    }
  },
  {
    name: "Chutneys",
    area: "Road No. 1, Jubilee Hills / Banjara Hills",
    cuisines: ["South Indian", "Pure Veg", "Breakfast", "Dosa", "Thali"],
    rating: 4.7, ratingCount: 29000, deliveryTime: "15-25 min", priceForTwo: 350, deliveryFee: 0,
    offer: "10% OFF ON VEG MEALS", image: `${IMG}/rest5.jpg`, isVeg: true, isPromoted: true, isNew: false,
    categories: ['south-indian', 'healthy', 'thali'],
    menu: {
      "Signature Dosas & 7 Chutneys": [
        { id: 701, name: "Babai Hotel Ghee Idli (with 7 Chutneys)", price: 160, desc: "Steaming hot button idlis dunked in pure desi ghee, served with signature 7 freshly ground chutneys", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 702, name: "MLA Pesarattu with Upma", price: 185, desc: "Crispy whole green gram crepe stuffed with seasoned rava upma and ginger allam chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 703, name: "Guntur Spicy Karam Dosa", price: 175, desc: "Crisp dosa roasted with fiery Guntur red chili paste and melted butter", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 704, name: "Butter Masala Dosa", price: 155, desc: "Golden dosa roasted with Amul butter and potato onion masala", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 705, name: "Corn & Cheese Dosa", price: 195, desc: "Modern fusion dosa stuffed with sweet corn and molten mozzarella", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 706, name: "Ghee Rava Onion Masala Dosa", price: 170, desc: "Lacy crisp semolina crepe with crunchy onions and green chilies", isVeg: true, isBestseller: false, image: `${IMG}/rest5.jpg` }
      ],
      "Breakfast Specials & Vadas": [
        { id: 707, name: "Crispy Medu Vada (2 pcs)", price: 110, desc: "Golden lentil doughnuts with crisp exterior and fluffy interior, with hot sambar", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 708, name: "Ghee Pongal with Vada", price: 150, desc: "Comforting rice and yellow moong dal cooked with crushed black pepper, cumin, and cashews", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 709, name: "Poori with Potato Masala Sagu (2 pcs)", price: 140, desc: "Fluffy fried pooris with traditional potato bhaji", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ],
      "Thalis & South Indian Meals": [
        { id: 710, name: "Chutneys Special Executive Thali", price: 270, desc: "Full feast with steamed rice, sambar, rasam, kootu, veg fry, papad, poori, sweet, and curd", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 711, name: "Authentic Curd Rice (Bagala Bath)", price: 140, desc: "Cooling tempered curd rice with mustard seeds, curry leaves, and pomegranate arils", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` },
        { id: 712, name: "Authentic Filter Coffee in Brass Cup", price: 55, desc: "Piping hot South Indian decoction coffee with frothy milk", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ]
    }
  },
  {
    name: "Rayalaseema Ruchulu",
    area: "Road No. 36, Jubilee Hills",
    cuisines: ["Andhra", "Rayalaseema", "South Indian", "Seafood", "Biryani"],
    rating: 4.5, ratingCount: 19800, deliveryTime: "25-35 min", priceForTwo: 550, deliveryFee: 0,
    offer: "FREE RAGI SANGATI ON ORDERS ₹500+", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['south-indian', 'biryani', 'chicken'],
    menu: {
      "Authentic Rayalaseema & Andhra Delicacies": [
        { id: 801, name: "Ragi Sangati with Natu Kodi Pulusu", price: 380, desc: "Healthy finger millet mudda served with fiery village-style country chicken gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 802, name: "Gongura Mutton Curry", price: 395, desc: "Tender lamb simmered in tangy red sorrel leaves and spices", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 803, name: "Ulavacharu Chicken Dum Biryani", price: 360, desc: "Biryani cooked with traditional horse gram (Ulavacharu) reduction and tender chicken", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 804, name: "Avakaya Chicken Biryani", price: 350, desc: "Spiced biryani infused with authentic Andhra raw mango pickle zest", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Crispy Vepudus & Seafood": [
        { id: 805, name: "Royyala Vepudu (Spicy Prawns Fry)", price: 360, desc: "Fresh prawns pan-roasted with shallots, crushed black pepper, and curry leaves", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 806, name: "Chepala Pulusu (Nellore Fish Curry)", price: 370, desc: "Freshwater fish cooked in tangy tamarind and red chili gravy", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 807, name: "Kodi Vepudu (Andhra Chicken Fry)", price: 310, desc: "Bone-in chicken fried with caramelized onions and roasted spices", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 808, name: "Gutti Vankaya Koora (Stuffed Brinjal)", price: 240, desc: "Baby eggplants stuffed with roasted peanut, sesame, and coconut masala", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Thalis & Sweets": [
        { id: 809, name: "Rayalaseema Rajula Non-Veg Bhojanam (Thali)", price: 440, desc: "Grand feast with chicken curry, mutton curry, prawns fry, sambar, rasam, rice, curd, and sweet", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 810, name: "Ghee Bobbatlu (Puran Poli 2 pcs)", price: 110, desc: "Sweet flatbread stuffed with jaggery and chana dal, roasted in ghee", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ]
    }
  },
  {
    name: "Karachi Bakery & Cafe",
    area: "Mozamjahi Market / Banjara Hills",
    cuisines: ["Bakery", "Desserts", "Cakes", "Snacks", "Fast Food"],
    rating: 4.8, ratingCount: 46000, deliveryTime: "15-20 min", priceForTwo: 300, deliveryFee: 0,
    offer: "FLAT 20% OFF", image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: false, isNew: false,
    categories: ['desserts', 'bakery', 'coffee'],
    menu: {
      "World Famous Heritage Biscuits": [
        { id: 901, name: "Famous Fruit Biscuits (400g Pack)", price: 190, desc: "World famous crunchy candied fruit & cashew biscuits in signature heritage packaging", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 902, name: "Kaju Pista Biscuits (400g)", price: 230, desc: "Rich butter cookies loaded with premium cashews and pistachios", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 903, name: "Badam Pista Biscuits (400g)", price: 220, desc: "Almond and pistachio butter biscuits", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` },
        { id: 904, name: "Coconut Macaroons (Box of 8)", price: 140, desc: "Crispy exterior and chewy sweet coconut core", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 905, name: "Osmania Biscuits (400g)", price: 170, desc: "Classic sweet and salty tea-time biscuits", isVeg: true, isBestseller: true, image: `${IMG}/rest5.jpg` }
      ],
      "Pastries, Cakes & Jar Desserts": [
        { id: 906, name: "Belgian Chocolate Pastry", price: 110, desc: "Dark chocolate ganache layered sponge pastry", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 907, name: "Black Forest Cake (500g)", price: 420, desc: "Whipped cream, dark cherries, and chocolate shavings on cocoa sponge", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 908, name: "Red Velvet Jar Cake", price: 130, desc: "Layers of red velvet cake and cream cheese frosting in glass jar", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 909, name: "Butterscotch Pastry", price: 95, desc: "Crunchy praline and caramel butterscotch cream", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ],
      "Savory Bakes & Rolls": [
        { id: 910, name: "Chicken Tikka Roll", price: 140, desc: "Spiced tandoori chicken chunks in soft kathi wrap", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 911, name: "Crispy Veg Burger", price: 99, desc: "Potato patty with crunchy lettuce, mayo, and cheese in toasted bun", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 912, name: "Butter Khari (250g)", price: 90, desc: "Light and flaky tea-time puff biscuits", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Fiza Arabian Mandi",
    area: "Mehdipatnam / Tolichowki",
    cuisines: ["Arabian", "Mandi", "Kebabs", "Middle Eastern", "Biryani"],
    rating: 4.6, ratingCount: 24000, deliveryTime: "25-35 min", priceForTwo: 600, deliveryFee: 0,
    offer: "FREE SOUP & SALAD", image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['biryani', 'chicken'],
    menu: {
      "Authentic Arabian Mandi Platters": [
        { id: 1001, name: "Chicken Juicy Arabian Mandi (Serves 2)", price: 460, desc: "Aromatic seasoned basmati rice topped with juicy roasted chicken, fried cashews, and tomato chutney", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1002, name: "Mutton Faham Mandi (Serves 2)", price: 580, desc: "Charcoal-grilled spiced lamb chops served over fragrant mandi rice platter with garlic dip", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1003, name: "Chicken Al Faham Mandi", price: 480, desc: "Smoky grilled half chicken with Arabian spices over spiced mandi rice", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1004, name: "Fish Mandi (Serves 2)", price: 540, desc: "Grilled King Fish steaks marinated in za'atar and sumac served with rice", isVeg: false, isBestseller: false, image: `${IMG}/rest7.jpg` },
        { id: 1005, name: "Jumbo Mix Meat Mandi (Serves 4)", price: 1150, desc: "Grand feast with juicy chicken, mutton faham, and prawns with nuts and dips", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` }
      ],
      "Arabian Grills & Desserts": [
        { id: 1006, name: "Al Faham Chicken (Full)", price: 420, desc: "Whole chicken roasted over coal with Arabic spice rub", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1007, name: "Chicken Seekh Kebab (4 pcs)", price: 290, desc: "Charcoal minced chicken skewers with mint dip", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1008, name: "Garlic Toum Dip & Salata (Extra)", price: 50, desc: "Creamy garlic mayo and spicy crushed tomato dip", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` },
        { id: 1009, name: "Kunafa with Cheese & Sugar Syrup", price: 240, desc: "Warm shredded phyllo dough pastry with gooey melted cheese soaked in rose syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    name: "Kritunga Restaurant",
    area: "KPHB Colony / Ameerpet",
    cuisines: ["Rayalaseema", "Andhra", "Biryani", "Spicy", "South Indian"],
    rating: 4.5, ratingCount: 31000, deliveryTime: "25-35 min", priceForTwo: 500, deliveryFee: 0,
    offer: "RAYALASEEMA SPICY SPECIAL", image: `${IMG}/rest7.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'south-indian', 'chicken'],
    menu: {
      "Signature Potlam & Rayalaseema Biryanis": [
        { id: 1101, name: "Potlam Chicken Biryani", price: 360, desc: "Iconic biryani wrapped inside a thin egg omelette pouch packed with spicy chicken kheema and pieces", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1102, name: "Gongura Mutton Biryani", price: 410, desc: "Spiced mutton cooked with tangy sorrel leaves layered over dum rice", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1103, name: "Tagubothu Kodi Biryani", price: 380, desc: "Fiery Rayalaseema country chicken biryani cooked with extra green chilies and spices", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1104, name: "Kaju Paneer Biryani", price: 290, desc: "Fragrant rice cooked with golden fried cashews and marinated paneer cubes", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Fiery Starters & Curries": [
        { id: 1105, name: "Mushroom Ghee Roast", price: 250, desc: "Fresh button mushrooms roasted in fiery red Kundapura ghee masala", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1106, name: "Kodi Chips (Crispy Chicken Strips)", price: 290, desc: "Ultra-crispy spiced chicken strips with fried curry leaves", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1107, name: "Royyala Iguru (Prawns Thick Gravy)", price: 370, desc: "Prawns cooked in onion tomato gravy with cloves and cinnamon", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1108, name: "Ragi Mudda (2 Balls)", price: 90, desc: "Finger millet dumplings cooked with a hint of ghee", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ]
    }
  },
  {
    name: "Santosh Dhaba Exclusive",
    area: "Abids / Koti / Himayatnagar",
    cuisines: ["North Indian", "Pure Veg", "Biryani", "Paneer", "Thali"],
    rating: 4.6, ratingCount: 34000, deliveryTime: "20-25 min", priceForTwo: 350, deliveryFee: 0,
    offer: "100% PURE VEG DELIGHT", image: `${IMG}/rest8.jpg`, isVeg: true, isPromoted: false, isNew: false,
    categories: ['north-indian', 'healthy', 'thali'],
    menu: {
      "Paneer & Dhaba Curries": [
        { id: 1201, name: "Special Paneer Butter Masala", price: 240, desc: "Fresh cottage cheese in sweet and tangy buttery tomato gravy with cream", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1202, name: "Kaju Curry (Cashew Gravy)", price: 270, desc: "Roasted cashew nuts cooked in rich mild mawa and tomato gravy", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1203, name: "Paneer Tikka Masala", price: 250, desc: "Grilled paneer tikka tossed in spicy onion capsicum gravy", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1204, name: "Veg Kolhapuri", price: 210, desc: "Mixed garden vegetables in fiery Kolhapuri red chili gravy", isVeg: true, isBestseller: false, image: `${IMG}/rest1.jpg` },
        { id: 1205, name: "Dal Tadka with Desi Ghee", price: 180, desc: "Yellow lentils tempered with cumin, garlic, and red chilies", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Pure Veg Biryanis & Breads": [
        { id: 1206, name: "Special Kaju Veg Dum Biryani", price: 260, desc: "Basmati rice cooked with roasted cashews, paneer, and garden fresh vegetables", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1207, name: "Paneer Biryani", price: 240, desc: "Fragrant rice layered with spiced cottage cheese cubes", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1208, name: "Butter Naan", price: 55, desc: "Fresh butter tandoori naan", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1209, name: "Garlic Butter Naan", price: 65, desc: "Naan topped with chopped garlic and butter", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 1210, name: "Gulab Jamun (2 pcs)", price: 70, desc: "Soft mawa dumplings in sugar syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest7.jpg` }
      ]
    }
  },
  {
    name: "G. Pulla Reddy Sweets",
    area: "Abids / Somajiguda",
    cuisines: ["Sweets", "Pure Desi Ghee", "Desserts", "Snacks"],
    rating: 4.8, ratingCount: 38000, deliveryTime: "15-20 min", priceForTwo: 350, deliveryFee: 0,
    offer: "100% PURE GHEE SWEETS", image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: true, isNew: false,
    categories: ['desserts'],
    menu: {
      "Legendary Pure Desi Ghee Sweets": [
        { id: 1301, name: "Pulla Reddy Pootharekulu (Paper Sweet 5 pcs)", price: 220, desc: "Authentic rice starch paper sheets layered with pure ghee, powdered jaggery, and dry fruits", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1302, name: "Ghee Mysore Pak (250g Box)", price: 190, desc: "Traditional melt-in-mouth gram flour sweet rich in pure aromatic ghee", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1303, name: "Kaju Katli (250g Box)", price: 290, desc: "Finest cashew diamond fudge with edible silver leaf", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1304, name: "Dry Fruit Halwa (250g)", price: 240, desc: "Chewy wheat starch jelly loaded with roasted almonds and cashews", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1305, name: "Motichoor Laddu (250g)", price: 170, desc: "Tiny gram flour pearls fried in ghee and soaked in saffron syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ],
      "Hot Savories & Snacks": [
        { id: 1306, name: "Special Chekkalu / Murukku (250g)", price: 120, desc: "Crispy spiced rice crackers with chana dal and sesame", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 1307, name: "Kaju Mixture (250g)", price: 160, desc: "Spiced fried lentils, sev, peanuts, and cashews", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  }
];

export const TOP_BRAND_CHAINS_FULL = [
  {
    namePrefix: "Domino's Pizza",
    cuisines: ["Pizza", "Italian", "Fast Food", "Desserts"],
    rating: 4.6, ratingCount: 78000, deliveryTime: "15-20 min", priceForTwo: 400, deliveryFee: 0,
    offer: "EVERYDAY VALUE - 2 REGULAR PIZZAS @ ₹99 EA", image: `${IMG}/rest2.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['pizza', 'desserts'],
    menu: {
      "Cheesy Pizzas (Veg & Non-Veg)": [
        { id: 5001, name: "Peppy Paneer Cheese Burst Pizza", price: 349, desc: "Juicy paneer, crisp capsicum, spicy red paprika with molten cheese core in crust", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5002, name: "Farmhouse Fresh Veggie Pizza", price: 289, desc: "Delightful combination of onion, capsicum, tomato, and grilled mushrooms", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5003, name: "Non-Veg Supreme Pizza", price: 449, desc: "Loaded with black olives, grilled mushrooms, pepper barbecue chicken, peri-peri chicken", isVeg: false, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5004, name: "Chicken Dominator Pizza", price: 479, desc: "Loaded with double pepper barbecue chicken, peri-peri chicken, chicken tikka & sausages", isVeg: false, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5005, name: "Classic Margherita", price: 199, desc: "Single cheese topping with classic herb-seasoned tomato sauce", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` }
      ],
      "Sides, Pastas & Dips": [
        { id: 5006, name: "Garlic Breadsticks with Cheesy Jalapeño Dip", price: 129, desc: "Freshly buttered and seasoned with garlic herbs, served with warm cheese dip", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5007, name: "Veg Stuffed Garlic Bread", price: 159, desc: "Stuffed with sweet corn, jalapeños, and gooey mozzarella cheese", isVeg: true, isBestseller: true, image: `${IMG}/rest2.jpg` },
        { id: 5008, name: "Creamy Tomato Non-Veg Pasta", price: 179, desc: "Penne pasta with chicken meatballs in tangy tomato and cheese sauce", isVeg: false, isBestseller: false, image: `${IMG}/rest2.jpg` }
      ],
      "Desserts & Drinks": [
        { id: 5009, name: "Choco Lava Cake", price: 109, desc: "Warm chocolate cake with molten bubbling chocolate fudge center", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5010, name: "Butterscotch Mousse Cake", price: 99, desc: "Sweet butterscotch mousse layered over soft sponge cake", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5011, name: "Pepsi Black Can (330ml)", price: 60, desc: "Zero calorie chilled cola can", isVeg: true, isBestseller: false, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "McDonald's",
    cuisines: ["Burgers", "Fast Food", "Beverages", "Fries", "Desserts"],
    rating: 4.5, ratingCount: 92000, deliveryTime: "15-20 min", priceForTwo: 350, deliveryFee: 0,
    offer: "FLAT 20% OFF ON MEALS", image: `${IMG}/rest3.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['burgers', 'desserts'],
    menu: {
      "Burgers & Wraps": [
        { id: 5101, name: "McSpicy Chicken Burger", price: 199, desc: "Tender and juicy chicken patty coated in spicy crispy batter, topped with creamy mayo and lettuce", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5102, name: "McSpicy Paneer Burger", price: 189, desc: "Crispy battered paneer patty with spicy cocktail mayo and shredded lettuce", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5103, name: "McAloo Tikki Burger Meal (with Fries & Coke)", price: 149, desc: "Crispy spiced potato & peas patty with special sweet tomato mayo in toasted bun with fries and coke", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5104, name: "Big Spicy Chicken McWrap", price: 239, desc: "Whole-wheat wrap with spicy fried chicken, lettuce, onions, and spicy sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5105, name: "Chicken McNuggets (9 pcs with Mustard Dip)", price: 219, desc: "Golden bite-sized chicken nuggets with savory dip", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` }
      ],
      "Fries & Sides": [
        { id: 5106, name: "World Famous French Fries (Large) with Peri Peri", price: 125, desc: "Crispy golden french fries with shake-shake peri peri spice mix", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5107, name: "Cheesy Veg Nuggets (6 pcs)", price: 119, desc: "Melted cheese and vegetable nuggets with crispy crumb", isVeg: true, isBestseller: false, image: `${IMG}/rest3.jpg` }
      ],
      "McCafe & Desserts": [
        { id: 5108, name: "Oreo McFlurry", price: 115, desc: "Creamy soft serve ice cream blended with crunchy Oreo cookie chunks", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5109, name: "Soft Serve with Hot Fudge", price: 65, desc: "Creamy vanilla soft serve with warm chocolate fudge", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5110, name: "Iced Cold Coffee with Soft Serve", price: 135, desc: "Rich blended cold coffee topped with vanilla soft serve swirl", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "KFC",
    cuisines: ["Fried Chicken", "Burgers", "Fast Food", "Wings", "Rolls"],
    rating: 4.5, ratingCount: 84000, deliveryTime: "20-25 min", priceForTwo: 450, deliveryFee: 0,
    offer: "SAVE ₹120 ON 8-PC BUCKET", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['burgers', 'chicken'],
    menu: {
      "Finger Lickin' Chicken Buckets": [
        { id: 5201, name: "Hot & Crispy Chicken Bucket (6 pcs)", price: 499, desc: "Signature 11 herbs & spices secret recipe crispy fried chicken drumsticks & thighs", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5202, name: "Peri Peri 10 Leg Piece Bucket", price: 799, desc: "10 juicy chicken leg pieces tossed in special peri peri seasoning with dips", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5203, name: "Hot Wings (8 pcs)", price: 299, desc: "Spicy and crunchy chicken wings with dynamite sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5204, name: "Hot Popcorn Chicken (Large)", price: 230, desc: "Bite-sized tender boneless chicken nuggets with peri peri sprinkler", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ],
      "Zinger Burgers & Rolls": [
        { id: 5205, name: "Classic Chicken Zinger Burger", price: 199, desc: "Signature double-breaded crispy chicken fillet with lettuce and mayo in a soft bun", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5206, name: "Tandoori Chicken Zinger Burger", price: 219, desc: "Crispy fillet coated in spicy tandoori sauce and onions", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5207, name: "Classic Veg Zinger", price: 179, desc: "Crispy vegetable patty with lettuce and creamy mayo", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5208, name: "Chicken Longer Roll", price: 129, desc: "Crispy chicken strip rolled in tortilla with spicy dressing", isVeg: false, isBestseller: false, image: `${IMG}/rest1.jpg` }
      ],
      "Sides & Drinks": [
        { id: 5209, name: "KFC Medium Fries with Dip", price: 109, desc: "Crispy salted french fries with peri peri dip", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5210, name: "Choco Mud Pie Dessert", price: 119, desc: "Decadent chocolate mud pie with chocolate syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "Burger King",
    cuisines: ["Burgers", "American", "Fast Food", "Fries"],
    rating: 4.4, ratingCount: 62000, deliveryTime: "15-25 min", priceForTwo: 350, deliveryFee: 0,
    offer: "WHOPPER WEDNESDAY - 40% OFF", image: `${IMG}/rest3.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['burgers'],
    menu: {
      "Flame-Grilled Whoppers & Burgers": [
        { id: 5301, name: "Crispy Veg Whopper Double", price: 189, desc: "Flame-grilled juicy veg patty with lettuce, tomatoes, creamy mayo, pickles, and sesame bun", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5302, name: "Chicken Whopper with Cheese", price: 229, desc: "Flame-grilled chicken patty topped with melted cheese slice and crunchy veggies", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5303, name: "BK Fiery Chicken Burger", price: 199, desc: "Spicy crispy fried chicken patty with ghost pepper sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5304, name: "Paneer Royale Burger", price: 179, desc: "Thick golden paneer patty with herb mayo and lettuce", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` }
      ],
      "King Fries & Shakes": [
        { id: 5305, name: "King Cheesy Fries", price: 139, desc: "Golden fries drenched in warm cheddar cheese sauce and jalapeños", isVeg: true, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5306, name: "BK Chicken Fries (6 pcs)", price: 149, desc: "Crispy breaded chicken strips shaped like fries with BBQ dip", isVeg: false, isBestseller: true, image: `${IMG}/rest3.jpg` },
        { id: 5307, name: "Chocolate Thick Shake", price: 159, desc: "Creamy chocolate shake made with real chocolate syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "Subway",
    cuisines: ["Healthy", "Sandwiches", "Salads", "Wraps"],
    rating: 4.4, ratingCount: 45000, deliveryTime: "15-20 min", priceForTwo: 350, deliveryFee: 0,
    offer: "SUB OF THE DAY @ ₹189", image: `${IMG}/rest8.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['healthy', 'rolls'],
    menu: {
      "Fresh Handcrafted Subs (6-Inch / Footlong)": [
        { id: 5401, name: "Paneer Tikka Sub (6-Inch)", price: 219, desc: "Tender spiced paneer cubes with crisp fresh veggies and choices of chipotle & southwest sauces", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` },
        { id: 5402, name: "Italian B.M.T Sub (6-Inch)", price: 249, desc: "Genoa salami, spicy pepperoni, and black forest ham with melted cheese on toasted parmesan oregano bread", isVeg: false, isBestseller: true, image: `${IMG}/rest8.jpg` },
        { id: 5403, name: "Peri Peri Chicken Sub (6-Inch)", price: 239, desc: "Sliced roasted chicken in spicy peri peri marinade with crunchy veggies", isVeg: false, isBestseller: true, image: `${IMG}/rest8.jpg` },
        { id: 5404, name: "Veggie Delite Sub (6-Inch)", price: 179, desc: "Crispy lettuce, tomatoes, cucumbers, green peppers, and red onions with vinaigrette", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` }
      ],
      "Salad Bowls & Cookies": [
        { id: 5405, name: "Paneer Tikka Salad Bowl", price: 249, desc: "Spiced paneer, fresh salad greens, olives, jalapeños with honey mustard dressing", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` },
        { id: 5406, name: "Double Dark Chocolate Cookie", price: 69, desc: "Freshly baked warm chocolate cookie with chocolate chunks", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "Starbucks Coffee",
    cuisines: ["Cafe", "Coffee", "Bakery", "Desserts", "Breakfast"],
    rating: 4.8, ratingCount: 54000, deliveryTime: "15-20 min", priceForTwo: 550, deliveryFee: 0,
    offer: "FREE SIZE UPGRADE", image: `${IMG}/rest6.jpg`, isVeg: true, isPromoted: true, isNew: false,
    categories: ['coffee', 'desserts', 'breakfast'],
    menu: {
      "Handcrafted Frappuccinos & Coffees": [
        { id: 5501, name: "Java Chip Frappuccino (Grande)", price: 345, desc: "Mocha sauce and Frappuccino chips blended with coffee, milk, and ice, topped with whipped cream and mocha drizzle", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5502, name: "Caramel Macchiato (Hot / Iced)", price: 295, desc: "Freshly steamed milk with vanilla syrup, marked with espresso and topped with caramel drizzle", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5503, name: "Caffe Latte (Grande)", price: 265, desc: "Rich full-bodied espresso in steamed milk, lightly topped with foam", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5504, name: "Cold Brew with Vanilla Sweet Cream", price: 285, desc: "Slow-steeped custom blend cold brew topped with house-made vanilla sweet cream", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ],
      "Artisanal Bakes & Sandwiches": [
        { id: 5505, name: "Double Chocolate Chip Cookie", price: 165, desc: "Warm rich cookie loaded with dark chocolate chunks", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5506, name: "Butter Croissant", price: 195, desc: "Flaky golden French pastry with rich European butter", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5507, name: "Paneer Tikka Sandwich on Sourdough", price: 245, desc: "Spiced paneer, bell peppers, and cheese grilled in sourdough bread", isVeg: true, isBestseller: true, image: `${IMG}/rest8.jpg` }
      ]
    }
  },
  {
    namePrefix: "Wow! Momo",
    cuisines: ["Chinese", "Momos", "Tibetan", "Fast Food"],
    rating: 4.5, ratingCount: 46000, deliveryTime: "15-20 min", priceForTwo: 250, deliveryFee: 0,
    offer: "BUY 1 GET 1 ON MOMO PLATTERS", image: `${IMG}/rest9.jpg`, isVeg: false, isPromoted: false, isNew: false,
    categories: ['chinese'],
    menu: {
      "Steamed & Pan-Fried Momos": [
        { id: 5601, name: "Darjeeling Steamed Chicken Momos (8 pcs)", price: 169, desc: "Handcrafted juicy steamed dumplings served with fiery red chili sauce", isVeg: false, isBestseller: true, image: `${IMG}/rest9.jpg` },
        { id: 5602, name: "Corn & Cheese Pan-Fried Momos in Schezwan", price: 199, desc: "Crispy pan-seared momos tossed in sweet and spicy Schezwan sauce", isVeg: true, isBestseller: true, image: `${IMG}/rest9.jpg` },
        { id: 5603, name: "Chicken Moburg (Momo in a Burger)", price: 119, desc: "Fried momos stuffed between soft burger buns with spicy mayo and onions", isVeg: false, isBestseller: true, image: `${IMG}/rest9.jpg` },
        { id: 5604, name: "Steamed Veg Himalayan Momos (8 pcs)", price: 139, desc: "Cabbage, carrots, paneer dumplings with spicy chutney", isVeg: true, isBestseller: true, image: `${IMG}/rest9.jpg` },
        { id: 5605, name: "Chocolate Momo Delight (2 pcs)", price: 99, desc: "Crisp hot momo dumpling filled with molten dark chocolate ganache", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` }
      ]
    }
  },
  {
    namePrefix: "Haldiram's Sweets & Chaat",
    cuisines: ["North Indian", "Sweets", "Chaat", "Thali", "Pure Veg"],
    rating: 4.7, ratingCount: 68000, deliveryTime: "20-25 min", priceForTwo: 300, deliveryFee: 0,
    offer: "100% PURE DESI GHEE SWEETS", image: `${IMG}/rest10.jpg`, isVeg: true, isPromoted: true, isNew: false,
    categories: ['thali', 'north-indian', 'desserts', 'rolls'],
    menu: {
      "Iconic Chaat & Pure Desi Ghee Mithai": [
        { id: 5701, name: "Special Raj Kachori", price: 130, desc: "Crisp giant kachori shell packed with spiced potatoes, sprouts, sweet curd, saunth, and pomegranate", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 5702, name: "Chole Bhature (2 Puffed Bhaturas)", price: 160, desc: "Spicy Amritsari chickpea curry served with piping hot paneer-stuffed bhature and pickle", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 5703, name: "Pani Puri Platter (8 puris with 2 Waters)", price: 90, desc: "Crispy puris with spicy mint water, sweet tamarind chutney, and boiled potato filling", isVeg: true, isBestseller: true, image: `${IMG}/rest10.jpg` },
        { id: 5704, name: "Kaju Katli (250g Box)", price: 290, desc: "Finest cashew diamond fudge with edible silver leaf", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5705, name: "Rasgulla (Tin of 8 pcs)", price: 150, desc: "Spongy cottage cheese balls soaked in light sugar syrup", isVeg: true, isBestseller: true, image: `${IMG}/rest6.jpg` },
        { id: 5706, name: "Haldiram's Executive Veg Thali", price: 240, desc: "Paneer butter masala, dal makhani, mix veg, jeera rice, 2 parathas, gulab jamun, and raita", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` }
      ]
    }
  },
  {
    namePrefix: "Behrouz Biryani",
    cuisines: ["Royal Biryani", "Mughlai", "Kebabs", "Desserts"],
    rating: 4.7, ratingCount: 51000, deliveryTime: "25-35 min", priceForTwo: 600, deliveryFee: 0,
    offer: "FLAT ₹150 OFF ON ROYAL ORDERS", image: `${IMG}/rest1.jpg`, isVeg: false, isPromoted: true, isNew: false,
    categories: ['biryani', 'north-indian'],
    menu: {
      "Royal Persian Biryanis": [
        { id: 5801, name: "Dum Gosht (Mutton) Biryani (Serves 1-2)", price: 449, desc: "Tender lamb marinated with secret Persian spices, layered with long grain basmati rice, saffron, and fried cashews", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5802, name: "Lazeez Bhuna Murgh Biryani", price: 369, desc: "Slow-cooked boneless chicken biryani in rich bhuna masala with gulab jamun and salan", isVeg: false, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5803, name: "Subz-e-Biryani (Royal Veg)", price: 299, desc: "Aromatic basmati rice layered with vegetables, paneer, and caramelized onions", isVeg: true, isBestseller: true, image: `${IMG}/rest1.jpg` },
        { id: 5804, name: "Murgh Kefta Kebab (6 pcs)", price: 320, desc: "Persian spiced grilled chicken meatballs with mint dip", isVeg: false, isBestseller: true, image: `${IMG}/rest7.jpg` }
      ]
    }
  }
];
