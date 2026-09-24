/**
 * SWETHA'S SSC CGL SHORTCUTS & FORMULA MASTER BANK
 * Section-wise speed math, formulas, reasoning rules, English grammar rules, and GA mnemonics.
 */

window.SHORTCUTS_BANK = [
  {
    subject: "Quantitative Aptitude",
    category: "Speed Math & Multiplication",
    title: "Square of Numbers Ending in 5",
    formula: "(N x (N + 1)) followed by 25",
    example: "Find 75²: N=7 → 7 x 8 = 56. Append 25 → 5625.",
    note: "Works for 15, 25, 35, ..., 115, 125, etc."
  },
  {
    subject: "Quantitative Aptitude",
    category: "Percentage & Fractions",
    title: "Fraction to Percentage Conversion Table",
    formula: "1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%",
    example: "Calculate 37.5% of 640 → 37.5% = 3/8 → 3/8 x 640 = 240.",
    note: "Memorizing fractions up to 1/20 saves 40+ seconds per question!"
  },
  {
    subject: "Quantitative Aptitude",
    category: "Profit & Loss",
    title: "Two Successive Discounts Shortcut",
    formula: "Net Discount % = A + B - (A x B) / 100",
    example: "Successive discounts of 20% and 10% → 20 + 10 - (20x10)/100 = 30 - 2 = 28%.",
    note: "For 3 discounts, apply formula to first two, then combine result with 3rd."
  },
  {
    subject: "Quantitative Aptitude",
    category: "Simple & Compound Interest",
    title: "Difference Between CI and SI for 2 Years",
    formula: "Diff (D) = P x (R / 100)²",
    example: "P = ₹10,000, R = 10% → D = 10000 x (10/100)² = 10000 x 0.01 = ₹100.",
    note: "For 3 Years: Diff = P x (R/100)² x (3 + R/100)."
  },
  {
    subject: "Quantitative Aptitude",
    category: "Time & Work",
    title: "A and B Together Work Formula",
    formula: "Time = (A x B) / (A + B)",
    example: "A takes 10 days, B takes 15 days → (10 x 15) / (10 + 15) = 150 / 25 = 6 days.",
    note: "If A+B together take T days and A alone takes A days → B alone takes (A x T) / (A - T)."
  },
  {
    subject: "Quantitative Aptitude",
    category: "Time, Speed & Distance",
    title: "Average Speed for Equal Distances",
    formula: "Avg Speed = (2 x S1 x S2) / (S1 + S2)",
    example: "Speed 40 km/h going and 60 km/h returning → (2 x 40 x 60)/(40 + 60) = 4800/100 = 48 km/h.",
    note: "Do NOT average the speeds directly (e.g. (40+60)/2 = 50 is WRONG)."
  },
  {
    subject: "Quantitative Aptitude",
    category: "Algebra",
    title: "Important Algebraic Identities",
    formula: "If x + 1/x = a, then:\n1) x² + 1/x² = a² - 2\n2) x³ + 1/x³ = a³ - 3a",
    example: "If x + 1/x = 4 → x² + 1/x² = 4² - 2 = 14. x³ + 1/x³ = 4³ - 3(4) = 52.",
    note: "If x - 1/x = a → x² + 1/x² = a² + 2, and x³ - 1/x³ = a³ + 3a."
  },
  {
    subject: "General Intelligence & Reasoning",
    category: "Alphabet Coding",
    title: "EJOTY & Reverse Position Code",
    formula: "E=5, J=10, O=15, T=20, Y=25. Reverse Position = 27 - Forward Position.",
    example: "Find position of 'S': T is 20, so S is 19. Reverse of S = 27 - 19 = 8 (H).",
    note: "Opposite letter pairs sum up to 27: A-Z (1+26), B-Y (2+25), C-X (3+24), D-W, E-V, F-U, G-T."
  },
  {
    subject: "General Intelligence & Reasoning",
    category: "Clock Angle Shortcut",
    title: "Angle Between Hour & Minute Hands",
    formula: "Angle = | 30 x H - (11 / 2) x M |",
    example: "At 4:20 → Angle = | 30(4) - (11/2)(20) | = | 120 - 110 | = 10°.",
    note: "If angle > 180°, reflex angle = 360° - angle."
  },
  {
    subject: "General Intelligence & Reasoning",
    category: "Calendar Tricks",
    title: "Odd Days Count Rule",
    formula: "Ordinary Year = 1 Odd Day (365 % 7 = 1)\nLeap Year = 2 Odd Days (366 % 7 = 2)",
    example: "If 1 Jan 2023 was Sunday, 1 Jan 2024 (1 year later) is Monday.",
    note: "Century odd days: 100 yrs = 5, 200 yrs = 3, 300 yrs = 1, 400 yrs = 0."
  },
  {
    subject: "English Comprehension",
    category: "Grammar Rules",
    title: "Rule of 'Neither...Nor' & 'Either...Or'",
    formula: "Verb agrees with the SUBJECT NEAREST to it.",
    example: "Neither the teacher nor the students WERE present. (Students is plural → WERE).",
    note: "Neither the students nor the teacher WAS present. (Teacher is singular → WAS)."
  },
  {
    subject: "English Comprehension",
    category: "Grammar Rules",
    title: "Nouns Always Plural / Singular",
    formula: "Plural only: Scissors, Trousers, Spectacles, Cattle, Gentry, Poultry.\nSingular only: Information, Advice, Luggage, Furniture, Poetry, Scenery.",
    example: "INCORRECT: 'He gave me an advice.' → CORRECT: 'He gave me a piece of advice.'",
    note: "Never add 's' to Furniture, Scenery, Information."
  },
  {
    subject: "General Awareness",
    category: "Indian Polity",
    title: "Fundamental Rights Mnemonic (Articles 14-32)",
    formula: "E-F-E-R-C-R (Equality 14-18, Freedom 19-22, Exploitation 23-24, Religion 25-28, Culture/Education 29-30, Remedies 32)",
    example: "Article 21: Protection of Life & Personal Liberty. Article 32: Heart & Soul of Constitution.",
    note: "Right to Property was deleted from FR by 44th Amendment 1978 (now Legal Right under 300A)."
  },
  {
    subject: "General Awareness",
    category: "General Science",
    title: "Vitamin Deficiency Disease Trick",
    formula: "Vit A: Night Blindness | Vit B1: Beriberi | Vit C: Scurvy | Vit D: Rickets | Vit K: Non-clotting",
    example: "Vit C is water-soluble (found in citrus fruits like lemon/orange). Vit A,D,E,K are fat-soluble.",
    note: "Fat soluble vitamins shortcut: KEDA (K, E, D, A)."
  }
];
