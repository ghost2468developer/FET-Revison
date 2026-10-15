// Shared answer-grading logic, used by the resolvers AND the database seed
// (so seeded demo history is graded exactly like live answers).

export type GradeableQuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface GradedAnswerLike {
  text: string;
  isCorrect: boolean;
  keywords?: string[];
  alternatives?: string[];
}

export interface QuestionLike {
  type: GradeableQuestionType;
  points: number;
  answers: GradedAnswerLike[];
}

/**
 * Normalise text for fuzzy comparison: lowercase, unify the unicode minus,
 * drop the caret, and keep only letters, digits, ".", "-" and "$".
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/\^/g, "")
    .replace(/[^a-z0-9.\-$]/g, "");
}

/**
 * Short-answer matching rule for one correct answer row:
 *  - `keywords`: ALL must be present in the learner's answer (use for
 *    multi-part answers - every required part must be mentioned).
 *  - `alternatives`: at least ONE must be present (use for acceptable
 *    spellings/phrasings, e.g. "equity" or "capital").
 *  - neither set: the normalised answer must equal the normalised text.
 */
function shortAnswerMatches(userNorm: string, correct: GradedAnswerLike): boolean {
  const kws = (correct.keywords ?? []).map(normalize).filter(Boolean);
  const alts = (correct.alternatives ?? []).map(normalize).filter(Boolean);
  const validKw = (k: string) => k.length >= 2 || /^\d+$/.test(k);
  const kwOk = kws.every((k) => !validKw(k) || userNorm.includes(k));
  const altOk = alts.length > 0 ? alts.some((a) => userNorm.includes(a)) : true;
  if (kws.length === 0 && alts.length === 0) return normalize(correct.text) === userNorm;
  return kwOk && altOk;
}

export interface GradeResult {
  isCorrect: boolean;
  awarded: number;
}

/**
 * Grade a learner's selection.
 * `selected` is the Answer row the learner picked (MCQ / true-false) and
 * `answerText` is the free text they typed (short answer).
 */
export function gradeSelection(
  q: QuestionLike,
  selected: GradedAnswerLike | undefined | null,
  answerText?: string | null
): GradeResult {
  if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
    const ok = !!selected && selected.isCorrect === true;
    return { isCorrect: ok, awarded: ok ? q.points : 0 };
  }
  const user = normalize(answerText ?? "");
  if (!user) return { isCorrect: false, awarded: 0 };
  const ok = q.answers.some((a) => a.isCorrect && shortAnswerMatches(user, a));
  return { isCorrect: ok, awarded: ok ? q.points : 0 };
}
