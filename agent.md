# Agent Operational Guide: Vibe UI Show

Welcome, Agent. This document contains all essential architectural decisions, stack specifications, security invariants, directory conventions, and operational workflows for **Vibe UI Show**. Treat this file as the single source of truth for all autonomous tasks on this codebase.

---

## 1. Stack & Pinned Package Versions

- **Framework:** `next` @ `16.4.2` (Next.js App Router, React Server Components, Server Actions)
- **UI Runtime:** `react` @ `19.3.0` & `react-dom` @ `19.3.0`
- **Styling:** `tailwindcss` @ `4.3.3` (Tailwind CSS v4 CSS-first token configuration in `src/app/globals.css`)
- **Animation:** `motion` @ `14.5.0`
- **Backend & Auth:** `@supabase/ssr` @ `^0.12.7` & `@supabase/supabase-js` @ `^2.118.0`
- **Code Editor:** `@monaco-editor/react` @ `^4.7.0`
- **Form Management & Validation:** `react-hook-form` @ `^7.90.0`, `zod` @ `^4.6.7`, `@hookform/resolvers` @ `^3.10.0`
- **Icons & UI Primitives:** `lucide-react` @ `^1.61.0`, `clsx` @ `^2.1.1`, `tailwind-merge` @ `^3.7.0`, `class-variance-authority` @ `^0.7.1`
- **Feedback & Notifications:** `sonner` @ `^2.0.8`
- **Screenshot Ingestion:** `playwright-core` @ `^1.64.1` & `@sparticuz/chromium` @ `^153.0.0`

---

## 2. Core Operational Commands

```bash
# Run local development server
npm run dev

# Run production build
npm run build

# Start production server
npm run start

# Run ESLint validation
npm run lint

# Apply Supabase database migrations (when Supabase CLI is linked)
supabase db push

# Generate Supabase TypeScript types
supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
```

---

## 3. Directory Layout & Architecture

```
vibe-ui/
├── .env.local.example          # Template for required environment variables
├── MASTER_PLAN.md              # Full system architecture and design specifications
├── agent.md                    # This operational manual
├── package.json
├── tsconfig.json
├── next.config.ts              # CSP headers and domain security policies
├── supabase/
│   ├── migrations/             # SQL migration files (schema, triggers, RLS)
│   └── seed.sql                # Seed projects with Three.js and Canvas starters
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout with dark theme, glass navbar & toast container
    │   ├── page.tsx            # Bento discovery grid, hero tile, search and filters
    │   ├── globals.css         # Tailwind v4 glass tokens and styling
    │   ├── p/
    │   │   └── [id]/           # Project detail page (live preview, code tab, comments)
    │   ├── upload/             # Split Monaco editor + live preview studio
    │   ├── admin/              # Role-guarded moderation dashboard
    │   ├── u/
    │   │   └── [username]/     # User profile and portfolio
    │   ├── login/              # Auth page (GitHub + Magic Link)
    │   ├── embed/
    │   │   └── [id]/           # Fullscreen CSP-sandboxed viewer
    │   └── api/
    │       ├── guest-session/  # HMAC guest cookie signer
    │       └── cron/
    │           └── screenshots/# Playwright headless screenshot queue worker
    ├── components/
    │   ├── ui/                 # Reusable glass buttons, inputs, dialogs, badges
    │   ├── viewer/             # Sandboxed HTML iframe component with Three.js shim
    │   ├── editor/             # Monaco editor component wrapper
    │   ├── bento/              # Bento grid and card layout components
    │   ├── comments/           # Threaded comment section component
    │   └── rating/             # 5-star interactive rating and bookmark buttons
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts       # Browser Supabase client (@supabase/ssr)
    │   │   ├── server.ts       # Server Supabase client with cookies handler
    │   │   └── middleware.ts   # Session refresh & protected route guard
    │   ├── guest.ts            # HMAC token signer & validator
    │   ├── sandbox.ts          # HTML injection & ESM import-map wrapper
    │   └── utils.ts            # cn() class merger
    └── types/
        └── database.ts         # Supabase database TypeScript definitions
```

---

## 4. Strict Security Invariants (NON-NEGOTIABLE)

1. **Sandboxed Iframe Rules:**
   - Always render arbitrary user HTML in `<iframe srcdoc={...} sandbox="allow-scripts allow-pointer-lock">`.
   - **NEVER** add `allow-same-origin`. Allowing `allow-same-origin` would allow user code to read cookies, `localStorage`, access the parent window, and impersonate the user to Supabase.
   - **NEVER** add `allow-top-navigation` or `allow-forms`.
