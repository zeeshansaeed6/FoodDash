// ============================================================
// Footer Component
// ============================================================

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.id = 'main-footer';

  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">
            <span>🍔</span>
            <span class="footer__logo-text">FoodDash</span>
          </div>
          <p class="footer__desc">
            Discover the best food & drinks in your city. Order from top restaurants with lightning-fast delivery and exclusive offers.
          </p>
          <div class="footer__socials">
            <a href="#" class="footer__social-link" aria-label="Instagram">📸</a>
            <a href="#" class="footer__social-link" aria-label="Twitter">🐦</a>
            <a href="#" class="footer__social-link" aria-label="Facebook">📘</a>
            <a href="#" class="footer__social-link" aria-label="YouTube">🎬</a>
          </div>
        </div>

        <div>
          <h4 class="footer__col-title">Company</h4>
          <a href="#" class="footer__link">About Us</a>
          <a href="#" class="footer__link">Careers</a>
          <a href="#" class="footer__link">Blog</a>
          <a href="#" class="footer__link">Press</a>
          <a href="#" class="footer__link">Contact</a>
        </div>

        <div>
          <h4 class="footer__col-title">For You</h4>
          <a href="#" class="footer__link">Partner with Us</a>
          <a href="#" class="footer__link">Ride with Us</a>
          <a href="#" class="footer__link">FoodDash Pro</a>
          <a href="#" class="footer__link">Gift Cards</a>
        </div>

        <div>
          <h4 class="footer__col-title">Support</h4>
          <a href="#" class="footer__link">Help Center</a>
          <a href="#" class="footer__link">Safety</a>
          <a href="#" class="footer__link">FAQ</a>
          <a href="#" class="footer__link">Accessibility</a>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">© 2026 FoodDash. All rights reserved. Made with ❤️ in India.</p>
        <div class="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  `;

  return footer;
}
