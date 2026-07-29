(() => {
  const CODE_FILTER = "codes";

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
    cards.sort((a,b) => {
      const ac = classifyCard(a), bc = classifyCard(b);
      if(ac.coded !== bc.coded) return ac.coded ? -1 : 1;
      if(ac.trending !== bc.trending) return ac.trending ? -1 : 1;
      return text(a.querySelector(".title")).localeCompare(text(b.querySelector(".title")));
    });
    cards.forEach(card => grid.appendChild(card));
  }

  function applyCodesFilter(active){
    const grid = document.querySelector(".song-grid");
    if(!grid) return;
    [...grid.children].forEach(card => {
      if(!card.classList.contains("song")) return;
      card.style.display = !active || classifyCard(card).coded ? "" : "none";
    });
    const visible = [...grid.children].filter(card => card.classList.contains("song") && card.style.display !== "none").length;
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
    button.addEventListener("click", () => {
      chips.querySelectorAll(".chip").forEach(chip => chip.classList.remove("on"));
      button.classList.add("on");
      applyCodesFilter(true);
      const heading = document.querySelector(".sectionbar h3");
      if(heading) heading.textContent = "Songs with codes";
    });
    chips.prepend(button);
  }

  function enhance(){
    document.documentElement.classList.add("videoke-redesign");
    ensureCodeFilter();
    reorderCards();
  }

  const main = document.getElementById("main");
  if(main){
    new MutationObserver(() => requestAnimationFrame(enhance)).observe(main,{childList:true,subtree:true});
  }
  addEventListener("DOMContentLoaded", enhance, {once:true});
  setTimeout(enhance, 250);
})();