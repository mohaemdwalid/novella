function openTabFeed(evt, sectionId, tabName) {
  function applyToClass(className, callback) {
    Array.from(document.getElementsByClassName(className)).forEach(callback);
  }

  // hide all tabcontent panels for this section
  applyToClass("products-feed__tabcontent--" + sectionId, function (el) {
    el.style.display = "none";
  });

  // remove "active" from all tablinks for this section
  applyToClass("products-feed__tablinks--" + sectionId, function (el) {
    el.className = el.className.replace(" active", "");
  });

  // show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// show the first tabs by default on load - data-default-open
document.querySelectorAll("[data-default-open]").forEach(el => {
  el.click();
});
window.addEventListener("shopify:section:load", () => {
  document.querySelectorAll("[data-default-open]").forEach(el => {
    el.click();
  });
});
