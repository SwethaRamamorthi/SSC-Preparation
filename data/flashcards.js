/**
 * SWETHA'S SPEED MATH & VOCAB FLASHCARDS DATASET
 */

window.FLASHCARD_DECKS = {
  squares: Array.from({ length: 50 }, (_, i) => {
    const num = i + 1;
    return {
      front: `${num}²`,
      back: `${num * num}`,
      hint: `Square of ${num}`,
      category: "Squares (1-50)"
    };
  }),

  cubes: Array.from({ length: 30 }, (_, i) => {
    const num = i + 1;
    return {
      front: `${num}³`,
      back: `${num * num * num}`,
      hint: `Cube of ${num}`,
      category: "Cubes (1-30)"
    };
  }),

  fractions: [
    { front: "1 / 2", back: "50%", hint: "Half", category: "Fractions & %" },
    { front: "1 / 3", back: "33.33%", hint: "One third", category: "Fractions & %" },
    { front: "2 / 3", back: "66.66%", hint: "Two thirds", category: "Fractions & %" },
    { front: "1 / 4", back: "25%", hint: "Quarter", category: "Fractions & %" },
    { front: "3 / 4", back: "75%", hint: "Three quarters", category: "Fractions & %" },
    { front: "1 / 5", back: "20%", hint: "One fifth", category: "Fractions & %" },
    { front: "2 / 5", back: "40%", hint: "Two fifths", category: "Fractions & %" },
    { front: "3 / 5", back: "60%", hint: "Three fifths", category: "Fractions & %" },
    { front: "4 / 5", back: "80%", hint: "Four fifths", category: "Fractions & %" },
    { front: "1 / 6", back: "16.66%", hint: "One sixth", category: "Fractions & %" },
    { front: "5 / 6", back: "83.33%", hint: "Five sixths", category: "Fractions & %" },
    { front: "1 / 7", back: "14.28%", hint: "One seventh", category: "Fractions & %" },
    { front: "2 / 7", back: "28.57%", hint: "Two sevenths", category: "Fractions & %" },
    { front: "1 / 8", back: "12.5%", hint: "One eighth", category: "Fractions & %" },
    { front: "3 / 8", back: "37.5%", hint: "Three eighths", category: "Fractions & %" },
    { front: "5 / 8", back: "62.5%", hint: "Five eighths", category: "Fractions & %" },
    { front: "7 / 8", back: "87.5%", hint: "Seven eighths", category: "Fractions & %" },
    { front: "1 / 9", back: "11.11%", hint: "One ninth", category: "Fractions & %" },
    { front: "1 / 10", back: "10%", hint: "One tenth", category: "Fractions & %" },
    { front: "1 / 11", back: "9.09%", hint: "One eleventh", category: "Fractions & %" },
    { front: "1 / 12", back: "8.33%", hint: "One twelfth", category: "Fractions & %" },
    { front: "1 / 13", back: "7.69%", hint: "One thirteenth", category: "Fractions & %" },
    { front: "1 / 14", back: "7.14%", hint: "One fourteenth", category: "Fractions & %" },
    { front: "1 / 15", back: "6.66%", hint: "One fifteenth", category: "Fractions & %" },
    { front: "1 / 16", back: "6.25%", hint: "One sixteenth", category: "Fractions & %" },
    { front: "1 / 20", back: "5%", hint: "One twentieth", category: "Fractions & %" }
  ],

  trigonometry: [
    { front: "sin(0°)", back: "0", hint: "Sin 0 degree", category: "Trigonometry" },
    { front: "sin(30°)", back: "1 / 2  (0.5)", hint: "Sin 30 degree", category: "Trigonometry" },
    { front: "sin(45°)", back: "1 / √2  (~0.707)", hint: "Sin 45 degree", category: "Trigonometry" },
    { front: "sin(60°)", back: "√3 / 2  (~0.866)", hint: "Sin 60 degree", category: "Trigonometry" },
    { front: "sin(90°)", back: "1", hint: "Sin 90 degree", category: "Trigonometry" },
    { front: "cos(0°)", back: "1", hint: "Cos 0 degree", category: "Trigonometry" },
    { front: "cos(30°)", back: "√3 / 2  (~0.866)", hint: "Cos 30 degree", category: "Trigonometry" },
    { front: "cos(45°)", back: "1 / √2  (~0.707)", hint: "Cos 45 degree", category: "Trigonometry" },
    { front: "cos(60°)", back: "1 / 2  (0.5)", hint: "Cos 60 degree", category: "Trigonometry" },
    { front: "cos(90°)", back: "0", hint: "Cos 90 degree", category: "Trigonometry" },
    { front: "tan(0°)", back: "0", hint: "Tan 0 degree", category: "Trigonometry" },
    { front: "tan(30°)", back: "1 / √3  (~0.577)", hint: "Tan 30 degree", category: "Trigonometry" },
    { front: "tan(45°)", back: "1", hint: "Tan 45 degree", category: "Trigonometry" },
    { front: "tan(60°)", back: "√3  (~1.732)", hint: "Tan 60 degree", category: "Trigonometry" },
    { front: "tan(90°)", back: "Undefined (∞)", hint: "Tan 90 degree", category: "Trigonometry" }
  ]
};
