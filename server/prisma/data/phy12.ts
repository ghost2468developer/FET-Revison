import { SubjectSeed } from "./types";

export const phy12: SubjectSeed = {
  grade: 12,
  code: "PHY",
  name: "Physical Sciences",
  color: "#155e75",
  examTitle: "Grade 12 Physical Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Geometrical optics",
      description: "Refraction, Snell's law, lenses and magnification.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Light **bends towards the normal** when it enters a denser medium (slower) and away from the normal when it enters a less dense medium.\n**Snell's law**: n₁ sin i = n₂ sin r.\n**Lens formula**: 1/f = 1/u + 1/v; magnification m = v/u = hᵢ/hₒ.\nA converging lens can form a real, inverted image (object outside F) or an enlarged virtual image (object inside F, magnifying glass).",
        },
        {
          type: "FORMULA",
          title: "Lens equations",
          content:
            "1/f = 1/u + 1/v\nm = v/u = hᵢ/hₒ\nn = sin i / sin r",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "f = 10 cm, u = 15 cm:\n1/v = 1/10 − 1/15 = 1/30 → v = 30 cm\nm = 30/15 = 2 → a real, inverted image twice the size of the object.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Light travels from air into glass. The ray of light bends:",
          explanation: "Glass is optically denser (slower), so the ray bends towards the normal.",
          options: [
            { text: "towards the normal", correct: true },
            { text: "away from the normal" },
            { text: "not at all" },
            { text: "depends on the colour only" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "An object is placed 15 cm from a converging lens with focal length 10 cm. The image distance is:",
          explanation: "1/v = 1/10 − 1/15 = 1/30 → v = 30 cm.",
          options: [
            { text: "30 cm", correct: true },
            { text: "6 cm" },
            { text: "25 cm" },
            { text: "15 cm" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a converging lens can form a real image.",
          explanation: "When the object is outside the focal point, a converging lens forms a real, inverted image.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "An object is 10 cm from a converging lens with focal length 5 cm. Calculate the image distance.",
          explanation: "1/v = 1/5 − 1/10 = 1/10 → v = 10 cm.",
          options: [
            { text: "10 cm", correct: true, keywords: ["10"] },
          ],
        },
      ],
    },
    {
      name: "Electromagnetic spectrum",
      description: "The order of EM radiation, E = hf, and c = fλ.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Order (low → high frequency): radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays.\nHigher frequency → **higher energy** (E = hf) and **shorter wavelength** (c = fλ).\nApplications: microwaves (heating, Wi-Fi), infrared (remote controls, thermal imaging), ultraviolet (sterilisation), X-rays (medical imaging), gamma (radiotherapy).\nAll EM waves travel at c = 3 × 10⁸ m/s in a vacuum.",
        },
        {
          type: "FORMULA",
          title: "Wave and photon equations",
          content:
            "c = fλ\nE = hf, h = 6.63 × 10⁻³⁴ J·s",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A radio wave has f = 100 MHz = 10⁸ Hz:\nλ = c/f = 3×10⁸/10⁸ = 3 m",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which type of electromagnetic radiation has the highest energy photons?",
          explanation: "Gamma rays have the highest frequency, so E = hf is largest.",
          options: [
            { text: "Gamma rays", correct: true },
            { text: "Infrared" },
            { text: "Radio waves" },
            { text: "Visible light" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The speed of ALL electromagnetic waves in a vacuum is:",
          explanation: "All EM waves travel at c = 3 × 10⁸ m/s in a vacuum.",
          options: [
            { text: "3 × 10⁸ m/s", correct: true },
            { text: "3 × 10⁶ m/s" },
            { text: "340 m/s" },
            { text: "it depends on the colour" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: ultraviolet radiation has a higher frequency than infrared radiation.",
          explanation: "On the spectrum, UV sits at a higher frequency than IR.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A radio wave has a frequency of 100 MHz. Calculate its wavelength. (c = 3 × 10⁸ m/s)",
          explanation: "λ = c/f = 3×10⁸/10⁸ = 3 m.",
          options: [
            { text: "3 m", correct: true, keywords: ["3m"] },
          ],
        },
      ],
    },
    {
      name: "Wave–particle duality",
      description: "The photoelectric effect, photons, and the Compton effect.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Photoelectric effect**: light behaves as particles (photons). If the frequency is below the **threshold frequency**, NO electrons are emitted — however intense the light. Above it: KE_max = hf − Φ.\nEach photon carries momentum p = h/λ.\n**Compton effect**: X-rays scattered by electrons emerge with a LONGER wavelength — evidence that photons carry momentum.",
        },
        {
          type: "FORMULA",
          title: "Photon equations",
          content:
            "E = hf\nKE_max = hf − Φ\np = h/λ",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "f = 5 × 10¹⁴ Hz:\nE = hf = 6.63×10⁻³⁴ × 5×10¹⁴ = 3.315×10⁻¹⁹ J ≈ 2.07 eV\nIf the work function Φ < 2.07 eV, electrons are emitted.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "In the photoelectric effect, if the light frequency is below the threshold frequency, then:",
          explanation: "Below the threshold, individual photons lack the energy to free an electron — no emission, no matter the intensity.",
          options: [
            { text: "no electrons are emitted at all", correct: true },
            { text: "more electrons are emitted" },
            { text: "slower electrons are emitted" },
            { text: "electrons are emitted with zero KE" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A photon has frequency 5 × 10¹⁴ Hz. Its energy is: (h = 6.63 × 10⁻³⁴ J·s)",
          explanation: "E = hf = 6.63×10⁻³⁴ × 5×10¹⁴ = 3.315×10⁻¹⁹ J ≈ 3.3 × 10⁻¹⁹ J.",
          options: [
            { text: "3.3 × 10⁻¹⁹ J", correct: true },
            { text: "1.3 × 10⁻¹⁸ J" },
            { text: "6.6 × 10⁻²⁰ J" },
            { text: "3.3 × 10⁻¹⁴ J" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: increasing the INTENSITY of light below the threshold frequency will cause electron emission.",
          explanation: "Intensity adds more photons, but each photon still lacks the energy hf ≥ Φ. No emission occurs.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Calculate the energy of a photon with frequency 2 × 10¹⁵ Hz. (h = 6.63 × 10⁻³⁴ J·s)",
          explanation: "E = hf = 6.63×10⁻³⁴ × 2×10¹⁵ = 1.326×10⁻¹⁸ J.",
          options: [
            { text: "1.326 × 10⁻¹⁸ J", correct: true, keywords: ["1.326"] },
          ],
        },
      ],
    },
  ],
};
