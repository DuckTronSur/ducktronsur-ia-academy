# START v0.4 · integration review

Status: CANDIDATE BRANCH ONLY · NOT MERGED · NOT DEPLOYED

## Included

- Eight editorial source documents copied into `docs/start-v0.4/content/L01.md` through `L08.md`.
- A manifest with titles, versions and five-question ranges.
- No changes to the current `ruta.html`, `leccion.html`, `evaluacion.html` or `assessment.js`.
- No Supabase migration applied.

## Deliberate boundary

The current production flow remains the four-lesson START route. This branch preserves the new content for review before changing navigation or database links. The next implementation commit should add a versioned preview route, then wire the approved content and assessment v2 after editorial sign-off.

## Review gates

1. Confirm the final approved version for L01–L08.
2. Review the five questions per lesson against the final lesson content.
3. Add the versioned frontend preview and test all eight links.
4. Prepare assessment v2 with 40 questions and 120 options, unpublished.
5. Run structural and browser QA on the branch.
6. Decide whether to merge; do not deploy automatically from this review branch.
