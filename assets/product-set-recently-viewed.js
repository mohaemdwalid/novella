document.addEventListener("DOMContentLoaded", () => {
  const addRecentProductHandle = () => {
    const storedHandles = localStorage.getItem("recently-viewed");
    const currentHandle = document.querySelector(".js-product")?.dataset.productHandle;

    if (!currentHandle) return;

    if (storedHandles) {
      if (storedHandles.includes(currentHandle)) return;

      const handleList = [currentHandle, ...storedHandles.split(",")];
      if (handleList.length > 10) handleList.pop();

      localStorage.setItem("recently-viewed", handleList.join(","));
    } else {
      localStorage.setItem("recently-viewed", currentHandle);
    }
  };
  addRecentProductHandle();
});
