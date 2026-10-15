import { SubjectSeed } from "./types";

export const math10: SubjectSeed = {
  grade: 10,
  code: "MATH",
  name: "Mathematics",
  color: "#4f46e5",
  examTitle: "Grade 10 Mathematics Mock Exam",
  examDuration: 45,
  topics: [
    {
      name: "Real numbers, exponents and surds",
      description: "Exponent laws, simplifying surds, and standard form.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Exponent laws: a^m × a^n = a^(m+n) | a^m ÷ a^n = a^(m−n) | (a^m)^n = a^(mn) | a^0 = 1 | a^(−n) = 1/a^n.\nA **surd** is a square root that cannot be simplified to a rational number, e.g. √2 and √50 (but not √49, which is 7).\n**Standard form**: a × 10^n where 1 ≤ a < 10. Small numbers have a negative exponent: 0.0045 = 4.5 × 10⁻³.",
        },
        {
          type: "FORMULA",
          title: "Useful identities",
          content:
            "√(a×b) = √a × b\n√(a²) = a (when a ≥ 0)\nRationalising: 1/√a = √a/a\na^(m+n) = a^m × a^n",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Simplify √50: √50 = √(25 × 2) = √25 × √2 = 5√2.\nEvaluate 2³ × 2⁴: add the exponents → 2⁷ = 128.\nWrite 0.00045 in standard form: move the decimal point 4 places right → 4.5 × 10⁻⁴.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Simplify: 3² × 3⁴",
          explanation: "When multiplying powers with the same base, add the exponents: 3^(2+4) = 3⁶.",
          options: [
            { text: "3⁶", correct: true },
            { text: "3⁸" },
            { text: "9⁶" },
            { text: "3¹⁶" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Simplify √72 in the form k√p where p is square-free.",
          explanation: "72 = 36 × 2, so √72 = √36 × √2 = 6√2.",
          options: [
            { text: "6√2", correct: true },
            { text: "4√3" },
            { text: "9√8" },
            { text: "36√2" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: 0.00045 written in standard form is 4.5 × 10⁻⁴.",
          explanation: "Moving the decimal point 4 places to the right gives 4.5, so the exponent is −4.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Evaluate 2⁵ × 2³ and give your answer as an integer.",
          explanation: "Add the exponents: 2⁸ = 256.",
          options: [
            { text: "256", correct: true, keywords: ["256"] },
          ],
        },
      ],
    },
    {
      name: "Quadratic functions and equations",
      description: "Solving quadratics, the discriminant, and completing the square.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A quadratic function has the form f(x) = ax² + bx + c. Its graph is a parabola.\nThe **discriminant** Δ = b² − 4ac tells you the nature of the roots:\n- Δ > 0: two real roots\n- Δ = 0: one repeated (double) root\n- Δ < 0: no real roots\nComplete the square: ax² + bx + c = a(x + b/2a)² + c − b²/4a.",
        },
        {
          type: "FORMULA",
          title: "The quadratic formula",
          content: "x = (−b ± √(b² − 4ac)) / 2a",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "f(x) = x² − 4x + 3 = (x − 2)² − 1.\nTurning point: (2, −1). The roots are where f(x) = 0: x = 1 or x = 3.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The discriminant of x² − 5x + 6 = 0 is:",
          explanation: "Δ = b² − 4ac = 25 − 24 = 1.",
          options: [
            { text: "1", correct: true },
            { text: "−1" },
            { text: "25" },
            { text: "49" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Solve: x² − 4x + 3 = 0",
          explanation: "Factorise: (x − 1)(x − 3) = 0, so x = 1 or x = 3.",
          options: [
            { text: "x = 1 or x = 3", correct: true },
            { text: "x = −1 or x = −3" },
            { text: "x = 1 or x = −3" },
            { text: "x = 4 or x = 3" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: x² + 2x + 5 has two real roots.",
          explanation: "Δ = 4 − 20 = −16 < 0, so there are no real roots.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Find the coordinates of the turning point of f(x) = x² + 6x + 5.",
          explanation: "Complete the square: (x + 3)² − 4, so the turning point is (−3, −4).",
          options: [
            { text: "(−3, −4)", correct: true, keywords: ["-3", "-4"] },
          ],
        },
      ],
    },
    {
      name: "Trigonometry: right-angled triangles",
      description: "SOHCAHTOA, special angles, and elevation problems.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**SOHCAHTOA**:\n- sin θ = opposite / hypotenuse\n- cos θ = adjacent / hypotenuse\n- tan θ = opposite / adjacent\nSpecial values: sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1.\nAngles of **elevation** are measured up from the horizontal; angles of **depression** are measured down from the horizontal.",
        },
        {
          type: "FORMULA",
          title: "Ratio definitions",
          content:
            "sin θ = O/H\ncos θ = A/H\ntan θ = O/A\nsin(90° − θ) = cos θ",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A ladder 10 m long leans against a wall at 60° to the ground.\nHeight up the wall = 10 × sin 60° ≈ 10 × 0.866 = 8.66 m.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The value of sin 30° is:",
          explanation: "sin 30° = 1/2 = 0.5.",
          options: [
            { text: "0.5", correct: true },
            { text: "1" },
            { text: "0.707" },
            { text: "0.866" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "In a right-angled triangle, the side opposite θ is 3 cm and the adjacent side is 4 cm. Find cos θ.",
          explanation: "Hypotenuse = √(9 + 16) = 5, so cos θ = adjacent/hypotenuse = 4/5.",
          options: [
            { text: "4/5", correct: true },
            { text: "3/5" },
            { text: "3/4" },
            { text: "5/4" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: tan 45° = 1.",
          explanation: "In a square, the opposite and adjacent sides are equal, so tan 45° = 1.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A kite string makes an angle of 60° with the ground. If the string is 50 m long, what is the height of the kite? (Use sin 60° = 0.866.)",
          explanation: "height = 50 × sin 60° = 50 × 0.866 = 43.3 m.",
          options: [
            { text: "43.3 m", correct: true, keywords: ["43.3"] },
          ],
        },
      ],
    },
  ],
};
