import { SubjectSeed } from "./types";

export const life12: SubjectSeed = {
  grade: 12,
  code: "LS",
  name: "Life Sciences",
  color: "#166534",
  examTitle: "Grade 12 Life Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Cell respiration and photosynthesis",
      description: "Aerobic and anaerobic respiration, and the photosynthesis equation.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Aerobic respiration** (mitochondria): glucose + oxygen → carbon dioxide + water + energy (ATP). Oxygen is REQUIRED.\n**Anaerobic respiration**:\n- in human muscle → lactic acid (muscle fatigue)\n- in yeast → ethanol + CO₂ (fermentation, used in brewing and baking)\n**Photosynthesis** (chloroplasts): carbon dioxide + water →(light, chlorophyll)→ glucose + oxygen.\nLimiting factors of photosynthesis: light intensity, CO₂ concentration, temperature.",
        },
        {
          type: "FORMULA",
          title: "The equations",
          content:
            "Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy\nPhotosynthesis: 6CO₂ + 6H₂O →(light)→ C₆H₁₂O₆ + 6O₂",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "After intense exercise, your muscles switch to anaerobic respiration and produce lactic acid — this causes the burning, tired feeling in your legs.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The main product of anaerobic respiration in human muscle is:",
          explanation: "Human muscle produces lactic acid when oxygen is in short supply.",
          options: [
            { text: "lactic acid", correct: true },
            { text: "ethanol" },
            { text: "glucose" },
            { text: "oxygen" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The gas produced during photosynthesis is:",
          explanation: "Plants release oxygen as a by-product of splitting water.",
          options: [
            { text: "oxygen", correct: true },
            { text: "carbon dioxide" },
            { text: "nitrogen" },
            { text: "methane" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: aerobic respiration requires oxygen.",
          explanation: "Aerobic = with oxygen; anaerobic = without oxygen.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Write the word equation for aerobic respiration.",
          explanation: "Glucose + oxygen → carbon dioxide + water + energy.",
          options: [
            {
              text: "Glucose + oxygen → carbon dioxide + water + energy",
              correct: true,
              keywords: ["glucose", "oxygen"],
              alternatives: ["water", "h2o", "co2", "carbon"],
            },
          ],
        },
      ],
    },
    {
      name: "Genetics: control of gene expression",
      description: "DNA → RNA → protein, mutations, and enzymes.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**The central dogma**: DNA →(transcription)→ mRNA →(translation)→ protein.\nA **gene** is a section of DNA that codes for a protein.\n**Mutations** change the DNA sequence; effects can be neutral, harmful or beneficial.\n**Enzymes** are proteins that catalyse biological reactions; they are denatured (permanently changed) by high temperature or extreme pH.",
        },
        {
          type: "DEFINITION",
          title: "Gene",
          content:
            "A section of DNA that carries the code for a protein (polypeptide).",
        },
        {
          type: "EXAMPLE",
          title: "A mutation example",
          content:
            "A single base change in the HBB gene causes sickle-cell anaemia — one nucleotide difference changes the haemoglobin protein and the shape of red blood cells.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The process of making a protein from an mRNA template is called:",
          explanation: "Translation reads the mRNA codons at the ribosome to build a protein.",
          options: [
            { text: "translation", correct: true },
            { text: "transcription" },
            { text: "replication" },
            { text: "mitosis" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "During gene expression, DNA is first copied into which molecule?",
          explanation: "Transcription copies a gene into messenger RNA (mRNA).",
          options: [
            { text: "mRNA", correct: true },
            { text: "tRNA" },
            { text: "a protein" },
            { text: "another DNA strand" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a mutation ALWAYS has a harmful effect on the organism.",
          explanation: "Most mutations are neutral; a few can be beneficial. Harm is not guaranteed.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State the central dogma in one line.",
          explanation: "DNA is transcribed into RNA, which is translated into protein.",
          options: [
            {
              text: "DNA → RNA → protein",
              correct: true,
              keywords: ["dna", "rna", "protein"],
            },
          ],
        },
      ],
    },
    {
      name: "Homeostasis: the endocrine system",
      description: "Hormones, feedback loops, and blood glucose control.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Homeostasis** = maintaining a stable internal environment despite external changes.\nThe **endocrine system** uses **hormones** (chemical messengers carried in the blood).\n**Insulin** (from the pancreas) LOWERS blood glucose; **glucagon** RAISES it.\nThe hypothalamus coordinates many feedback loops; most are **negative feedback** loops that restore a set point.",
        },
        {
          type: "DEFINITION",
          title: "Homeostasis",
          content:
            "The maintenance of a stable internal environment (e.g. body temperature, blood glucose) despite changes outside the body.",
        },
        {
          type: "EXAMPLE",
          title: "Blood glucose feedback loop",
          content:
            "After a meal, blood glucose rises → the pancreas releases insulin → glucose is taken up into cells → the level returns to normal. This is a negative feedback loop.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which hormone LOWERS blood glucose levels?",
          explanation: "Insulin promotes uptake of glucose into cells, lowering the blood level.",
          options: [
            { text: "insulin", correct: true },
            { text: "glucagon" },
            { text: "adrenaline" },
            { text: "thyroxine" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "The gland that releases insulin is the:",
          explanation: "Insulin is produced by the beta cells of the pancreas.",
          options: [
            { text: "pancreas", correct: true },
            { text: "liver" },
            { text: "thyroid" },
            { text: "pituitary gland" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the body maintains a stable internal environment through homeostasis.",
          explanation: "That is the definition of homeostasis.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Explain what happens to insulin release when blood glucose rises after a meal.",
          explanation: "The pancreas releases MORE insulin, which drives glucose into cells and brings the blood level back down.",
          options: [
            {
              text: "The pancreas releases more insulin, which lowers blood glucose.",
              correct: true,
              keywords: ["insulin"],
              alternatives: ["release", "released", "releases", "increase", "secret", "secrete", "more"],
            },
          ],
        },
      ],
    },
  ],
};
