import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-display text-base font-bold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          Devaleur Learn
        </div>
        <p className="text-sm text-muted-foreground">
          Construit avec React, TypeScript et Next.js.
        </p>
        <nav className="flex gap-5 text-sm text-slate">
          <Link to="/" className="hover:text-ink">Accueil</Link>
          <Link to="/connexion" className="hover:text-ink">Connexion</Link>
          <Link to="/inscription" className="hover:text-ink">Inscription</Link>
        </nav>
      </div>
    </footer>
  )
}
