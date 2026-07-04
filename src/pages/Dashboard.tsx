import * as React from "react"
import { Link } from "react-router-dom"
import { api } from "@/api/client"
import type { Course, CourseProgress } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Dashboard() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [progress, setProgress] = React.useState<CourseProgress[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [levelFilter, setLevelFilter] = React.useState<string>("Tous")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("Toutes")

  React.useEffect(() => {
    Promise.all([api.getCourses(), api.getProgress()])
      .then(([coursesRes, progressRes]) => {
        setCourses(coursesRes.courses)
        setProgress(progressRes.progress)
      })
      .finally(() => setLoading(false))
  }, [])

  function progressFor(courseId: string) {
    return progress.find((p) => p.courseId === courseId)
  }

  const levels = ["Tous", ...Array.from(new Set(courses.map((c) => c.level)))]
  const categories = ["Toutes", ...Array.from(new Set(courses.map((c) => c.category)))]

  const filteredCourses = courses.filter((course) => {
    const matchesQuery =
      query.trim() === "" ||
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    const matchesLevel = levelFilter === "Tous" || course.level === levelFilter
    const matchesCategory = categoryFilter === "Toutes" || course.category === categoryFilter
    return matchesQuery && matchesLevel && matchesCategory
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 animate-fade-up">
        <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
          Catalogue
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Mes cours</h1>
        <p className="mt-1 text-slate">Reprenez où vous vous êtes arrêté.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un cours…"
            className="pl-9"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement des cours…</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun cours ne correspond à votre recherche.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const p = progressFor(course.id)
            const total = course.lessons.length
            const done = p?.completedLessonIds.length ?? 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            const started = done > 0

            return (
              <Link key={course.id} to={`/cours/${course.slug}`}>
                <Card
                  className={`spine h-full hover:-translate-y-1 hover:border-ink/15 hover:shadow-lg ${
                    started ? "spine-filled" : ""
                  }`}
                >
                  <CardHeader className="pl-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{course.level}</Badge>
                      <span className="font-mono-data text-xs text-muted-foreground">
                        {course.durationHours}h
                      </span>
                    </div>
                    <CardTitle className="mt-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-6">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{done}/{total} leçons</span>
                      <span className="font-mono-data">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
