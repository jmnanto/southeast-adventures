if (window.location.protocol === "file:") {
  document.querySelectorAll("[data-local-href]").forEach((link) => {
    link.href = link.dataset.localHref;
  });
}
