
/* =========================================
   GIDY CONNECT — APPLICATION ENGINE
   Version 1.0
========================================= */

const platforms = [
  {
    id: "facebook",
    name: "Facebook",
    symbol: "f",
    description: "Connect your Facebook"
  },
  {
    id: "instagram",
    name: "Instagram",
    symbol: "◎",
    description: "Connect your Instagram"
  },
  {
    id: "youtube",
    name: "YouTube",
    symbol: "▶",
    description: "Connect your YouTube"
  },
  {
    id: "tiktok",
    name: "TikTok",
    symbol: "♪",
    description: "Connect your TikTok"
  },
  {
    id: "telegram",
    name: "Telegram",
    symbol: "➤",
    description: "Connect your Telegram"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    symbol: "◉",
    description: "Connect your WhatsApp"
  }
];

const platformLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  tiktok: "https://www.tiktok.com/",
  telegram: "https://telegram.org/",
  whatsapp: "https://www.whatsapp.com/"
};

const socialContainer = document.getElementById(
  "social-platforms"
);

const addButton = document.getElementById("add-account");
const profileButton = document.getElementById("create-profile");

function renderPlatforms() {
  socialContainer.innerHTML = "";

  platforms.forEach(platform => {
    const card = document.createElement("button");

    card.className = "social-card";
    card.type = "button";

    const icon = document.createElement("span");
    icon.className = "social-icon";
    icon.textContent = platform.symbol;

    const name = document.createElement("h3");
    name.textContent = platform.name;

    const description = document.createElement("p");
    description.textContent = platform.description;

    card.append(icon, name, description);

    card.addEventListener("click", () => {
      openPlatform(platform.id);
    });

    socialContainer.appendChild(card);
  });
}

function openPlatform(platformId) {
  const url = platformLinks[platformId];

  if (!url) return;

  window.open(url, "_blank", "noopener,noreferrer");
}

addButton.addEventListener("click", () => {
  const platformNames = platforms
    .map((platform, index) =>
      `${index + 1}. ${platform.name}`
    )
    .join("\n");

  const choice = prompt(
    "Choose a social platform:\n\n" + platformNames
  );

  if (choice === null) return;

  const index = Number(choice) - 1;

  if (!Number.isInteger(index) ||
      index < 0 ||
      index >= platforms.length) {
    alert("Please enter a valid number.");
    return;
  }

  const platform = platforms[index];

  alert(
    `${platform.name} selected.\n\n` +
    "Official account authorization will be added " +
    "in our social integration phase."
  );
});

profileButton.addEventListener("click", () => {
  alert("Your personal profile section is coming soon.");
});

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
        " section is coming soon."
      );
    }
  });
});

// INITIALIZE APPLICATION

renderPlatforms();

console.log("Gidy Connect initialized successfully.");
