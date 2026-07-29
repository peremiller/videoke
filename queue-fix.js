(() => {
  "use strict";

  function getSong(code) {
    return typeof SONGS !== "undefined" ? SONGS.find(song => song.code === code) : null;
  }

  function openQueueDialog(code) {
    const song = getSong(code);
    const dialog = document.getElementById("queueDlg");
    const title = document.getElementById("qTitle");
    const singer = document.getElementById("singer");
    if (!song || !dialog || !title || !singer) return;

    pending = code;
    title.textContent = `Reserve ${song.title}`;
    singer.value = "";
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => singer.focus());
  }

  function openQueueTab() {
    tab = "queue";
    if (typeof render === "function") render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", event => {
    const reserveButton = event.target.closest("[data-res]");
    if (reserveButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openQueueDialog(reserveButton.dataset.res);
      return;
    }

    const queueTab = event.target.closest('nav button[data-tab="queue"]');
    if (queueTab) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openQueueTab();
    }
  }, true);

  const addButton = document.getElementById("qAdd");
  if (addButton) {
    addButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const song = getSong(pending);
      if (!song) return;

      const singer = document.getElementById("singer")?.value.trim() || "";
      state.queue = Array.isArray(state.queue) ? state.queue : [];
      state.queue.push({ ...song, singer });
      if (typeof save === "function") save();
      document.getElementById("queueDlg")?.close();
      if (typeof toast === "function") toast(`Queued: ${song.title}`);
      if (typeof render === "function") render();
    }, true);
  }

  const cancelButton = document.getElementById("qCancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.getElementById("queueDlg")?.close();
    }, true);
  }
})();