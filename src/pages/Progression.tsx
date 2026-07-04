import * as React from "react"
import { Link } from "react-router-dom"
import { api } from "@/api/client"
import type { Course, CourseProgress } from "@/types"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function Progression() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [progress, setProgress] = React.useState<CourseProgress[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([api.getCourses(), api.getProgress()]).then(([c, p]) => {
      setCourses(c.courses)
      setProgress(p.progress)
    }).finally(() => setLoading(false))
  }, [])

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0)
  const totalDone = progress.reduce((sum, p) => sum + p.completedLessonIds.length, 0)
  const overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
        Carnet de progression
      </span>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">Votre progression</h1>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <>
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">Avancement global</p>
              <span className="font-mono-data text-sm text-teal">{overallPct}%</span>
            </div>
            <Progress value={overallPct} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {totalDone} / {totalLessons} leçons terminées sur {courses.length} cours
            </p>
          </Card>

          <div className="mt-6 flex flex-col gap-3">
            {courses.map((course) => {
              const p = progress.find((x) => x.courseId === course.id)
              const done = p?.completedLessonIds.length ?? 0
              const total = course.lessons.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0

              return (
                <Link key={course.id} to={`/cours/${course.slug}`}>
                  <Card className="spine spine-filled flex items-center justify-between gap-4 p-4 hover:shadow-md">
                    <div className="pl-2">
                      <p className="font-medium text-ink">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {done}/{total} leçons
                        {p?.quizScore != null && (
                          <span className="ml-2">· Quiz : {p.quizScore}%</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {pct === 100 && <Badge variant="success">Terminé</Badge>}
                      <div className="w-28">
                        <Progress value={pct} />
                      </div>
                      <span className="font-mono-data text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
