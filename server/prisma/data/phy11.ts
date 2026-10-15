import { SubjectSeed } from "./types";

export const phy11: SubjectSeed = {
  grade: 11,
  code: "PHY",
  name: "Physical Sciences",
  color: "#0e7490",
  examTitle: "Grade 11 Physical Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Electromagnetic fields",
      description: "Magnetic fields of currents, the motor effect, and F = BIL.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A current-carrying conductor produces a **circular magnetic field** around it (right-hand grip rule).\nA conductor carrying current in a magnetic field experiences a force: **F = BIL** (when B is perpendicular to the wire).\n**The motor effect**: the forces on opposite sides of a coil are in opposite directions, so the coil rotates — this is how electric motors work.",
        },
        {
          type: "FORMULA",
          title: "Force on a current-carrying wire",
          content:
            "F = BIL\nB in tesla (T), I in amperes (A), L in metres (m)\nDirection: Fleming's left-hand rule",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "B = 0.5 T, I = 2 A, L = 0.1 m:\nF = 0.5 × 2 × 0.1 = 0.1 N",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The force on a current-carrying wire in a magnetic field is given by:",
          explanation: "F = BIL, where B is the flux density, I the current and L the length of wire in the field.",
          options: [
            { text: "F = BIL", correct: true },
            { text: "F = B/I" },
            { text: "F = BI²L" },
            { text: "F = I/(BL)" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A wire of length 0.1 m carries a current of 2 A in a 0.5 T field (perpendicular). The force on the wire is:",
          explanation: "F = BIL = 0.5 × 2 × 0.1 = 0.1 N.",
          options: [
            { text: "0.1 N", correct: true },
            { text: "1 N" },
            { text: "0.01 N" },
            { text: "10 N" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the magnetic field around a straight current-carrying wire is circular.",
          explanation: "Field lines form concentric circles around the wire (right-hand grip rule).",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Calculate the force on a 0.2 m wire carrying a current of 3 A in a 0.4 T magnetic field (perpendicular).",
          explanation: "F = BIL = 0.4 × 3 × 0.2 = 0.24 N.",
          options: [
            { text: "0.24 N", correct: true, keywords: ["0.24"] },
          ],
        },
      ],
    },
    {
      name: "Oscillations and simple harmonic motion",
      description: "Period, frequency, and the spring and pendulum formulas.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Simple harmonic motion (SHM)**: the restoring force is proportional to the displacement and directed towards equilibrium.\nPeriod of a mass on a spring: T = 2π√(m/k).\nPeriod of a simple pendulum: T = 2π√(L/g).\nFrequency f = 1/T. At the equilibrium point the speed is maximum and the acceleration is zero; at the extremes the displacement is maximum and the acceleration is maximum.",
        },
        {
          type: "FORMULA",
          title: "Oscillation formulas",
          content:
            "T = 2π√(m/k)\nT_pendulum = 2π√(L/g)\nf = 1/T",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A 0.25 kg mass on a spring (k = 40 N/m):\nT = 2π√(0.25/40) = 2π√0.00625 ≈ 0.5 s\n(Using π² ≈ 10: T² = 4π²m/k = 40 × 0.00625 = 0.25 → T = 0.5 s)",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The relationship between frequency and period is:",
          explanation: "f = 1/T — frequency is the reciprocal of the period.",
          options: [
            { text: "f = 1/T", correct: true },
            { text: "f = T" },
            { text: "f = 2πT" },
            { text: "f = T²" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A pendulum has a period of 4 s. Its frequency is:",
          explanation: "f = 1/T = 1/4 = 0.25 Hz.",
          options: [
            { text: "0.25 Hz", correct: true },
            { text: "4 Hz" },
            { text: "0.5 Hz" },
            { text: "2 Hz" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: in simple harmonic motion the acceleration is maximum at the equilibrium point.",
          explanation: "At equilibrium the displacement (and restoring force) is zero, so the acceleration is zero there. It is maximum at the extremes.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A spring has k = 40 N/m and a 0.25 kg mass attached. Calculate the period of oscillation. (Use π² ≈ 10.)",
          explanation: "T² = 4π²(m/k) = 4 × 10 × (0.25/40) = 0.25, so T = 0.5 s.",
          options: [
            { text: "0.5 s", correct: true, keywords: ["0.5"] },
          ],
        },
      ],
    },
    {
      name: "Electromagnetic induction",
      description: "Faraday's law, Lenz's law, and how generators work.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A **changing magnetic flux** through a coil induces an emf (Faraday's law): ε = −N·ΔΦ/Δt.\n**Lenz's law**: the induced current flows in a direction that OPPOSES the change that produced it.\n**Generators**: a coil rotating in a magnetic field; slip rings give AC, a split-ring commutator gives DC.\nFlux Φ = B·A.",
        },
        {
          type: "FORMULA",
          title: "Induction formulas",
          content:
            "ε = −N ΔΦ/Δt\nΦ = B·A",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A coil with N = 100 turns experiences a flux change from 0.02 Wb to 0.06 Wb in 0.1 s:\nε = N·ΔΦ/Δt = 100 × 0.04/0.1 = 40 V",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "An emf is induced in a coil when the magnetic flux through it:",
          explanation: "Faraday's law: an emf is induced only when the flux CHANGES.",
          options: [
            { text: "changes with time", correct: true },
            { text: "stays constant" },
            { text: "is zero" },
            { text: "is at its maximum" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A coil has N = 100 turns. Its flux changes by 0.04 Wb in 0.1 s. The induced emf is:",
          explanation: "ε = N·ΔΦ/Δt = 100 × 0.04/0.1 = 40 V.",
          options: [
            { text: "40 V", correct: true },
            { text: "0.4 V" },
            { text: "400 V" },
            { text: "4 V" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: Lenz's law states that the induced current opposes the change that produced it.",
          explanation: "That is Lenz's law — it is a consequence of conservation of energy.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "State Lenz's law in one sentence.",
          explanation: "The direction of the induced current is such that it opposes the change that produced it.",
          options: [
            { text: "The induced current opposes the change that produced it.", correct: true, keywords: ["oppos"] },
          ],
        },
      ],
    },
  ],
};
