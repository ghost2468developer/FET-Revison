import { SubjectSeed } from "./types";

export const math12: SubjectSeed = {
  grade: 12,
  code: "MATH",
  name: "Mathematics",
  color: "#2563eb",
  examTitle: "Grade 12 Mathematics Mock Exam",
  examDuration: 45,
  topics: [
    {
      name: "Functions and transformations",
      description: "Transformations of parent functions, domain and range.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Transformations of f(x) = x²:\n- f(x + a): shift LEFT by a\n- f(x) + b: shift UP by b\n- −f(x): reflect in the x-axis\n- f(2x): horizontal compression (factor ½)\nThe domain and range change with the transformation — always update the range from the new minimum or maximum.",
        },
        {
          type: "FORMULA",
          title: "Transformation rules",
          content:
            "f(x − 3) + 2 : shift 3 right, then 2 up\nf(2x) : horizontal compression, factor 1/2\n−(x − h)² + k : opens downward, maximum k at (h, k)",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "g(x) = (x − 3)² + 2: the minimum is (3, 2), so the range is {y ≥ 2}.\nh(x) = −(x + 1)² + 5: opens downward, maximum 5 at (−1, 0)… at (−1, 5); range {y ≤ 5}.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The range of f(x) = (x − 3)² + 2 is:",
          explanation: "The minimum value is 2 (at x = 3), and the parabola opens upward.",
          options: [
            { text: "{y ≥ 2}", correct: true },
            { text: "{y ≥ 3}" },
            { text: "{y ≤ 2}" },
            { text: "{y ≥ −3}" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "The graph of y = x² is transformed to y = x² − 4. The transformation is:",
          explanation: "Subtracting 4 from the function shifts the whole graph down by 4 units.",
          options: [
            { text: "Shift 4 units down", correct: true },
            { text: "Shift 4 units up" },
            { text: "Reflect in the x-axis" },
            { text: "Shift 4 units right" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: the graph of y = −x² is a reflection of y = x² in the x-axis.",
          explanation: "Negating the function flips it in the x-axis.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "State the transformation that maps y = x² to y = (x + 5)².",
          explanation: "x + 5 inside the bracket is a horizontal shift of 5 units to the left.",
          options: [
            { text: "A horizontal shift of 5 units to the left", correct: true, keywords: ["5", "left"] },
          ],
        },
      ],
    },
    {
      name: "Trigonometric graphs and addition formulas",
      description: "Amplitude, period, phase shifts, and the double-angle formulas.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "y = a·sin(bθ + c) has **amplitude** |a| and **period** 360°/b.\nAddition formulas: sin(A ± B) = sinA·cosB ± cosA·sinB; cos(A ± B) = cosA·cosB ∓ sinA·sinB.\n**Double angles**: sin 2θ = 2 sin θ cos θ; cos 2θ = cos²θ − sin²θ; 1 − cos 2θ = 2 sin²θ.",
        },
        {
          type: "FORMULA",
          title: "Double-angle formulas",
          content:
            "sin 2θ = 2 sin θ cos θ\ncos 2θ = cos²θ − sin²θ\n1 − cos 2θ = 2 sin²θ",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "If θ is acute, sin θ = 3/5 and cos θ = 4/5, then:\nsin 2θ = 2 × (3/5) × (4/5) = 24/25.\nThe period of y = sin 2θ is 360°/2 = 180°.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "The period of y = sin 2θ is:",
          explanation: "Period = 360°/b = 360°/2 = 180°.",
          options: [
            { text: "180°", correct: true },
            { text: "360°" },
            { text: "90°" },
            { text: "720°" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "If sin θ = 3/5 and θ is acute, then sin 2θ = :",
          explanation: "cos θ = 4/5, so sin 2θ = 2 × (3/5) × (4/5) = 24/25.",
          options: [
            { text: "24/25", correct: true },
            { text: "9/25" },
            { text: "7/25" },
            { text: "12/25" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the maximum value of y = 2 sin θ is 2.",
          explanation: "The amplitude is 2, so the maximum is 2.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Using the double-angle formula, express sin 2θ in terms of sin θ and cos θ.",
          explanation: "sin 2θ = 2 sin θ cos θ.",
          options: [
            { text: "2 sin θ cos θ", correct: true, keywords: ["2sincos"] },
          ],
        },
      ],
    },
    {
      name: "Permutations and combinations",
      description: "Factorials, nPr, nCr, and choosing the right model.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "n! = n × (n−1) × … × 2 × 1, and 0! = 1.\n**Permutations** nPr = n! / (n−r)! — ORDER MATTERS (arrangements, positions, ranks).\n**Combinations** nCr = n! / [r!(n−r)!] — order does NOT matter (selections, committees, pairs).\nRule of thumb: can you rank the items? Use permutations. Are you just selecting a group? Use combinations.",
        },
        {
          type: "FORMULA",
          title: "Formulas",
          content:
            "nPr = n! / (n−r)!\nnCr = n! / [r!(n−r)!] = nPr / r!",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "5P2 = 5 × 4 = 20 (ways to choose 1st and 2nd place from 5 runners).\n5C2 = (5 × 4)/2 = 10 (ways to choose a pair from 5 people).",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The number of ways to choose 2 captains from 5 players is:",
          explanation: "Order does not matter → 5C2 = (5×4)/2 = 10.",
          options: [
            { text: "10", correct: true },
            { text: "20" },
            { text: "120" },
            { text: "25" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Evaluate 4P3.",
          explanation: "4P3 = 4 × 3 × 2 = 24.",
          options: [
            { text: "24", correct: true },
            { text: "6" },
            { text: "4" },
            { text: "12" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: combinations are used when the order of selection does not matter.",
          explanation: "That is exactly the defining difference between combinations and permutations.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Evaluate 6C2.",
          explanation: "6C2 = (6 × 5)/2 = 15.",
          options: [
            { text: "15", correct: true, keywords: ["15"] },
          ],
        },
      ],
    },
  ],
};
