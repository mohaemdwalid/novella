if (!customElements.get("product-tabs")) {
  class ProductTabs extends HTMLElement {
    constructor() {
      super();
      this.id = this.getAttribute("id");

      if (Shopify.designMode) {
        window.addEventListener(
          "shopify:section:load",
          this.init.bind(this)
        );
      }
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.bindTabTriggers();
      this.openDefaultTab();
    }

    bindTabTriggers() {
      const triggers = this.querySelectorAll(".product__tab--trigger");
      triggers.forEach((trigger) => {
        trigger.addEventListener("click", (evt) => {
          this.openTab(evt, trigger.dataset.tab);
        });
      });
    }

    openDefaultTab() {
      const defaultTab = this.querySelector(".product__tab[data-default-open]");
      if (defaultTab) {
        defaultTab.click();
      }
    }

    openTab(evt, tabName) {
      const allContents = this.querySelectorAll(".product__tab-content");
      const allLinks = this.querySelectorAll(".product__tab");

      allContents.forEach((content) => {
        content.style.display = "none";
      });

      allLinks.forEach((link) => {
        link.classList.remove("active");
      });

      const targetContent = this.querySelector(`#${tabName}`);
      if (targetContent) {
        targetContent.style.display = "block";
        if (evt && evt.currentTarget) {
          evt.currentTarget.classList.add("active");
        }
      }
    }
  }
  customElements.define("product-tabs", ProductTabs);
}
