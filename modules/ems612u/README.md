# EMS612U Dynamics Notes

Open `dist/index.html` in a browser. It works offline without a server, installation, account or API key. Keep the complete `dist` folder together. External NASA links require internet access; all lessons, calculators, practice, diagrams, the study assistant and original PDFs are local.

Contents: 16 connected lessons; 12 equation calculators; 7 animated, clickable diagram views; 12 worked tutorial entries covering the supplied subquestions (including the unavailable 1.9); 8 generated numerical question types; 5 conceptual checks; searchable text for all 48 source pages; a search-based offline study assistant; a dedicated Aircraft Lab with perspective, side and top views.

Aircraft Lab
- Pitch, flight path, airspeed and thrust update the longitudinal equations live.
- Elevator, tab, flap, differential aileron and rudder sliders update the geometry.
- Geometry, mass, density, lift derivatives, downwash and hinge coefficients are editable.
- Readouts include angle references, dynamic pressure, lift/drag coefficients and forces, moment coefficient, wing-AC moment, force residuals, signed tail volume, hinge torque and free-elevator angle.
- Level, climb, descent and steady-glide presets solve the stated model. The trim button adjusts pitch, elevator and thrust.
- Bank and heading rotate the view. Lateral-directional response is not calculated: the supplied notes do not provide those derivatives.
- Flap aerodynamic effect defaults to zero because the supplied notes have no numeric flap derivative. A user can explicitly enter dα₀/dδ_f for a linear zero-lift shift; physical tail setting is preserved. This extension excludes flap drag, moment and stall changes.
- The animation is an algebraic teaching model, not a time-integrated six-degree-of-freedom simulator. Flow particles illustrate direction. Linear attached-flow laws do not predict stall. All assumptions remain visible in the lab.

Sources
- Week 2: Lift platforms angles and fundamental aerodynamics, 30 pages.
- Week 3: Equilibrium, 13 pages.
- Tutorial 1 typed solutions, 3 pages, E. Avital.
- Tutorial 2 typed solutions, 2 pages, E. Avital.

Source issues are explained beside the worked answers. Tutorial 1 mixes chord-based and no-lift-based notation, prints 0.485 where 0.5 cos 8° gives 0.495134, and contains inconsistent moment inputs/signs and rounded lift values. Tutorial 2 states b₁ = 0.03 but uses 0.09 in its worked hinge calculation. Both routes are retained. Tutorial 1.9 lacks a supplied readable question and solution; none has been invented. The tutorial prompts are reconstructed from the solution sheets.

Files for later weeks
- `dist/content.js`: lessons, stable IDs and PDF references.
- `dist/equations.js`: independent validated calculator models.
- `dist/aircraft.js`: geometry, live longitudinal model, trim solver and controls.
- `dist/diagrams.js`: animated diagrams and component explanations, with verified NASA links.
- `dist/papers.js`: original tutorial data, working and source discrepancies.
- `dist/practice.js`: generated numerical templates and conceptual checks.
- `dist/source-index.js`: page-labelled source text for search.
- `dist/assistant.js`: transparent, local retrieval from lessons and worked answers; no remote model.
- `dist/app.js`: navigation, lessons, equation UI, global search and theme.

Append new material with stable source and lesson IDs. Preserve reference areas, angular units, assumptions and original PDFs. Add actual lateral-directional derivatives and a separately documented dynamic model before predicting roll/yaw trajectories.

Verification from the EMS612U folder: `node tools/check-site.cjs` and `node tools/browser-check.cjs`. The checks cover source examples, invalid inputs, trim residuals, flap-reference consistency, route rendering, responsive layout, pause/play, component dialogs, search, assistant retrieval and generated-answer feedback. Source-rendering utilities and review images live in `source-review/` outside the delivered website. These are review aids; the unchanged PDFs remain authoritative.

Optional WebMCP search/calculator registration is feature-detected. No supported WebMCP browser context was available for live registration testing; unsupported browsers simply use the normal controls.

Theme and last-opened lesson use device-local storage where available. Aircraft and practice values persist during navigation in the current page session; refreshing starts a new session. No analytics or tracking.
