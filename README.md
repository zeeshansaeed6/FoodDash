<div align="center">
  <img src="public/logo.jpg" alt="FoodDash Logo" width="200" height="200" style="border-radius: 50%; border: 4px solid #1572B6; box-shadow: 0 8px 16px rgba(0,0,0,0.4); margin-bottom: 20px;">
  
  <h1 style="font-size: 3.5em; font-weight: 800; margin: 0; color: #ff4b2b;">🚀 FoodDash</h1>
  
  <p style="font-size: 1.2em; color: #555;"><strong>The Next-Generation Full-Stack Food Delivery & Social Dining Ecosystem</strong></p>

  <p>
    <a href="https://github.com/zeeshansaeed6/FoodDash"><img src="https://img.shields.io/badge/version-1.0.0--stable-blue.svg?style=for-the-badge&logo=appveyor" alt="Version"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License"></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Express-339933.svg?style=for-the-badge&logo=nodedotjs" alt="Node.js"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite"></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-3D-black.svg?style=for-the-badge&logo=three.js" alt="Three.js"></a>
  </p>
  
  <p><i>Redefining digital food delivery with immersive 3D rendering, AI dining intelligence, and real-time social experiences.</i></p>
</div>

<br />

<div align="center">
  <img src="fooddash_linkedin_showcase.png" alt="FoodDash Preview" style="border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); width: 100%; max-width: 850px; border: 1px solid #333;">
</div>

<br />

---

