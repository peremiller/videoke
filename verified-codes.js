(() => {
  const KEY = "videokeph.multibrand.v1";
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

  let state;
  try {
    state = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    state = {};
  }

  state.codes = state.codes && typeof state.codes === "object" ? state.codes : {};
  let changed = false;

  for (const [songCode, brands] of Object.entries(VERIFIED)) {
    state.codes[songCode] = state.codes[songCode] || {};
    for (const [brand, entry] of Object.entries(brands)) {
      const current = state.codes[songCode][brand];
      if (!current || current.code !== entry.code || current.model !== entry.model) {
        state.codes[songCode][brand] = entry;
        changed = true;
      }
    }
  }

  if (changed) {
    localStorage.setItem(KEY, JSON.stringify(state));
    if (!sessionStorage.getItem("videokeph.verified-codes.loaded")) {
      sessionStorage.setItem("videokeph.verified-codes.loaded", "1");
      location.reload();
    }
  }
})();
