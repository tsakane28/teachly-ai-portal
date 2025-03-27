
import { toast } from "sonner";

// Database keys
const USERS_KEY = "teachly_users";
const COURSES_KEY = "teachly_courses";
const QUESTIONS_KEY = "teachly_questions";
const ATTEMPTS_KEY = "teachly_attempts";

// Types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  status?: string;
  courses?: string[];
  progress?: Record<string, any>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  questions?: string[];
  createdAt: number;
}

export interface Question {
  id: string;
  courseId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  createdBy: string;
}

export interface Attempt {
  id: string;
  userId: string;
  courseId: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  timestamp: number;
}

// Course Management
export const getCourses = (userId?: string, role?: string): Course[] => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  
  // If no filters, return all courses
  if (!userId && !role) return courses;
  
  // For admin, return all courses
  if (role === "admin") return courses;
  
  // For teachers, return courses they created
  if (role === "teacher") {
    return courses.filter(course => course.createdBy === userId);
  }
  
  // For students, return all available courses
  return courses;
};

export const getCourseById = (courseId: string): Course | null => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  return courses.find(course => course.id === courseId) || null;
};

export const createCourse = (courseData: Omit<Course, "id" | "createdAt">): Course => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  
  const newCourse: Course = {
    ...courseData,
    id: `course-${Date.now()}`,
    questions: [],
    createdAt: Date.now()
  };
  
  courses.push(newCourse);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  toast.success("Course created successfully");
  
  return newCourse;
};

export const updateCourse = (courseId: string, courseData: Partial<Course>): Course => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  
  const updatedCourses = courses.map(course => {
    if (course.id === courseId) {
      return { ...course, ...courseData };
    }
    return course;
  });
  
  localStorage.setItem(COURSES_KEY, JSON.stringify(updatedCourses));
  toast.success("Course updated successfully");
  
  return updatedCourses.find(course => course.id === courseId) as Course;
};

export const deleteCourse = (courseId: string): void => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  
  // Remove course
  const updatedCourses = courses.filter(course => course.id !== courseId);
  localStorage.setItem(COURSES_KEY, JSON.stringify(updatedCourses));
  
  // Remove all questions for this course
  const updatedQuestions = questions.filter(question => question.courseId !== courseId);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updatedQuestions));
  
  // Remove all attempts for this course
  const updatedAttempts = attempts.filter(attempt => attempt.courseId !== courseId);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updatedAttempts));
  
  toast.success("Course deleted successfully");
};

// Question Management
export const getQuestions = (courseId?: string): Question[] => {
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  
  if (courseId) {
    return questions.filter(question => question.courseId === courseId);
  }
  
  return questions;
};

export const getQuestionById = (questionId: string): Question | null => {
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  return questions.find(question => question.id === questionId) || null;
};

export const createQuestion = (questionData: Omit<Question, "id">): Question => {
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  
  const newQuestion: Question = {
    ...questionData,
    id: `question-${Date.now()}`
  };
  
  // Add question
  questions.push(newQuestion);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  
  // Update course to include this question
  const updatedCourses = courses.map(course => {
    if (course.id === questionData.courseId) {
      const updatedQuestions = [...(course.questions || []), newQuestion.id];
      return { ...course, questions: updatedQuestions };
    }
    return course;
  });
  
  localStorage.setItem(COURSES_KEY, JSON.stringify(updatedCourses));
  toast.success("Question added successfully");
  
  return newQuestion;
};

export const updateQuestion = (questionId: string, questionData: Partial<Question>): Question => {
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  
  const updatedQuestions = questions.map(question => {
    if (question.id === questionId) {
      return { ...question, ...questionData };
    }
    return question;
  });
  
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updatedQuestions));
  toast.success("Question updated successfully");
  
  return updatedQuestions.find(question => question.id === questionId) as Question;
};

export const deleteQuestion = (questionId: string): void => {
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  
  // Get the question to find its courseId
  const question = questions.find(q => q.id === questionId);
  if (!question) return;
  
  // Remove question
  const updatedQuestions = questions.filter(q => q.id !== questionId);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updatedQuestions));
  
  // Update course to remove this question
  const updatedCourses = courses.map(course => {
    if (course.id === question.courseId) {
      const updatedQuestions = (course.questions || []).filter(id => id !== questionId);
      return { ...course, questions: updatedQuestions };
    }
    return course;
  });
  
  localStorage.setItem(COURSES_KEY, JSON.stringify(updatedCourses));
  
  // Remove all attempts for this question
  const updatedAttempts = attempts.filter(attempt => attempt.questionId !== questionId);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updatedAttempts));
  
  toast.success("Question deleted successfully");
};

