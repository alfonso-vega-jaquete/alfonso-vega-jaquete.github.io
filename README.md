# alfonso-vega-jaquete.github.io

Personal portfolio of Alfonso Vega de Seoane, served by GitHub Pages at https://alfonso-vega-jaquete.github.io.

Plain HTML and CSS, no framework and no build step. Edit a file, commit, and the site updates within a minute or two.

## What's where

| Path | What it is |
|---|---|
| `index.html` | Home: intro, selected work, about, skills, contact |
| `work/*.html` | One page per case study |
| `assets/style.css` | All styles, light and dark |
| `assets/site.js` | Draws the line chart on the thesis page. Other charts are plain HTML |
| `assets/alfonso.jpg` | Portrait, 320×400 |
| `assets/og-card.jpg` | Preview image for LinkedIn and other link previews |
| `Alfonso-Vega-de-Seoane-CV.pdf` | Public CV (no phone number) |
| `Alfonso-Vega-de-Seoane-Writing-Sample.pdf` | Writing sample |
| `404.html`, `sitemap.xml`, `robots.txt`, `.nojekyll` | Housekeeping for GitHub Pages |

## Add a project

1. Copy the case page closest to the new one, for example `work/attrition-risk.html`, and rename it with a short, descriptive slug.
2. Keep the same order of sections: title that states the finding, a one-paragraph result, the "at a glance" list, Problem, Approach, Result, Robustness and limits, What I would do differently. Aim for 400 to 700 words.
3. Update the `<title>`, the meta description, the canonical URL and the `og:` tags at the top of the file.
4. For a bar chart, reuse the `gbars` (grouped bars) or `hbars` (diverging bars) markup and change the `--v` values. Every chart keeps its "Show the numbers" table.
5. Add a card to the `Selected work` list in `index.html` and fix the "Next case" links so the pages still chain together.
6. Add the new URL to `sitemap.xml`.
7. Commit. Then open the page on your phone and check that every number matches its source.

## Update the CV

Replace `Alfonso-Vega-de-Seoane-CV.pdf` with the new export, keeping the same file name so existing links still work. Leave the phone number off the public copy.

## Rules this site follows

- Every number traces to a source file. Nothing is estimated for effect.
- Nothing from El Corte Inglés beyond what is already on the CV.
- Course work credits teammates by name and does not publish course datasets.
- No tracking scripts, no web fonts, no external requests.
