if (!customElements.get('product-recommendations')) {
  class ProductRecommendations extends HTMLElement {
    constructor() {
      super();
      this.slider = null;
    }

    connectedCallback() {
      this.performRecommendations();
    }

    performRecommendations() {
      const targetEl = this.querySelector('[data-recommendations]');
      if (!targetEl) return;
      
      fetch(this.dataset.url)
        .then(res => res.text())
        .then(htmlString => {
          const parsedDom = new DOMParser().parseFromString(htmlString, 'text/html');
          const newHtml = parsedDom.querySelector('[data-recommendations]')?.innerHTML;
          
          if (!newHtml) return;
          
          this.classList.remove('hidden');
          
          const fullCart = document.querySelector('.cart-drawer-items__full');
          if (fullCart) fullCart.classList.remove('cart-drawer-items__full');
          
          targetEl.innerHTML = newHtml;
          this.initSlider();

          setTimeout(() => {
            const quickCart = document.querySelector("quick-cart-drawer");
            if (quickCart) {
              quickCart.init();
            } else {
              this.querySelectorAll(".quick-cart-drawer__trigger").forEach(trigger => trigger.remove());
            }
          }, 500);
        });
    }

    initSlider() {
      this.slider = new Swiper(this.querySelector('.swiper'), {
        slidesPerView: 'auto',
        spaceBetween: 16,
      });
    }
  }

  customElements.define('product-recommendations', ProductRecommendations);
}
