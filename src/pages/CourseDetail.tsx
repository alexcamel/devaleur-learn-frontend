import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "@/api/client"
import type { Course, CourseProgress } from "@/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [course, setCourse] = React.useState<Course | null>(null)
  const [progress, setProgress] = React.useState<CourseProgress | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [marking, setMarking] = React.useState<string | null>(null)

  const load = React.useCallback(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([api.getCourse(slug), api.getProgress()])
      .then(([courseRes, progressRes]) => {
        setCourse(courseRes.course)
        setProgress(
          progressRes.progress.find((p) => p.courseId === courseRes.course.id) || null
        )
      })
      .finally(() => setLoading(false))
  }, [slug])

  React.useEffect(() => {
    load()
  }, [load])

  async function markComplete(lessonId: string) {
    if (!course) return
    setMarking(lessonId)
    try {
      const res = await api.updateProgress(course.id, lessonId)
      setProgress(res.progress)
    } finally {
      setMarking(null)
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-4xl px-6 py-12 text-sm text-muted-foreground">Chargement…</p>
  }

  if (!course) {
    return <p className="mx-auto max-w-4xl px-6 py-12 text-sm text-destructive">Cours introuvable.</p>
  }

  const completedIds = new Set(progress?.completedLessonIds ?? [])
  const pct = Math.round((completedIds.size / course.lessons.length) * 100)
  const allDone = completedIds.size === course.lessons.length

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="outline">{course.category}</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-slate">{course.description}</p>

        <div className="mt-5 flex items-center gap-3">
          <Progress value={pct} className="max-w-xs" />
          <span className="font-mono-data text-xs text-muted-foreground">
            {completedIds.size}/{course.lessons.length} leçons · {pct}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {course.lessons.map((lesson, i) => {
          const done = completedIds.has(lesson.id)
          return (
            <Card key={lesson.id} className="flex items-center justify-between gap-4 p-4">
              <Link
                to={`/cours/${course.slug}/lecons/${lesson.id}`}
                className="flex flex-1 items-center gap-3"
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p className="font-mono-data text-xs text-muted-foreground">
                    Leçon {i + 1}
                  </p>
                  <p className="font-medium text-ink hover:underline">{lesson.title}</p>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} min
                </span>
                <Button
                  size="sm"
                  variant={done ? "outline" : "secondary"}
                  disabled={marking === lesson.id}
                  onClick={() => markComplete(lesson.id)}
                >
                  {done ? "Revoir" : marking === lesson.id ? "…" : "Marquer terminé"}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-line bg-white p-5">
        <div>
          <p className="font-display font-semibold text-ink">Quiz de validation</p>
          <p className="text-sm text-muted-foreground">
            {allDone
              ? "Toutes les leçons sont terminées, testez vos connaissances."
              : "Terminez les leçons pour débloquer le quiz."}
            {progress?.quizScore != null && (
              <span className="ml-2 font-mono-data text-teal">
                Meilleur score : {progress.quizScore}%
              </span>
            )}
          </p>
        </div>
        <Link to={`/cours/${course.slug}/quiz`}>
          <Button disabled={!allDone}>Passer le quiz</Button>
        </Link>
      </div>
    </div>
  )
}
