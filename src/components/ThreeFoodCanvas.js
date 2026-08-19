// ============================================================
// FoodDash — Interactive WebGL 3D Food Stage (Three.js Engine)
// ============================================================
import * as THREE from 'three';

let renderer = null;
let scene = null;
let camera = null;
let currentFoodGroup = null;
let particleSystem = null;
let animationFrameId = null;
let currentDishType = 'burger';
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let pointLight = null;

export function mount3DFoodStage(containerElement, onSelectDish) {
  if (!containerElement) return;

  // Cleanup old instance if present
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  containerElement.innerHTML = '';

  const width = containerElement.clientWidth || 440;
  const height = containerElement.clientHeight || 360;

  // 1. Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1.2, 5.2);

  // 2. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  containerElement.appendChild(renderer.domElement);

  // 3. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x88ccff, 1.2);
  fillLight.position.set(-5, 3, -3);
  scene.add(fillLight);

  pointLight = new THREE.PointLight(0xff7700, 2.5, 8);
  pointLight.position.set(0, 2, 2);
  scene.add(pointLight);

  // 4. Background Floating Glow Particles
  createAmbient3DParticles();

  // 5. Build Initial 3D Food Mesh
  load3DFoodModel(currentDishType);

  // 6. Mouse Interaction & Drag Orbit
  const dom = renderer.domElement;
  dom.style.cursor = 'grab';

  dom.addEventListener('mousedown', (e) => {
    isDragging = true;
    dom.style.cursor = 'grabbing';
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging && currentFoodGroup) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      currentFoodGroup.rotation.y += deltaX * 0.008;
      currentFoodGroup.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    // Move dynamic point light with cursor for specular shimmer
    const rect = dom.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (pointLight) {
      pointLight.position.x = nx * 3;
      pointLight.position.y = ny * 2 + 1;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    dom.style.cursor = 'grab';
  });

  // Touch Support
  dom.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && currentFoodGroup && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      currentFoodGroup.rotation.y += deltaX * 0.008;
      currentFoodGroup.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 7. Animation Render Loop
  let clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (currentFoodGroup && !isDragging) {
      currentFoodGroup.rotation.y += 0.006;
      currentFoodGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
    }

    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.03;
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.002;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  function handleResize() {
    if (!containerElement || !renderer || !camera) return;
    const w = containerElement.clientWidth || 440;
    const h = containerElement.clientHeight || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', handleResize);
}

// Switch 3D Food Dish
export function switch3DFood(type) {
  currentDishType = type;
  load3DFoodModel(type);
}

function load3DFoodModel(type) {
  if (!scene) return;

  if (currentFoodGroup) {
    scene.remove(currentFoodGroup);
  }

  currentFoodGroup = new THREE.Group();

  switch (type) {
    case 'burger':
      build3DBurger(currentFoodGroup);
      break;
    case 'pizza':
      build3DPizza(currentFoodGroup);
      break;
    case 'drink':
      build3DDrink(currentFoodGroup);
      break;
    case 'sushi':
      build3DSushi(currentFoodGroup);
      break;
    case 'cupcake':
      build3DCupcake(currentFoodGroup);
      break;
    default:
      build3DBurger(currentFoodGroup);
  }

  currentFoodGroup.position.set(0, 0, 0);
  currentFoodGroup.rotation.set(0.2, 0.4, 0);
  scene.add(currentFoodGroup);
}

// ----------------- Procedural 3D Mesh Builders -----------------

function build3DBurger(group) {
  // Materials
  const bunMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97724,
    roughness: 0.4,
    metalness: 0.1
  });
  const pattyMaterial = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.8
  });
  const cheeseMaterial = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.3
  });
  const tomatoMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.2
  });
  const lettuceMaterial = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
    side: THREE.DoubleSide
  });
  const seedMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.2
  });

  // Bottom Bun
  const bottomBunGeo = new THREE.CylinderGeometry(1.2, 1.1, 0.35, 32);
  const bottomBun = new THREE.Mesh(bottomBunGeo, bunMaterial);
  bottomBun.position.y = -0.6;
  group.add(bottomBun);

  // Patty
  const pattyGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.4, 32);
  const patty = new THREE.Mesh(pattyGeo, pattyMaterial);
  patty.position.y = -0.22;
  group.add(patty);

  // Melted Cheese
  const cheeseGeo = new THREE.BoxGeometry(2.3, 0.08, 2.3);
  const cheese = new THREE.Mesh(cheeseGeo, cheeseMaterial);
  cheese.position.y = 0.02;
  cheese.rotation.y = 0.4;
  group.add(cheese);

  // Tomato Slice
  const tomatoGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.16, 32);
  const tomato = new THREE.Mesh(tomatoGeo, tomatoMaterial);
  tomato.position.y = 0.16;
  group.add(tomato);

  // Crisp Lettuce
  const lettuceGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 16);
  const lettuce = new THREE.Mesh(lettuceGeo, lettuceMaterial);
  lettuce.position.y = 0.3;
  lettuce.rotation.z = 0.05;
  group.add(lettuce);

  // Top Bun Dome
  const topBunGeo = new THREE.SphereGeometry(1.25, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const topBun = new THREE.Mesh(topBunGeo, bunMaterial);
  topBun.position.y = 0.34;
  topBun.scale.set(1, 0.65, 1);
  group.add(topBun);

  // Sesame Seeds on Top Bun
  for (let i = 0; i < 28; i++) {
    const seedGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const seed = new THREE.Mesh(seedGeo, seedMaterial);
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * 0.8;
    const rad = 1.18;
    seed.position.x = rad * Math.cos(u) * Math.sin(v);
    seed.position.y = 0.34 + rad * Math.cos(v) * 0.65;
    seed.position.z = rad * Math.sin(u) * Math.sin(v);
    seed.scale.set(1.5, 0.8, 0.8);
    group.add(seed);
  }
}

