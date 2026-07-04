import * as React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { api } from "@/api/client"
import type { Course, CourseProgress } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react"

export default function LessonView() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = React.useState<Course | null>(null)
  const [progress, setProgress] = React.useState<CourseProgress | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [marking, setMarking] = React.useState(false)

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

  if (loading) {
    return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-muted-foreground">Chargement…</p>
  }

  if (!course) {
    return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-destructive">Cours introuvable.</p>
  }

  const index = course.lessons.findIndex((l) => l.id === lessonId)
  const lesson = course.lessons[index]

  if (!lesson) {
    return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-destructive">Leçon introuvable.</p>
  }

  const prevLesson = course.lessons[index - 1]
  const nextLesson = course.lessons[index + 1]
  const completedIds = new Set(progress?.completedLessonIds ?? [])
  const done = completedIds.has(lesson.id)

  async function markComplete() {
    if (!course) return
    setMarking(true)
    try {
      const res = await api.updateProgress(course.id, lesson.id)
      setProgress(res.progress)
    } finally {
      setMarking(false)
    }
  }

  async function handleNext() {
    if (!done) await markComplete()
    if (nextLesson) {
      navigate(`/cours/${course!.slug}/lecons/${nextLesson.id}`)
    } else {
      navigate(`/cours/${course!.slug}`)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to={`/cours/${course.slug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {course.title}
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="outline">
          Leçon {index + 1} / {course.lessons.length}
        </Badge>
        {done && (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3" /> Terminée
          </Badge>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold text-ink">{lesson.title}</h1>
      <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} min
      </span>

      <div className="spine spine-filled mt-8 rounded-xl border border-line bg-white p-6">
        <p className="pl-4 text-base leading-relaxed text-slate">{lesson.content}</p>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {prevLesson ? (
          <Link to={`/cours/${course.slug}/lecons/${prevLesson.id}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Précédent
            </Button>
          </Link>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {!done && (
            <Button variant="outline" disabled={marking} onClick={markComplete}>
              {marking ? "…" : "Marquer terminé"}
            </Button>
          )}
          <Button onClick={handleNext} disabled={marking}>
            {nextLesson ? "Leçon suivante" : "Terminer le cours"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
