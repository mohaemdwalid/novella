const createClipPath = (xStart, xEnd) => {
  return `clip-path: polygon(${xStart} 0, ${xEnd} 0, ${xEnd} 100%, ${xStart} 100%);`;
};

function slideBeforeAfter(sectionId) {
  const wrapperId = `#section-compare-slider-${sectionId}`;
  const currentVal = document.querySelector(`${wrapperId} input[type="range"]`).value;

  const handleLine = document.querySelector(`${wrapperId} .compare-slider__handle .compare-slider__handle-line`);
  
  const imgBefore = document.querySelector(`${wrapperId} .compare-slider__image-before`);
  const imgAfter = document.querySelector(`${wrapperId} .compare-slider__image-after`);
  
  const rtlImgBefore = document.querySelector(`[dir="rtl"] ${wrapperId} .compare-slider__image-before`);
  const rtlImgAfter = document.querySelector(`[dir="rtl"] ${wrapperId} .compare-slider__image-after`);

  if (imgBefore) imgBefore.style.cssText = createClipPath(`${currentVal}%`, '100%');
  if (rtlImgBefore) rtlImgBefore.style.cssText = createClipPath('0', `${100 - currentVal}%`);
  
  if (imgAfter) imgAfter.style.cssText = createClipPath('0', `${currentVal}%`);
  if (rtlImgAfter) rtlImgAfter.style.cssText = createClipPath(`${100 - currentVal}%`, '100%');
  
  if (handleLine) handleLine.style.cssText = `inset-inline-start: ${currentVal}%;`;
}

const bindCompareSliders = () => {
  document.querySelectorAll(".section-compare-slider").forEach((sliderNode) => {
    const sId = sliderNode.dataset.id;
    const rangeInput = document.querySelector(`#section-compare-slider-${sId} input[type="range"]`);
    if (rangeInput) {
      rangeInput.addEventListener("input", () => slideBeforeAfter(sId));
    }
  });
};

bindCompareSliders();

if (window.Shopify && Shopify.designMode) {
  document.addEventListener("shopify:section:load", bindCompareSliders);

  document.addEventListener("change", (e) => {
    if (e.target.matches('.section-compare-slider input[type="range"]')) {
      const parentSection = e.target.closest(".section-compare-slider");
      if (parentSection && parentSection.dataset.id) {
        slideBeforeAfter(parentSection.dataset.id);
      }
    }
  });
}