function build3DPizza(group) {
  const crustMaterial = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
  const cheeseMaterial = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
  const sauceMaterial = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 });
  const pepperoniMaterial = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 });
  const basilMaterial = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 });

  // Outer Crust Ring
  const crustGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 48);
  const crust = new THREE.Mesh(crustGeo, crustMaterial);
  crust.rotation.x = Math.PI / 2;
  group.add(crust);

  // Base Dough & Sauce
  const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32);
  const base = new THREE.Mesh(baseGeo, sauceMaterial);
  group.add(base);

  // Melted Cheese Surface
  const cheeseGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.09, 32);
  const cheese = new THREE.Mesh(cheeseGeo, cheeseMaterial);
  cheese.position.y = 0.02;
  group.add(cheese);

  // Pepperoni Slices
  const numPep = 10;
  for (let i = 0; i < numPep; i++) {
    const pepGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16);
    const pep = new THREE.Mesh(pepGeo, pepperoniMaterial);
    const angle = (i / numPep) * Math.PI * 2 + (Math.random() * 0.3);
    const dist = 0.4 + (i % 2 === 0 ? 0.6 : 0.2);
    pep.position.set(Math.cos(angle) * dist, 0.08, Math.sin(angle) * dist);
    pep.rotation.y = Math.random();
    group.add(pep);
  }

  // Basil Leaves
  for (let j = 0; j < 6; j++) {
    const leafGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const leaf = new THREE.Mesh(leafGeo, basilMaterial);
    leaf.scale.set(1.5, 0.2, 0.8);
    const a = j * 1.1;
    leaf.position.set(Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7);
    leaf.rotation.set(0.1, j, 0.2);
    group.add(leaf);
  }

  group.rotation.x = 0.6;
}

