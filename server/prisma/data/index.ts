import { SubjectSeed } from "./types";
import { math10 } from "./math10";
import { math11 } from "./math11";
import { math12 } from "./math12";
import { phy10 } from "./phy10";
import { phy11 } from "./phy11";
import { phy12 } from "./phy12";
import { life10 } from "./life10";
import { life11 } from "./life11";
import { life12 } from "./life12";
import { acct11 } from "./acct11";
import { acct12 } from "./acct12";
import { cat11 } from "./cat11";
import { cat12 } from "./cat12";

export const SUBJECTS: SubjectSeed[] = [
  math10,
  math11,
  math12,
  phy10,
  phy11,
  phy12,
  life10,
  life11,
  life12,
  acct11,
  acct12,
  cat11,
  cat12,
];

export type { SubjectSeed, SeedTopic, SeedQuestion, SeedMaterial } from "./types";
