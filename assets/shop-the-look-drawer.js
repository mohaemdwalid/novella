if (!customElements.get("shop-the-look-drawer")) {
  class ShopTheLookDrawer extends HTMLElement {
    constructor() {
      super();
      this._boundInit = this.init.bind(this);
      
      if (Shopify.designMode) {
        window.addEventListener("shopify:section:load", this._boundInit);
      }
      this.init();
    }

    init() {
      this.toggleState = false;
      this._boundClose = this.close.bind(this);
      this._boundOpen = this.open.bind(this);

      if (!this.classList.contains("is--open")) {
        document.body.classList.remove("overflow-hidden");
      }

      const closeBtn = this.querySelector(".button--close");
      if (closeBtn) closeBtn.addEventListener("click", this._boundClose);

      const backdrop = this.querySelector(".shop-the-look-drawer__backdrop");
      if (backdrop) backdrop.addEventListener("click", this._boundClose);

      const triggerElements = document.querySelectorAll(".shop-the-look-drawer__trigger");
      triggerElements.forEach(trigger => trigger.addEventListener("click", this._boundOpen));
    }

    toggle() {
      this.toggleState ? this.close() : this.open();
    }

    open() {
      this.toggleState = true;
      document.body.classList.add("overflow-hidden");
      this.classList.add("is--open");
    }

    close() {
      this.toggleState = false;
      document.body.classList.remove("overflow-hidden");
      this.classList.remove("is--open");
      this.toggleAriaExpanded();
    }

    toggleAriaExpanded(event) {
      if (event) {
        const btn = event.target.closest("button");
        if (btn) btn.setAttribute("aria-expanded", "true");
        
        const closeBtn = this.querySelector(".button--close");
        if (closeBtn) closeBtn.setAttribute("aria-expanded", "true");
      } else {
        const toggleButtons = document.querySelectorAll('[aria-controls="shop-the-look-drawer"]');
        toggleButtons.forEach(button => button.setAttribute("aria-expanded", "false"));
      }
    }
  }

  customElements.define("shop-the-look-drawer", ShopTheLookDrawer);
}
