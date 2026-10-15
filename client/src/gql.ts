import { gql } from "@apollo/client";

export const GQL_ME = gql`
  query Me {
    me {
      id
      name
      email
      avatarUrl
      role
      createdAt
      profile {
        id
        grade
        school
      }
    }
  }
`;

export const GQL_GRADES = gql`
  query Grades {
    grades {
      id
      name
    }
  }
`;

export const GQL_SUBJECTS = gql`
  query Subjects($gradeId: Int) {
    subjects(gradeId: $gradeId) {
      id
      code
      name
      color
      topicCount
      examCount
      grade {
        id
        name
      }
    }
  }
`;

export const GQL_TOPICS = gql`
  query Topics($subjectId: ID!) {
    topics(subjectId: $subjectId) {
      id
      name
      description
      order
      materialCount
      questionCount
      subject {
        id
        name
        color
        grade {
          id
          name
        }
      }
    }
  }
`;

export const GQL_TOPIC = gql`
  query Topic($id: ID!) {
    topic(id: $id) {
      id
      name
      description
      questionCount
      materialCount
      subject {
        id
        name
        color
      }
    }
  }
`;

export const GQL_MATERIALS = gql`
  query Materials($topicId: ID!) {
    studyMaterials(topicId: $topicId) {
      id
      type
      title
      content
    }
  }
`;

export const GQL_QUESTIONS = gql`
  query Questions($topicId: ID!) {
    questions(topicId: $topicId) {
      id
      type
      difficulty
      points
      text
      options {
        id
        text
      }
    }
  }
`;

export const GQL_EXAMS = gql`
  query Exams($gradeId: Int) {
    exams(gradeId: $gradeId) {
      id
      title
      description
      durationMinutes
      questionCount
      totalPoints
      bestPercentage
      subject {
        id
        name
        color
        grade {
          id
          name
        }
      }
    }
  }
`;

export const GQL_ATTEMPT = gql`
  query Attempt($id: ID!) {
    attempt(id: $id) {
      id
      mode
      status
      startedAt
      submittedAt
      totalPoints
      maxPoints
      percentage
      durationSeconds
      topic {
        id
        name
        subject {
          id
          name
          color
        }
      }
      exam {
        id
        title
        subject {
          id
          name
          color
        }
      }
      answers {
        isCorrect
        awardedPoints
        selectedOptionId
        selectedOptionText
        correctText
        question {
          id
          type
          difficulty
          points
          text
          explanation
          correctText
          options {
            id
            text
            isCorrect
          }
        }
      }
    }
  }
`;

export const GQL_DASHBOARD = gql`
  query Dashboard {
    dashboard {
      questionsAttempted
      correctRate
      averagePercentage
      examCount
      studyMinutes
      currentStreak
      weakTopics {
        accuracy
        attempts
        topic {
          id
          name
          subject {
            id
            name
            color
          }
        }
      }
      strongTopics {
        accuracy
        attempts
        topic {
          id
          name
        }
      }
      subjectAccuracy {
        accuracy
        attempts
        subject {
          id
          name
          color
        }
      }
      recentActivity {
        id
        mode
        title
        subjectName
        grade
        percentage
        totalPoints
        maxPoints
        submittedAt
      }
      examResults {
        id
        mode
        title
        subjectName
        grade
        percentage
        totalPoints
        maxPoints
        submittedAt
      }
      scoreTrend {
        date
        percentage
      }
    }
  }
`;

export const GQL_USERS = gql`
  query Users {
    users {
      id
      name
      email
      avatarUrl
      role
      profile {
        grade
        school
      }
    }
  }
`;

export const GQL_ADMIN_QUESTIONS = gql`
  query AdminQuestions($topicId: ID!) {
    adminQuestions(topicId: $topicId) {
      id
      topicId
      topicName
      type
      difficulty
      points
      text
      explanation
      options {
        id
        text
        isCorrect
        keywords
        alternatives
      }
    }
  }
`;

export const GQL_ADMIN_QUESTION = gql`
  query AdminQuestion($id: ID!) {
    adminQuestion(id: $id) {
      id
      topicId
      topicName
      type
      difficulty
      points
      text
      explanation
      options {
        id
        text
        isCorrect
        keywords
        alternatives
      }
    }
  }
`;

export const GQL_EXAM_QUESTIONS = gql`
  query ExamQuestions($examId: ID!) {
    examQuestions(examId: $examId) {
      id
      type
      difficulty
      points
      text
    }
  }
`;

// ---------------- mutations ----------------

export const M_REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        avatarUrl
        role
        profile {
          grade
          school
        }
      }
    }
  }
`;

export const M_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        avatarUrl
        role
        profile {
          grade
          school
        }
      }
    }
  }
`;

export const M_GOOGLE = gql`
  mutation LoginWithGoogle($credential: String!, $name: String, $picture: String) {
    loginWithGoogle(credential: $credential, name: $name, picture: $picture) {
      token
      user {
        id
        name
        email
        avatarUrl
        role
        profile {
          grade
          school
        }
      }
    }
  }
`;

