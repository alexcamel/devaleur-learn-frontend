import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          Devaleur Learn
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate hover:text-ink">
                Mes cours
              </Link>
              <Link to="/progression" className="text-sm font-medium text-slate hover:text-ink">
                Progression
              </Link>
              <span className="hidden font-mono-data text-xs text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Link to="/profil" className="text-sm font-medium text-slate hover:text-ink">
                Profil
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout()
                  navigate("/connexion")
                }}
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/connexion">
                <Button variant="ghost" size="sm">Se connecter</Button>
              </Link>
              <Link to="/inscription">
                <Button variant="secondary" size="sm">Commencer</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
