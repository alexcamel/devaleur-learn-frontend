const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

function getToken() {
  return localStorage.getItem("learnup_token")
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(body.message || "Une erreur est survenue")
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data) }
    ),

  me: () => request<{ user: { id: string; name: string; email: string } }>("/auth/me"),

  updateProfile: (data: { name: string }) =>
    request<{ user: { id: string; name: string; email: string } }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getCourses: () => request<{ courses: import("@/types").Course[] }>("/courses"),

  getCourse: (idOrSlug: string) =>
    request<{ course: import("@/types").Course }>(`/courses/${idOrSlug}`),

  getQuiz: (courseId: string) =>
    request<{ quiz: import("@/types").Quiz }>(`/courses/${courseId}/quiz`),

  submitQuiz: (courseId: string, answers: Record<string, number>) =>
    request<{ score: number; total: number }>(`/courses/${courseId}/quiz/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getProgress: () =>
    request<{ progress: import("@/types").CourseProgress[] }>("/progress"),

  updateProgress: (courseId: string, lessonId: string) =>
    request<{ progress: import("@/types").CourseProgress }>("/progress", {
      method: "POST",
      body: JSON.stringify({ courseId, lessonId }),
    }),
}

export function setToken(token: string) {
  localStorage.setItem("learnup_token", token)
}

export function clearToken() {
  localStorage.removeItem("learnup_token")
}
