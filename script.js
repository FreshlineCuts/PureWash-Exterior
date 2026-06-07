const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const quoteForm = document.querySelector("#quoteForm");
const estimateTotal = document.querySelector("#estimateTotal");
const formStatus = document.querySelector("#formStatus");
const windowCount = document.querySelector("#windowCount");
const stories = document.querySelector("#stories");
const windowService = document.querySelector("#windowService");
const pressureService = document.querySelector("#pressureService");
const businessPhone = "+16085123562";

function updateEstimate() {
  const windows = Number(windowCount.value) || 0;
  const storyCount = Number(stories.value) || 1;
  let low = 0;
  let high = 0;

  if (windowService.checked) {
    low += Math.max(200, windows * 10);
    high += Math.max(200, windows * 12);
  }

  if (pressureService.checked) {
    low += 120;
    high += 240;
  }

  if (storyCount === 2) {
    low *= 1.12;
    high *= 1.16;
  }

  if (storyCount >= 3) {
    low *= 1.26;
    high *= 1.34;
  }

  if (!windowService.checked && !pressureService.checked) {
    estimateTotal.textContent = "Select a service";
    return;
  }

  const roundedLow = Math.round(low / 10) * 10;
  const roundedHigh = Math.round(high / 10) * 10;
  estimateTotal.textContent = `$${roundedLow} - $${roundedHigh}`;
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

[windowCount, stories, windowService, pressureService].forEach((control) => {
  control.addEventListener("input", updateEstimate);
  control.addEventListener("change", updateEstimate);
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const name = data.get("name") || "there";
  const contact = data.get("contact") || "Not provided";
  const notes = data.get("notes") || "No extra notes";
  const serviceList = [
    windowService.checked ? "window cleaning" : "",
    pressureService.checked ? "pressure washing upon request" : "",
  ]
    .filter(Boolean)
    .join(" and ");
  const message = [
    "PureWash estimate request",
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Services: ${serviceList || "service not selected"}`,
    `Windows: ${windowCount.value}`,
    `Stories: ${stories.value}`,
    `Estimate shown: ${estimateTotal.textContent}`,
    `Notes: ${notes}`,
  ].join("\n");

  formStatus.textContent = `Thanks, ${name}. Opening a text message to 608-512-3562.`;
  window.location.href = `sms:${businessPhone}?&body=${encodeURIComponent(message)}`;
});

updateEstimate();
