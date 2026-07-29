(() => {
  const KEY = "videokeph.unified.v1";
  const VERIFIED = {
    "12001": {
      platinum: {
        code: "1426",
        model: "Platinum P-Series Vol. 59 (legacy)",
        source: "Published Platinum Karaoke P-Series Vol. 59 songbook",
        verifiedAt: "2026-07-29"
      }
    },
    "14001": {
      platinum: {
        code: "3057",
        model: "Platinum P-Series Vol. 59 (legacy)",
        source: "Published Platinum Karaoke P-Series Vol. 59 songbook",
        verifiedAt: "2026-07-29"
      }
    },
    "20005": {
      platinum: {
        code: "8267",
        model: "Platinum P-Series Vol. 59 (legacy)",
        source: "Published Platinum Karaoke P-Series Vol. 59 songbook",
        verifiedAt: "2026-07-29"
      }
    },
    "20015": {
      platinum: {
        code: "11703",
        model: "Platinum P-Series Vol. 59 (legacy)",
        source: "Published Platinum Karaoke P-Series Vol. 59 songbook",
        verifiedAt: "2026-07-29"
      }
    }
  };

  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    saved = {};
  }

  saved.codes = saved.codes && typeof saved.codes === "object" ? saved.codes : {};
  for (const [songCode, brands] of Object.entries(VERIFIED)) {
    saved.codes[songCode] = { ...brands, ...(saved.codes[songCode] || {}) };
  }
  localStorage.setItem(KEY, JSON.stringify(saved));

  const style = document.createElement("style");
  style.textContent = `
    .vendor{position:relative;min-height:74px;background:linear-gradient(145deg,#142944,#0b1b31);border-color:#57e8ff66;box-shadow:inset 0 0 0 1px #57e8ff12}
    .vendor b{color:#b8c8db;font-size:10px}
    .vendor span{font-size:20px!important;line-height:1.15;color:#7cecff!important;overflow:visible!important;text-overflow:clip!important}
    .vendor small{display:block;margin-top:6px;color:#91a5bd;font-size:10px;line-height:1.25}
    .badge.code-ready{background:#5ce1a518;border-color:#5ce1a54d;color:#8ff0c5}
  `;
  document.head.appendChild(style);

  if (typeof CATS !== "undefined") CATS.codes = "🔢 Songs with codes";

  if (typeof songRow === "function") {
    songRow = function(s) {
      const vendors = Object.entries(BRANDS).flatMap(([k, n]) => {
        const v = vendorData(s, k);
        return v ? [`<div class="vendor" title="${esc(v.source || v.model || "Verified catalog match")}"><b>${n}</b><span>${esc(v.code)}</span><small>${esc(v.model || "Verified catalog")}</small></div>`] : [];
      }).join("");
      return `<article class="song"><div class="song-top"><div class="appcode">${s.code}</div><div class="meta"><div class="title">${esc(s.title)}</div><div class="artist">${esc(s.artist)} · ${s.year} · ${s.ukc}</div><div class="badges">${s.cat === "hits" ? '<span class="badge trend">🔥 Trending</span>' : ""}${hasCodes(s) ? '<span class="badge code-ready">🔢 Code available</span>' : ""}</div></div><button class="btn pink" data-res="${s.code}">Queue</button></div>${vendors ? `<div class="codes">${vendors}</div>` : ""}<div class="song-actions"><button class="fav ${state.favs.includes(s.code) ? "on" : ""}" data-fav="${s.code}">★ Favorite</button><button class="btn ghost" data-edit="${s.code}">＋ Machine code</button></div></article>`;
    };
  }

  if (typeof book === "function") {
    book = function() {
      let list = SONGS.filter(s => {
        if (filter === "fav" && !state.favs.includes(s.code)) return false;
        if (filter === "codes" && !hasCodes(s)) return false;
        if (!["all", "fav", "codes"].includes(filter) && s.cat !== filter) return false;
        const q = query.trim().toLowerCase();
        return !q || searchable(s).includes(q);
      });
      list.sort(smartCompare);
      return hero() + `<div class="toolbar"><input id="search" class="search" placeholder="Search title, artist, UKC, or machine code" value="${esc(query)}"><select id="sort" class="select"><option value="title" ${sort === "title" ? "selected" : ""}>Sort rest: Title</option><option value="year" ${sort === "year" ? "selected" : ""}>Sort rest: Newest</option><option value="trending" ${sort === "trending" ? "selected" : ""}>Sort rest: Popularity</option></select><button class="btn ghost" data-clear>Clear</button></div><div class="chips">${Object.entries(CATS).map(([k, v]) => `<button class="chip ${filter === k ? "on" : ""}" data-cat="${k}">${v}</button>`).join("")}</div><div class="sectionbar"><div><h3>${CATS[filter]}</h3><span class="muted">${list.length} result${list.length === 1 ? "" : "s"}</span></div><span class="muted">${filter === "codes" ? "Showing only songs with verified machine codes" : filter === "all" ? "Trending first · coded songs next · then the rest" : "Verified machine codes are displayed below each matching song"}</span></div><div class="song-grid">${list.map(songRow).join("") || '<div class="empty">No songs found.</div>'}</div>`;
    };
  }

  if (typeof render === "function") render();
})();