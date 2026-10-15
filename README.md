# 📚 FETRevise - FET Revision & Exam Preparation Platform

A full-stack web app for **South African Grade 10–12 learners** to revise subjects, practice
questions with instant marking, take timed mock exams, and track their progress.

## Features

| Area | What it does |
|---|---|
| 👤 **Authentication** | Sign in / register with **Google (Gmail)** or email + password, JWT sessions, student profiles, Teacher & Admin roles |
| 📚 **Subjects & Topics** | Grade → Subject → Topic structure (Maths, Physical Sciences, Life Sciences, Accounting, CAT - 13 subjects, 41 topics, 164 questions pre-seeded) |
| 📝 **Revision** | Topic summaries, definitions, formulas, worked examples and study notes |
| 🧠 **Practice** | Multiple choice, True/False and short-answer questions with difficulty levels and **instant marking + explanations** |
| 📊 **Progress Dashboard** | Questions attempted, correct rate, average score, day streak, weak topics, strong topics, accuracy by subject, score trend, study history |
| 🧪 **Mock exams** | Timed papers with a live countdown, auto-marking, final percentage and a full question-by-question review |
| ⚙️ **Teacher/Admin panel** | Manage subjects, topics, study notes, questions (incl. short-answer grading keys), build mock exams, and (admin) assign user roles |

## Tech stack

- **React 18 + TypeScript** (Vite) - SPA, React Router, Apollo Client
- **Node.js + TypeScript** - GraphQL API (**Apollo Server 4**) with the classic **schemas (SDL) + resolvers** structure
- **Prisma ORM** on **PostgreSQL**
- **JWT** auth (`jsonwebtoken`) + **Google Identity Services** verification (`google-auth-library`)
- **bcryptjs** password hashing, **recharts** dashboard charts

## Data model

Matches the requested hierarchy:

```
User ─── StudentProfile (grade, school)
Grade ── Subject ── Topic ──┬─ StudyMaterial (summary / definition / formula / example / note)
                            └─ Question ── Answer (options, or expected short answers + grading keys)
Exam ── ExamQuestion ── Question
Student ── Attempt (PRACTICE | EXAM) ── AttemptAnswer
```

## Quick start (local)

Prerequisites: **Node 20+** and a running **PostgreSQL** instance.

```bash
# 1. create the database (once)
createdb fet_platform          # or: psql -c "CREATE DATABASE fet_platform;"

# 2. install everything
npm install
npm install --prefix server
npm install --prefix client

# 3. configure the server environment
cp server/.env.example server/.env
#    → set DATABASE_URL (and GOOGLE_CLIENT_ID if you have one)

# 4. create tables + seed the curriculum & demo accounts
npm --prefix server exec prisma migrate dev
npm --prefix server run seed

# 5. run (two terminals)
npm --prefix server run dev    # API on http://localhost:4000 (GraphQL at /graphql)
npm --prefix client run dev    # web app on http://localhost:5173 (proxies /graphql)
```

Or all-in-one: `npm run setup && npm run dev`

### Production mode (single port)

```bash
npm run build     # builds client → client/dist and server → server/dist
npm start         # serves the web app AND the API on http://localhost:4000
```

## Demo accounts

| Email | Password | Role |
|---|---|---|
| `admin@fet.co.za` | `Admin123!` | **Admin** (content + user roles) |
| `teacher@fet.co.za` | `Teacher123!` | **Teacher** (content + exams) |
| `demo@fet.co.za` | `Student123!` | **Student** (Grade 12, pre-filled study history so the dashboard shows real data) |

> The **first account ever registered** (or whoever uses the `ADMIN_EMAIL` in `server/.env`)
> automatically becomes an admin.

## Google ("Sign in with Gmail") setup

The app uses the modern **Google Identity Services** button - no redirect URIs needed.

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth client ID** of type **Web application**
3. Under *Authorized JavaScript origins* add the origins your app runs on, e.g.
   `http://localhost:5173`, `http://localhost:4000`
