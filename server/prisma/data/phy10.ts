import { SubjectSeed } from "./types";

export const phy10: SubjectSeed = {
  grade: 10,
  code: "PHY",
  name: "Physical Sciences",
  color: "#0891b2",
  examTitle: "Grade 10 Physical Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Motion in a straight line",
      description: "SUVAT equations, free fall, and velocity–time graphs.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Displacement is distance with direction; velocity is displacement per second; acceleration is the rate of change of velocity.\n**SUVAT**: v = u + at | s = ut + ½at² | v² = u² + 2as | s = ½(u + v)t\n**Free fall**: a = g = 9.8 m/s² downward (ignore air resistance).\nOn a velocity–time graph: the **gradient** is acceleration and the **area under the graph** is displacement.",
        },
        {
          type: "FORMULA",
          title: "SUVAT equations",
          content:
            "v = u + at\ns = ut + ½at²\nv² = u² + 2as\ng = 9.8 m/s² (downward)",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A car accelerates from rest at 2 m/s² for 5 s:\nv = 0 + 2(5) = 10 m/s\ns = ½ × 2 × 5² = 25 m",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A car accelerates from rest at 2 m/s². Its speed after 3 s is:",
          explanation: "v = u + at = 0 + 2(3) = 6 m/s.",
          options: [
            { text: "6 m/s", correct: true },
            { text: "3 m/s" },
            { text: "9 m/s" },
            { text: "12 m/s" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A ball is thrown straight up at 20 m/s. How long does it take to reach the top? (g = 10 m/s²)",
          explanation: "At the top v = 0: 0 = 20 − 10t → t = 2 s.",
          options: [
            { text: "2 s", correct: true },
            { text: "1 s" },
            { text: "4 s" },
            { text: "20 s" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: acceleration is the rate of change of velocity.",
          explanation: "That is the definition of acceleration: a = Δv/Δt.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A stone is dropped from rest from a height of 5 m. Calculate the time it takes to reach the ground. (g = 10 m/s²)",
          explanation: "s = ½gt² → 5 = 5t² → t² = 1 → t = 1 s.",
          options: [
            { text: "1 s", correct: true, keywords: ["1s"] },
          ],
        },
      ],
    },
    {
      name: "Forces, momentum and Newton's laws",
      description: "Newton's three laws, momentum, and impulse.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Newton's 1st law**: an object stays at rest or moves at constant velocity unless a net force acts on it.\n**Newton's 2nd law**: F = ma.\n**Newton's 3rd law**: for every action there is an equal and opposite reaction.\n**Momentum** p = mv is a vector. **Impulse** = F·Δt = change in momentum. Momentum is conserved in collisions.",
        },
        {
          type: "FORMULA",
          title: "Core formulas",
          content:
            "F = ma\np = mv\nF·Δt = Δp",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A 1000 kg car travelling at 20 m/s brakes to rest in 4 s:\np = 1000 × 20 = 20 000 kg·m/s\nF = Δp/Δt = 20 000/4 = 5000 N (braking force).",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A 10 kg trolley moving at 3 m/s has a momentum of:",
          explanation: "p = mv = 10 × 3 = 30 kg·m/s.",
          options: [
            { text: "30 kg·m/s", correct: true },
            { text: "3.3 kg·m/s" },
            { text: "13 kg·m/s" },
            { text: "300 kg·m/s" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A 500 g ball hits a wall at 20 m/s and bounces back at 15 m/s. The magnitude of its change in momentum is:",
          explanation: "Δp = m|v − u| = 0.5 × |−15 − 20| = 0.5 × 35 = 17.5 kg·m/s.",
          options: [
            { text: "17.5 kg·m/s", correct: true },
            { text: "2.5 kg·m/s" },
            { text: "17.5 N·s" },
            { text: "8.75 kg·m/s" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: Newton's third law states that for every action there is an equal and opposite reaction.",
          explanation: "That is Newton's third law.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A 1500 kg car travels at 20 m/s. Calculate its momentum.",
          explanation: "p = mv = 1500 × 20 = 30 000 kg·m/s.",
          options: [
            { text: "30 000 kg·m/s", correct: true, keywords: ["30000"] },
          ],
        },
      ],
    },
    {
      name: "Electric circuits",
      description: "Ohm's law, series and parallel circuits, and electrical power.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Ohm's law**: V = IR.\n**Series**: the same current flows through every component, voltages add, and R_total = R₁ + R₂ + …\n**Parallel**: the same voltage is across every branch, currents add, and 1/R_total = 1/R₁ + 1/R₂ + …\n**Power**: P = VI = I²R = V²/R (in watts).",
        },
        {
          type: "FORMULA",
          title: "Circuit formulas",
          content:
            "V = IR\nP = VI\nSeries: R = R₁ + R₂\nParallel: 1/R = 1/R₁ + 1/R₂",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Two 6 Ω resistors in parallel: 1/R = 1/6 + 1/6 = 2/6 → R = 3 Ω.\nConnected to 12 V: I = V/R = 12/3 = 4 A.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A 12 V battery drives a 4 Ω resistor. The current is:",
          explanation: "I = V/R = 12/4 = 3 A.",
          options: [
            { text: "3 A", correct: true },
            { text: "48 A" },
            { text: "4 A" },
            { text: "8 A" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Two 6 Ω resistors connected in parallel have a total resistance of:",
          explanation: "1/R = 1/6 + 1/6 = 2/6 → R = 3 Ω.",
          options: [
            { text: "3 Ω", correct: true },
            { text: "12 Ω" },
            { text: "6 Ω" },
            { text: "2 Ω" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: in a parallel circuit the current is the same through each branch.",
          explanation: "It is the VOLTAGE that is the same across each branch; the currents split.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A 12 V source is connected to a resistor that draws a current of 0.5 A. Calculate the resistance.",
          explanation: "R = V/I = 12/0.5 = 24 Ω.",
          options: [
            { text: "24 Ω", correct: true, keywords: ["24"] },
          ],
        },
      ],
    },
  ],
};
