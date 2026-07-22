(function () {
  const config = window.byfFakeCurrency;

  if (!config || !config.countries) return;

  const getCountryConfig = (countryIso) => {
    return config.countries[countryIso] || config.countries.QA;
  };

  const getActiveCountryConfig = () => getCountryConfig(config.currentCountryIso);

  const getLocale = (countryIso) => {
    const languageIso = config.currentLanguageIso === "ar" ? "ar" : "en";
    return `${languageIso}-${countryIso}`;
  };

  const formatConvertedAmount = (minorAmount, countryIso) => {
    if (minorAmount === null || minorAmount === undefined || minorAmount === "") return "";

    const countryConfig = getCountryConfig(countryIso);
    const baseMajor = parseFloat(minorAmount) / 100;
    const convertedMajor = baseMajor * countryConfig.rate;

    return new Intl.NumberFormat(getLocale(countryIso), {
      style: "currency",
      currency: countryConfig.currency,
    }).format(convertedMajor);
  };

  const updateMoneyNodes = (root) => {
    root.querySelectorAll("[data-money-convert]").forEach((node) => {
      if (node.dataset.byfCurrencyRendered === config.currentCountryIso) return;
      const amount = node.getAttribute("data-money-convert");
      node.textContent = formatConvertedAmount(amount, config.currentCountryIso);
      node.dataset.byfCurrencyRendered = config.currentCountryIso;
    });
  };

  const renderPriceContainer = (container) => {
    if (container.dataset.byfCurrencyRendered === config.currentCountryIso) return;

    const price = parseInt(container.dataset.price || "0", 10);
    const priceMin = parseInt(container.dataset.priceMin || price || "0", 10);
    const priceMax = parseInt(container.dataset.priceMax || price || "0", 10);
    const compareAtPrice = parseInt(container.dataset.compareAtPrice || "0", 10);
    const compareAtPriceMin = parseInt(container.dataset.compareAtPriceMin || "0", 10);
    const compareAtPriceMax = parseInt(container.dataset.compareAtPriceMax || "0", 10);
    const regularLabel = container.dataset.labelPriceRegular || "";
    const saleLabel = container.dataset.labelPriceSale || "";
    const fromLabel = container.dataset.labelPriceFrom || "";
    const priceVaries = priceMin !== priceMax;

    if (priceVaries) {
      if (compareAtPriceMax > priceMax || compareAtPriceMin > priceMin) {
        container.innerHTML = `
          <div class="price__sale">
            <div class="price__sale-inner">
              <span class="visually-hidden">${regularLabel}</span>
              <s>${formatConvertedAmount(compareAtPriceMax, config.currentCountryIso)}</s>
              <ins>
                ${fromLabel}
                <span>${formatConvertedAmount(priceMin, config.currentCountryIso)}</span>
                <span aria-hidden="true">-</span>
                <span>${formatConvertedAmount(priceMax, config.currentCountryIso)}</span>
              </ins>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="price__regular">
            <span>${formatConvertedAmount(priceMin, config.currentCountryIso)}</span>
            <span aria-hidden="true">-</span>
            <span>${formatConvertedAmount(priceMax, config.currentCountryIso)}</span>
          </div>
        `;
      }

      container.dataset.byfCurrencyRendered = config.currentCountryIso;
      return;
    }

    if (compareAtPrice > price) {
      container.innerHTML = `
        <div class="price__sale">
          <div class="price__sale-inner">
            <span class="visually-hidden">${saleLabel}</span>
            <s>${formatConvertedAmount(compareAtPrice, config.currentCountryIso)}</s>
            <ins>${formatConvertedAmount(price, config.currentCountryIso)}</ins>
          </div>
        </div>
      `;
      container.dataset.byfCurrencyRendered = config.currentCountryIso;
      return;
    }

    container.innerHTML = `
      <div class="price__regular">
        <span class="visually-hidden">${regularLabel}</span>
        <span>${formatConvertedAmount(price, config.currentCountryIso)}</span>
      </div>
    `;
    container.dataset.byfCurrencyRendered = config.currentCountryIso;
  };

  const updatePriceContainers = (root) => {
    root.querySelectorAll(".price__container").forEach(renderPriceContainer);
  };

  const updateCountryLabels = (root) => {
    const activeCountry = getActiveCountryConfig();
    root.querySelectorAll("[data-current-country-label]").forEach((node) => {
      if (node.dataset.byfCurrencyRendered === config.currentCountryIso) return;
      node.textContent = `${activeCountry.countryName} | ${activeCountry.currency}`;
      node.dataset.byfCurrencyRendered = config.currentCountryIso;
    });

    root.querySelectorAll("[data-country-code]").forEach((node) => {
      if (node.dataset.byfCurrencyRendered) return;
      const countryConfig = getCountryConfig(node.getAttribute("data-country-code"));
      node.textContent = `${countryConfig.countryName} (${countryConfig.currency})`;
      node.dataset.byfCurrencyRendered = "true";
    });
  };

  const updateCheckoutNotes = (root) => {
    root.querySelectorAll(".cart__summary-tax, .cart-drawer__summary-tax").forEach((node) => {
      if (node.dataset.byfCheckoutCurrencyApplied === "true") return;
      node.insertAdjacentHTML("beforeend", ` <span data-byf-checkout-note>${config.checkoutCurrencyNote}</span>`);
      node.dataset.byfCheckoutCurrencyApplied = "true";
    });
  };

  const applyFakeCurrency = (root = document) => {
    updatePriceContainers(root);
    updateMoneyNodes(root);
    updateCountryLabels(root);
    updateCheckoutNotes(root);
  };

  const originalFormatPrice = typeof window.formatPrice === "function" ? window.formatPrice : null;

  window.formatPrice = function (amount, moneyString) {
    if (config.currentCountryIso && config.currentCountryIso !== "QA") {
      return formatConvertedAmount(amount, config.currentCountryIso);
    }

    if (originalFormatPrice) {
      return originalFormatPrice(amount, moneyString);
    }

    return formatConvertedAmount(amount, "QA");
  };

  window.Shopify = window.Shopify || {};
  window.Shopify.currency = window.Shopify.currency || {};
  window.Shopify.currency.rate = getActiveCountryConfig().rate;

  document.addEventListener("DOMContentLoaded", function () {
    applyFakeCurrency(document);

    let frameRequested = false;
    const observer = new MutationObserver(() => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(() => {
        frameRequested = false;
        applyFakeCurrency(document);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
