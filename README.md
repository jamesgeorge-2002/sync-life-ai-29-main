# ✨ LIFE-SYNC AI

> **The intelligent workspace for your entire life.**  
> One AI-powered platform replacing six productivity apps — tasks, calendar, notes, finance, health, and goals — all in sync.

---

## 🚀 Overview

**LIFE-SYNC AI** is a full-stack, AI-driven personal productivity platform built with **TanStack Start**, **React 19**, **Firebase**, and **Google Gemini**. It consolidates every dimension of your life into a single, beautiful workspace, using retrieval-augmented generation (RAG) to surface insights from your own documents, meetings, and notes.

---

## 🧩 Features

| Module | Description |
|---|---|
| 🤖 **AI Assistant** | ChatGPT-style copilot — plans your week, drafts emails, and answers questions from your documents |
| 📅 **Smart Calendar** | Auto time-blocking and conflict-aware scheduling |
| ✅ **Adaptive Tasks** | Kanban, subtasks, and AI prioritization |
| 📝 **Notes + RAG** | Rich notes with semantic search across all your docs and meetings |
| 💰 **Finance Copilot** | Expense tracking, cashflow prediction, and AI budget suggestions |
| ❤️ **Health & Mood** | Sleep, workouts, meals, and mood tracking with wellness insights |
| 🎯 **Goals & Habits** | Break goals into daily habits with streaks and an AI coach |
| 🛒 **Shopping Lists** | Smart shopping management |
| ✈️ **Travel Planner** | Trip planning integrated with your calendar |
| 📚 **Study Hub** | Flashcards from your papers, study tracking |
| 📊 **Analytics & Reports** | Productivity trends and insights |
| 🔒 **Private by Design** | Data encrypted end-to-end; never used for model training |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI) |
| **Routing** | TanStack Router (file-based) |
| **Data Fetching** | TanStack Query |
| **Backend / DB** | [Firebase](https://firebase.google.com/) (Firestore + Auth + Storage) |
| **AI / LLM** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`) |
| **RAG** | Custom RAG pipeline (`src/lib/rag.ts`) over Firestore documents |
| **Charts** | [Recharts](https://recharts.org/) |
| **Forms** | React Hook Form + Zod |
| **Build Tool** | [Vite](https://vite.dev/) |
| **Deployment** | Cloudflare Workers (via Nitro / Wrangler) |
| **Payments** | Razorpay (premium subscriptions) |

---

## 📁 Project Structure

```
sync-life-ai-29-main/
├── src/
│   ├── components/        # Reusable UI components (shadcn/ui + custom)
│   ├── hooks/             # Custom React hooks (useAuth, etc.)
│   ├── lib/
│   │   ├── db.ts          # Firestore CRUD helpers & data types
│   │   ├── firebase.ts    # Firebase initialization
│   │   ├── gemini.ts      # Gemini API helpers (briefings, chat, etc.)
│   │   ├── rag.ts         # Retrieval-augmented generation pipeline
│   │   ├── premium.ts     # Premium subscription logic
│   │   └── razorpay.ts    # Razorpay payment integration
│   └── routes/
│       ├── index.tsx          # Public landing page
│       ├── auth.*.tsx         # Auth flows (login, register, 2FA, OTP, etc.)
│       └── app.*.tsx          # Protected app modules:
│           ├── app.index.tsx      # Dashboard
│           ├── app.assistant.tsx  # AI Assistant
│           ├── app.calendar.tsx   # Calendar
│           ├── app.tasks.tsx      # Tasks
│           ├── app.notes.tsx      # Notes
│           ├── app.goals.tsx      # Goals
│           ├── app.habits.tsx     # Habits
│           ├── app.health.tsx     # Health & Mood
│           ├── app.expenses.tsx   # Finance / Expenses
│           ├── app.documents.tsx  # Document store
│           ├── app.knowledge.tsx  # Knowledge base
│           ├── app.analytics.tsx  # Analytics
│           ├── app.reports.tsx    # Reports
│           ├── app.shopping.tsx   # Shopping lists
│           ├── app.study.tsx      # Study hub
│           ├── app.travel.tsx     # Travel planner
│           ├── app.contacts.tsx   # Contacts
│           ├── app.mood.tsx       # Mood tracker
│           ├── app.notifications.tsx # Notifications
│           ├── app.premium.tsx    # Premium upgrade
│           ├── app.settings.tsx   # Settings
│           └── app.admin.tsx      # Admin panel
├── .env.example           # Environment variable template
├── vite.config.ts         # Vite + TanStack Start config
├── tsconfig.json          # TypeScript config
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 18 (or [Bun](https://bun.sh/))
- A **Firebase** project with Firestore, Authentication, and Storage enabled
- A **Google Gemini API key**

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sync-life-ai-29.git
cd sync-life-ai-29-main
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Set up Firestore security rules

See [`FIRESTORE_RULES.md`](./FIRESTORE_RULES.md) for the recommended Firestore security rules.

### 5. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run backend` | Start the Python RAG / healthcare backend |

---

## 💎 Pricing Tiers

| Plan | Price | Highlights |
|---|---|---|
| **Free** | ₹0 | Core tasks & notes, 50 AI messages/month |
| **Pro** | ₹1,999/mo | Unlimited AI, RAG on documents, all modules, priority support |
| **Teams** | ₹12,499/member | Shared knowledge base, team analytics, SSO & audit logs |

Payments are processed via **Razorpay**.

---

## 🤝 Contributing

1. Fork the repo and create your branch from `main`.
2. Make your changes — keep commits atomic and descriptive.
3. Run `npm run lint` and `npm run format` before pushing.
4. Open a pull request against `main`.

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). **Do not force-push, rebase, amend, or squash commits that are already pushed** — it rewrites history on Lovable's side and will cause project history loss.

---

## 📄 License

This project is **private**. All rights reserved © 2026 LIFE-SYNC AI.

