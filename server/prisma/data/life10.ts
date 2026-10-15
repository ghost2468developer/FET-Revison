import { SubjectSeed } from "./types";

export const life10: SubjectSeed = {
  grade: 10,
  code: "LS",
  name: "Life Sciences",
  color: "#16a34a",
  examTitle: "Grade 10 Life Sciences Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Diversity and classification of living things",
      description: "The five kingdoms, taxonomic hierarchy, and binomial nomenclature.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Life is classified into **five kingdoms**: Monera (bacteria), Protista, Fungi, Plantae and Animalia.\n**Viruses are NOT classified as living** — they cannot replicate without a host and carry out no life processes on their own.\nTaxonomic hierarchy: kingdom → phylum → class → order → family → genus → species.\n**Binomial nomenclature**: species are named *Genus species*, e.g. *Homo sapiens* (genus first, both parts with only the genus capitalised).",
        },
        {
          type: "DEFINITION",
          title: "Binomial nomenclature",
          content:
            "The two-part scientific naming system for a species, using the genus name followed by the species name, e.g. *Felis catus* for the domestic cat.",
        },
        {
          type: "EXAMPLE",
          title: "Classification example",
          content:
            "Lion: Animalia → Chordata → Mammalia → Carnivora → Felidae → Panthera → Panthera leo.\nThe closer two organisms are in the hierarchy, the more they have in common.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "How many kingdoms are there in the five-kingdom classification?",
          explanation: "Monera, Protista, Fungi, Plantae and Animalia — five in total.",
          options: [
            { text: "5", correct: true },
            { text: "3" },
            { text: "6" },
            { text: "4" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Which of the following is NOT considered a living organism?",
          explanation: "Viruses need a host cell to replicate and carry out no metabolism of their own.",
          options: [
            { text: "A virus", correct: true },
            { text: "A bacterium" },
            { text: "An amoeba" },
            { text: "A fungus" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the scientific name of a species has two parts.",
          explanation: "Binomial nomenclature = genus + species (two parts).",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Name the five kingdoms in the classification of living things.",
          explanation: "Animalia, Plantae, Fungi, Protista and Monera.",
          options: [
            {
              text: "Animalia, Plantae, Fungi, Protista, Monera",
              correct: true,
              keywords: ["animal", "plant", "fungi", "protist", "monera"],
            },
          ],
        },
      ],
    },
    {
      name: "Cells and basic life processes",
      description: "Organelles, prokaryotic vs eukaryotic, plant vs animal cells.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "All living things are made of **cells**.\n**Prokaryotic** cells (bacteria) have NO membrane-bound nucleus. **Eukaryotic** cells (plants, animals, fungi) do.\nKey organelles:\n- **Nucleus** — controls the cell, holds the DNA\n- **Mitochondria** — cellular respiration (releases energy, ATP)\n- **Ribosomes** — protein synthesis\n- **Chloroplasts** — photosynthesis (plant cells only)\n- **Cell membrane** — controls what enters and leaves the cell",
        },
        {
          type: "DEFINITION",
          title: "Organelle",
          content:
            "A specialised sub-unit within a cell that carries out a specific function, such as the mitochondrion or ribosome.",
        },
        {
          type: "EXAMPLE",
          title: "Plant cell vs animal cell",
          content:
            "Plant cells have a cell wall, chloroplasts and a large central vacuole.\nAnimal cells have none of these three.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which organelle is known as the powerhouse of the cell?",
          explanation: "The mitochondrion is where aerobic respiration releases energy (ATP).",
          options: [
            { text: "The mitochondrion", correct: true },
            { text: "The nucleus" },
            { text: "The ribosome" },
            { text: "The chloroplast" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which structure is found in plant cells but NOT in animal cells?",
          explanation: "Chloroplasts are plant-only (photosynthesis).",
          options: [
            { text: "Chloroplasts", correct: true },
            { text: "Mitochondria" },
            { text: "A cell membrane" },
            { text: "A nucleus" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: prokaryotic cells have a membrane-bound nucleus.",
          explanation: "Prokaryotes (bacteria) have no nucleus — their DNA floats in the cytoplasm.",
          options: [
            { text: "True" },
            { text: "False", correct: true },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State the function of ribosomes.",
          explanation: "Ribosomes synthesise (build) proteins.",
          options: [
            { text: "Ribosomes synthesize proteins.", correct: true, keywords: ["protein"] },
          ],
        },
      ],
    },
    {
      name: "Reproduction in humans",
      description: "The male and female reproductive systems, fertilisation and development.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Male system**: testes (produce sperm and testosterone), vas deferens, urethra.\n**Female system**: ovaries (produce eggs and hormones), fallopian tubes (site of fertilisation), uterus (fetal development).\n**Fertilisation** happens in the fallopian tube when a sperm fuses with an egg → a **zygote** forms, which travels to and implants in the uterus.\nThe embryo becomes a **fetus** after about 8 weeks; a full pregnancy lasts about 40 weeks (9 months).",
        },
        {
          type: "DEFINITION",
          title: "Fertilisation",
          content:
            "The fusion of a male gamete (sperm) with a female gamete (egg) to form a zygote, normally in the fallopian tube.",
        },
        {
          type: "EXAMPLE",
          title: "The menstrual cycle",
          content:
            "The average menstrual cycle is 28 days. Ovulation (release of the egg) occurs around day 14 — the fertile window.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Fertilisation in humans normally takes place in the:",
          explanation: "Fertilisation occurs in the fallopian (uterine) tube, not the uterus.",
          options: [
            { text: "fallopian tube", correct: true },
            { text: "uterus" },
            { text: "ovary" },
            { text: "cervix" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The fertilised egg is called a:",
          explanation: "Sperm + egg = zygote, which then divides and implants in the uterus.",
          options: [
            { text: "zygote", correct: true },
            { text: "embryo" },
            { text: "fetus" },
            { text: "placenta" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: meiosis is the type of cell division that produces gametes (sperm and eggs).",
          explanation: "Meiosis halves the chromosome number to produce haploid gametes.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Name the male organ that produces sperm.",
          explanation: "The testes produce sperm (and testosterone).",
          options: [
            {
              text: "The testes (testicles)",
              correct: true,
              alternatives: ["testis", "testes", "testicle", "testicles"],
            },
          ],
        },
      ],
    },
  ],
};
