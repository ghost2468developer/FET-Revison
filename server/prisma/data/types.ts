export type MaterialTypeSeed = "SUMMARY" | "DEFINITION" | "FORMULA" | "EXAMPLE" | "STUDY_NOTE";
export type QuestionTypeSeed = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
export type DifficultySeed = "EASY" | "MEDIUM" | "HARD";

export interface SeedQuestionOption {
  text: string;
  correct?: boolean;
  /** ALL of these tokens must appear in the learner's short answer. */
  keywords?: string[];
  /** At least ONE of these must appear (acceptable alternative phrasings). */
  alternatives?: string[];
}

export interface SeedQuestion {
  type: QuestionTypeSeed;
  difficulty?: DifficultySeed;
  points?: number;
  text: string;
  explanation?: string;
  options: SeedQuestionOption[];
}

export interface SeedMaterial {
  type: MaterialTypeSeed;
  title: string;
  content: string;
}

export interface SeedTopic {
  name: string;
  description?: string;
  materials: SeedMaterial[];
  questions: SeedQuestion[];
}

export interface SubjectSeed {
  grade: number;
  code: string;
  name: string;
  color: string;
  /** How many questions to draw for the mock exam of this subject (default 10). */
  examQuestionCount?: number;
  examTitle?: string;
  examDuration?: number;
  topics: SeedTopic[];
}
