import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ListChecks,
  LineChart,
} from "lucide-react"

const steps = [
  {
    n: "01",
    title: "Créez votre compte",
    body: "Inscription en moins d'une minute, aucune carte bancaire requise.",
  },
  {
    n: "02",
    title: "Suivez les leçons",
    body: "Progressez cours par cours, à votre rythme, et cochez chaque étape franchie.",
  },
  {
    n: "03",
    title: "Validez avec un quiz",
    body: "Confirmez vos acquis et débloquez un score consultable dans votre carnet.",
  },
]

const features = [
  {
    icon: KeyRound,
    title: "Authentification sécurisée",
    body: "Comptes protégés par mot de passe hashé et sessions signées, pour reprendre vos cours en confiance sur n'importe quel appareil.",
  },
  {
    icon: ListChecks,
    title: "Quiz de validation",
    body: "Chaque cours se termine par un quiz noté qui confirme ce que vous avez réellement retenu, pas seulement ce que vous avez lu.",
  },
  {
    icon: LineChart,
    title: "Suivi de progression",
    body: "Un carnet visuel qui garde la trace de chaque leçon terminée et de chaque score, cours après cours.",
  },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero — la seule surface sombre de la page, réservée au propos principal */}
      <section className="ink-panel relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-amber">
              FR · Formation en ligne
            </span>
            <h1 className="text-balance mt-4 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">
              Chaque leçon terminée
              <br /> laisse une trace.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              Devaleur Learn suit votre progression leçon par leçon, comme un carnet
              d'apprentissage. Suivez des cours structurés, validez vos acquis
              avec des quiz, et voyez votre parcours prendre forme.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={user ? "/dashboard" : "/inscription"}>
                <Button size="lg" variant="secondary">
                  {user ? "Accéder à mes cours" : "Commencer gratuitement"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/connexion">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  Se connecter
                </Button>
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <dt className="font-mono-data text-2xl font-semibold text-amber">4</dt>
                <dd className="mt-1 text-xs text-white/50">cours structurés</dd>
              </div>
              <div>
                <dt className="font-mono-data text-2xl font-semibold text-amber">14</dt>
                <dd className="mt-1 text-xs text-white/50">leçons au total</dd>
              </div>
              <div>
                <dt className="font-mono-data text-2xl font-semibold text-amber">100%</dt>
                <dd className="mt-1 text-xs text-white/50">suivi personnel</dd>
              </div>
            </dl>
          </div>

          {/* Mockup du carnet de progression — l'élément signature de Devaleur Learn */}
          <div className="animate-fade-up-delay-2 relative">
            <div className="spine spine-filled rounded-2xl border border-white/10 bg-white p-6 text-ink shadow-2xl shadow-black/40">
              <div className="pl-4">
                <p className="font-mono-data text-xs text-muted-foreground">
                  COURS · API-NEXTJS
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                  Construire une API avec Next.js
                </h3>
                <div className="mt-4 flex flex-col gap-2">
                  {[
                    { label: "Route handlers et méthodes HTTP", done: true },
                    { label: "Authentification par JWT", done: true },
                    { label: "Validation des données avec Zod", done: false },
                    { label: "CORS et frontend séparé", done: false },
                  ].map((step) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5"
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-line" />
                      )}
                      <span className={`text-sm ${step.done ? "text-ink" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">2/4 leçons</span>
                  <span className="font-mono-data font-semibold text-teal">50%</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-xl border border-line bg-amber px-4 py-3 shadow-lg sm:block">
              <p className="font-mono-data text-xs font-semibold text-ink">Quiz validé · 92%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche — vraie séquence, la numérotation encode l'ordre réel du parcours */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-lg">
          <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
            Le parcours
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            Comment ça marche
          </h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative pl-1">
              <span className="font-mono-data text-4xl font-bold text-line">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
              {i < steps.length - 1 && (
                <span className="absolute right-[-1rem] top-3 hidden text-line sm:block">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-lg">
            <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
              Fonctionnalités
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">
              Tout ce qu'il faut pour progresser
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-xl border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:border-ink/15 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-soft text-teal transition-colors group-hover:bg-amber-soft group-hover:text-amber-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">
          Prêt à ouvrir votre carnet ?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate">
          Rejoignez Devaleur Learn et commencez votre premier cours en quelques secondes.
        </p>
        <div className="mt-7">
          <Link to={user ? "/dashboard" : "/inscription"}>
            <Button size="lg" variant="secondary">
              {user ? "Accéder à mes cours" : "Créer mon compte gratuitement"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
