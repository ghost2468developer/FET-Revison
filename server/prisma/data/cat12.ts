import { SubjectSeed } from "./types";

export const cat12: SubjectSeed = {
  grade: 12,
  code: "CAT",
  name: "Computer Applications Technology",
  color: "#7e22ce",
  examTitle: "Grade 12 CAT Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Spreadsheets: functions and formulas",
      description: "Built-in functions, IF logic, and absolute references.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A formula always starts with **=**.\nUseful functions: **SUM** (adds), **AVERAGE**, **COUNT** (counts cells with numbers), **COUNTA** (counts non-empty cells), **MAX**, **MIN**, **IF(condition, value_if_true, value_if_false)**.\n**Relative references** change when copied; **absolute references** (e.g. $B$2) stay fixed.\nCharts can be created directly from selected data.",
        },
        {
          type: "DEFINITION",
          title: "Absolute reference",
          content:
            "A cell reference fixed with $ signs (e.g. $B$2) that does NOT change when the formula is copied to another cell.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "=IF(C2>=50, \"PASS\", \"FAIL\") → shows PASS when C2 is 50 or more.\n=AVERAGE(B2:B10) → the average of cells B2 to B10.\n=A1*($B$1) → multiplies A1 by the fixed rate in B1, even when copied down.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which function counts cells that contain NUMBERS?",
          explanation: "COUNT counts numeric cells; COUNTA counts any non-empty cell.",
          options: [
            { text: "COUNT", correct: true },
            { text: "COUNTA" },
            { text: "SUM" },
            { text: "AVERAGE" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "=IF(A1>5, \"Yes\", \"No\") returns \"No\" when A1 contains 3. What does it return when A1 contains 7?",
          explanation: "7 > 5 is true, so the true-branch \"Yes\" is returned.",
          options: [
            { text: "\"Yes\"", correct: true },
            { text: "\"No\"" },
            { text: "7" },
            { text: "an error" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the AVERAGE function ignores blank cells.",
          explanation: "Blank cells are excluded from both the sum and the count.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Write the ABSOLUTE reference for cell B2.",
          explanation: "Absolute references use $ signs before both the column and row: $B$2.",
          options: [
            {
              text: "$B$2",
              correct: true,
              alternatives: ["$b$2"],
            },
          ],
        },
      ],
    },
    {
      name: "Presentations: advanced",
      description: "Slide masters, design principles, and presenting well.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**The slide master** controls the design (fonts, colours, logo position) of ALL slides at once.\nGood design: limited text (the 6×6 rule: ~6 bullet points, ~6 words each), consistent theme, good contrast, alt-text for accessibility.\nHandouts and notes pages help the audience follow.\nDelivery: know your audience, rehearse, make eye contact, have a backup (USB/copy) ready.",
        },
        {
          type: "DEFINITION",
          title: "Slide master",
          content:
            "The template that controls the overall design of all slides in a presentation - changing it changes every slide at once.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Move the school logo on the slide master and it instantly appears in the same position on all 30 slides - no per-slide editing needed.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The template that controls the design of ALL slides is the:",
          explanation: "That is the slide master.",
          options: [
            { text: "slide master", correct: true },
            { text: "animation pane" },
            { text: "transition" },
            { text: "handout" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A good presentation slide should:",
          explanation: "Slides support the speaker - limited, clear text works far better than walls of text.",
          options: [
            { text: "use limited text and support the speaker's message", correct: true },
            { text: "contain as much text as possible" },
            { text: "use 10 different fonts" },
            { text: "have no title" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: the slide master can change the design of all slides at once.",
          explanation: "Editing the master applies the change to every slide based on it.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State the purpose of a slide master.",
          explanation: "It stores the design (layout, fonts, colours) so all slides can be changed at once.",
          options: [
            {
              text: "It controls the design of all slides at once.",
              correct: true,
              keywords: ["design"],
              alternatives: ["allslides", "everyslide", "alltheslides", "allsides"],
            },
          ],
        },
      ],
    },
    {
      name: "Databases: queries and relationships",
      description: "Joins, criteria, aggregations, and referential integrity.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Queries** can combine tables (**joins**), apply **criteria** (conditions), and aggregate results (COUNT, SUM, AVG).\nRelationships enforce **referential integrity**: no record may reference a non-existent key in the related table.\n**Cascading** deletes/updates propagate changes automatically.\nA **many-to-many** relationship is implemented with a third **linking (junction) table**.",
        },
        {
          type: "DEFINITION",
          title: "Join",
          content:
            "The combination of two or more tables using matching key fields so that related records can be queried together.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Query: show the names of all learners whose average mark is above 75.\n= a query combining the Students and Marks tables with a criteria (average > 75) and an aggregate.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A many-to-many relationship is implemented using a:",
          explanation: "A linking (junction) table holds one pair of keys per row.",
          options: [
            { text: "linking (junction) table", correct: true },
            { text: "report" },
            { text: "form" },
            { text: "saved query" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A query that finds all records meeting a specific condition is using:",
          explanation: "The condition is called the query's criteria.",
          options: [
            { text: "criteria", correct: true },
            { text: "a primary key" },
            { text: "a macro" },
            { text: "a transition" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: enforcing referential integrity prevents orphan records.",
          explanation: "It stops you creating/deleting records in a way that leaves dangling foreign keys.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State the purpose of a join.",
          explanation: "A join combines records from two tables using matching key fields.",
          options: [
            {
              text: "To combine records from two tables using matching key fields.",
              correct: true,
              alternatives: ["combine", "link", "match", "join"],
            },
          ],
        },
      ],
    },
    {
      name: "Web development: HTML and CSS",
      description: "Document structure, common tags, and CSS selectors.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**HTML** defines the structure; **CSS** controls the presentation (style).\nCommon tags: <h1>–<h6> (headings), <p> (paragraph), <a href=\"...\"> (hyperlink), <img src=\"...\" alt=\"...\" />, <ul>/<ol>/<li> (lists), <table>, <form>, <input>.\nDocument structure: <!DOCTYPE html>, <html>, <head> (meta, title, <link>), <body>.\n**CSS selectors**: element (p), class (.intro), id (#header).\n**Box model**: content → padding → border → margin.",
        },
        {
          type: "DEFINITION",
          title: "HTML",
          content:
            "HyperText Markup Language - the markup language that defines the structure and content of a web page.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            '<a href="https://www.doe.gov.za">Education</a> creates a hyperlink with the text \"Education\" that opens the Department of Education website.',
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The HTML tag for a hyperlink is:",
          explanation: "The <a> (anchor) tag with an href attribute creates a link.",
          options: [
            { text: "<a>", correct: true },
            { text: "<link>" },
            { text: "<href>" },
            { text: "<url>" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The tag used for the MAIN page heading is:",
          explanation: "<h1> is the top-level heading; <h6> is the smallest.",
          options: [
            { text: "<h1>", correct: true },
            { text: "<p>" },
            { text: "<head>" },
            { text: "<html>" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: CSS controls the presentation (style) of a web page.",
          explanation: "HTML is structure, CSS is presentation.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Write the HTML for a hyperlink to https://www.doe.gov.za with the text Education.",
          explanation: "<a href=\"https://www.doe.gov.za\">Education</a>",
          options: [
            {
              text: "<a href=\"https://www.doe.gov.za\">Education</a>",
              correct: true,
              keywords: ["href"],
            },
          ],
        },
      ],
    },
  ],
};
