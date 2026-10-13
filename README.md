# Flight Deck

Personal aerospace hub with EMS611U Flight Notes, EMS612U Dynamics Notes, Aerospace Atlas, and a link to the existing M.I.D.A.S. project.

## Publish with GitHub Pages

1. Create a public GitHub repository named flight-deck.
2. Upload the CONTENTS of this folder to the repository root (index.html, hub.css, hub.js, modules, atlas, .nojekyll and this README). Do not upload the ZIP file or an extra containing folder.
3. Commit the files to main.
4. Open repository Settings > Pages. Under Build and deployment, choose Deploy from a branch, then main and /(root). Save.
5. Wait for the Pages deployment to finish. The site should be https://andreaspoimen.github.io/flight-deck/ if that is the account and repository name used.

GitHub hosts the site independently of your computer. GitHub Free requires a public repository for Pages. The site and included lecture/tutorial PDFs will be public.

## Layout

- index.html, hub.css, hub.js: the central hub
- modules/ems611u/: complete conceptual-design revision site
- modules/ems612u/: complete dynamics revision site
- atlas/: Aerospace Atlas company explorer
- .nojekyll: serve these static files without Jekyll processing

M.I.D.A.S. stays on its current GitHub Pages site and uses its existing services. This hub links to it. Atlas external map libraries and job feeds require internet access and depend on those services. No new Supabase setup is needed for the hub.

## Update later

Edit the original local hub/module websites, then run node tools/build-flight-deck.cjs from EMS612U. Upload the refreshed contents of flight-deck-github to this repository and commit. The publishing folder is a generated copy; update original sources first so future builds retain your changes.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