4. Copy the **Client ID** and set it in **two places**:
   - `server/.env` → `GOOGLE_CLIENT_ID=...` (the server verifies the token's signature)
   - `client/.env` → `VITE_GOOGLE_CLIENT_ID=...` (the button)

   ```bash
   echo "VITE_GOOGLE_CLIENT_ID=123456...-abc.apps.googleusercontent.com" > client/.env
   ```
5. Rebuild/restart both apps. The **"Continue with Google"** button appears on the login
   page. A Gmail user who has never registered is **auto-registered** on first sign-in;
   existing local accounts with the same email get their Google identity linked.

Until you configure a client ID, the button is hidden and a notice explains why -
email/password login works regardless.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | server/.env | PostgreSQL connection string |
| `JWT_SECRET` | server/.env | Secret used to sign JWTs - change in production |
| `PORT` | server/.env | API port (default 4000) |
| `GOOGLE_CLIENT_ID` | server/.env | Enables Google sign-in on the API |
| `ADMIN_EMAIL` | server/.env | Email that is granted the ADMIN role |
| `VITE_GOOGLE_CLIENT_ID` | client/.env | Same client ID - renders the Google button |

## GraphQL API (schemas + resolvers)

The API follows the GraphQL pattern you asked for: a single SDL schema
(`server/src/schema.graphql`) and resolver maps (`server/src/resolvers/*`).

```graphql
# Auth
mutation { login(email: "demo@fet.co.za", password: "Student123!") { token user { name } } }
mutation { loginWithGoogle(credential: "<GIS id token>") { token user { name } } }

# Browse (students get their own grade by default)
query { subjects { name code topicCount } }
query($id: ID!) { topics(subjectId: $id) { name questionCount } }
query($id: ID!) { studyMaterials(topicId: $id) { type title content } }

# Practice (instant marking - the server grades and returns the explanation)
mutation($id: ID!) { startPracticeSession(topicId: $id) }
mutation($a: ID!, $q: ID!, $o: ID) {
  submitPracticeAnswer(attemptId: $a, questionId: $q, answerId: $o) {
    isCorrect awardedPoints explanation correctOptionText
  }
}

# Mock exam (timed, auto-marked)
mutation($id: ID!) { startExam(examId: $id) { attemptId deadlineAt questions { id options { id text } } } }
mutation($a: ID!, $q: ID!, $o: ID) { submitExamAnswer(attemptId: $a, questionId: $q, answerId: $o) }
mutation($a: ID!) { submitExam(attemptId: $a) { percentage totalPoints answers { isCorrect } } }

# Dashboard
query { dashboard { questionsAttempted correctRate weakTopics { topic { name } accuracy } strongTopics { accuracy } } }
```

Open the Apollo sandbox in dev mode at `http://localhost:4000/graphql` to explore everything
(interactive, with autocompletion).

## Short-answer grading

Short-answer questions are graded automatically with a transparent rule
(`server/src/grading.ts`):

- **keywords** - ALL listed tokens must appear in the learner's answer (use for
  multi-part answers, e.g. `["45", "225"]` for "45° and 225°")
- **alternatives** - at least ONE must appear (use for acceptable variants,
  e.g. `["equity", "capital"]`)
- neither set → the answer must exactly match the expected text (fuzzy: case,
  punctuation and spacing ignored)

Both lists are editable per expected answer in the teacher panel.

## Project structure

```
fet-platform/
├── package.json               # root scripts (setup / dev / build / start)
├── server/
│   ├── prisma/
│   │   ├── schema.prisma      # data model (Prisma)
│   │   ├── migrations/        # SQL migrations
│   │   ├── seed.ts            # seeds curriculum + demo accounts + demo history
│   │   └── data/              # curriculum content (12 subject-grade modules)
│   └── src/
│       ├── index.ts           # Express + Apollo Server + static client
│       ├── schema.graphql     # GraphQL SDL (the "schema")
│       ├── context.ts         # JWT → user, guard helpers
│       ├── grading.ts         # shared answer-grading logic
│       ├── google.ts          # Google ID-token verification
│       └── resolvers/         # the "resolvers": auth, browse, practice,
│                              #   exams, dashboard, admin
└── client/
    └── src/
        ├── api.ts             # Apollo client (auth link, 401 guard)
        ├── auth.tsx           # session context
        ├── gql.ts             # all queries/mutations
        ├── pages/             # Login, Dashboard, Subjects, Topic, Practice,
        │                      #   Exams, ExamRunner, Result, Profile, Admin
        └── components/        # Layout, UI kit, Google button
```

## Notes

- Practice sessions are marked per answer and also count toward your dashboard stats.
- Mock exams: the timer auto-submits at 0:00; answers save as you go; the question order
  is shuffled for every attempt.
- Deleting a subject cascades (topics, questions, exams); questions locked inside an exam
  must be removed from the exam first.