function build3DDrink(group) {
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5
  });
  const liquidMaterial = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    transparent: true,
    opacity: 0.85,
    roughness: 0.2
  });
  const bobaMaterial = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.1 });
  const strawMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3 });
  const iceMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.1 });

  // Glass Cup
  const cupGeo = new THREE.CylinderGeometry(0.9, 0.7, 2.2, 32, 1, true);
  const cup = new THREE.Mesh(cupGeo, glassMaterial);
  group.add(cup);

  // Liquid
  const liquidGeo = new THREE.CylinderGeometry(0.85, 0.68, 1.8, 32);
  const liquid = new THREE.Mesh(liquidGeo, liquidMaterial);
  liquid.position.y = -0.15;
  group.add(liquid);

  // Boba Pearls
  for (let i = 0; i < 18; i++) {
    const bobaGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const boba = new THREE.Mesh(bobaGeo, bobaMaterial);
    const r = Math.random() * 0.5;
    const a = Math.random() * Math.PI * 2;
    boba.position.set(Math.cos(a) * r, -0.9 + Math.random() * 0.3, Math.sin(a) * r);
    group.add(boba);
  }

  // Floating Ice Cubes
  for (let k = 0; k < 3; k++) {
    const iceGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const ice = new THREE.Mesh(iceGeo, iceMaterial);
    ice.position.set((k - 1) * 0.3, 0.4 + k * 0.1, (k % 2 === 0 ? 0.2 : -0.2));
    ice.rotation.set(0.3 * k, 0.5 * k, 0.2);
    group.add(ice);
  }

  // Straw
  const strawGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16);
  const straw = new THREE.Mesh(strawGeo, strawMaterial);
  straw.position.set(0.2, 0.4, 0);
  straw.rotation.z = -0.2;
  group.add(straw);
}

function build3DSushi(group) {
  const riceMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
  const salmonMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
  const noriMaterial = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.7 });
  const wasabiMaterial = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.8 });

  // Rice Block
  const riceGeo = new THREE.BoxGeometry(2.0, 0.7, 1.1);
  const rice = new THREE.Mesh(riceGeo, riceMaterial);
  rice.position.y = -0.2;
  group.add(rice);

  // Salmon Fillet
  const salmonGeo = new THREE.BoxGeometry(2.2, 0.35, 1.2);
  const salmon = new THREE.Mesh(salmonGeo, salmonMaterial);
  salmon.position.y = 0.3;
  salmon.rotation.z = 0.05;
  group.add(salmon);

  // Nori Band
  const noriGeo = new THREE.BoxGeometry(0.4, 1.1, 1.25);
  const nori = new THREE.Mesh(noriGeo, noriMaterial);
  nori.position.y = 0.05;
  group.add(nori);

  // Wasabi dollop
  const wasabiGeo = new THREE.ConeGeometry(0.35, 0.5, 16);
  const wasabi = new THREE.Mesh(wasabiGeo, wasabiMaterial);
  wasabi.position.set(-1.4, -0.2, 0.6);
  group.add(wasabi);
}

function build3DCupcake(group) {
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const creamMaterial = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
  const cherryMaterial = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.1 });
  const sprinkleMaterial = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });

  // Cupcake Base
  const baseGeo = new THREE.CylinderGeometry(0.9, 0.6, 1.0, 24);
  const base = new THREE.Mesh(baseGeo, baseMaterial);
  base.position.y = -0.5;
  group.add(base);

  // Cream Swirl
  const cream1 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 16), creamMaterial);
  cream1.position.y = 0.2;
  cream1.scale.set(1, 0.6, 1);
  group.add(cream1);

  const cream2 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 16), creamMaterial);
  cream2.position.y = 0.65;
  cream2.scale.set(1, 0.7, 1);
  group.add(cream2);

  // Cherry on Top
  const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), cherryMaterial);
  cherry.position.y = 1.15;
  group.add(cherry);

  // Sprinkles
  for (let i = 0; i < 20; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.14), sprinkleMaterial);
    const u = Math.random() * Math.PI * 2;
    sp.position.set(Math.cos(u) * 0.75, 0.25 + Math.random() * 0.4, Math.sin(u) * 0.75);
    sp.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(sp);
  }
}

// ----------------- 3D Floating Particle Atmosphere -----------------
function createAmbient3DParticles() {
  const particleCount = 70;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0xff6b00),
    new THREE.Color(0xef4444),
    new THREE.Color(0x10b981),
    new THREE.Color(0xfacc15),
    new THREE.Color(0x818cf8)
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.7
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}
