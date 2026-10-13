# EMS611U Flight Notes

Open `dist/index.html` in a browser. The site works directly from local files, without installation, a server or an internet connection. Keep the `dist` directory together: it contains the notes, figures, scripts and six original PDFs.

## Weekly updates

Continue working in this folder and supply the next week's notes. Add source-backed lessons to the existing library rather than replacing the site.

- `dist/content.js`: original propulsion lessons and source definitions.
- `dist/flight-notes.js`: aerodynamics and flight-mechanics lessons.
- `dist/equations.js`, `dist/flight-equations.js`: equation definitions, units, input checks and calculations.
- `dist/source-index.js` and `dist/paper-index.js`: full text extracted from the supplied PDFs, with labels added for scanned material.
- `dist/app.js`: home screen, lessons, calculators, diagrams, navigation and global search.
- `dist/styles.css`: dark/light themes and responsive layout.
- `dist/sources/`: unchanged original PDFs.
- `dist/figures/`: figures extracted from the supplied sources.

Each lesson records a stable ID, topic group, source and page range. Keep old IDs stable so saved links remain useful. New notes can be loaded as another plain script before `app.js` and append lessons to `STUDY_DATA.lessons`; calculators append to `EQUATIONS.models`. The search index automatically covers all lesson sections, derivations, symbols and equations. Refresh the original-page index when adding a PDF.

## Academic content policy

Use only supplied notes for subject content. Plain-language explanations are paraphrases. Derivations are algebraic expansions of supplied equations. Keep units, assumptions and validity limits beside each calculator. Chart values must be read from original source figures or supplied explicitly, never fabricated. Illustrative calculator defaults are labelled separately from worked source examples.

Source issues identified in this version:

- `balance_force.pdf` p. 4: stated inputs produce 126.5556 m/s, although 126.49 m/s is printed.
- `balance_force.pdf` p. 9: exact arctangent gives 2.8624 degrees; the small-angle arcsine route gives 2.8660 degrees, which rounds to 2.87 rather than the printed 2.86.
- The atmosphere-table header uses T0 = 288.16 K while its footnote says T0 = 288 K. The discrete lookup preserves printed ratios and uses header reference values for dimensional values.
- `jet-engine_notes_V2.pdf` p. 17 labels W as aircraft weight in an engine-sizing discussion. Keep this ambiguity explicit.
- Approximate high-temperature statements and the electric-biplane zero-induced-drag claim are identified as source statements, not universal design rules.
- Imperial sizing correlations are copied literally and labelled empirical; no unspecified validity ranges or replacement coefficients are invented.

Preferences (theme and last opened lesson) use local browser storage where available. No account or backend is required for the local copy. No tracking is included.

## Verification

Run `node ../tools/check-site.cjs` from this directory, or `node tools/check-site.cjs` from the EMS611U parent directory. It checks local references, equation values and invalid-input cases. Browser checks use the standalone script in `tools/browser-check.cjs` in the parent directory.

Live diagrams include engine and aerofoil airflow, propeller rotation, actuator-disc flow, and an adjustable steady-flight force diagram. Playback controls support pause and speed; reduced-motion preferences start animation paused. Motion is conceptual, not a numerical flow simulation.

Practice tab: 6 numerical templates with randomized inputs and checked answers, plus 4 explanation questions. Worked solutions cite the supplied notes. Both typed example papers are included above generated practice, with six main questions and worked explanations. Questions are generated locally from templates, with no online AI dependency. Answers and the current set remain available while navigating tabs; refresh starts a new session.

October update: added both typed example papers (9 pages, 6 main questions), original PDFs, searchable text, worked explanations, source discrepancy notes and similar generated variants. Explore tab provides 3 interactive diagrams and 8 component explanations with verified NASA links. Future lecture notes and papers should retain source IDs and page references; update sources, search and question data together.

Update files: `papers.js` contains supplied questions, solutions and source checks; `practice.js` holds generated templates; `explore.js` contains component pop-ups and NASA references. Preserve original inputs and label generated variants. Verify new answers, retain source-specific assumptions, copy original PDFs into `sources/`, and update page counts and search. Run `node tools/check-site.cjs`, `node tools/check-practice.cjs`, and `node tools/browser-check.cjs` after relevant changes. The add/integrate/finish scripts are one-time migration helpers, not repeatable build commands.
