import { SubjectSeed } from "./types";

export const life11: SubjectSeed = {
  grade: 11,
  code: "LS",
  name: "Life Sciences",
  color: "#15803d",
  examTitle: "Grade 11 Life Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Heredity and inheritance",
      description: "Mendel's laws, Punnett squares, and inherited human disorders.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Mendel's laws**: dominance (the dominant allele masks the recessive one) and segregation (allele pairs separate during meiosis).\nAlleles: dominant (A) / recessive (a).\nCross of two heterozygotes Aa × Aa → **1:2:1 genotypic** ratio (AA : Aa : aa) and **3:1 phenotypic** ratio.\nUse a **Punnett square** to predict offspring.\nIn humans: sickle-cell anaemia is recessive (HbS); red–green colour blindness is X-linked recessive.",
        },
        {
          type: "DEFINITION",
          title: "Genotype vs phenotype",
          content:
            "**Genotype**: the genetic makeup of an organism (e.g. Aa).\n**Phenotype**: the observable trait that results (e.g. tall).",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Aa × Aa → offspring: AA (25%), Aa (50%), aa (25%).\nIf A (tall) is dominant: 75% tall, 25% short.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A cross Aa × Aa gives a genotypic ratio of:",
          explanation: "AA : Aa : aa = 1 : 2 : 1.",
          options: [
            { text: "1 : 2 : 1", correct: true },
            { text: "3 : 1" },
            { text: "1 : 1" },
            { text: "9 : 3 : 3 : 1" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Both parents are carriers for sickle-cell anaemia (HbA HbS). What is the probability their child has sickle-cell anaemia?",
          explanation: "HbA HbS × HbA HbS → 25% HbS HbS (anaemia), 50% carriers, 25% normal.",
          options: [
            { text: "25%", correct: true },
            { text: "50%" },
            { text: "75%" },
            { text: "0%" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a recessive allele only shows its trait when no dominant allele is present.",
          explanation: "That is the law of dominance — recessives are masked by dominants.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Give the PHENOTYPIC ratio from a cross Aa × Aa (A dominant over a).",
          explanation: "3 dominant phenotype : 1 recessive phenotype.",
          options: [
            {
              text: "3 : 1",
              correct: true,
              alternatives: ["3to1", "31"],
            },
          ],
        },
      ],
    },
    {
      name: "Ecosystems",
      description: "Food webs, trophic levels, energy flow and nutrient cycles.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "An **ecosystem** = a community of organisms + their physical environment.\n**Trophic levels**: producers (1st) → primary consumers (2nd) → secondary consumers (3rd) → tertiary consumers (4th).\nA **food web** shows many connected food chains.\nOnly about **10%** of energy is transferred between trophic levels — the rest is lost (mostly as heat).\n**Decomposers** break down dead matter and recycle nutrients back into the ecosystem.",
        },
        {
          type: "DEFINITION",
          title: "Trophic level",
          content:
            "The position an organism occupies in a food chain, e.g. a grasshopper that eats grass is a primary consumer (2nd trophic level).",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Grass → grasshopper → frog → snake = four trophic levels.\nGrass = producer; grasshopper = primary consumer; frog = secondary consumer; snake = tertiary consumer.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "In a food chain, green plants occupy which trophic level?",
          explanation: "Producers make their own food and form the 1st trophic level.",
          options: [
            { text: "1st trophic level (producers)", correct: true },
            { text: "2nd trophic level" },
            { text: "3rd trophic level" },
            { text: "4th trophic level" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Approximately what percentage of energy is transferred from one trophic level to the next?",
          explanation: "The 10% rule: most energy is lost as heat at each level.",
          options: [
            { text: "10%", correct: true },
            { text: "50%" },
            { text: "100%" },
            { text: "1%" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a food web shows many connected food chains.",
          explanation: "A food web links all the food chains in an ecosystem.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State the role of decomposers in an ecosystem.",
          explanation: "Decomposers break down dead organic matter and recycle nutrients back into the soil/ecosystem.",
          options: [
            {
              text: "They break down dead matter and recycle nutrients.",
              correct: true,
              keywords: ["recycl"],
            },
          ],
        },
      ],
    },
    {
      name: "Genetic diversity and evolution",
      description: "Variation, mutation, and why diversity matters for survival.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Genetic diversity** = the variety of different alleles/genes within a population.\n**Low diversity is dangerous**: populations become vulnerable to disease, environmental change and cannot adapt.\nSources of variation: **mutation** (new alleles), **recombination** (crossing over in meiosis) and **sexual reproduction** (mixing of parents' genes).",
        },
        {
          type: "DEFINITION",
          title: "Genetic diversity",
          content:
            "The variety of different genes and alleles present in a population or species.",
        },
        {
          type: "EXAMPLE",
          title: "A cautionary example",
          content:
            "The Irish potato famine: Irish farmers grew one potato variety (very low genetic diversity). When blight struck, the whole crop failed — a disaster caused by low diversity.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Genetic diversity refers to:",
          explanation: "It is the variety of alleles/genes in a population.",
          options: [
            { text: "the variety of genes/alleles in a population", correct: true },
            { text: "the number of species in an area" },
            { text: "the age of a population" },
            { text: "the size of individual organisms" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A population with LOW genetic diversity is more likely to:",
          explanation: "Without variation, there may be no individuals suited to survive a new disease or environment.",
          options: [
            { text: "struggle to adapt to environmental changes", correct: true },
            { text: "evolve faster" },
            { text: "grow to a larger size" },
            { text: "reproduce more quickly" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "MEDIUM",
          points: 1,
          text: "True or false: mutation can increase genetic diversity.",
          explanation: "Mutations create new alleles, adding to the gene pool.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Name TWO sources of genetic variation.",
          explanation: "Any two of: mutation, recombination (crossing over), sexual reproduction.",
          options: [
            {
              text: "Mutation and recombination (or sexual reproduction).",
              correct: true,
              keywords: ["mutation"],
            },
          ],
        },
      ],
    },
  ],
};
