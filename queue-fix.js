(() => {
  "use strict";

  function recoverQueueButtons() {
    document.querySelectorAll("[data-res]").forEach(button => {
      if (button.dataset.queueFallbackReady === "true") return;
      button.dataset.queueFallbackReady = "true";
      button.addEventListener("click", () => {
        requestAnimationFrame(() => {
          const dialog = document.getElementById("queueDlg");
          if (dialog?.open) return;
          const code = button.dataset.res;
          const song = typeof SONGS !== "undefined" ? SONGS.find(item => item.code === code) : null;
          if (!song || !dialog) return;
          pending = code;
          const title = document.getElementById("qTitle");
          const singer = document.getElementById("singer");
          if (title) title.textContent = `Reserve ${song.title}`;
          if (singer) singer.value = "";
          try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); }
        });
      });
    });
  }

  const main = document.getElementById("main");
  if (main) {
    new MutationObserver(recoverQueueButtons).observe(main, { childList: true, subtree: true });
  }
  addEventListener("DOMContentLoaded", recoverQueueButtons, { once: true });
  setTimeout(recoverQueueButtons, 200);
})();