// Exam/Quiz Attempts
export const submitAttempt = (attemptData: Omit<Attempt, "id" | "timestamp" | "isCorrect">): Attempt => {
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  const questions: Question[] = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  
  // Find the question to check correct answer
  const question = questions.find(q => q.id === attemptData.questionId);
  
  if (!question) {
    throw new Error("Question not found");
  }
  
  const isCorrect = question.correctAnswer === attemptData.answer;
  
  const newAttempt: Attempt = {
    ...attemptData,
    id: `attempt-${Date.now()}`,
    timestamp: Date.now(),
    isCorrect
  };
  
  // Add attempt
  attempts.push(newAttempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  
  return newAttempt;
};

export const getUserAttempts = (userId: string, courseId?: string): Attempt[] => {
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  
  const userAttempts = attempts.filter(attempt => attempt.userId === userId);
  
  if (courseId) {
    return userAttempts.filter(attempt => attempt.courseId === courseId);
  }
  
  return userAttempts;
};

export const getCourseStats = (courseId: string): {
  totalAttempts: number;
  correctAttempts: number;
  totalStudents: number;
  avgScore: number;
} => {
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  
  const courseAttempts = attempts.filter(attempt => attempt.courseId === courseId);
  const totalAttempts = courseAttempts.length;
  const correctAttempts = courseAttempts.filter(attempt => attempt.isCorrect).length;
  
  // Get unique students who attempted this course
  const uniqueStudents = new Set(courseAttempts.map(attempt => attempt.userId)).size;
  
  const avgScore = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  
  return {
    totalAttempts,
    correctAttempts,
    totalStudents: uniqueStudents,
    avgScore
  };
};

// AI Integration for Analytics
export const getStudentWeakAreas = (userId: string): { courseId: string, courseName: string, performance: number }[] => {
  const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  
  const userAttempts = attempts.filter(attempt => attempt.userId === userId);
  
  // Group attempts by course
  const coursePerformance: Record<string, { correct: number, total: number }> = {};
  
  userAttempts.forEach(attempt => {
    if (!coursePerformance[attempt.courseId]) {
      coursePerformance[attempt.courseId] = { correct: 0, total: 0 };
    }
    
    coursePerformance[attempt.courseId].total += 1;
    if (attempt.isCorrect) {
      coursePerformance[attempt.courseId].correct += 1;
    }
  });
  
  // Calculate performance for each course
  const weakAreas = Object.entries(coursePerformance)
    .map(([courseId, stats]) => {
      const course = courses.find(c => c.id === courseId);
      const performance = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      
      return {
        courseId,
        courseName: course ? course.title : "Unknown Course",
        performance
      };
    })
    .filter(area => area.performance < 70) // Consider courses with less than 70% performance as weak areas
    .sort((a, b) => a.performance - b.performance);
  
  return weakAreas;
};

export const getTeacherInsights = (teacherId: string): {
  lowPerformanceCourses: { courseId: string, title: string, avgScore: number }[],
  recommendations: string[]
} => {
  const courses: Course[] = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
  const teacherCourses = courses.filter(course => course.createdBy === teacherId);
  
  const courseStats = teacherCourses.map(course => {
    const stats = getCourseStats(course.id);
    return {
      courseId: course.id,
      title: course.title,
      avgScore: stats.avgScore
    };
  });
  
  // Identify courses with low performance
  const lowPerformanceCourses = courseStats
    .filter(course => course.avgScore < 70)
    .sort((a, b) => a.avgScore - b.avgScore);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (lowPerformanceCourses.length > 0) {
    recommendations.push(`Consider revising material for ${lowPerformanceCourses[0].title} as students are struggling with it.`);
    recommendations.push("Add more practice questions to help reinforce learning.");
    recommendations.push("Consider breaking complex topics into smaller, more manageable segments.");
  } else if (courseStats.length > 0) {
    recommendations.push("Your courses are performing well! Consider adding more advanced content.");
    recommendations.push("Share your teaching strategies with other instructors.");
  } else {
    recommendations.push("Create your first course to start gathering student performance data.");
  }
  
  return {
    lowPerformanceCourses,
    recommendations
  };
};

// Analytics for students
export const getStudentRecommendations = (userId: string): string[] => {
  const weakAreas = getStudentWeakAreas(userId);
  const recommendations: string[] = [];
  
  if (weakAreas.length > 0) {
    recommendations.push(`Focus on improving in ${weakAreas[0].courseName} where your performance is lowest.`);
    recommendations.push("Try to take quizzes multiple times to reinforce learning.");
    recommendations.push("Consider asking your teacher for additional resources.");
  } else {
    const attempts: Attempt[] = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
    const userAttempts = attempts.filter(attempt => attempt.userId === userId);
    
    if (userAttempts.length > 0) {
      recommendations.push("Great job! You're performing well across all your courses.");
      recommendations.push("Consider taking on more challenging courses to continue growing.");
    } else {
      recommendations.push("Take your first quiz to start getting personalized recommendations.");
    }
  }
  
  return recommendations;
};
