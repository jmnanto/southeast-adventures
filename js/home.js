const directory = document.querySelector("#app-list");
const entries = Array.from(directory.querySelectorAll(".directory-app"));
const filters = document.querySelector(".app-filters");
const filterButtons = Array.from(filters.querySelectorAll("button"));
const filterStatus = document.querySelector("#filter-status");

function applyFilter(platform) {
  let visibleCount = 0;
  for (const entry of entries) {
    entry.hidden = platform !== "all" && entry.dataset.platform !== platform;
    if (!entry.hidden) visibleCount++;
  }
  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === platform));
  }
  filterStatus.textContent = `${visibleCount} apps shown`;
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (button) applyFilter(button.dataset.filter);
});
filters.hidden = false;

window.addEventListener("hashchange", () => {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.closest(".directory-app[hidden]")) {
    applyFilter("all");
    target.scrollIntoView();
  }
});

const carousel = document.querySelector(".app-carousel");
const controls = carousel.querySelector(".carousel-controls");
const indicator = controls.querySelector(".carousel-position");
const featured = carousel.querySelector(".featured-card");
const featuredIcon = featured.querySelector("img");
const featuredPlatform = featured.querySelector(".platform-label");
const featuredName = featured.querySelector("h3");
const featuredDescription = featured.querySelector(".featured-description");
const featuredLink = featured.querySelector(".featured-link");
const previews = [...carousel.querySelectorAll(".carousel-preview")];

// Keep the crawlable directory as the source of the carousel's app details.
const apps = entries.map((entry) => {
  const link = entry.querySelector("h3 a");
  return {
    name: link.textContent,
    url: link.getAttribute("href"),
    platform: entry.querySelector(".platform-label").textContent,
    icon: entry.querySelector("img").getAttribute("src"),
    description: entry.querySelector("p").textContent,
  };
});
const firstFeatured = apps.findIndex((app) => app.url === featuredLink.getAttribute("href"));
apps.push(...apps.splice(0, firstFeatured));
let current = 0;

function showApp(step) {
  current = (current + step + apps.length) % apps.length;
  const app = apps[current];

  featuredIcon.src = app.icon;
  featuredName.textContent = app.name;
  featuredPlatform.textContent = app.platform;
  featuredDescription.textContent = app.description;
  featuredLink.href = app.url;
  featuredLink.textContent = `View ${app.name}`;
  previews.forEach((preview, index) => {
    const offset = index === 0 ? -1 : 1;
    const adjacent = apps[(current + apps.length + offset) % apps.length];
    preview.querySelector("img").src = adjacent.icon;
    preview.querySelector("span").textContent = adjacent.name;
  });

  indicator.textContent = `${current + 1} / ${apps.length}`;
  const announcement = document.createElement("span");
  announcement.className = "visually-hidden";
  announcement.textContent = ` featured apps: ${app.name}`;
  indicator.append(announcement);
}

controls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-direction]");
  if (button) showApp(Number(button.dataset.direction));
});

carousel.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showApp(event.key === "ArrowLeft" ? -1 : 1);
  }
});

showApp(0);
controls.hidden = false;
previews.forEach((preview) => { preview.hidden = false; });
