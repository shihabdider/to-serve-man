# Iteration

## Current slice

Publish the verified static site to GitHub Pages.

## Customer-facing goal

Make To Serve Man publicly available at `https://shihabdider.github.io/to-serve-man/` and automatically redeploy verified changes pushed to `main`.

## Scope

- Make `shihabdider/to-serve-man` public.
- Configure GitHub Pages to use GitHub Actions.
- Restore the deployment workflow's `main` push trigger while retaining manual dispatch.
- Update repository documentation to describe the live publication workflow.
- Verify the site locally, confirm the remote workflow succeeds, and check the public URL.

## Non-goals

- No content, route, presentation, framework, or runtime changes.
- No custom domain or alternate hosting provider.

## Acceptance checks

- Configured verification and TypeScript compilation pass before the activation push.
- The repository is public and Pages uses the workflow build source.
- The deployment workflow succeeds for the activation commit.
- The published URL responds successfully.

## Status

Published. Deployment run `29519561434` succeeded for activation commit `b8e08a0`, and the public URL returned HTTP 200 with the expected site title.
