# Devaleur Learn — Frontend

Application React de formation en ligne : catalogue de cours, leçons,
authentification, quiz et suivi de progression.

**Stack** : React + Vite + TypeScript + TailwindCSS v4 + shadcn/ui (style,
composants copiés dans `src/components/ui`) + React Router.

## Démarrer

```bash
npm install
cp .env.example .env   # ajustez VITE_API_URL si besoin
npm run dev
```

L'app tourne sur http://localhost:5173 et attend le backend Devaleur Learn
(Next.js) sur http://localhost:3000 par défaut (voir `.env`).

## Structure

```
src/
  api/client.ts             client fetch typé vers l'API Next.js
  context/AuthContext.tsx   état d'authentification (token en localStorage)
  components/ui/            composants shadcn/ui (button, card, input, ...)
  components/layout/        Navbar, RequireAuth
  pages/                    Landing, Login, Register, Dashboard, CourseDetail, Quiz, Progression
  types/                    types partagés (Course, Quiz, CourseProgress, ...)
```

## Identité visuelle

Thème "carnet de progression" : navy encre (#10172A) + accent ambre
(#F5A623) + teal pour la validation. Les cartes de cours utilisent une
"reliure" en pointillés (`.spine` / `.spine-filled`) qui se remplit d'ambre
dès qu'une leçon est commencée — le signe visuel distinctif de l'app.

## Build

```bash
npm run build
```
