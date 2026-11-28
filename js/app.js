
/* =========================================
   GIDY CONNECT — NAVIGATION ENGINE
   Version 3.0
========================================= */

(() => {
  "use strict";

  const main = document.getElementById("main-content");
  const navItems = document.querySelectorAll(".nav-item");

  if (!main) return;

  const welcome = main.querySelector(".welcome-section");
  const dashboard = main.querySelector(".dashboard-section");
  const profileSection = main.querySelector(".profile-section");

  if (!welcome || !dashboard || !profileSection) {
    console.error("Gidy Connect: Required sections missing.");
    return;
  }

  // Create independent page containers
  const homePage = document.createElement("section");
  homePage.id = "home-page";

  const connectPage = document.createElement("section");
  connectPage.id = "connect-page";

  const workspace = document.createElement("section");
  workspace.id = "gidy-workspace";

  homePage.append(welcome, profileSection);
  connectPage.appendChild(dashboard);

  main.append(homePage, connectPage, workspace);

  // Workspace styling
  const style = document.createElement("style");

  style.textContent = `
    #home-page,
    #connect-page,
    #gidy-workspace {
      width: 100%;
      animation: gidyPageIn .25s ease;
    }

    #connect-page,
    #gidy-workspace {
      display: none;
      min-height: 70vh;
      padding-top: 30px;
      padding-bottom: 30px;
    }

    .gidy-page-heading {
      margin-bottom: 25px;
    }

    .gidy-page-heading h1 {
      font-size: 27px;
      margin-bottom: 7px;
    }

    .gidy-page-heading p {
      color: #969bb4;
      font-size: 14px;
    }

    .gidy-workspace-card {
      padding: 22px;
      margin-bottom: 18px;
      border: 1px solid rgba(154,145,255,.2);
      border-radius: 19px;
      background: #111528;
    }

    .gidy-workspace-card h3 {
      margin-bottom: 9px;
    }

    .gidy-workspace-card p {
      color: #969bb4;
      font-size: 14px;
    }

    .gidy-workspace-button {
      margin-top: 16px;
      padding: 12px 18px;
      border: 1px solid #8178ff;
      border-radius: 11px;
      background: #222541;
      color: white;
      font-weight: 700;
    }

    .gidy-empty-state {
      padding: 45px 20px;
      text-align: center;
      border: 1px solid rgba(154,145,255,.17);
      border-radius: 19px;
      background: #111528;
    }

    .gidy-empty-state .empty-icon {
      font-size: 42px;
      margin-bottom: 12px;
    }

    .gidy-empty-state p {
      color: #969bb4;
      margin-top: 8px;
      font-size: 13px;
    }

    @keyframes gidyPageIn {
      from {
        opacity: 0;
        transform: translateY(7px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  document.head.appendChild(style);

  // Switch between independent pages
  function navigate(page) {

    homePage.style.display = "none";
    connectPage.style.display = "none";
    workspace.style.display = "none";

    navItems.forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.page === page
      );
    });

    if (page === "home") {
      homePage.style.display = "block";
    }

    else if (page === "connections") {
      connectPage.style.display = "block";
    }

    else {
      workspace.style.display = "block";
      renderWorkspace(page);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Build workspace content
  function renderWorkspace(page) {

    workspace.innerHTML = "";

    if (page === "inbox") {
      workspace.innerHTML = `
        <div class="gidy-page-heading">
          <h1>Inbox</h1>
          <p>Your conversations in one place.</p>
        </div>

        <div class="gidy-empty-state">
          <div class="empty-icon">✉</div>
          <h3>Your Messages</h3>
          <p>
            Your Gidy Connect conversations will
            appear here.
          </p>
          <p>
            Native messaging and supported external
            integrations are coming in our next development phase.
          </p>
        </div>
      `;
    }

    else if (page === "notifications") {
      workspace.innerHTML = `
        <div class="gidy-page-heading">
          <h1>Activity</h1>
          <p>Stay updated with your digital identity.</p>
        </div>

        <div class="gidy-empty-state">
          <div class="empty-icon">♧</div>
          <h3>No Activity Yet</h3>
          <p>
            New notifications and account activity
            will appear here.
          </p>
        </div>
      `;
    }

    else if (page === "profile") {
      workspace.innerHTML = `
        <div class="gidy-page-heading">
          <h1>My Profile</h1>
          <p>Manage your Gidy Connect identity.</p>
        </div>

        <div class="gidy-workspace-card">
          <h3>Your Digital Identity</h3>
          <p>
            Create your personal profile and share
            your social connections through one link.
          </p>

          <button
            class="gidy-workspace-button"
            id="workspace-create-profile"
          >
            Create Your Profile
          </button>
        </div>

        <div class="gidy-workspace-card">
          <h3>Account & Security</h3>
          <p>
            Manage your login and account security
            using the account button at the top.
          </p>
        </div>
      `;

      document
        .getElementById("workspace-create-profile")
        ?.addEventListener("click", () => {
          showProfileSetup();
        });
    }
  }

  // Profile creation entry point
  function showProfileSetup() {
    workspace.innerHTML = `
      <div class="gidy-page-heading">
        <h1>Create Your Profile</h1>
        <p>Start building your digital identity.</p>
      </div>

      <div class="gidy-workspace-card">
        <h3>Personal Profile</h3>
        <p>
          Your profile setup will include your name,
          username, profile photo, biography,
          social links and privacy settings.
        </p>
        <p style="margin-top:12px">
          The next development step will connect
          this profile to your Supabase database.
        </p>
      </div>

      <button
        class="gidy-workspace-button"
        id="back-to-profile"
      >
        Back to Profile
      </button>
    `;

    document
      .getElementById("back-to-profile")
      ?.addEventListener("click", () => {
        renderWorkspace("profile");
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bottom navigation events
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navigate(item.dataset.page);
    });
  });

  // Create Your Profile button on Home
  const createProfileButton =
    document.getElementById("create-profile");

  createProfileButton?.addEventListener("click", () => {
    navigate("profile");
    showProfileSetup();
  });

  // Initial page
  navigate("home");

  console.log("Gidy Connect navigation v3.0 initialized.");

})();
