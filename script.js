const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const bookingForm = document.querySelector("#booking-form");
const arrivalInput = document.querySelector("#arrival");
const departureInput = document.querySelector("#departure");
const bookingStatus = document.querySelector("#booking-status");

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

arrivalInput.min = localToday;
departureInput.min = localToday;

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  }
});

arrivalInput.addEventListener("change", () => {
  departureInput.min = arrivalInput.value || localToday;
  if (departureInput.value && departureInput.value <= arrivalInput.value) {
    departureInput.value = "";
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const arrival = new Date(`${arrivalInput.value}T12:00:00`);
  const departure = new Date(`${departureInput.value}T12:00:00`);
  if (departure <= arrival) {
    departureInput.setCustomValidity("Choose a departure date after your arrival.");
    departureInput.reportValidity();
    departureInput.setCustomValidity("");
    return;
  }

  const formatDate = (date) => new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
  const guestCount = Number(document.querySelector("#guests").value);
  bookingStatus.textContent = `${formatDate(arrival)} – ${formatDate(departure)} · ${guestCount} ${guestCount === 1 ? "guest" : "guests"}. Your dates are selected.`;
});