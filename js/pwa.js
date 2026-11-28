
/* =================================
   GIDY CONNECT — PWA INSTALLATION
================================= */

(() => {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers are not supported.");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(registration => {
        console.log(
          "Gidy Connect PWA ready:",
          registration.scope
        );
      })
      .catch(error => {
        console.error(
          "PWA registration failed:",
          error
        );
      });
  });
})();
