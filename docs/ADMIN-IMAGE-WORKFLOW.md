# TLMK Studio Image Admin Workflow

Phase 1 adds a private Decap CMS prototype at `/admin`. It does not change the live homepage, portfolio, about page, gallery HTML, lightbox JavaScript, CSS, prices, policies, contact details, tracking, hosting, or deployment settings.

## Login And OAuth Requirements

The admin uses the Decap CMS GitHub backend for `tonleed-ent/tlmk-studio-websitee` on the `main` branch. Login will not work until the owner manually configures OAuth.

Manual owner steps:

1. In GitHub, create an OAuth app for TLMK Studio.
2. Set the OAuth app homepage URL to the live TLMK Studio site.
3. Set the OAuth callback URL required by Netlify's OAuth provider.
4. Copy the GitHub OAuth client ID and client secret.
5. In Netlify, configure the GitHub OAuth provider for the existing TLMK Studio site.
6. Restrict GitHub repository access to trusted users only.
7. Confirm Netlify deploys the production site from `main`.

Never commit OAuth client secrets, API keys, tokens, or Netlify credentials to this repository.

## Upload And Publishing Flow

The prototype collection edits `data/portfolio-images.json`. Uploaded files are configured to go to `images/uploads`.

The editor fields are:

- `image`
- `title`
- `alt`
- `category`
- `order`
- `featured`
- `showOnHomepage`
- `visible`

Publishing uses Decap's editorial workflow, so content changes remain Git-backed and reviewable instead of bypassing Git history.

## Git Commits And Netlify Deploys

When a draft is published, Decap should write commits to the existing GitHub repository. Netlify should then build and deploy from the configured production branch.

Before using this for production images, confirm in the Netlify dashboard that:

1. The connected repository is `tonleed-ent/tlmk-studio-websitee`.
2. The production branch is `main`.
3. Deploy previews or branch deploys behave as expected for editorial review.

## Image Original Safety

Do not overwrite, delete, rename, or compress existing original images in place. New admin uploads should go into `images/uploads`. If original high-resolution files need to be preserved separately, keep them outside generated delivery variants or in a clearly documented source folder.

## Later Gallery Migration

The current homepage, portfolio, and about images remain hardcoded in HTML for Phase 1. A later migration can read `data/portfolio-images.json` and render the existing gallery classes so the current design, ordering, hover behavior, and lightbox behavior are preserved.

Do not migrate current production images until the admin login, preview, ordering, rollback, and image delivery plan have been tested.

## Phase 2 Image Delivery

Netlify Image CDN integration is planned for Phase 2. The goal is to keep uploaded originals safe while serving optimized resized images from delivery URLs. Phase 2 should update rendering paths only after testing layout, lightbox quality, mobile performance, and cache behavior.

## Rollback Process

Because content is Git-backed, rollback should use Git history:

1. Identify the Decap commit that changed image data or uploaded files.
2. Revert that commit in GitHub or locally.
3. Let Netlify redeploy the reverted state.
4. Verify `/admin`, homepage, portfolio, about page, gallery order, and lightbox behavior.

## Security Risks

- OAuth misconfiguration can grant repository write access to the wrong users.
- Committed secrets would expose production credentials.
- The current `_headers` Content Security Policy blocks external scripts and non-self connections, so Decap and OAuth will need a future approved CSP update before the hosted admin can function.
- Uploading very large images directly to Git can make the repository slow.
- Admin content must not be allowed to edit CSS, JavaScript, prices, policies, contact details, tracking, hosting, DNS, or deployment settings.
