import { SubjectSeed } from "./types";

export const math11: SubjectSeed = {
  grade: 11,
  code: "MATH",
  name: "Mathematics",
  color: "#7c3aed",
  examTitle: "Grade 11 Mathematics Mock Exam",
  examDuration: 45,
  topics: [
    {
      name: "Exponential and logarithmic functions",
      description: "Exponential graphs, logarithm laws and solving exponential equations.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "f(x) = a^x (a > 0, a ≠ 1): the y-intercept is always 1 and the x-axis (y = 0) is a horizontal asymptote.\n**Logarithms are inverses of exponentials**: y = logₐ x  ⇔  x = a^y.\nLog laws: log(ab) = log a + log b | log(a/b) = log a − log b | log(a^b) = b·log a.",
        },
        {
          type: "FORMULA",
          title: "Log laws",
          content:
            "logₐ x = ln x / ln a\nlog(10x) = 1 + log x\na^logₐ x = x",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Solve 2^x = 16: 16 = 2⁴, so x = 4.\nSolve log₂ x = 5: x = 2⁵ = 32.\nlog 2 + log 5 = log(10) = 1.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Solve for x: 3^x = 27",
          explanation: "27 = 3³, so x = 3.",
          options: [
            { text: "3", correct: true },
            { text: "9" },
            { text: "4" },
            { text: "27" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Simplify: log₂ 8 + log₂ 4",
          explanation: "log₂(8 × 4) = log₂ 32 = 5.",
          options: [
            { text: "5", correct: true },
            { text: "12" },
            { text: "7" },
            { text: "2" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the graph of y = 2^x has a horizontal asymptote at y = 0.",
          explanation: "As x → −∞, 2^x → 0, so the x-axis is the asymptote.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Solve for x: log₃ x = 2.",
          explanation: "x = 3² = 9.",
          options: [
            { text: "x = 9", correct: true, keywords: ["9"] },
          ],
        },
      ],
    },
    {
      name: "Quadratic functions and graphs",
      description: "Completing the square, turning points, and ranges.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Complete the square to read off the turning point: ax² + bx + c = a(x + b/2a)² + (4ac − b²)/4a.\nIf a > 0 the parabola opens upward (minimum at the turning point); if a < 0 it opens downward (maximum).\nThe range of f(x) = a(x − h)² + k is y ≥ k (a > 0) or y ≤ k (a < 0).",
        },
        {
          type: "FORMULA",
          title: "Turning point form",
          content: "ax² + bx + c = a(x + b/2a)² + (4ac − b²)/4a",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "f(x) = 2x² − 8x + 5 = 2(x² − 4x) + 5 = 2(x − 2)² − 8 + 5 = 2(x − 2)² − 3.\nTurning point (2, −3); range {y ≥ −3}.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "The turning point of y = x² − 6x + 11 is:",
          explanation: "Complete the square: (x − 3)² − 2 → turning point (3, −2).",
          options: [
            { text: "(3, −2)", correct: true },
            { text: "(−3, −2)" },
            { text: "(3, 2)" },
            { text: "(6, −2)" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "The range of f(x) = −(x − 1)² + 4 is:",
          explanation: "The parabola opens downward with maximum 4, so all values are ≤ 4.",
          options: [
            { text: "{y ≤ 4}", correct: true },
            { text: "{y ≥ 4}" },
            { text: "{y ≤ 1}" },
            { text: "{y ≥ 1}" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: the graph of y = 3x² + 2x − 1 crosses the x-axis at two points.",
          explanation: "Δ = 4 − 4(3)(−1) = 16 > 0, so there are two distinct real roots.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Write f(x) = x² + 8x + 1 in the form a(x + p)² + q. Give the values of p and q.",
          explanation: "f(x) = (x + 4)² − 16 + 1 = (x + 4)² − 15, so p = 4 and q = −15.",
          options: [
            { text: "(x + 4)² − 15", correct: true, keywords: ["4", "-15"] },
          ],
        },
      ],
    },
    {
      name: "Trigonometric identities and equations",
      description: "Pythagorean identities and solving trig equations from 0° to 360°.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Pythagorean identity**: sin²θ + cos²θ = 1 (and 1 + tan²θ = sec²θ).\nReciprocal: tan θ = sin θ / cos θ.\nTo solve trig equations on 0° ≤ θ ≤ 360°: find the reference angle, then use the quadrants:\n- sin is positive in Quadrants I and II\n- cos is positive in Quadrants I and IV\n- tan is positive in Quadrants I and III",
        },
        {
          type: "FORMULA",
          title: "Identities to know",
          content:
            "sin²θ + cos²θ = 1\ntan θ = sin θ / cos θ\n1 + tan²θ = sec²θ",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Solve sin θ = 0.5 for 0° ≤ θ ≤ 360°.\nReference angle: 30°. Sin is positive in QI and QII → θ = 30° or θ = 180° − 30° = 150°.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "If sin θ = 0.6 and θ is acute, then cos θ = :",
          explanation: "cos²θ = 1 − sin²θ = 1 − 0.36 = 0.64 → cos θ = 0.8 (acute).",
          options: [
            { text: "0.8", correct: true },
            { text: "0.6" },
            { text: "0.36" },
            { text: "1.25" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Solve sin θ = 0.5 for 0° ≤ θ ≤ 360°.",
          explanation: "Reference angle 30°; sin is positive in QI and QII → 30° and 150°.",
          options: [
            { text: "30° and 150°", correct: true },
            { text: "30° and 330°" },
            { text: "150° and 210°" },
            { text: "30°, 150° and 210°" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: sin²θ + cos²θ = 1 for all angles θ.",
          explanation: "This is the fundamental Pythagorean identity — it always holds.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Solve tan θ = 1 for 0° ≤ θ ≤ 360°, giving ALL solutions.",
          explanation: "Reference angle 45°; tan is positive in QI and QIII → 45° and 225°.",
          options: [
            { text: "45° and 225°", correct: true, keywords: ["45", "225"] },
          ],
        },
      ],
    },
  ],
};
