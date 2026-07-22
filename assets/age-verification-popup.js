class AgeVerificationPopup extends ModalDialog {
  constructor() {
    super();
    if (Shopify.designMode) {
      window.addEventListener('shopify:section:load', this.init.bind(this));
    }
    this.init();
  }

  init() {
    this.ageVerified = getCookie("age-verified");
    this.noButton = this.querySelector(".button-no");
    this.yesButton = this.querySelector(".button-yes");
    this.newsletterPopup = document.getElementById("NewsletterModal-newsletter-popup");

    if (this.noButton) {
      this.noButton.addEventListener("click", () => {
        setCookie("age-verified", "false");
        window.history.length > 1 ? window.history.back() : (window.location.href = this.noButton.href);
      });
    }

    if (this.yesButton) {
      this.yesButton.addEventListener("click", () => {
        setCookie("age-verified", "true");
        this.hide();
      });
    }

    setTimeout(() => {
      if (this.hasAttribute("open") && this.classList.contains("age-verification-popup--blurred")) {
        document.body.classList.add("age-verification-popup-is-open");
      }
    }, 5000);
  }

  connectedCallback() {
    if (Shopify.designMode) {
      if (this.dataset.openInDesignMode === "true") this.show();
      return;
    }

    if (!this.ageVerified || this.ageVerified === "false") {
      if (this.newsletterPopup) {
        this.newsletterPopup.classList.add("newsletter-popup-is-hidden");
      }
      this.show();
    }
  }

  show() {
    super.show();
    if (this.classList.contains("age-verification-popup--blurred")) {
      document.body.classList.add("age-verification-popup-is-open");
    }
  }

  hide() {
    super.hide();
    document.body.classList.remove("age-verification-popup-is-open");

    if (this.hasAttribute("data-open-in-design-mode")) {
      this.removeAttribute("data-open-in-design-mode");
    }

    if (this.newsletterPopup) {
      this.newsletterPopup.classList.remove("newsletter-popup-is-hidden");
    }
  }
}

customElements.define("age-verification-popup", AgeVerificationPopup);
