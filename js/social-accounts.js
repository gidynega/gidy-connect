
/* =========================================
   GIDY CONNECT — SOCIAL ACCOUNT MANAGER
   App Icons • Open Apps • Add • Edit • Delete
========================================= */

(() => {
  "use strict";

  const supabase = window.gidySupabase;
  const container = document.getElementById("social-platforms");
  const addButton = document.getElementById("add-account");
  const count = document.querySelector(".connection-count");

  if (!supabase || !container || !addButton) {
    console.error("Social account manager initialization failed.");
    return;
  }

  const platforms = {
    Facebook: {
      slug: "facebook",
      color: "#1877F2",
      package: "com.facebook.katana"
    },
    Instagram: {
      slug: "instagram",
      color: "#C13584",
      package: "com.instagram.android"
    },
    YouTube: {
      slug: "youtube",
      color: "#FF0033",
      package: "com.google.android.youtube"
    },
    TikTok: {
      slug: "tiktok",
      color: "#111111",
      package: "com.zhiliaoapp.musically"
    },
    Telegram: {
      slug: "telegram",
      color: "#229ED9",
      package: "org.telegram.messenger"
    },
    WhatsApp: {
      slug: "whatsapp",
      color: "#25D366",
      package: "com.whatsapp"
    },
    X: {
      slug: "x",
      color: "#111111",
      package: "com.twitter.android"
    },
    LinkedIn: {
      slug: "linkedin",
      color: "#0A66C2",
      package: "com.linkedin.android"
    },
    Snapchat: {
      slug: "snapchat",
      color: "#FFFC00",
      package: "com.snapchat.android"
    }
  };

  const platformNames = [
    ...Object.keys(platforms),
    "Other"
  ];

  let accounts = [];

  const style = document.createElement("style");

  style.textContent = `
    .sa-modal {
      position: fixed;
      inset: 0;
      z-index: 5000;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(0,0,0,.82);
    }

    .sa-box {
      width: 100%;
      max-width: 430px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      border: 1px solid #343957;
      border-radius: 20px;
      background: #111528;
      color: white;
    }

    .sa-box h2 { margin-bottom: 15px; }

    .sa-box input:not([type="checkbox"]),
    .sa-box select {
      display: block;
      width: 100%;
      padding: 13px;
      margin: 12px 0;
      border: 1px solid #39435f;
      border-radius: 10px;
      background: #090e1d;
      color: white;
      box-sizing: border-box;
    }

    .sa-actions {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .sa-actions button,
    .sa-submit {
      padding: 10px 14px;
      border: 0;
      border-radius: 9px;
      font-weight: 700;
    }

    .sa-submit { background: #65eee4; color: #090b16; }
    .sa-cancel { background: #292e46; color: white; }
    .sa-delete { background: #692b3b; color: white; }
    .sa-edit { background: #34345e; color: white; }
    .sa-visibility { background: #16454b; color: #65eee4; }

    .sa-card {
      padding: 17px;
      border: 1px solid #343957;
      border-radius: 16px;
      background: #151a30;
      min-width: 0;
    }

    .sa-card-head {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .sa-app-icon {
      width: 62px;
      height: 62px;
      min-width: 62px;
      border-radius: 17px;
      display: grid;
      place-items: center;
      overflow: hidden;
      text-decoration: none;
      box-shadow: 0 5px 18px rgba(0,0,0,.25);
    }

    .sa-app-icon img {
      width: 34px;
      height: 34px;
      object-fit: contain;
    }

    .sa-icon-fallback {
      color: white;
      font-size: 25px;
      font-weight: 800;
    }

    .sa-account-info {
      min-width: 0;
    }

    .sa-account-info strong {
      display: block;
      font-size: 17px;
      margin-bottom: 5px;
    }

    .sa-handle {
      color: #65eee4;
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .sa-open-label {
      display: inline-block;
      margin-top: 5px;
      color: #a6abc0;
      font-size: 12px;
      text-decoration: none;
    }

    .sa-card small {
      display: block;
      color: #a6abc0;
      margin-top: 15px;
    }

    .sa-message {
      color: #65eee4;
      font-size: 13px;
    }
  `;

  document.head.appendChild(style);

  function showMessage(message) {
    alert(message);
  }

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    return data.user;
  }

  function closeModal() {
    document.querySelector(".sa-modal")?.remove();
  }

  // Extract a readable account name without showing the full URL.
  function getAccountLabel(account) {
    try {
      const url = new URL(account.account_url);
      const parts = url.pathname.split("/").filter(Boolean);

      if (account.platform === "Instagram" && parts[0]) {
        return "@" + parts[0].replace(/^@/, "");
      }

      if (account.platform === "TikTok" && parts[0]) {
        return parts[0].startsWith("@")
          ? parts[0]
          : "@" + parts[0];
      }

      if (parts[0]) {
        return parts[0].length > 32
          ? parts[0].slice(0, 29) + "..."
          : parts[0];
      }

      return "View profile";
    } catch {
      return "View profile";
    }
  }

  // Android opens the installed app when possible.
  // If it is not installed, Android opens the website.
  function getAppLink(account) {
    const originalUrl = new URL(account.account_url);
    const info = platforms[account.platform];

    if (!info) return originalUrl.href;

    const cleanPath = originalUrl.pathname || "/";
    const fallback = encodeURIComponent(originalUrl.href);

    return (
      `intent://${originalUrl.host}${cleanPath}` +
      `#Intent;scheme=https;package=${info.package};` +
      `S.browser_fallback_url=${fallback};end`
    );
  }

  function openForm(account = null) {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "sa-modal";

    const options = platformNames.map(name =>
      `<option value="${name}" ${
        account?.platform === name ? "selected" : ""
      }>${name}</option>`
    ).join("");

    const safeUrl = account
      ? account.account_url
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
      : "";

    modal.innerHTML = `
      <form class="sa-box">
        <h2>${account ? "Edit Account" : "Add Social Account"}</h2>

        <label>Platform</label>
        <select id="sa-platform" required>${options}</select>

        <label>Account profile URL</label>
        <input
          id="sa-url"
          type="url"
          placeholder="https://..."
          value="${safeUrl}"
          required
        >

        <label>
          <input
            id="sa-visible"
            type="checkbox"
            ${account?.is_visible !== false ? "checked" : ""}
            style="display:inline;width:auto;margin-right:8px"
          >
          Show this account publicly
        </label>

        <div class="sa-actions">
          <button class="sa-submit" type="submit">
            ${account ? "Save Changes" : "Add Account"}
          </button>
          <button class="sa-cancel" type="button">Cancel</button>
        </div>

        <p class="sa-message" role="status"></p>
      </form>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector("form");
    const message = modal.querySelector(".sa-message");

    modal.querySelector(".sa-cancel").onclick = closeModal;

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const submit = form.querySelector(".sa-submit");
      submit.disabled = true;
      message.textContent = "Saving...";

      try {
        const user = await getUser();

        if (!user) {
          throw new Error("Please sign in before managing accounts.");
        }

        const platform = modal.querySelector("#sa-platform").value;
        const url = modal.querySelector("#sa-url").value.trim();
        const visible = modal.querySelector("#sa-visible").checked;

        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Please enter a valid HTTP or HTTPS URL.");
        }

        const record = {
          user_id: user.id,
          platform,
          account_url: parsedUrl.href,
          is_visible: visible
        };

        let result;

        if (account) {
          result = await supabase
            .from("social_accounts")
            .update(record)
            .eq("id", account.id)
            .eq("user_id", user.id);
        } else {
          result = await supabase
            .from("social_accounts")
            .insert(record);
        }

        if (result.error) throw result.error;

        closeModal();
        await loadAccounts();

        showMessage(
          account
            ? "Account updated successfully!"
            : "Account added successfully!"
        );

      } catch (error) {
        console.error(error);
        message.textContent = error.message || "Unable to save account.";
        submit.disabled = false;
      }
    });
  }

  function editAccount(id) {
    const account = accounts.find(item => item.id === id);
    if (account) openForm(account);
  }

  async function deleteAccount(id) {
    if (!confirm("Are you sure you want to remove this account?")) return;

    try {
      const user = await getUser();
      if (!user) throw new Error("Please sign in first.");

      const { error } = await supabase
        .from("social_accounts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await loadAccounts();
      showMessage("Account removed successfully!");

    } catch (error) {
      console.error(error);
      showMessage(error.message);
    }
  }

  async function toggleVisibility(id) {
    const account = accounts.find(item => item.id === id);
    if (!account) return;

    try {
      const user = await getUser();
      if (!user) throw new Error("Please sign in first.");

      const { error } = await supabase
        .from("social_accounts")
        .update({ is_visible: !account.is_visible })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await loadAccounts();

    } catch (error) {
      console.error(error);
      showMessage(error.message);
    }
  }

  function renderAccounts() {
    container.innerHTML = "";

    if (count) {
      count.textContent = `${accounts.length} Connected`;
    }

    accounts.forEach(account => {
      const card = document.createElement("div");
      card.className = "sa-card";

      const head = document.createElement("div");
      head.className = "sa-card-head";

      const info = platforms[account.platform];

      const appLink = document.createElement("a");
      appLink.className = "sa-app-icon";
      appLink.href = getAppLink(account);
      appLink.target = "_blank";
      appLink.rel = "noopener noreferrer";
      appLink.title = `Open ${account.platform}`;
      appLink.setAttribute(
        "aria-label",
        `Open ${account.platform} profile`
      );

      const background = info ? info.color : "#34345e";
      appLink.style.background = background;

      if (info) {
        const logo = document.createElement("img");
        logo.src = `https://cdn.simpleicons.org/${info.slug}/ffffff`;
        logo.alt = "";
        logo.onerror = () => {
          logo.remove();
          const fallback = document.createElement("span");
          fallback.className = "sa-icon-fallback";
          fallback.textContent = account.platform.charAt(0);
          appLink.appendChild(fallback);
        };
        appLink.appendChild(logo);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "sa-icon-fallback";
        fallback.textContent = "G";
        appLink.appendChild(fallback);
      }

      const accountInfo = document.createElement("div");
      accountInfo.className = "sa-account-info";

      const title = document.createElement("strong");
      title.textContent = account.platform;

      const handle = document.createElement("div");
      handle.className = "sa-handle";
      handle.textContent = getAccountLabel(account);

      const openText = document.createElement("a");
      openText.className = "sa-open-label";
      openText.href = getAppLink(account);
      openText.target = "_blank";
      openText.rel = "noopener noreferrer";
      openText.textContent = `Open ${account.platform}`;

      accountInfo.append(title, handle, openText);
      head.append(appLink, accountInfo);

      const status = document.createElement("small");
      status.textContent = account.is_visible ? "Public" : "Private";

      const actions = document.createElement("div");
      actions.className = "sa-actions";

      const visibility = document.createElement("button");
      visibility.className = "sa-visibility";
      visibility.textContent = account.is_visible
        ? "Make Private"
        : "Make Public";
      visibility.onclick = () => toggleVisibility(account.id);

      const edit = document.createElement("button");
      edit.className = "sa-edit";
      edit.textContent = "Edit";
      edit.onclick = () => editAccount(account.id);

      const remove = document.createElement("button");
      remove.className = "sa-delete";
      remove.textContent = "Remove";
      remove.onclick = () => deleteAccount(account.id);

      actions.append(visibility, edit, remove);
      card.append(head, status, actions);
      container.appendChild(card);
    });

    if (!accounts.length) {
      const empty = document.createElement("p");
      empty.textContent = "No social accounts added yet.";
      container.appendChild(empty);
    }
  }

  async function loadAccounts() {
    try {
      const user = await getUser();

      if (!user) {
        accounts = [];
        renderAccounts();
        return;
      }

      const { data, error } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      accounts = data || [];
      renderAccounts();

    } catch (error) {
      console.error("Loading social accounts failed:", error);
      showMessage(error.message);
    }
  }

  // Prevent the old Add button action from running.
  addButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    openForm();
  }, true);

  supabase.auth.onAuthStateChange(() => {
    setTimeout(loadAccounts, 0);
  });

  loadAccounts();

  console.log("Gidy Connect: Social account manager initialized.");

})();
