(() => {
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

  const mergeCodes = key => {
    let state = {};
    try {
      state = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      state = {};
    }
    state.codes = state.codes && typeof state.codes === "object" ? state.codes : {};
    for (const [songCode, brands] of Object.entries(VERIFIED)) {
      state.codes[songCode] = { ...(state.codes[songCode] || {}), ...brands };
    }
    localStorage.setItem(key, JSON.stringify(state));
  };

  mergeCodes("videokeph.multibrand.v1");
  mergeCodes("videokeph.unified.v1");

  const applyCompactHero = () => {
    if (document.getElementById("videokeph-compact-hero")) return;
    const style = document.createElement("style");
    style.id = "videokeph-compact-hero";
    style.textContent = `
      main{padding-top:16px!important}
      .hero{grid-template-columns:minmax(0,1fr) 320px!important;gap:12px!important;margin-bottom:12px!important}
      .hero-main{padding:20px 24px!important;min-height:0!important}
      .hero-main:after{width:180px!important;height:180px!important;right:-70px!important;top:-80px!important}
      .hero h2,.hero-main h2{font-size:clamp(28px,3.2vw,46px)!important;line-height:1!important;margin:6px 0 8px!important;letter-spacing:-1.8px!important}
      .hero p,.hero-main p{font-size:13px!important;line-height:1.45!important;margin:0!important;max-width:760px!important}
      .hero .actions{margin-top:12px!important}
      .hero .btn{padding:9px 12px!important;font-size:12px!important}
      .stats{padding:12px!important;gap:8px!important}
      .stat{padding:11px 12px!important;border-radius:14px!important}
      .stat strong{font-size:22px!important;line-height:1!important}
      .stat span{font-size:10px!important}
      .toolbar{margin-top:0!important}
      @media(max-width:820px){
        .hero{grid-template-columns:1fr!important}
        .stats{grid-template-columns:repeat(4,1fr)!important}
      }
      @media(max-width:600px){
        main{padding-top:12px!important}
        .hero-main{padding:18px!important}
        .hero .actions{display:none!important}
        .stats{grid-template-columns:repeat(2,1fr)!important}
      }
    `;
    document.head.appendChild(style);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCompactHero, { once: true });
  } else {
    applyCompactHero();
  }
})();