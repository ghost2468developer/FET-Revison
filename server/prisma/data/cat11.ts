import { SubjectSeed } from "./types";

export const cat11: SubjectSeed = {
  grade: 11,
  code: "CAT",
  name: "Computer Applications Technology",
  color: "#6d28d9",
  examTitle: "Grade 11 CAT Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Data collection and analysis",
      description: "Primary vs secondary data, survey design, and statistics.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Primary data**: collected first-hand for your specific purpose (surveys, questionnaires, interviews, observations).\n**Secondary data**: already collected by someone else (Statistics South Africa, published reports).\nQuestion design: **open** questions (free text) vs **closed** questions (fixed options).\nCharts: bar (comparison), pie (part-to-whole), line (trend over time).\nMeasures of central tendency: mean, median, mode. The **mean** is the most affected by extreme values (outliers).",
        },
        {
          type: "DEFINITION",
          title: "Primary data",
          content:
            "Data collected first-hand by the researcher for a specific purpose, e.g. through a questionnaire or interview.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A survey of 50 learners: 30 prefer mathematics → 30/50 = 60%.\nA pie chart is the best way to show this part-to-whole preference.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which chart type is best for showing part-to-whole data?",
          explanation: "Pie charts show how each category contributes to the whole (100%).",
          options: [
            { text: "pie chart", correct: true },
            { text: "line graph" },
            { text: "histogram" },
            { text: "scatter plot" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A questionnaire that you design and run yourself is an example of:",
          explanation: "You collected it first-hand for your purpose — primary data.",
          options: [
            { text: "primary data", correct: true },
            { text: "secondary data" },
            { text: "tertiary data" },
            { text: "metadata" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the mean is affected by extreme values (outliers).",
          explanation: "A very large or small value pulls the mean with it; the median is more resistant.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Calculate the mean of 4, 8, 10, 12 and 16.",
          explanation: "Sum = 50; 50 ÷ 5 = 10.",
          options: [
            { text: "10", correct: true, keywords: ["10"] },
          ],
        },
      ],
    },
    {
      name: "Databases: basics",
      description: "Tables, records, fields, keys, and the four database objects.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A relational database is built from **tables**: **records** (rows) and **fields** (columns).\nA **primary key** uniquely identifies each record.\nA **foreign key** links two tables (a relationship).\nRelationships: one-to-one, one-to-many, many-to-many.\nFour main objects: **tables** (data), **queries** (saved questions), **forms** (data entry), **reports** (formatted output).",
        },
        {
          type: "DEFINITION",
          title: "Primary key",
          content:
            "A field (or combination of fields) that uniquely identifies each record in a table — no two records may share the same value.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Students (studentNo PK, name, grade) and Marks (markId PK, studentNo FK, subject, mark):\nthe studentNo in Marks links back to Students — a one-to-many relationship.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The field used to uniquely identify a record is the:",
          explanation: "That is the primary key.",
          options: [
            { text: "primary key", correct: true },
            { text: "foreign key" },
            { text: "index" },
            { text: "field label" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A saved question asked of a database is a:",
          explanation: "A query retrieves the records that match your criteria.",
          options: [
            { text: "query", correct: true },
            { text: "form" },
            { text: "report" },
            { text: "macro" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a primary key cannot contain duplicate values.",
          explanation: "Uniqueness is the whole point of a primary key.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Name the key that links two tables in a relationship.",
          explanation: "A foreign key in one table references the primary key in another table.",
          options: [
            { text: "Foreign key", correct: true, keywords: ["foreign"] },
          ],
        },
      ],
    },
    {
      name: "Multimedia and presentations",
      description: "Media formats, embedding vs linking, and slide effects.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Multimedia** = combining text, images, audio, video and animation.\nCommon formats: images .jpg / .png / .gif; audio .mp3 / .wav; video .mp4 / .avi.\n**Embedding** stores the media INSIDE the presentation file (larger file, always travels with it).\n**Linking** keeps a reference to the file (smaller file, but the media file must stay available).\n**Animations**: effects applied to objects on a slide. **Transitions**: effects between slides.",
        },
        {
          type: "DEFINITION",
          title: "Transition",
          content:
            "The effect that plays when moving from one slide to the next during a presentation.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A presentation with an embedded 20 MB video file will be far larger than the same presentation with the video linked.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which of the following is a common image file format?",
          explanation: ".jpg is a compressed image format; the others are audio, word and web formats.",
          options: [
            { text: ".jpg", correct: true },
            { text: ".mp3" },
            { text: ".docx" },
            { text: ".html" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Embedding a media file in a presentation:",
          explanation: "Embedding stores the actual media inside the file, so the file size grows.",
          options: [
            { text: "stores it inside the file, increasing the file size", correct: true },
            { text: "keeps a reference to it, keeping the file small" },
            { text: "compresses it to the minimum size" },
            { text: "converts it to a different format" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a slide transition is the effect shown when moving between slides.",
          explanation: "Transitions act between slides; animations act on objects within a slide.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Give a common file extension for an audio file.",
          explanation: "MP3 (or WAV, AAC, OGG) are common audio formats.",
          options: [
            {
              text: "MP3",
              correct: true,
              alternatives: ["mp3", "wav", "aac", "ogg"],
            },
          ],
        },
      ],
    },
  ],
};
