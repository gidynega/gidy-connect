
/* =========================================
   GIDY CONNECT — EMAIL AUTHENTICATION
   Complete improved version
========================================= */

(() => {
  "use strict";

  const supabase = window.gidySupabase;

  if (!supabase) {
    console.error("Supabase is not initialized.");
    return;
  }

  const profileButton = document.querySelector(".profile-button");

  if (!profileButton) {
    console.error("Profile button not found.");
    return;
  }

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
      box-sizing: border-box;
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

    .gidy-auth-box button:disabled {
      opacity: .6;
      cursor: wait;
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
      min-height: 18px;
    }

    .gidy-auth-message.error {
      color: #ff7777;
    }
  `;

  document.head.appendChild(style);

  let mode = "login";
  let overlay = null;

  async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session;
  }

  function openAuth() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "gidy-auth-overlay";

    overlay.innerHTML = `
      <div class="gidy-auth-box">

        <button
          class="gidy-auth-close"
          type="button"
          aria-label="Close"
        >×</button>

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

          <button
            class="gidy-auth-submit"
            type="submit"
          >Sign In</button>

        </form>

        <button
          class="gidy-auth-switch"
          type="button"
        >Create a new account</button>

        <p
          class="gidy-auth-message"
          role="status"
          aria-live="polite"
        ></p>

      </div>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector("#gidy-auth-form");
    const emailInput = overlay.querySelector("#gidy-auth-email");
    const passwordInput = overlay.querySelector("#gidy-auth-password");
    const message = overlay.querySelector(".gidy-auth-message");
    const title = overlay.querySelector("#gidy-auth-title");
    const submit = overlay.querySelector(".gidy-auth-submit");
    const switchButton = overlay.querySelector(".gidy-auth-switch");

    function showMessage(text, isError = false) {
      message.textContent = text;
      message.classList.toggle("error", isError);
    }

    function updateMode() {
      title.textContent =
        mode === "login"
          ? "Welcome Back"
          : "Create Your Account";

      submit.textContent =
        mode === "login"
          ? "Sign In"
          : "Create Account";

      switchButton.textContent =
        mode === "login"
          ? "Create a new account"
          : "Already have an account? Sign In";

      passwordInput.autocomplete =
        mode === "login"
          ? "current-password"
          : "new-password";

      showMessage("");
    }

    switchButton.addEventListener("click", () => {
      if (submit.disabled) return;

      mode = mode === "login" ? "signup" : "login";

      updateMode();
    });

    overlay.querySelector(".gidy-auth-close")
      .addEventListener("click", closeAuth);

    overlay.addEventListener("click", event => {
      if (event.target === overlay && !submit.disabled) {
        closeAuth();
      }
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (submit.disabled) return;

      if (!form.reportValidity()) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const currentMode = mode;

      submit.disabled = true;
      switchButton.disabled = true;

      submit.textContent = "Please wait...";

      showMessage(
        currentMode === "signup"
          ? "Creating your account..."
          : "Signing you in..."
      );

      try {
        let result;

        if (currentMode === "signup") {
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

        if (result.error) {
          throw result.error;
        }

        if (currentMode === "signup") {

          if (!result.data.session) {
            showMessage(
              "Registration successful! Please check your email to verify your account."
            );
          } else {
            showMessage("Account created successfully!");

            setTimeout(() => {
              closeAuth();
            }, 1500);
          }

        } else {
          showMessage("Welcome back! Login successful.");

          setTimeout(() => {
            closeAuth();
          }, 1200);
        }

      } catch (error) {
        console.error("Gidy Connect authentication error:", error);

        showMessage(
          error.message || "Something went wrong. Please try again.",
          true
        );

      } finally {
        submit.disabled = false;
        switchButton.disabled = false;

        submit.textContent =
          currentMode === "login"
            ? "Sign In"
            : "Create Account";
      }
    });

    updateMode();
  }

  function closeAuth() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }

    mode = "login";
  }

  async function updateProfileButton(session) {
    profileButton.title = session
      ? "Signed in: " + session.user.email
      : "Sign in or create an account";

    profileButton.setAttribute(
      "aria-label",
      profileButton.title
    );
  }

  profileButton.addEventListener("click", async () => {
    try {
      const session = await getSession();

      if (session) {
        const shouldSignOut = confirm(
          "You are signed in. Do you want to sign out?"
        );

        if (shouldSignOut) {
          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          alert("You have signed out successfully.");

          await updateProfileButton(null);
        }

      } else {
        openAuth();
      }

    } catch (error) {
      console.error("Authentication session error:", error);
      alert(error.message || "Unable to check your account.");
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    updateProfileButton(session);
  });

  getSession()
    .then(updateProfileButton)
    .catch(error => {
      console.error("Session initialization error:", error);
    });

  console.log("Gidy Connect authentication initialized.");

})();
