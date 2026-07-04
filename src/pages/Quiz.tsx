import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "@/api/client"
import type { Course, Quiz as QuizType } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Quiz() {
  const { slug } = useParams<{ slug: string }>()
  const [course, setCourse] = React.useState<Course | null>(null)
  const [quiz, setQuiz] = React.useState<QuizType | null>(null)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [result, setResult] = React.useState<{ score: number; total: number } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!slug) return
    api.getCourse(slug).then(({ course }) => {
      setCourse(course)
      api.getQuiz(course.id).then(({ quiz }) => setQuiz(quiz))
    }).finally(() => setLoading(false))
  }, [slug])

  async function handleSubmit() {
    if (!course) return
    setSubmitting(true)
    try {
      const res = await api.submitQuiz(course.id, answers)
      setResult(res)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-muted-foreground">Chargement du quiz…</p>
  if (!quiz || !course) return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-destructive">Quiz introuvable.</p>

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined)

  if (result) {
    const passed = result.score / result.total >= 0.6
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono-data text-xs uppercase tracking-widest text-teal">Résultat</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">
          {Math.round((result.score / result.total) * 100)}%
        </h1>
        <p className="mt-2 text-slate">
          {result.score} / {result.total} bonnes réponses —{" "}
          {passed ? "Bravo, quiz validé !" : "Continuez à réviser, vous y êtes presque."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={`/cours/${course.slug}`}>
            <Button variant="outline">Retour au cours</Button>
          </Link>
          <Link to="/progression">
            <Button variant="secondary">Voir ma progression</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-mono-data text-xs uppercase tracking-widest text-teal">
        Quiz · {course.title}
      </p>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink">{quiz.title}</h1>

      <div className="mt-8 flex flex-col gap-6">
        {quiz.questions.map((q, i) => (
          <Card key={q.id} className="p-5">
            <p className="font-medium text-ink">
              {i + 1}. {q.question}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-line px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                    answers[q.id] === idx && "border-ink bg-ink text-white hover:bg-ink"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono-data text-[10px]",
                      answers[q.id] === idx ? "border-white" : "border-line"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button disabled={!allAnswered || submitting} onClick={handleSubmit}>
          {submitting ? "Envoi…" : "Valider mes réponses"}
        </Button>
      </div>
    </div>
  )
}
