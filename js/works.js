/* ============================================
   Ateljé Sällström — Gallery data
   --------------------------------------------
   One entry per artwork. To add a work:
   1. Put the image in images/ and create optimized
      copies in images/opt/ as <stem>-800.webp and
      <stem>-1600.webp (max width 800/1600px).
   2. Add an entry below. `size` may be "tall" or
      "wide" for larger grid cells, or omitted.

   ============================================ */
window.WORKS = [
  // — Lennart —
  { stem: 'lennart01', title: 'Stadssilhuetter', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'tall', w: 800, h: 628 },
  { stem: 'lennart04', title: 'Tänk', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'wide', w: 800, h: 566 },
  { stem: 'lennart02', title: 'Röd komposition', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 596 },
  { stem: 'lennart06', title: 'Södermalm i färg', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'tall', w: 800, h: 1422 },
  { stem: 'lennart08', title: 'Abstrakt stadsvy', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 647 },
  { stem: 'lennart03', title: 'Stadsmotiv i rött', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'tall', w: 800, h: 1127 },
  { stem: 'lennart05', title: 'Kvarter i kvällsljus', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 673 },
  { stem: 'lennart07', title: 'Gatuliv', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 626 },

  // — Robin —
  { stem: 'robin03', title: 'Interstellar Dreams', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst', size: 'tall', w: 800, h: 1000 },
  { stem: 'robin04', title: 'Flow', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst', w: 800, h: 1132 },
  { stem: 'robin05', title: 'Neonljus', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst', w: 800, h: 1000 },
  { stem: 'robin08', title: 'Skymning', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst', size: 'wide', w: 800, h: 626 },
  { stem: 'robin09', title: 'Surrealistisk dröm', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst', w: 800, h: 1131 },
  { stem: 'robin02', title: 'Norrsken — triptyk', artist: 'robin', artistName: 'Robin Sällström', medium: 'Digital konst, inramade tryck', w: 800, h: 450 },

  // — Ninni —
  { stem: 'ninni05', title: 'Under ytan', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Akryl pouring', w: 800, h: 626 },
  { stem: 'ninni15', title: 'Isblomma', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Akryl pouring', size: 'tall', w: 800, h: 626 },
  { stem: 'ninni06', title: 'Flytande färger', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Akryl pouring', w: 800, h: 533 },
  { stem: 'ninni13', title: 'Blåsippor', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Fotografi', w: 800, h: 533 },
  { stem: 'ninni22', title: 'Naturens former', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Fotografi', w: 800, h: 450 },
  { stem: 'ninni10', title: 'Poetisk natur', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Fotografi', size: 'tall', w: 800, h: 1422 },
  { stem: 'ninni04', title: 'Himlatoner', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Fotografi', size: 'wide', w: 800, h: 533 },
  { stem: 'ninni23', title: 'Havsbris', artist: 'ninni', artistName: 'Ninni Sällström', medium: 'Fotografi', w: 800, h: 450 },
  // — Salen-serien (Lennart) — 48 verk från utställningen
  { stem: 'salen01', title: 'Verk 1', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 573 },
  { stem: 'salen02', title: 'Verk 2', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 517 },
  { stem: 'salen03', title: 'Verk 3', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen04', title: 'Verk 4', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen05', title: 'Verk 5', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen06', title: 'Verk 6', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen07', title: 'Verk 7', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen08', title: 'Verk 8', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 582 },
  { stem: 'salen09', title: 'Verk 9', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 563 },
  { stem: 'salen10', title: 'Verk 10', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 591 },
  { stem: 'salen11', title: 'Verk 11', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen12', title: 'Verk 12', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 574 },
  { stem: 'salen13', title: 'Verk 13', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen14', title: 'Verk 14', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 466 },
  { stem: 'salen15', title: 'Verk 15', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 507 },
  { stem: 'salen16', title: 'Verk 16', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 659 },
  { stem: 'salen17', title: 'Verk 17', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen18', title: 'Verk 18', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen19', title: 'Verk 19', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 497 },
  { stem: 'salen20', title: 'Verk 20', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 372 },
  { stem: 'salen21', title: 'Verk 21', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen22', title: 'Verk 22', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 580 },
  { stem: 'salen23', title: 'Verk 23', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen24', title: 'Verk 24', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen25', title: 'Verk 25', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen26', title: 'Verk 26', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 494 },
  { stem: 'salen27', title: 'Verk 27', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 518 },
  { stem: 'salen28', title: 'Verk 28', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 612 },
  { stem: 'salen29', title: 'Verk 29', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen30', title: 'Verk 30', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen31', title: 'Verk 31', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 628 },
  { stem: 'salen32', title: 'Verk 32', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 351 },
  { stem: 'salen33', title: 'Verk 33', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 456 },
  { stem: 'salen34', title: 'Verk 34', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 690 },
  { stem: 'salen35', title: 'Verk 35', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 638 },
  { stem: 'salen36', title: 'Verk 36', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen37', title: 'Verk 37', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 657 },
  { stem: 'salen38', title: 'Verk 38', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 592 },
  { stem: 'salen39', title: 'Verk 39', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 695 },
  { stem: 'salen40', title: 'Verk 40', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 571 },
  { stem: 'salen41', title: 'Verk 41', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 580 },
  { stem: 'salen42', title: 'Verk 42', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 784 },
  { stem: 'salen43', title: 'Verk 43', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen44', title: 'Verk 44', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'tall', w: 800, h: 1425 },
  { stem: 'salen45', title: 'Verk 45', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', size: 'tall', w: 800, h: 1425 },
  { stem: 'salen46', title: 'Verk 46', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 797 },
  { stem: 'salen47', title: 'Verk 47', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 449 },
  { stem: 'salen48', title: 'Verk 48', artist: 'lennart', artistName: 'Lennart Sällström', medium: 'Akryl', w: 800, h: 806 }
];
