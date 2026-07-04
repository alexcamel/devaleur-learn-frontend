import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/api/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [name, setName] = React.useState(user?.name ?? "")
  const [nameSaving, setNameSaving] = React.useState(false)
  const [nameSuccess, setNameSuccess] = React.useState(false)
  const [nameError, setNameError] = React.useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [passwordSaving, setPasswordSaving] = React.useState(false)
  const [passwordSuccess, setPasswordSuccess] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNameError(null)
    setNameSuccess(false)
    setNameSaving(true)
    try {
      const res = await api.updateProfile({ name })
      updateUser(res.user)
      setNameSuccess(true)
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Échec de la mise à jour")
    } finally {
      setNameSaving(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    setPasswordSaving(true)
    try {
      await api.changePassword({ currentPassword, newPassword })
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Échec de la mise à jour")
    } finally {
      setPasswordSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
        Compte
      </span>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">Mon profil</h1>

      <div className="mt-8 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {nameError && <p className="text-sm text-destructive">{nameError}</p>}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={nameSaving || name === user.name}>
                  {nameSaving ? "Enregistrement…" : "Enregistrer"}
                </Button>
                {nameSuccess && (
                  <span className="flex items-center gap-1 text-sm text-teal">
                    <CheckCircle2 className="h-4 w-4" /> Enregistré
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mot de passe</CardTitle>
            <CardDescription>Changez votre mot de passe régulièrement.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              <div className="flex items-center gap-3">
                <Button type="submit" variant="secondary" disabled={passwordSaving}>
                  {passwordSaving ? "Enregistrement…" : "Changer le mot de passe"}
                </Button>
                {passwordSuccess && (
                  <span className="flex items-center gap-1 text-sm text-teal">
                    <CheckCircle2 className="h-4 w-4" /> Mis à jour
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
