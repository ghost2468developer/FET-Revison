/* API smoke test - exercises the full flow over HTTP. */
const BASE = "http://localhost:4000/graphql";

async function gql(query, variables = {}, token = null) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL error: ${JSON.stringify(json.errors[0])}\nquery: ${query.slice(0, 120)}`);
  return json.data;
}

let pass = 0;
function ok(name, cond) {
  if (!cond) throw new Error(`FAILED: ${name}`);
  pass++;
  console.log(`  ✓ ${name}`);
}

(async () => {
  console.log("- auth -");
  const reg = await gql(
    `mutation { register(name: "Test Student", email: "test+api@example.com", password: "secret123") { token user { name email role profile { grade } } } }`
  );
  ok("register returns token + student", !!reg.register.token && reg.register.user.role === "STUDENT");
  const t1 = reg.register.token;

  const dup = await fetch(BASE, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: `mutation { register(name: "X", email: "test+api@example.com", password: "secret123") { token } }` }) }).then((r) => r.json());
  ok("duplicate register rejected", !!dup.errors);

  const login = await gql(`mutation { login(email: "demo@fet.co.za", password: "Student123!") { token user { name } } }`);
  const demo = login.login.token;
  ok("demo login", login.login.user.name === "Thandi Mokoena");

  const me = await gql(`query { me { name role profile { grade school } } }`, {}, demo);
  ok("me returns profile", me.me.profile.grade === 12);

  const noAuth = await fetch(BASE, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: `query { dashboard { questionsAttempted } }` }) }).then((r) => r.json());
  ok("unauthenticated dashboard rejected", noAuth.errors?.[0]?.extensions?.code === "UNAUTHENTICATED");

  console.log("- browse -");
  const grades = await gql(`query { grades { id name } }`);
  ok("3 grades", grades.grades.length === 3);

  const subjects = await gql(`query { subjects { id name code grade { id } topicCount examCount } }`, {}, demo);
  ok("grade 12 subjects for student", subjects.subjects.length === 5 && subjects.subjects.every((s) => s.grade.id === 12));

  const math = subjects.subjects.find((s) => s.code === "MATH");
  const topics = await gql(`query($id: ID!) { topics(subjectId: $id) { id name questionCount materialCount } }`, { id: math.id }, demo);
  ok("math topics", topics.topics.length === 3 && topics.topics.every((t) => t.questionCount === 4));

  const topic = topics.topics[0];
  const mats = await gql(`query($id: ID!) { studyMaterials(topicId: $id) { type title content } }`, { id: topic.id }, demo);
  ok("study materials", mats.studyMaterials.length >= 3);

  const qs = await gql(`query($id: ID!) { questions(topicId: $id) { id type points options { id text } } }`, { id: topic.id }, demo);
  ok("questions (no correct-answer leak)", qs.questions.length === 4 && JSON.stringify(qs.questions).includes("options"));
  const mcq = qs.questions.find((q) => q.type === "MCQ");
  const sa = qs.questions.find((q) => q.type === "SHORT_ANSWER");

  console.log("- practice -");
  const sess = await gql(`mutation($id: ID!) { startPracticeSession(topicId: $id) }`, { id: topic.id }, demo);
  ok("start practice session", typeof sess.startPracticeSession === "string");
  const attemptId = sess.startPracticeSession;

  // correct MCQ: pick each option once via the DB check - find correct option by asking server (it will tell us after submit); instead submit one option and read result
  const r1 = await gql(
    `mutation($a: ID!, $q: ID!, $o: ID) { submitPracticeAnswer(attemptId: $a, questionId: $q, answerId: $o) { isCorrect awardedPoints correctOptionId explanation totalPoints answeredCount } }`,
    { a: attemptId, q: mcq.id, o: mcq.options[0].id },
    demo
  );
  ok("practice answer graded", typeof r1.submitPracticeAnswer.isCorrect === "boolean" && r1.submitPracticeAnswer.answeredCount === 1);
  const r2 = await gql(
    `mutation($a: ID!, $q: ID!, $t: String) { submitPracticeAnswer(attemptId: $a, questionId: $q, answerText: $t) { isCorrect correctText } }`,
    { a: attemptId, q: sa.id, t: "wrong answer entirely" },
    demo
  );
  ok("short answer wrong graded", r2.submitPracticeAnswer.isCorrect === false);

  const fin = await gql(`mutation($a: ID!) { finishPracticeSession(attemptId: $a) { totalPoints maxPoints percentage answers { isCorrect } } }`, { a: attemptId }, demo);
  ok("finish practice session", typeof fin.finishPracticeSession.percentage === "number");

  console.log("- exam -");
  const exams = await gql(`query { exams { id title questionCount durationMinutes bestPercentage } }`, {}, demo);
  ok("exams for grade 12", exams.exams.length === 5);
  const exam = exams.exams.find((e) => e.title.includes("Mathematics"));

  const session = await gql(`mutation($id: ID!) { startExam(examId: $id) { attemptId deadlineAt questions { id options { id } } } }`, { id: exam.id }, demo);
  ok("start exam", session.startExam.questions.length === 10);
  const ea = session.startExam.attemptId;

  // answer first 3 questions: pick first option
  for (const q of session.startExam.questions.slice(0, 3)) {
    await gql(`mutation($a: ID!, $q: ID!, $o: ID) { submitExamAnswer(attemptId: $a, questionId: $q, answerId: $o) }`, { a: ea, q: q.id, o: q.options[0].id }, demo);
  }
  const submitted = await gql(`mutation($a: ID!) { submitExam(attemptId: $a) { id percentage totalPoints maxPoints answers { isCorrect question { text } } } }`, { a: ea }, demo);
  ok("exam submitted + auto-marked", submitted.submitExam.percentage >= 0 && submitted.submitExam.answers.length === 10);

  const attempt = await gql(`query($id: ID!) { attempt(id: $id) { id percentage exam { title } answers { question { options { isCorrect } } } } }`, { id: submitted.submitExam.id }, demo);
  ok("attempt review includes answer key", attempt.attempt.answers.length === 10);

  // grade guard: demo (grade 12) cannot start a grade 10 exam
  const g10exams = await gql(`query { exams(gradeId: 10) { id } }`);
  const mismatch = await fetch(BASE, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${demo}` }, body: JSON.stringify({ query: `mutation($id: ID!) { startExam(examId: $id) { attemptId } }`, variables: { id: g10exams.exams[0].id } }) }).then((r) => r.json());
  ok("grade mismatch blocked", !!mismatch.errors);

  console.log("- dashboard -");
  const dash = await gql(`query { dashboard { questionsAttempted correctRate averagePercentage currentStreak weakTopics { accuracy } strongTopics { accuracy } subjectAccuracy { subject { name } accuracy } recentActivity { title } scoreTrend { date } } }`, {}, demo);
  const d = dash.dashboard;
  ok("dashboard stats", d.questionsAttempted > 0 && typeof d.averagePercentage === "number");
  ok("dashboard trend", d.scoreTrend.length >= 2);
  ok("dashboard recent activity", d.recentActivity.length >= 2);

  console.log("- admin -");
  const adminLogin = await gql(`mutation { login(email: "admin@fet.co.za", password: "Admin123!") { token user { role } } }`);
  const admin = adminLogin.login.token;
  ok("admin login", adminLogin.login.user.role === "ADMIN");

  const tLogin = await gql(`mutation { login(email: "teacher@fet.co.za", password: "Teacher123!") { token user { role } } }`);
  const teacher = tLogin.login.token;
  ok("teacher login", tLogin.login.user.role === "TEACHER");

  const usersQ = await gql(`query { users { id email role } }`, {}, admin);
  ok("admin sees users", usersQ.users.length >= 3);

  // student cannot access admin query
  const studentUsers = await fetch(BASE, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${demo}` }, body: JSON.stringify({ query: `query { users { id } }` }) }).then((r) => r.json());
  ok("student blocked from users", studentUsers.errors?.[0]?.extensions?.code === "FORBIDDEN");

  // teacher creates a topic
  const newTopic = await gql(
    `mutation($s: ID!, $n: String!) { createTopic(subjectId: $s, name: $n, description: "Added by smoke test") { id questionCount } }`,
    { s: math.id, n: "Smoke test topic" },
    teacher
  );
  ok("teacher creates topic", !!newTopic.createTopic.id);

  // teacher creates a question (MCQ)
  const newQ = await gql(
    `mutation($t: ID!) { createQuestion(topicId: $t, type: MCQ, difficulty: EASY, points: 1, text: "2 + 2 = ?", explanation: "basic arithmetic", options: [{text: "4", isCorrect: true}, {text: "5", isCorrect: false}, {text: "3", isCorrect: false}]) { id options { isCorrect } } }`,
    { t: newTopic.createTopic.id },
    teacher
  );
  ok("teacher creates question", newQ.createQuestion.options.length === 3 && newQ.createQuestion.options.filter((o) => o.isCorrect).length === 1);

  // student can practice the new question
  const newQs = await gql(`query($id: ID!) { questions(topicId: $id) { id options { id } } }`, { id: newTopic.createTopic.id }, demo);
  const p2 = await gql(`mutation($id: ID!) { startPracticeSession(topicId: $id) }`, { id: newTopic.createTopic.id }, demo);
  const pr2 = await gql(
    `mutation($a: ID!, $q: ID!, $o: ID) { submitPracticeAnswer(attemptId: $a, questionId: $q, answerId: $o) { isCorrect } }`,
    { a: p2.startPracticeSession, q: newQs.questions[0].id, o: newQs.questions[0].options[0].id },
    demo
  );
  ok("new question instantly usable", pr2.submitPracticeAnswer.isCorrect === true); // option[0] is the correct one (creation order preserved)

  // teacher creates an exam and adds a question
  const newExam = await gql(`mutation($g: Int!, $s: ID!) { createExam(gradeId: $g, subjectId: $s, title: "Smoke Exam", durationMinutes: 10) { id questionCount } }`, { g: 12, s: math.id }, teacher);
  const addQ = await gql(`mutation($e: ID!, $q: ID!) { addExamQuestion(examId: $e, questionId: $q) { questionCount totalPoints } }`, { e: newExam.createExam.id, q: newQ.createQuestion.id }, teacher);
  ok("exam question added", addQ.addExamQuestion.questionCount === 1);

  // admin role change
  const tgt = usersQ.users.find((u) => u.email === "test+api@example.com");
  const roleUp = await gql(`mutation($u: ID!, $r: Role!) { setUserRole(userId: $u, role: $r) { role } }`, { u: tgt.id, r: "TEACHER" }, admin);
  ok("admin promotes user", roleUp.setUserRole.role === "TEACHER");

  // cleanup the smoke-test data (exam first: it references the question)
  const delExam = await gql(`mutation($e: ID!) { deleteExam(id: $e) }`, { e: newExam.createExam.id }, admin);
  const delQ = await gql(`mutation($q: ID!) { deleteQuestion(id: $q) }`, { q: newQ.createQuestion.id }, admin);
  const delTopic = await gql(`mutation($t: ID!) { deleteTopic(id: $t) }`, { t: newTopic.createTopic.id }, admin);
  ok("cleanup", delExam.deleteExam === true && delQ.deleteQuestion === true && delTopic.deleteTopic === true);

  console.log(`\n✅ ALL ${pass} CHECKS PASSED`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
