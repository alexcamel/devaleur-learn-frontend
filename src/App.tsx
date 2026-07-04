import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { RequireAuth } from "@/components/layout/RequireAuth"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import CourseDetail from "@/pages/CourseDetail"
import LessonView from "@/pages/LessonView"
import Quiz from "@/pages/Quiz"
import Progression from "@/pages/Progression"
import Profile from "@/pages/Profile"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-paper">
          <Navbar />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/cours/:slug"
              element={
                <RequireAuth>
                  <CourseDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/cours/:slug/lecons/:lessonId"
              element={
                <RequireAuth>
                  <LessonView />
                </RequireAuth>
              }
            />
            <Route
              path="/cours/:slug/quiz"
              element={
                <RequireAuth>
                  <Quiz />
                </RequireAuth>
              }
            />
            <Route
              path="/progression"
              element={
                <RequireAuth>
                  <Progression />
                </RequireAuth>
              }
            />
            <Route
              path="/profil"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