export const M_UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String, $grade: Int, $school: String) {
    updateProfile(name: $name, grade: $grade, school: $school) {
      id
      name
      email
      role
      profile {
        grade
        school
      }
    }
  }
`;

export const M_START_PRACTICE = gql`
  mutation StartPractice($topicId: ID!, $questionIds: [ID!]) {
    startPracticeSession(topicId: $topicId, questionIds: $questionIds)
  }
`;

export const M_SUBMIT_PRACTICE = gql`
  mutation SubmitPractice($attemptId: ID!, $questionId: ID!, $answerId: ID, $answerText: String) {
    submitPracticeAnswer(attemptId: $attemptId, questionId: $questionId, answerId: $answerId, answerText: $answerText) {
      isCorrect
      awardedPoints
      correctOptionId
      correctOptionText
      correctText
      explanation
      totalPoints
      maxPoints
      answeredCount
    }
  }
`;

export const M_FINISH_PRACTICE = gql`
  mutation FinishPractice($attemptId: ID!) {
    finishPracticeSession(attemptId: $attemptId) {
      id
      totalPoints
      maxPoints
      percentage
    }
  }
`;

export const M_START_EXAM = gql`
  mutation StartExam($examId: ID!) {
    startExam(examId: $examId) {
      attemptId
      examId
      title
      subjectName
      durationMinutes
      deadlineAt
      questions {
        id
        type
        difficulty
        points
        text
        options {
          id
          text
        }
      }
    }
  }
`;

export const M_SUBMIT_EXAM_ANSWER = gql`
  mutation SubmitExamAnswer($attemptId: ID!, $questionId: ID!, $answerId: ID, $answerText: String) {
    submitExamAnswer(attemptId: $attemptId, questionId: $questionId, answerId: $answerId, answerText: $answerText)
  }
`;

export const M_SUBMIT_EXAM = gql`
  mutation SubmitExam($attemptId: ID!) {
    submitExam(attemptId: $attemptId) {
      id
    }
  }
`;

export const M_SET_ROLE = gql`
  mutation SetRole($userId: ID!, $role: Role!) {
    setUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const M_CREATE_SUBJECT = gql`
  mutation CreateSubject($gradeId: Int!, $code: String!, $name: String!, $color: String) {
    createSubject(gradeId: $gradeId, code: $code, name: $name, color: $color) {
      id
    }
  }
`;
export const M_UPDATE_SUBJECT = gql`
  mutation UpdateSubject($id: ID!, $code: String, $name: String, $color: String) {
    updateSubject(id: $id, code: $code, name: $name, color: $color) {
      id
    }
  }
`;
export const M_DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

export const M_CREATE_TOPIC = gql`
  mutation CreateTopic($subjectId: ID!, $name: String!, $description: String) {
    createTopic(subjectId: $subjectId, name: $name, description: $description) {
      id
    }
  }
`;
export const M_DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id)
  }
`;

export const M_CREATE_MATERIAL = gql`
  mutation CreateMaterial($topicId: ID!, $type: MaterialType!, $title: String!, $content: String!) {
    createStudyMaterial(topicId: $topicId, type: $type, title: $title, content: $content) {
      id
    }
  }
`;
export const M_DELETE_MATERIAL = gql`
  mutation DeleteMaterial($id: ID!) {
    deleteStudyMaterial(id: $id)
  }
`;

export const M_CREATE_QUESTION = gql`
  mutation CreateQuestion($topicId: ID!, $type: QuestionType!, $difficulty: Difficulty, $points: Int, $text: String!, $explanation: String, $options: [OptionInput!]!) {
    createQuestion(topicId: $topicId, type: $type, difficulty: $difficulty, points: $points, text: $text, explanation: $explanation, options: $options) {
      id
    }
  }
`;
export const M_UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $text: String, $explanation: String, $points: Int, $options: [OptionInput!]) {
    updateQuestion(id: $id, text: $text, explanation: $explanation, points: $points, options: $options) {
      id
    }
  }
`;
export const M_DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

export const M_CREATE_EXAM = gql`
  mutation CreateExam($gradeId: Int!, $subjectId: ID!, $title: String!, $description: String, $durationMinutes: Int) {
    createExam(gradeId: $gradeId, subjectId: $subjectId, title: $title, description: $description, durationMinutes: $durationMinutes) {
      id
    }
  }
`;
export const M_DELETE_EXAM = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(id: $id)
  }
`;
export const M_ADD_EXAM_QUESTION = gql`
  mutation AddExamQuestion($examId: ID!, $questionId: ID!) {
    addExamQuestion(examId: $examId, questionId: $questionId) {
      id
      questionCount
      totalPoints
    }
  }
`;
export const M_REMOVE_EXAM_QUESTION = gql`
  mutation RemoveExamQuestion($examId: ID!, $questionId: ID!) {
    removeExamQuestion(examId: $examId, questionId: $questionId) {
      id
      questionCount
      totalPoints
    }
  }
`;