## 📖 Table of Contents
- [🎯 Why FoodDash?](#-why-fooddash)
- [✨ Core Features](#-core-features)
- [🏛️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack & Tools](#️-tech-stack--tools)
- [🎨 Design System](#-design-system)
- [🔌 API Reference](#-api-reference)
- [📂 Codebase Structure](#-codebase-structure)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contribute to FoodDash](#-contribute-to-fooddash)

---

## 🎯 Why FoodDash?

Traditional food delivery apps are flat, transactional, and lack engagement. **FoodDash** brings excitement back to ordering food by blending **e-commerce with social media features, gamification, and WebGL 3D graphics**. 

Whether you're exploring the menu in fully interactive 3D, rolling the mystery discount wheel, or splitting a bill dynamically with friends, FoodDash turns a simple order into an experience.

---

## ✨ Core Features

<details open>
<summary><b>🎨 Glassmorphism UI & Aesthetic Excellence</b></summary>
<br>

- **Curated Dark Theme:** Deep, immersive UI with tailored HSL accents and sleek typography.
- **Micro-Animations:** Fluid transitions, hover states, and dynamic elements powered by vanilla CSS.
- **Dynamic Cart Drawer:** Fully persistent sliding cart with live subtotal, tax calculation, and delivery fee adjustments.
- **Social Food Reels:** Instagram-style stories component (`FoodStoriesBar`, `FoodReelsModal`) for discovering trending dishes.

</details>

<details>
<summary><b>🧠 AI-Powered Dining Intelligence</b></summary>
<br>

- **FitMeal Planner:** Inputs your macro/calorie goals and automatically recommends meals that fit your diet.
- **AI Craving Engine:** Select your mood (e.g., "Cozy", "Spicy", "Comfort"), and our smart flavor profiler finds your perfect match.
- **Voice Assistant:** Hands-free voice ordering using native Web Speech APIs.

</details>

<details>
<summary><b>🎮 Immersive 3D & WebGL Gamification</b></summary>
<br>

- **Three.js Food Inspector:** Rotate, zoom, and inspect your food in real-time 3D before ordering.
- **Ambient Particle Physics:** Floating 3D particle system giving the app an alive, dynamic feel.
- **Gamified Discounts:** Spin-the-wheel and Mystery Box systems to unlock exclusive promo codes.

</details>

<details>
<summary><b>🌐 Full-Stack Node.js Architecture</b></summary>
<br>

- **Express.js API Layer:** Secure, robust REST endpoints for handling everything from auth to geocoding.
- **JWT Security:** Bearer token authorization, bcrypt hashing, and simulated OTP verification.
- **Location Engine:** Integrated with Google Maps for multi-city search and live restaurant distances.

</details>

<details>
<summary><b>🍽️ Multi-Sided Marketplace Tools</b></summary>
<br>

- **Table Reservations:** Multi-step party size and seating time picker.
- **Group Checkout:** Shared cart room generation for seamless split-bill group orders.
- **Merchant & Rider Dashboards:** Dedicated portals for restaurant owners and delivery drivers to manage live orders and availability.

</details>

---

## 🏛️ System Architecture

FoodDash uses a decoupled Client-Server architecture designed for scale and high performance.

```mermaid
graph TD
    A[Client Tier: Vite + Vanilla JS + CSS3] -->|HTTP / REST API| B[API Gateway / Express Server]
    A -->|Three.js Canvas| G[3D Food Inspector & Particle Engine]
    A -->|Web Speech API| H[AI Voice Assistant Engine]
    
    subgraph "Backend Services (Node.js & Express.js)"
        B --> C[Auth & JWT Security Service]
        B --> D[Location & Maps Engine]
        B --> E[Restaurant Catalog API]
        B --> F[Order Processing & Real-time State]
    end
    
    subgraph "Data Storage"
        C & D & E & F --> J[(File-Backed Relational DB)]
    end
```

---

## 🛠️ Tech Stack & Tools

### 🌐 Frontend (Web)
- **Framework:** `Vite` + `Vanilla ES6+ JavaScript`
- **Styling:** Custom `Vanilla CSS3` (Glassmorphism, CSS Grid, Flexbox)
- **3D Engine:** `Three.js (v0.185.1)`
- **Maps API:** `@googlemaps/js-api-loader`
- **Real-Time:** `socket.io-client`

### 📱 Frontend (Mobile)
- **Framework:** `React Native`
- **Toolchain:** `Expo` (Fast deployment via Expo Go)

### ⚙️ Backend (API Server)
- **Runtime:** `Node.js`
- **Framework:** `Express.js (v4.21)`
- **Security:** `jsonwebtoken` (Auth), `bcryptjs` (Hashing), `cors`
- **Database:** JSON File-Backed Store (Designed for seamless MongoDB/Prisma Migration)
- **Real-Time Engine:** `socket.io`

### 🛠 DevOps & Testing
- **Development Engine:** `concurrently` (runs Vite & Express simultaneously)
- **Testing Suite:** `vitest`, `supertest`, `jsdom`

---

## 🎨 Design System

FoodDash uses a bespoke, ultra-modern Glassmorphism design language tailored for dark mode displays. 

- **Primary Accent:** `<span style="color:#ff4b2b;">#FF4B2B (Spicy Orange)</span>`
- **Secondary Accent:** `<span style="color:#ff416c;">#FF416C (Neon Pink)</span>`
- **Background Layering:** Multiple gradients utilizing `#121212` and `#1a1a2e`.
- **Glass Effects:** Backdrop-filter blurring with `rgba(255, 255, 255, 0.05)` borders for premium depth.
- **Typography:** Sleek system-native san-serif fonts optimized for high-DPI screens.

---

## 🔌 API Reference

The backend Express server offers clean, RESTful endpoints. *(Requires valid JWT token for protected routes)*

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | `POST` | Authenticates user and returns JWT token |
| `/api/auth/register` | `POST` | Registers a new user with bcrypt hashed password |
| `/api/restaurants` | `GET` | Fetches a list of available restaurants based on location |
| `/api/orders` | `POST` | Submits a new order and triggers state machine |
| `/api/orders/:id` | `GET` | Retrieves real-time status of an order |

---

## 📂 Codebase Structure

```text
FOOD_DELIVERY/
├── public/                 # Static assets (images, icons, manifest.json)
├── server/                 # Express backend source code
│   ├── routes/             # Modular API endpoints
│   ├── db_data.json        # Database simulator
│   └── index.js            # Main Node.js server
├── src/                    # Frontend source code
│   ├── api/                # Axios/Fetch API wrappers
│   ├── components/         # 30+ Reusable UI components
│   ├── pages/              # Main application views
│   ├── styles/             # Modular CSS stylesheets
│   ├── utils/              # Three.js logic & utility scripts
│   └── main.js             # Vite application entry point
├── test/                   # Unit & API testing suite
└── index.html              # Main HTML document template
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Maps API Key** (Required for location tracking features)

### 2️⃣ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/zeeshansaeed6/FoodDash.git

# Navigate to directory
cd FoodDash

# Install all dependencies
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4️⃣ Boot Up the Platform
Start the frontend dev server and the backend API concurrently:
```bash
npm run dev
```

> **🎉 Success!** The frontend will be live at `http://localhost:5173` and the API at `http://localhost:5000`.

### 5️⃣ Mobile App (Expo Go)
To experience FoodDash on your phone via the React Native wrapper:
```bash
cd mobile-wrapper
npm install
npx expo start
```
> Scan the generated QR code with the **Expo Go** app on your iOS or Android device.

---

## 🤝 Contribute to FoodDash

We welcome all contributions! Whether it's reporting a bug, suggesting a new feature, or submitting a pull request.

1. **Fork** the Project
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**!

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <b>Developed with ❤️ to push the limits of modern web development.</b><br>
  <i>For collaboration, contributions, or technical queries, please reach out via GitHub issues.</i>
  <br><br>
  <a href="#-fooddash">⬆️ Back to Top</a>
</div>
