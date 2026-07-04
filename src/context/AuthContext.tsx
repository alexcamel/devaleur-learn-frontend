import * as React from "react"
import { api, setToken, clearToken } from "@/api/client"
import type { User } from "@/types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const token = localStorage.getItem("learnup_token")
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    setError(null)
    try {
      const res = await api.login({ email, password })
      setToken(res.token)
      setUser(res.user)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de la connexion")
      throw e
    }
  }

  async function register(name: string, email: string, password: string) {
    setError(null)
    try {
      const res = await api.register({ name, email, password })
      setToken(res.token)
      setUser(res.user)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'inscription")
      throw e
    }
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  function updateUser(updated: User) {
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider")
  return ctx
}
