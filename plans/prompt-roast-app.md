# Plan: Prompt Roast App

**PRD**: gathered via /grill-me session (2026-06-01)
**Repo**: alexandrakay/prompt-roast-app
**Created**: 2026-06-01

---

## Architectural Decisions

### Routes
- `/` — main roast page (anonymous + signed-in)
- `/roast/[id]` — public shareable roast card with dynamic OG meta
- `/history` — signed-in users only; roast history + delete

### Schema
Firestore collection: `roasts`
- `id`: string (auto-generated)
- `userId`: string | null (null for anonymous roasts)
- `originalPrompt`: string
- `roast`: string
- `charges`: string[]
- `fixed`: string
- `createdAt`: number (Unix timestamp)

### Key Models
- `RoastResult` — `{ roast, charges[], fixed }` (in-flight, not persisted)
- `RoastDocument` — full persisted record including `id`, `userId`, `createdAt`

### Service Boundaries
- **Anthropic Claude** — roast generation via Next.js server action, streamed
- **Firebase Auth** — Google sign-in only
- **Firestore** — all roast persistence (anonymous and authenticated)
- **Next.js `generateMetadata`** — dynamic OG tags per `/roast/[id]`

### Auth Model
- Anonymous users: up to 3 roasts tracked client-side; hard block + sign-in prompt on limit
- Signed-in users: unlimited roasts; roasts stored with `userId`
- Anonymous roasts: stored with `userId: null`; not claimable after sign-in (for now)

---

## Phase 1: Core Roast UI

**User stories**: submit a prompt, see a streamed roast, copy the fixed prompt

### What to build
A single page with a textarea for prompt input and a submit button. On submission, the roast streams in from the server action — roast text, then charges list, then fixed prompt — displayed in three distinct sections as the content arrives. A one-click copy button appears on the fixed prompt section. The existing MUI dark/red theme is applied globally. No auth, no persistence, no sharing yet.

### Acceptance criteria
- [ ] User can type a prompt and submit it
- [ ] Roast output streams in visually as Claude generates it
- [ ] Three sections render distinctly: roast paragraph, charges list (✗ bullets), fixed prompt
- [ ] Copy button on fixed prompt copies to clipboard
- [ ] UI uses the existing dark theme (`#0a0a0a` background, `#ff4444` accent)
- [ ] Empty prompt submission is blocked with an inline error

---

## Phase 2: Persistence + Sharing

**User stories**: every roast gets a shareable link; share to X or anywhere; rich link previews

### What to build
After a roast completes, it is saved to the Firestore `roasts` collection (with `userId: null` for anonymous). A share button appears post-roast and copies or navigates to `/roast/[id]`. That route renders a stripped-down roast card showing all three sections, with a prominent "Roast your own prompt →" CTA linking back to `/`. Dynamic OG meta tags are generated per roast so link previews on X/Slack show the first sentence of the roast as the title.

### Acceptance criteria
- [ ] Every completed roast is saved to Firestore before the share button appears
- [ ] `/roast/[id]` renders the roast, charges, and fixed prompt for any valid ID
- [ ] OG `title` is the first sentence of the roast; `description` is the original prompt
- [ ] Share button on the main page copies the `/roast/[id]` URL to clipboard
- [ ] Visiting an invalid roast ID shows a clear not-found state
- [ ] The shareable card has a "Roast your own prompt →" CTA

---

## Phase 3: Auth + Session Gate

**User stories**: sign in with Google; anonymous users are limited to 3 roasts; gate enforced with sign-in prompt

### What to build
A minimal nav bar with the app name on the left and a sign-in button (or user avatar + history link) on the right. Google sign-in via Firebase Auth. Anonymous users' roast count is tracked client-side; on the 3rd completed roast, the input is hard-blocked and a sign-in prompt is shown with playful copy. Signed-in users have no roast limit and see their `userId` attached to new roasts in Firestore. Firestore security rules allow public read on all roasts, write only from the app.

### Acceptance criteria
- [ ] Nav bar renders on all pages with sign-in/avatar state
- [ ] Google sign-in flow completes and auth state persists across page reloads
- [ ] Anonymous users can submit exactly 3 roasts before the hard block appears
- [ ] Hard block shows a sign-in prompt; signing in clears the block
- [ ] Signed-in users' new roasts are saved with their `userId` in Firestore
- [ ] Signing out returns the user to anonymous state

---

## Phase 4: History + Delete

**User stories**: signed-in users can view all their past roasts; delete any roast

### What to build
A `/history` page accessible only to signed-in users, showing a reverse-chronological list of their past roasts (original prompt + roast excerpt + timestamp). Each entry links to its `/roast/[id]` page and has a delete button. Deleting hard-removes the Firestore document. Unauthenticated visitors to `/history` are redirected to `/`.

### Acceptance criteria
- [ ] `/history` lists all roasts where `userId` matches the signed-in user
- [ ] List is reverse-chronological by `createdAt`
- [ ] Each entry shows: original prompt (truncated), roast excerpt, relative timestamp
- [ ] Each entry links to `/roast/[id]`
- [ ] Delete button hard-removes the document from Firestore and removes it from the list
- [ ] Unauthenticated visit to `/history` redirects to `/`
