
/* =========================================
   GIDY CONNECT — EMAIL AUTHENTICATION
========================================= */

(() => {
  const supabase = window.gidySupabase;

  if (!supabase) {
    console.error("Supabase is not initialized.");
    return;
  }

  const profileButton = document.querySelector(".profile-button");

  const style = document.createElement("style");

  style.textContent = `
    .gidy-auth-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0,0,0,.8);
      display: grid;
      place-items: center;
      padding: 20px;
    }

    .gidy-auth-box {
      background: #111629;
      color: white;
      width: 100%;
      max-width: 400px;
      padding: 28px;
      border-radius: 18px;
      border: 1px solid #303957;
      font-family: inherit;
    }

    .gidy-auth-box h2 {
      margin-top: 0;
    }

    .gidy-auth-box input {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: 13px;
      margin: 12px 0;
      border-radius: 9px;
      border: 1px solid #39435f;
      background: #090e1d;
      color: white;
    }

    .gidy-auth-box button {
      padding: 12px;
      border-radius: 9px;
      border: none;
      cursor: pointer;
      margin-top: 10px;
    }

    .gidy-auth-submit {
      width: 100%;
      background: #65eee4;
      color: #090b16;
      font-weight: bold;
    }

    .gidy-auth-switch {
      background: transparent;
      color: #65eee4;
    }

    .gidy-auth-close {
      float: right;
      background: transparent;
      color: white;
      font-size: 22px;
    }

    .gidy-auth-message {
      font-size: 13px;
      overflow-wrap: anywhere;
      color: #65eee4;
    }
  `;

  document.head.appendChild(style);

  let mode = "login";
  let overlay = null;

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  function openAuth() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "gidy-auth-overlay";

    overlay.innerHTML = `
      <div class="gidy-auth-box">

        <button class="gidy-auth-close">×</button>

        <h2 id="gidy-auth-title">Welcome Back</h2>

        <p>Connect your digital world with Gidy Connect.</p>

        <form id="gidy-auth-form">

          <input
            id="gidy-auth-email"
            type="email"
            placeholder="Email address"
            autocomplete="email"
            required
          >

          <input
            id="gidy-auth-password"
            type="password"
            placeholder="Password (minimum 6 characters)"
            autocomplete="current-password"
            minlength="6"
            required
          >

          <button class="gidy-auth-submit" type="submit">
            Sign In
          </button>

        </form>

        <button class="gidy-auth-switch">
          Create a new account
        </button>

        <p class="gidy-auth-message" role="status"></p>

      </div>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector("#gidy-auth-form");
    const message = overlay.querySelector(".gidy-auth-message");
    const title = overlay.querySelector("#gidy-auth-title");
    const submit = overlay.querySelector(".gidy-auth-submit");
    const switchButton = overlay.querySelector(".gidy-auth-switch");

    function updateMode() {
      title.textContent =
        mode === "login" ? "Welcome Back" : "Create Your Account";

      submit.textContent =
        mode === "login" ? "Sign In" : "Create Account";

      switchButton.textContent =
        mode === "login"
          ? "Create a new account"
          : "Already have an account? Sign In";

      overlay.querySelector("#gidy-auth-password").autocomplete =
        mode === "login" ? "current-password" : "new-password";

      message.textContent = "";
    }

    switchButton.addEventListener("click", () => {
      mode = mode === "login" ? "signup" : "login";
      updateMode();
    });

    overlay.querySelector(".gidy-auth-close")
      .addEventListener("click", closeAuth);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeAuth();
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const email = overlay.querySelector("#gidy-auth-email").value.trim();
      const password = overlay.querySelector("#gidy-auth-password").value;

      submit.disabled = true;
      submit.textContent = "Please wait...";
      message.textContent = "";

      try {
        let result;

        if (mode === "signup") {
          result = await supabase.auth.signUp({
            email,
            password
          });
        } else {
          result = await supabase.auth.signInWithPassword({
            email,
            password
          });
        }

        if (result.error) throw result.error;

        if (mode === "signup" && !result.data.session) {
          message.textContent =
            "Account created! Check your email to confirm your account.";
        } else {
          message.textContent =
            mode === "signup"
              ? "Account created successfully!"
              : "Welcome back! Sign in successful.";

          setTimeout(closeAuth, 1200);
        }

      } catch (error) {
        message.textContent = error.message;
      } finally {
        submit.disabled = false;
        updateMode();
      }
    });

    updateMode();
  }

  function closeAuth() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  async function updateProfileButton(session) {
    if (!profileButton) return;

    profileButton.title = session
      ? "Signed in: " + session.user.email
      : "Sign in or create an account";

    profileButton.setAttribute("aria-label", profileButton.title);
  }

  profileButton?.addEventListener("click", async () => {
    const session = await getSession();

    if (session) {
      const shouldSignOut = confirm(
        "You are signed in. Do you want to sign out?"
      );

      if (shouldSignOut) {
        const { error } = await supabase.auth.signOut();

        if (error) alert(error.message);
      }
    } else {
      openAuth();
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    updateProfileButton(session);
  });

  getSession().then(updateProfileButton);

  console.log("Gidy Connect authentication initialized.");
})();
