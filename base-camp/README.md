# Base Camp — Trip Planner & Catch Log

A small web app for planning outdoor trips and logging your catches. Build a gear
checklist for each trip, check things off as you pack, log the fish you catch, and
see all your catches rolled up with stats. Everything saves in your browser.

Built with plain HTML, CSS, and JavaScript — no frameworks, no backend.

---

## File Structure

```
base-camp/
├── index.html    Page structure for all three views
├── styles.css    All styling (sage / beige theme)
├── script.js     All the app logic
├── data.js       Starter gear lists for each trip type
└── README.md     This file
```

---

## Run it locally

No setup or install needed.

1. Download the files (or unzip `base-camp.zip`) into a folder.
2. Double-click `index.html` — it opens in your browser and just works.

> **Note on saving:** the app stores your trips in the browser's localStorage.
> That means your data lives in *that* browser on *that* computer. Opening the
> app in a different browser (or clearing your browser data) starts fresh. This
> is expected — it's how a no-backend app keeps things simple.

---

## Host it free on GitHub Pages

Since this is a static site (just HTML/CSS/JS), GitHub Pages can host it for free.

1. **Create a repository** on GitHub — name it something like `base-camp`.
2. **Upload the files.** On the repo page, click **Add file → Upload files**,
   drag in `index.html`, `styles.css`, `script.js`, and `data.js`, then
   **Commit changes**. (Upload the files themselves, not the folder.)
3. **Turn on Pages.** Go to **Settings → Pages**. Under *Build and deployment*,
   set **Source** to **Deploy from a branch**, pick the **main** branch and the
   **/ (root)** folder, and click **Save**.
4. **Wait about a minute,** then refresh the Pages settings screen. Your live
   link appears at the top — something like:
   `https://yourusername.github.io/base-camp/`

That's the same process you used for your personal site, so it should feel familiar.

---

## How it works (quick version)

The whole app runs off one array called `trips`. Each trip is an object that holds
its own gear list and its own catch list. When anything changes, the app saves the
array to localStorage and re-draws the screen. There are three views (My Trips,
Trip detail, All Catches) and only one shows at a time.

The code is commented section by section if you want to dig in.

---

## Make it your own

- **Edit the gear lists** — open `data.js` and change the items under
  `GEAR_TEMPLATES`. Add, remove, or rename anything.
- **Recolor the app** — open `styles.css` and edit the values at the top under
  `:root` (like `--sage` and `--beige`). Everything updates at once.
- **Track more per catch** — the catch form records species, length, and fly.
  You can add a field (like weight) by copying the length input in `index.html`
  and following the same pattern in the `addCatch` function in `script.js`.

---

*Base Camp · built by Sam Rose*
