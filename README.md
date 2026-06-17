# IS 201 Project — Sam Rose

A personal web project built for IS 201. The site brings together a professional
resume/home page, a topic page on fly fishing, and a small interactive web app —
all hosted together through GitHub Pages.

**Live site:** `https://YOURUSERNAME.github.io/REPONAME/`
*(replace with your actual GitHub Pages link once it's published)*

---

## Pages in this project

| Page | File | What it is |
|------|------|------------|
| **Home / Resume** | `index.html` | Landing page and resume, built on the Bootstrap MyResume template. Includes Home, About, Resume, and Contact sections. |
| **Fly Fishing** | `scratch.html` | A custom-built page, "The Hook of Fly Fishing" — a step-by-step beginner's guide, an embedded video, and a Tableau map to find a local fly shop. |
| **Base Camp** | `base-camp/index.html` | A standalone web app for planning trips and logging catches. Built from scratch with plain HTML, CSS, and JavaScript. See `base-camp/README.md` for details. |

The pages link to each other through the navigation bar at the top of each page.

---

## File Structure

```
.
├── index.html              Home / resume page (Bootstrap MyResume template)
├── scratch.html            Fly fishing topic page (custom build)
├── README.md               This file
│
├── assets/
│   ├── css/
│   │   ├── main.css            Styling for the resume page (template)
│   │   └── scratch-styles.css  Styling for the fly fishing page (custom)
│   ├── img/                 Images and favicons
│   ├── js/                  Template JavaScript
│   └── vendor/              Bootstrap, icons, and other template libraries
│
└── base-camp/              The Base Camp web app (self-contained)
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── data.js
    └── README.md           App-specific documentation
```

---

## Built with

- **HTML & CSS** — page structure and styling
- **JavaScript** — interactivity in the Base Camp app
- **Bootstrap (MyResume template)** — framework behind the home/resume page
- **Tableau Public** — embedded fly shop map on the fly fishing page
- **GitHub Pages** — free static hosting

---

## Viewing the project

**Online:** visit the GitHub Pages link at the top of this file.

**Locally:** download or clone the repository, then open `index.html` in a browser.
Every page links to the others, so you can navigate the whole project from there.

> Note: the Base Camp app saves your trips in your browser's localStorage, so its
> data stays on the device and browser you use it in.

---

## Credits

The home/resume page uses the **MyResume** template by
[BootstrapMade](https://bootstrapmade.com/free-html-bootstrap-template-my-resume/).
The fly fishing page, the Base Camp app, and all written content are my own work.

---

*Samuel Rose · IS 201*
