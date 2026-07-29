(() => {
  const originalBaseCompare = baseCompare;

  smartCompare = function smartCompare(a, b) {
    if (filter === "all") {
      const aHasCode = hasCodes(a);
      const bHasCode = hasCodes(b);
      if (aHasCode !== bHasCode) return aHasCode ? -1 : 1;

      const aTrending = a.cat === "hits";
      const bTrending = b.cat === "hits";
      if (aTrending !== bTrending) return aTrending ? -1 : 1;
    }

    return originalBaseCompare(a, b);
  };

  const originalBook = book;
  book = function bookWithPriorityLabel() {
    return originalBook().replace(
      "Trending first · coded songs next · then the rest",
      "Coded songs first · trending next · then the rest"
    );
  };

  render();
})();
