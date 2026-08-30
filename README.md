# Gloria Gu — Personal Website

Bilingual (EN / 中文) portfolio site built with plain HTML, CSS and a little vanilla JavaScript. No build step, no dependencies, no framework.

## Structure

```
personal-website/
├── index.html                    # Single page: 01 About · 02 Experience · 03 Mentora
│                                 #   · 04 Projects · 05 Writing · 06 Contact
├── styles.css                    # All styles. Design tokens at the top of the file.
├── script.js                     # Nav · footer year · reveal-on-scroll
│                                 #   · language switch · Mentora prototype
├── assets/
│   ├── portrait.jpg              # Hero photo (627×900, 48 KB)
│   └── Gloria-Gu-CV.pdf          # CV download (ATS version, 88 KB)
└── blog/
    ├── parent-visibility.html    # "The parent-visibility switch is the red line"
    └── teacher-who-codes.html    # "Both sides were reasonable. The requirement was broken."
                                  #   (filename kept from the original title; the URL is stable)
```

## One content policy worth knowing about

**No employer names on the public page.** The Experience cards say "International high school, Cambridge pathway — Hangzhou" rather than naming the school, and the IvyCampus card says "my school's platform". Universities *are* named, because a degree is your own credential rather than an employer's information. Full names, exact dates and detailed responsibilities are in `assets/Gloria-Gu-CV.pdf`, which is one click away — so the page reads as deliberate rather than evasive.

For the same reason the class-outcomes line is an aggregate ("every student in my 2026 cohort was admitted to a QS Top 100 university") instead of the per-university breakdown: in a named class of twenty, "1 Cambridge · 1 Imperial · 1 LSE" identifies individual students. The breakdown stays in the CV.

If you'd rather name employers, the only places to change are the three `.exp-org` blocks and the IvyCampus paragraph in `index.html`.

## How to view it

Double-click `index.html` and it opens in the browser. For a preview that behaves like a real server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Editing the bilingual copy

There is **no translation dictionary and no JSON file**. Each piece of copy exists twice, side by side in the HTML, and CSS hides the half that isn't active:

```html
<p class="i18n en">English copy here.</p>
<p class="i18n zh">中文文案在这里。</p>
```

Rules to keep it working:

- Always edit both halves at once — they sit next to each other precisely so you can't forget one.
- Keep `class="i18n en"` / `class="i18n zh"` exactly as written (two classes, in that order is easiest to grep).
- `<html data-lang="en">` is hard-coded, so **English still renders correctly with JavaScript disabled**.
- The switch is the `EN / 中` control in the nav; the choice is saved in `localStorage` under `gg-lang`, and `<html lang>` is kept in sync for screen readers.

Sanity check after editing — the two counts must match:

```bash
grep -o 'i18n en' index.html | wc -l
grep -o 'i18n zh' index.html | wc -l
```

Two exceptions to the pairing, both intentional: proper nouns that don't get translated (`Mentora`, `ACSL · CALICO`) carry no `i18n` class at all, and SVG `<text>` can't use the CSS trick, so those elements carry `data-en` / `data-zh` attributes which `setLang()` swaps directly.

## Editing the Mentora prototype

The prototype is a small state machine in `script.js` — pure front-end, no backend, no network calls. **All of its data is simulated.** Everything you'd want to change lives in named constants near the top of section 5:

| What to change | Where |
|---|---|
| The exam question | `QUESTION` |
| The (simulated) student answer | `ANSWER_LINES` |
| Mark points, which one fails, which sentence is the evidence | `MARK_POINTS` |
| The five error-cause chips and their follow-up actions | `CAUSES` |
| The four-week mastery figures and the alert threshold | `MASTERY`, `THRESHOLD` |
| The three items the teacher reviews in step ⑥ | `REVIEW_ITEMS` |
| Step titles, tab labels, and every panel's copy | `STEPS` and the `renderStep1…7` functions |

Each of those holds `{ en: '…', zh: '…' }` objects; `t()` picks the active language, and changing language re-renders the panel while keeping your place in the loop.

Behaviour worth preserving:

- Step ⑦ is **blocked** until all three items in step ⑥ have been reviewed. That is design principle 03 enforced by the interface rather than described in prose — it's the point of the whole demo, so don't "fix" it.
- The `Concept prototype · simulated data · not a live system` badge in `.proto-bar` and the honest-status note below the frame (`.proto-note`) must both stay. No effectiveness figures go on this site until a real pilot has produced them.
- Steps are `<button>`s; ← / → arrow keys move between them.

## Content sources

The factual content comes from `Desktop/简历/Resume_Amanguli.html`, `Desktop/Mentora/Mentora_设计文档.md` and `Desktop/IvyCampus_需求补充清单.md`. IvyCampus is described only at CV granularity — the internal P0/P1/P2 backlog is a school document and is not published here.

## Housekeeping

- The LinkedIn URL in the Contact section (`linkedin.com/in/gloriagu-edtech`) is a custom URL that must actually be claimed on LinkedIn, or the link 404s.
- To change the accent colour, edit `--accent` / `--accent-soft` at the top of `styles.css`.
- `assets/Gloria-Gu-CV.pdf` is the ATS export. The designed CV is 12 MB because it embeds a full-resolution photo — re-export it without the photo before swapping it in.

## Hosting (free)

- **GitHub Pages**: push this folder to a public repo, then enable Pages in repo settings.
- **Netlify Drop**: drag the folder onto https://app.netlify.com/drop.
- **Vercel**: run `vercel` in this folder if you have the CLI.

Once it's live, the URL goes into LinkedIn → Featured.
