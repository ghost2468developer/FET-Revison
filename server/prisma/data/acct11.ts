import { SubjectSeed } from "./types";

export const acct11: SubjectSeed = {
  grade: 11,
  code: "ACCT",
  name: "Accounting",
  color: "#d97706",
  examTitle: "Grade 11 Accounting Mock Exam",
  examDuration: 40,
  topics: [
    {
      name: "Final financial statements for sole proprietors",
      description: "The income statement and statement of financial position.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "The **income statement** (profit and loss account) shows revenue − expenses = net income for a PERIOD.\nThe **statement of financial position** (balance sheet) shows assets = liabilities + owner's equity AT A POINT IN TIME.\n**Current** assets/liabilities are expected to be converted to/settled in cash within a year; **non-current** items last longer.",
        },
        {
          type: "DEFINITION",
          title: "Owner's equity",
          content:
            "The owner's claim on the business: owner's equity = assets − liabilities.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Assets R120 000; liabilities R30 000:\nowner's equity = 120 000 − 30 000 = R90 000.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The statement that shows whether a business made a profit or loss during a period is the:",
          explanation: "The income statement covers a period of time (revenue − expenses).",
          options: [
            { text: "income statement", correct: true },
            { text: "statement of financial position" },
            { text: "cash flow statement" },
            { text: "trial balance" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Assets are R120 000 and liabilities are R30 000. Owner's equity is:",
          explanation: "Equity = assets − liabilities = R90 000.",
          options: [
            { text: "R90 000", correct: true },
            { text: "R150 000" },
            { text: "R30 000" },
            { text: "R120 000" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a statement of financial position is prepared AT a point in time.",
          explanation: "It is a 'snapshot' — 'as at 28 February 2025', not 'for the year ended…'.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "Complete the accounting equation: Assets = Liabilities + … ? ",
          explanation: "Assets = Liabilities + Owner's equity (capital).",
          options: [
            {
              text: "Owner's equity (capital)",
              correct: true,
              alternatives: ["equity", "capital"],
            },
          ],
        },
      ],
    },
    {
      name: "Inventory and cost of sales",
      description: "Computing cost of sales and the lower-of-cost-or-NRV rule.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "**Cost of sales** = opening inventory + purchases − closing inventory.\nClosing inventory is shown as a **current asset** on the statement of financial position.\nInventory is valued at the **lower of cost or net realisable value (NRV)** — NRV = selling price − costs to sell.\n**Perpetual** systems update inventory continuously; **periodic** systems count it at the end of the period.",
        },
        {
          type: "FORMULA",
          title: "Cost of sales",
          content: "Cost of sales = opening stock + purchases − closing stock",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Opening R5 000 + purchases R20 000 − closing R3 000 = cost of sales R22 000.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Cost of sales equals:",
          explanation: "Cost of sales = opening inventory + purchases − closing inventory.",
          options: [
            { text: "opening stock + purchases − closing stock", correct: true },
            { text: "opening stock + purchases + closing stock" },
            { text: "purchases − closing stock" },
            { text: "closing stock + purchases" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Opening inventory R8 000, purchases R30 000, closing inventory R5 000. Cost of sales is:",
          explanation: "8 000 + 30 000 − 5 000 = R33 000.",
          options: [
            { text: "R33 000", correct: true },
            { text: "R43 000" },
            { text: "R38 000" },
            { text: "R25 000" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: inventory is valued at the lower of cost or net realisable value.",
          explanation: "That is the lower-of-cost-or-NRV rule.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Calculate the cost of sales: opening R5 000, purchases R20 000, closing R3 000.",
          explanation: "5 000 + 20 000 − 3 000 = R22 000.",
          options: [
            { text: "R22 000", correct: true, keywords: ["22000"] },
          ],
        },
      ],
    },
    {
      name: "Depreciation",
      description: "The cost (straight-line) and diminishing value methods.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "Depreciation allocates the cost of a non-current asset over its useful life.\n**Cost method** (straight-line): depreciation = cost × rate — the SAME amount every year.\n**Diminishing value method**: depreciation = book value × rate — the charge DECREASES every year.\nBook value (carrying amount) = cost − accumulated depreciation.",
        },
        {
          type: "FORMULA",
          title: "Depreciation formulas",
          content:
            "Cost method: depreciation = cost × rate\nDiminishing value: depreciation = book value × rate\nBook value = cost − accumulated depreciation",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A R10 000 machine at 10% cost method: R1 000 every year.\nThe same machine at 10% diminishing value: year 1 R1 000, year 2 R900, year 3 R810 (decreasing).",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A R10 000 asset is depreciated at 10% using the COST method. The year 2 depreciation is:",
          explanation: "Cost method: 10 000 × 10% = R1 000 every year.",
          options: [
            { text: "R1 000", correct: true },
            { text: "R900" },
            { text: "R810" },
            { text: "R1 100" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "A R8 000 asset is depreciated at 20% using the DIMINISHING VALUE method. The year 1 depreciation is:",
          explanation: "Year 1 book value = cost = 8 000; 8 000 × 20% = R1 600.",
          options: [
            { text: "R1 600", correct: true },
            { text: "R1 280" },
            { text: "R800" },
            { text: "R2 000" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: with the diminishing value method, the annual depreciation charge decreases over time.",
          explanation: "Each year the rate is applied to a lower book value.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "A R12 000 asset is depreciated at 10% cost method. Calculate the TOTAL depreciation over 2 years.",
          explanation: "12 000 × 10% = 1 200 per year; × 2 years = R2 400.",
          options: [
            { text: "R2 400", correct: true, keywords: ["2400"] },
          ],
        },
      ],
    },
  ],
};
