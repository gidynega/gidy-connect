
/* =========================================
   GIDY CONNECT — SOCIAL CONNECTION ENGINE
   Version 2.0
========================================= */

const platforms = [
  { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2" },
  { id: "instagram", name: "Instagram", icon: "◎", color: "#E4408F" },
  { id: "youtube", name: "YouTube", icon: "▶", color: "#FF0033" },
  { id: "tiktok", name: "TikTok", icon: "♪", color: "#25F4EE" },
  { id: "telegram", name: "Telegram", icon: "➤", color: "#29A9EB" },
  { id: "whatsapp", name: "WhatsApp", icon: "◉", color: "#25D366" }
];

const platformLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  tiktok: "https://www.tiktok.com/",
  telegram: "https://telegram.org/",
  whatsapp: "https://www.whatsapp.com/"
};

const socialContainer =
  document.getElementById("social-platforms");

const addButton =
  document.getElementById("add-account");

const profileButton =
  document.getElementById("create-profile");

// CREATE CONNECTION WINDOW

function createConnectionWindow() {
  const modal = document.createElement("div");

  modal.id = "connection-modal";
  modal.className = "connection-modal";

  modal.innerHTML = `
    <div class="connection-dialog">

      <button class="modal-close" aria-label="Close">
        ×
      </button>

      <div class="modal-heading">
        <span class="modal-eyebrow">GIDY CONNECT</span>
        <h2>Connect Your Social World</h2>
        <p>
          Choose a platform to explore its connection options.
        </p>
      </div>

      <input
        type="search"
        id="platform-search"
        class="platform-search"
        placeholder="Search social platforms..."
        aria-label="Search social platforms"
      >

      <div id="modal-platform-grid" class="modal-platform-grid"></div>

      <div id="platform-details" class="platform-details" hidden></div>

      <p class="modal-security">
        <span>🛡️</span>
        Your social passwords are never requested by Gidy Connect.
      </p>

    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".modal-close").addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", handleEscape);

  function handleEscape(event) {
    if (event.key === "Escape") closeModal();
  }

  function closeModal() {
    modal.remove();
    document.removeEventListener("keydown", handleEscape);
  }

  return modal;
}

// SHOW CONNECTION WINDOW

function openConnectionWindow() {
  if (document.getElementById("connection-modal")) return;

  const modal = createConnectionWindow();

  const grid = modal.querySelector("#modal-platform-grid");
  const search = modal.querySelector("#platform-search");
  const details = modal.querySelector("#platform-details");

  function renderChoices(query = "") {
    grid.innerHTML = "";

    const filtered = platforms.filter(platform =>
      platform.name.toLowerCase().includes(query.toLowerCase())
    );

    filtered.forEach(platform => {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "modal-platform-card";

      const icon = document.createElement("span");
      icon.className = "modal-platform-icon";
      icon.style.color = platform.color;
      icon.textContent = platform.icon;

      const name = document.createElement("strong");
      name.textContent = platform.name;

      const status = document.createElement("small");
      status.textContent = "Not connected";

      card.append(icon, name, status);

      card.addEventListener("click", () => {
        showPlatformDetails(platform);
      });

      grid.appendChild(card);
    });

    if (!filtered.length) {
      const message = document.createElement("p");
      message.className = "no-platforms";
      message.textContent = "No matching platforms found.";
      grid.appendChild(message);
    }
  }

  function showPlatformDetails(platform) {
    details.hidden = false;
    details.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Connect " + platform.name;

    const description = document.createElement("p");
    description.textContent =
      "Continue to the official " + platform.name +
      " website to access your account. Official account authorization " +
      "will be implemented in a later development phase.";

    const connect = document.createElement("button");
    connect.className = "official-connect-button";
    connect.textContent = "Open " + platform.name;

    connect.addEventListener("click", () => {
      window.open(
        platformLinks[platform.id],
        "_blank",
        "noopener,noreferrer"
      );
    });

    const back = document.createElement("button");
    back.className = "back-connect-button";
    back.textContent = "Choose another platform";

    back.addEventListener("click", () => {
      details.hidden = true;
      details.innerHTML = "";
    });

    details.append(title, description, connect, back);

    details.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  search.addEventListener("input", () => {
    renderChoices(search.value);
  });

  renderChoices();
}

// MAIN SOCIAL PLATFORM CARDS

function renderPlatforms() {
  socialContainer.innerHTML = "";

  platforms.forEach(platform => {
    const card = document.createElement("button");

    card.className = "social-card";
    card.type = "button";

    const icon = document.createElement("span");
    icon.className = "social-icon";
    icon.style.color = platform.color;
    icon.textContent = platform.icon;

    const name = document.createElement("h3");
    name.textContent = platform.name;

    const description = document.createElement("p");
    description.textContent = "Not connected";

    card.append(icon, name, description);

    card.addEventListener("click", () => {
      openConnectionWindow();
    });

    socialContainer.appendChild(card);
  });
}

// BUTTON EVENTS

addButton.addEventListener("click", openConnectionWindow);

profileButton.addEventListener("click", () => {
  alert("Personal profile development is coming soon.");
});

// NAVIGATION

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(nav => {
      nav.classList.remove("active");
    });

    item.classList.add("active");

    const page = item.dataset.page;

    if (page !== "home") {
      alert(
        page.charAt(0).toUpperCase() +
        page.slice(1) +
        " page is under development."
      );
    }
  });
});

// INITIALIZE

renderPlatforms();

console.log("Gidy Connect v2.0 initialized.");
