export interface User {
  id: string
  name: string
  email: string
}

export interface Lesson {
  id: string
  title: string
  durationMinutes: number
  content: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex?: number // never sent to client before submission
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  questions: QuizQuestion[]
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  level: "Débutant" | "Intermédiaire" | "Avancé"
  category: string
  durationHours: number
  lessons: Lesson[]
}

export interface CourseProgress {
  courseId: string
  completedLessonIds: string[]
  quizScore: number | null
  updatedAt: string
}
