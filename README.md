# LP Refresher Course Library
**The Patient Investor Mastermind**

A premium static learning dashboard for the 10-lesson Liquidity Providing Refresher Course. Members can follow Greg's or Shane's version of each lesson, track their progress, and pick up where they left off — all with no backend required.

---

## Features

- 10 lesson cards with Greg, Shane, and Homework links
- Guided learning path stepper (lessons 1 → 10)
- "Start Here" and "Continue Next Lesson" CTAs
- Progress bar and completion count
- localStorage persistence — state survives page reloads
- "All Lessons Completed" celebration state
- Mobile responsive, keyboard accessible, reduced-motion safe

---

## Project Structure

```
/
├── index.html   — Page structure and semantic HTML
├── styles.css   — All styling (dark brand theme, gold accents)
├── script.js    — Lesson data, rendering logic, localStorage
└── README.md    — This file
```

No build step. No dependencies. No backend.

---

## Local Preview

**Option 1 — Open directly:**
```
open index.html
```
> Works for basic viewing. Some browsers restrict localStorage on `file://` URLs.

**Option 2 — Serve locally (recommended):**
```bash
npx serve .
```
Then open `http://localhost:3000` in your browser.

---

## Cloudflare Pages Deployment

This is a static site — deploy in 3 steps.

### 1. Push to GitHub

Create a repo and push this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages → Create → Pages → Connect to Git**
3. Select your GitHub repo
4. Configure the build:

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | *(leave blank)* |
| Build output directory | `/` |
| Root directory | `/` |

5. Click **Save and Deploy**

### 3. Done

Cloudflare will deploy and give you a `*.pages.dev` URL. Future pushes to `main` auto-deploy.

---

## Updating Lesson Content

All lesson data lives at the top of `script.js` in the `LESSONS` array. Each lesson object:

```js
{
  id: 1,                        // lesson number (1–10)
  title: 'Curriculum Overview', // displayed in card and stepper
  description: '...',           // short description on card
  greg: 'https://...',          // Greg's video URL
  shane: 'https://...',         // Shane's video URL
  homework: 'https://...',      // Homework Google Drive URL
}
```

Edit the array and redeploy. No other files need to change.

---

## localStorage

Completion state is stored under the key:

```
lp-refresher-completed-lessons
```

Value is a JSON array of completed lesson IDs, e.g. `[1, 2, 3]`.

To reset progress, clear this key in DevTools → Application → Local Storage.

---

## Notes

- Fully static — no server, no auth, no database required
- All lesson and homework links open in a new tab
- Designed to match the visual brand of the Patient Investor onboarding site
