// ============================================================
// Clean Minimalist Ambient Layer (3D Particles Disabled)
// ============================================================

export function init3DAmbientParticles() {
  const existing = document.getElementById('ambient-3d-particles-layer');
  if (existing) {
    existing.remove();
  }
}
