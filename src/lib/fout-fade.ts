const showMain = () => {
  document.getElementsByTagName('main')[0].classList.add('opacity-100');
  document.getElementsByTagName('main')[0].classList.remove('opacity-0');
};
const hasFont = (fontName: string) => {
  return document.fonts.check(`1rem '${fontName}'`);
};

(async () => {
  const fontName = document.getElementsByTagName('main')[0]?.dataset?.foutFont;
  if (!fontName) {
    setTimeout(showMain, 0);
    return;
  }

  let cap = 100;
  while (cap && !hasFont(fontName)) {
    await new Promise(resolve => setTimeout(resolve, 10));
    cap -= 1;
  }
  setTimeout(showMain, 500);
})();
