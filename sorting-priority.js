(() => {
  const originalBaseCompare = window.baseCompare;

  window.smartCompare = function smartCompare(a, b) {
    if (window.filter === "all") {
      const aHasCode = window.hasCodes(a);
      const bHasCode = window.hasCodes(b);
      if (aHasCode !== bHasCode) return aHasCode ? -1 : 1;

      const aTrending = a.cat === "hits";
      const bTrending = b.cat === "hits";
      if (aTrending !== bTrending) return aTrending ? -1 : 1;
    }

    return originalBaseCompare(a, b);
  };

  const originalBook = window.book;
  window.book = function bookWithPriorityLabel() {
    return originalBook().replace(
      "Trending first · coded songs next · then the rest",
      "Coded songs first · trending next · then the rest"
    );
  };

  if (typeof window.render === "function") window.render();
})();
