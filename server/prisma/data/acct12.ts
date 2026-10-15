import { SubjectSeed } from "./types";

export const acct12: SubjectSeed = {
  grade: 12,
  code: "ACCT",
  name: "Accounting",
  color: "#b45309",
  examTitle: "Grade 12 Accounting Mock Exam",
  examDuration: 45,
  topics: [
    {
      name: "Bank reconciliation statements",
      description: "Reconciling the bank statement with the cash book.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A **bank reconciliation statement (BRS)** reconciles the bank statement balance with the cash book (bank account) balance.\n**Adjustments to the bank statement**: deposits received but not yet credited (add), outstanding/uncashed cheques (subtract), interest and bank charges, debit/credit notes (e.g. insurance paid by the bank), EFTs.\n**Standing order**: a pre-arranged, regular, automatic payment (e.g. monthly rent).\n**EFT**: electronic funds transfer between accounts.",
        },
        {
          type: "DEFINITION",
          title: "Standing order",
          content:
            "A pre-arranged regular payment (for example, monthly rent or a subscription) that the bank makes automatically from your account.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Bank balance R15 000\n+ deposit in transit R2 000\n− outstanding cheques R1 500\n+ interest earned R200\n= cash book balance R15 700",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A cheque paid by a business but not yet presented for payment is called an:",
          explanation: "It is an outstanding (uncashed) cheque - deducted from the bank balance on the BRS.",
          options: [
            { text: "outstanding cheque", correct: true },
            { text: "unpresented deposit" },
            { text: "EFT" },
            { text: "standing order" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "On the BRS, a deposit made by the business but not yet credited by the bank is:",
          explanation: "The bank has not received it yet, so it is ADDED to the bank statement balance.",
          options: [
            { text: "added to the bank statement balance", correct: true },
            { text: "subtracted from the bank statement balance" },
            { text: "added to the cash book balance" },
            { text: "ignored" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a standing order is a pre-arranged regular payment.",
          explanation: "That is exactly what a standing order is.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "State what a standing order is.",
          explanation: "A standing order is a pre-arranged, regular, automatic payment made by the bank (e.g. rent).",
          options: [
            {
              text: "A standing order is a regular, pre-arranged automatic payment (for example, rent or a subscription).",
              correct: true,
              keywords: ["regular"],
              alternatives: ["automatic", "prearranged", "pre-arranged", "recurring", "automatically"],
            },
          ],
        },
      ],
    },
    {
      name: "Non-current assets and disposals",
      description: "Carrying amounts and gains/losses on disposal of PPE.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "The property, plant and equipment (PPE) note shows: **cost**, **accumulated depreciation**, and **carrying amount** (book value) = cost − accumulated depreciation.\nOn **disposal**: remove the cost and the accumulated depreciation; the gain or loss = proceeds − carrying amount.\nA **gain** increases income; a **loss** decreases it.",
        },
        {
          type: "FORMULA",
          title: "Disposal formulas",
          content:
            "Carrying amount = cost − accumulated depreciation\nGain on disposal = proceeds − carrying amount\nLoss on disposal = carrying amount − proceeds",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A vehicle cost R120 000; accumulated depreciation R48 000 → carrying amount R72 000.\nSold for R80 000 → gain = 80 000 − 72 000 = R8 000.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "The carrying amount of a non-current asset equals:",
          explanation: "Carrying amount = cost − accumulated depreciation.",
          options: [
            { text: "cost − accumulated depreciation", correct: true },
            { text: "cost + accumulated depreciation" },
            { text: "accumulated depreciation only" },
            { text: "proceeds from sale" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "An asset cost R120 000, accumulated depreciation R48 000. It is sold for R80 000. The gain on disposal is:",
          explanation: "Carrying amount = 72 000; gain = 80 000 − 72 000 = R8 000.",
          options: [
            { text: "R8 000", correct: true },
            { text: "R40 000" },
            { text: "R32 000" },
            { text: "a loss of R8 000" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: accumulated depreciation increases over the asset's useful life.",
          explanation: "Each year's depreciation is added to the accumulated total.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Equipment cost R50 000, accumulated depreciation R20 000. It is sold for R35 000. Calculate the gain or loss on disposal.",
          explanation: "Carrying amount = 50 000 − 20 000 = 30 000; gain = 35 000 − 30 000 = R5 000.",
          options: [
            { text: "Gain of R5 000", correct: true, keywords: ["5000"] },
          ],
        },
      ],
    },
    {
      name: "Partnerships",
      description: "Profit-sharing ratios, capital accounts, and dissolution.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A **partnership**: 2 to 50 partners who run the business together.\nThe **partnership agreement** sets the profit-sharing ratio, interest on capital, and salaries to partners.\n**Capital accounts**: fixed capital + current (drawing) accounts.\nOn **dissolution**: assets are realised (sold), creditors are paid, and any remaining cash is distributed according to the capital balances.",
        },
        {
          type: "DEFINITION",
          title: "Profit-sharing ratio",
          content:
            "The agreed proportion in which partners share the net income and losses of the partnership.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "Net income R9 000, ratio 2:1 → partner A receives 2/3 × 9 000 = R6 000; partner B receives R3 000.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Partners share profits and losses in accordance with the:",
          explanation: "The partnership agreement specifies the profit-sharing ratio.",
          options: [
            { text: "profit-sharing ratio", correct: true },
            { text: "size of their offices" },
            { text: "alphabetical order" },
            { text: "length of their names" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "MEDIUM",
          points: 2,
          text: "Net income is R9 000 and the profit-sharing ratio is 2:1. Partner A's share is:",
          explanation: "A gets 2/3 × 9 000 = R6 000.",
          options: [
            { text: "R6 000", correct: true },
            { text: "R3 000" },
            { text: "R4 500" },
            { text: "R9 000" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: in a partnership, partners share profits and losses in the agreed ratio.",
          explanation: "Yes - the ratio in the partnership agreement applies to both profits and losses.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "MEDIUM",
          points: 3,
          text: "Net income of R10 000 is shared in the ratio 3:2. Calculate the LARGER share.",
          explanation: "Total parts = 5; larger share = 3/5 × 10 000 = R6 000.",
          options: [
            { text: "R6 000", correct: true, keywords: ["6000"] },
          ],
        },
      ],
    },
    {
      name: "Introduction to companies",
      description: "Companies as legal entities, shares, and share capital.",
      materials: [
        {
          type: "SUMMARY",
          title: "Key ideas",
          content:
            "A **company is a separate legal entity** - it can own assets, borrow money and sue or be sued, independently of its owners.\nTypes: **private (Pty) Ltd**, **public Ltd**, and non-profit.\n**Share capital** is the money raised by selling shares.\n**Ordinary shares** carry voting rights; **preference shares** carry a fixed dividend and usually no voting rights.\nA private company must have at least one director.",
        },
        {
          type: "DEFINITION",
          title: "Share",
          content:
            "A unit of ownership in a company. Buying shares makes you a shareholder (owner) with a claim on the company's assets and profits.",
        },
        {
          type: "EXAMPLE",
          title: "Worked example",
          content:
            "A company issues 1 000 ordinary shares at R25 each:\nshare capital raised = 1 000 × 25 = R25 000.",
        },
      ],
      questions: [
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "Which type of share normally carries voting rights?",
          explanation: "Ordinary shareholders vote at AGMs; preference shareholders usually do not.",
          options: [
            { text: "ordinary shares", correct: true },
            { text: "preference shares" },
            { text: "both, equally" },
            { text: "neither" },
          ],
        },
        {
          type: "MCQ",
          difficulty: "EASY",
          points: 2,
          text: "A company issues 1 000 shares at R25 each. The share capital raised is:",
          explanation: "1 000 × 25 = R25 000.",
          options: [
            { text: "R25 000", correct: true },
            { text: "R25 0" },
            { text: "R1 000" },
            { text: "R2 500" },
          ],
        },
        {
          type: "TRUE_FALSE",
          difficulty: "EASY",
          points: 1,
          text: "True or false: a company is a legal entity separate from its owners.",
          explanation: "That 'separate legal personality' is what makes a company a company.",
          options: [
            { text: "True", correct: true },
            { text: "False" },
          ],
        },
        {
          type: "SHORT_ANSWER",
          difficulty: "EASY",
          points: 2,
          text: "State ONE difference between ordinary shares and preference shares.",
          explanation: "Ordinary shares carry voting rights; preference shares carry a fixed dividend (and usually no vote).",
          options: [
            {
              text: "Ordinary shares carry voting rights, while preference shares carry a fixed dividend.",
              correct: true,
              alternatives: ["vot", "dividend"],
            },
          ],
        },
      ],
    },
  ],
};
