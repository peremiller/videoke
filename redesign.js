(() => {
  const CODE_FILTER = "codes";
  let enhancing = false;

  function text(el){ return (el?.textContent || "").trim().toLowerCase(); }

  function classifyCard(card){
    const badges = [...card.querySelectorAll(".badge")].map(text);
    return {
      coded: badges.some(v => v.includes("verified code") || v.includes("code available")) || !!card.querySelector(".vendor"),
      trending: badges.some(v => v.includes("trending"))
    };
  }

  function reorderCards(){
    const grid = document.querySelector(".song-grid");
    if(!grid) return;
    const cards = [...grid.children].filter(el => el.classList.contains("song"));
    const sorted = [...cards].sort((a,b) => {
      const ac = classifyCard(a), bc = classifyCard(b);
      if(ac.coded !== bc.coded) return ac.coded ? -1 : 1;
      if(ac.trending !== bc.trending) return ac.trending ? -1 : 1;
      return text(a.querySelector(".title")).localeCompare(text(b.querySelector(".title")));
    });
    const changed = sorted.some((card,index) => card !== cards[index]);
    if(changed) sorted.forEach(card => grid.appendChild(card));
  }

  function applyCodesFilter(active){
    const grid = document.querySelector(".song-grid");
    if(!grid) return;
    [...grid.children].forEach(card => {
      if(!card.classList.contains("song")) return;
      card.hidden = active && !classifyCard(card).coded;
    });
    const visible = [...grid.children].filter(card => card.classList.contains("song") && !card.hidden).length;
    const count = document.querySelector(".sectionbar .muted");
    if(count && active) count.textContent = `${visible} result${visible===1?"":"s"}`;
  }

  function ensureCodeFilter(){
    const chips = document.querySelector(".chips");
    if(!chips || chips.querySelector('[data-cat="codes"]')) return;
    const button = document.createElement("button");
    button.className = "chip codes-only-chip";
    button.dataset.cat = CODE_FILTER;
    button.textContent = "🔢 Songs with codes";
    button.addEventListener("click", event => {
      event.preventDefault();
      chips.querySelectorAll(".chip").forEach(chip => chip.classList.remove("on"));
      button.classList.add("on");
      applyCodesFilter(true);
      const heading = document.querySelector(".sectionbar h3");
      if(heading) heading.textContent = "Songs with codes";
    });
    chips.prepend(button);
  }

  function openRandomNonAjSong(){
    if(typeof SONGS === "undefined") return;
    const eligible = SONGS.filter(song => song.cat !== "originals" && !/aj miller/i.test(song.artist || ""));
    if(!eligible.length) return;
    const song = eligible[Math.floor(Math.random() * eligible.length)];
    pending = song.code;
    const title = document.getElementById("qTitle");
    const singer = document.getElementById("singer");
    const dialog = document.getElementById("queueDlg");
    if(title) title.textContent = `Reserve ${song.title}`;
    if(singer) singer.value = "";
    if(dialog && !dialog.open) dialog.showModal();
  }

  document.addEventListener("click", event => {
    const surpriseButton = event.target.closest("[data-random]");
    if(!surpriseButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openRandomNonAjSong();
  }, true);

  function enhance(){
    if(enhancing) return;
    enhancing = true;
    document.documentElement.classList.add("videoke-redesign");
    ensureCodeFilter();
    reorderCards();
    requestAnimationFrame(() => { enhancing = false; });
  }

  const main = document.getElementById("main");
  if(main){
    let scheduled = false;
    new MutationObserver(() => {
      if(scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        enhance();
      });
    }).observe(main,{childList:true,subtree:true});
  }
  addEventListener("DOMContentLoaded", enhance, {once:true});
  setTimeout(enhance, 250);
})();