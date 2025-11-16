// try to prevent font flicker

const showMain = () => {
  document.getElementsByTagName("main")[0].classList.add("opacity-100");
  document.getElementsByTagName("main")[0].classList.remove("opacity-0");
};

const hasFont = (fontName: string) => {
  // always true if font wasn't first added
  return document.fonts.check(`1rem '${fontName}'`);
};

const addFonts = () => {
  document.fonts.add(
    new FontFace("Title", 'url("/fonts/Inter-VariableFont_opsz,wght.ttf")')
  );
};

(async () => {
  addFonts();

  // wait for fonts to be ready
  await document.fonts.ready;

  // main[data-fout-font]
  const fontFace = document.getElementsByTagName("main")[0]?.dataset?.foutFont;
  if (!fontFace) {
    setTimeout(showMain, 500);
    return;
  }

  let cap = 100;
  while (cap && !hasFont(fontFace)) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    cap -= 1;
  }

  setTimeout(showMain, 500);
})();