2. **Comment Rendering:**
   - Comments must be rendered as raw plain text strings. **NEVER** use `dangerouslySetInnerHTML` on comment text or user-provided descriptions.
3. **Guest Signature Protocol:**
   - Any unauthenticated vote, star, or comment must carry an HMAC-SHA256 signature issued by the server using `GUEST_SECRET`.
   - Reject unverified guest actions.
4. **Service-Role Key Isolation:**
   - `SUPABASE_SERVICE_ROLE_KEY` must only ever be accessed in server-side Route Handlers or Server Actions for administrative tasks. Never expose it to client components or prefix it with `NEXT_PUBLIC_`.
5. **Admin Role Integrity:**
   - The `role` column in `public.profiles` cannot be modified by standard users. Changes are guarded by a Postgres `BEFORE UPDATE` trigger verifying admin permissions.
6. **Input Size Limits:**
   - HTML uploads: Maximum 500 KB per project.
   - Comment content: Maximum 2,000 characters.

---

## 5. Environment Variables Reference

Create `.env.local` based on `.env.local.example`:

```env
# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Server-Only Secret
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Guest HMAC Token Secret
GUEST_SECRET=super-secret-hmac-key-min-32-chars

# Vercel Cron Secret (for screenshot worker)
CRON_SECRET=your-cron-secret-token

# Base Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 6. Database Schema & RLS Reference

### Tables
- `profiles`: `id (uuid, PK)`, `username (text)`, `avatar_url (text)`, `role (text: 'user' | 'admin')`, `created_at`
- `projects`: `id (uuid, PK)`, `user_id (uuid, FK)`, `title (text)`, `description (text)`, `tags (text[])`, `html_code (text)`, `cover_url (text)`, `status (text: 'published' | 'pending' | 'rejected' | 'flagged')`, `is_featured (boolean)`, `view_count (int)`, `avg_rating (numeric)`, `rating_count (int)`, `favorite_count (int)`, `search_vector (tsvector)`
- `ratings`: `id (uuid, PK)`, `project_id (uuid, FK)`, `user_id (uuid, FK, nullable)`, `guest_id (text, nullable)`, `rating (smallint 1-5)`
- `favorites`: `id (uuid, PK)`, `project_id (uuid, FK)`, `user_id (uuid, FK, nullable)`, `guest_id (text, nullable)`
- `comments`: `id (uuid, PK)`, `project_id (uuid, FK)`, `user_id (uuid, FK, nullable)`, `guest_id (text, nullable)`, `guest_name (text)`, `content (text)`, `is_hidden (boolean)`
- `screenshot_queue`: `id (uuid, PK)`, `project_id (uuid, FK)`, `status (text: 'pending'|'processing'|'completed'|'failed')`, `attempts (int)`

### RLS Policies
- `projects`:
  - `SELECT`: Anyone can view published projects (`status = 'published'`). Users can view their own projects. Admins can view all.
  - `INSERT`: Authenticated users can insert their own project.
  - `UPDATE`: Owner can update title/description/html. Admins can update any field (e.g. status, is_featured).
  - `DELETE`: Owner or Admin can delete.
- `ratings` & `favorites`:
  - `SELECT`: Public.
  - `INSERT`: Authenticated user or validated guest. Unique constraint prevents duplicate votes per project.
  - `UPDATE`: Owner of rating (by user_id or guest_id).
- `comments`:
  - `SELECT`: Anyone can read where `is_hidden = false`. Admins can read all.
  - `INSERT`: Authenticated user or validated guest.
  - `UPDATE/DELETE`: Author or Admin.

---

## 7. Development Guidelines & Glass Bento Conventions

- **Dark Glass Aesthetic:**
  - Base background: `#090a0f` or dark slate (`bg-slate-950`).
  - Glass cards: `bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-2xl rounded-2xl hover:border-white/[0.2] transition-all`.
  - Neon accents: Cyan (`#06b6d4`), Violet (`#8b5cf6`), Amber (`#f59e0b`).
- **Code Editor Integration:**
  - Monaco editor must use the `vs-dark` theme and `automaticLayout: true`.
  - Live preview in `/upload` should debounce preview refresh by 300ms to preserve UI responsiveness during rapid typing.
- **Three.js / CDN Support:**
  - Sandbox generator in `src/lib/sandbox.ts` wraps user code with import maps for `three`, `three/addons/`, `gsap`, and Tailwind Play CDN.
