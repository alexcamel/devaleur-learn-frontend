import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Chargement…
      </div>
    )
  }

  if (!user) return <Navigate to="/connexion" replace />

  return <>{children}</>
}
