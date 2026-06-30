---
name: tlmk-studio-developer
description: Safely develop and maintain the live TLMK Studio photography website and related business tools. Use when Codex is working in the TLMK Studio repository or on TLMK Studio tasks involving static HTML/CSS/JavaScript website edits, the image admin panel, gallery or lightbox behavior, forms, tracking, enquiry or booking workflows, website bugs, performance, SEO, mobile usability, accessibility, Git workflow, or simple website management for the live London photography business.
---

# TLMK Studio Developer

Use this skill to make focused, low-risk changes to the existing live TLMK Studio photography website and supporting business tools.

## Business Context

TLMK Studio is a live London photography business. The website, custom domain, hosting, Instagram, WhatsApp Business, Meta advertising, and Git repository already exist and work.

Prioritise enquiries, paid bookings, mobile usability, speed, accessibility, conversion, and simple ongoing management. Keep WhatsApp as the main enquiry channel unless the owner explicitly changes that direction.

The current website is a static HTML, CSS, and JavaScript project. Keep it static unless a backend, CMS, or external service is clearly required for the requested workflow.

## Starting Workflow

Before making changes:

1. Inspect the existing implementation before deciding how to edit it.
2. Read `AGENTS.md` and relevant files in `docs/` when they exist.
3. Check `git status` and the current branch.
4. Understand the business goal behind the request.
5. Identify the smallest safe implementation that solves the request.
6. List the files expected to change before editing.
7. Explain meaningful risks, especially if the change affects conversion, SEO, tracking, payments, bookings, policies, contact details, media assets, or deployment.
8. Read only the files required for the current task.
9. Do not scan image folders, video folders, `.git`, generated files, or the entire repository unless directly necessary.
10. Reuse information already inspected during the current task instead of repeatedly rereading unchanged files.

Use `rg` for repo-wide searches when broad search is necessary. For contact, booking, pricing, or policy changes, search the relevant project surfaces rather than only visible page sections.

## Implementation Rules

Preserve the current visual identity. Do not redesign unrelated sections.

Do not change colours, fonts, photographs, prices, packages, policies, testimonials, awards, client counts, business claims, booking terms, or contact details without explicit instruction.

Reuse existing HTML, CSS, JavaScript, naming, layout, and content patterns. Avoid unnecessary frameworks, build systems, and dependencies.

Make one focused change at a time. Keep edits narrow and reversible.

Protect live business surfaces:

1. Never invent testimonials, awards, client counts, prices, packages, policies, or business claims.
2. Never expose API keys, tokens, service credentials, or secrets in frontend files.
3. Never delete or overwrite original photographs or videos.
4. Do not rename production assets unless necessary and approved.
5. Preserve existing WhatsApp prefilled message text unless the user asks to change the copy.
6. Keep existing SEO and tracking behavior intact unless the requested change specifically targets it.
7. Avoid changing hosting, DNS, ad tracking, analytics, or deployment configuration without approval.

Prioritise:

1. Mobile usability.
2. Fast page loads and optimised images.
3. Accessible navigation, buttons, forms, alt text, and focus behavior.
4. Clear enquiry and booking paths.
5. Stable gallery and lightbox behavior.
6. Simple future maintenance.

## Static Website Guidance

For content changes, update only the required text, links, attributes, or data. Preserve surrounding layout and styling unless a small CSS adjustment is required to keep the existing design working.

For CSS changes, keep selectors local to the affected component where practical. Avoid broad resets or theme-level changes unless explicitly requested.

For JavaScript changes, preserve existing interaction patterns. Test the relevant navigation, gallery, lightbox, forms, buttons, and mobile menu behavior.

For images and video, preserve originals. Add optimised derivatives or metadata when needed, but do not destroy source media.

## Image Admin System Guidance

For the planned image admin system, prefer a simple secure CMS, Git-backed workflow, or static-site-friendly content workflow over a custom complex admin application.

The admin system should allow the owner to:

1. Upload images.
2. Reorder images.
3. Hide or show images.
4. Categorise images.
5. Preview changes before publishing.
6. Publish changes through a reversible Git-backed process.

Automatically optimise website image delivery where possible. Preserve original image files.

Do not allow the admin panel to edit CSS, JavaScript, policies, prices, packages, contact details, tracking settings, credentials, deployment settings, or other sensitive business settings.

Avoid custom authentication, storage, media processing, or admin infrastructure unless a simpler managed or Git-backed option cannot satisfy the workflow.

## Testing Workflow

After changes:

1. Review `git diff`.
2. Check `git status`.
3. Test every changed page.
4. Test mobile layouts, including a narrow viewport around 390px when practical.
5. Test navigation, forms, gallery, lightbox, booking CTAs, and WhatsApp links when relevant.
6. Check console errors when browser testing is available.
7. Check broken asset paths and missing media.
8. Confirm no unrelated design, copy, image, policy, price, package, or contact-detail changes were introduced.
9. Report every changed file and what changed in each one.
10. Explain what was tested and what could not be tested.

For mobile layout checks, confirm there is no horizontal overflow and that tap targets remain usable.

If one verification route is blocked, try another local route before stopping. For static pages, local file checks, a simple local server, browser DevTools, headless browser screenshots, DOM checks, and targeted `rg` searches are all valid depending on the task.

## Approval Required

Get explicit approval before:

1. Installing dependencies.
2. Adding frameworks, build tools, or paid services.
3. Changing hosting, DNS, redirects, deployment, or production configuration.
4. Creating API credentials, tokens, OAuth apps, or service accounts.
5. Changing prices, packages, policies, booking terms, cancellation terms, contact details, or business claims.
6. Deleting files.
7. Deleting, overwriting, compressing in place, or renaming original photographs or videos.
8. Committing.
9. Pushing.
10. Deploying.
11. Changing Meta advertising, analytics, tracking pixels, or conversion events.
12. Introducing a backend, database, authentication system, or admin service.
13. Making changes across more than five files, unless the task clearly requires it and the expected files were listed first.
14. Running a full repository audit, full browser automation suite, or multiple parallel agents.

If approval is needed, explain the reason, the expected impact, the safer alternative if any, and the exact action requested.

## Efficient Usage

Keep Codex usage focused and proportionate to the task.

1. Prefer targeted searches and specific file reads.
2. Do not produce long explanations unless requested.
3. Do not include full file contents or large diffs unless requested.
4. Do not propose unrelated improvements.
5. Stop when the requested task and relevant verification are complete.
6. For large tasks, divide implementation into small independently testable phases.
7. Warn before starting work that is likely to require broad repository analysis, multiple agents, extensive browser automation, or changes across many files.

Keep the final report concise and limited to:

1. What changed.
2. Files changed.
3. Tests performed.
4. Remaining risks.
5. Git status.

## Completion Checklist

Before finishing, report:

1. Files changed.
2. What changed in each file.
3. Business goal addressed.
4. Confirmation that unrelated design, layout, colours, fonts, copy, images, prices, packages, policies, and contact details were preserved unless explicitly requested.
5. Confirmation that original media assets were not deleted or overwritten.
6. Tests performed.
7. Mobile checks performed.
8. Navigation, form, gallery, lightbox, booking, tracking, or WhatsApp checks performed when relevant.
9. Console or asset-path checks performed when relevant.
10. Anything that could not be tested.
11. Current git status summary.
12. Confirmation that no commit, push, or deployment was performed unless explicitly requested.

## Correct Usage Examples

Use this skill for requests like:

- "Update the homepage WhatsApp booking links."
- "Fix the mobile gallery layout."
- "Add a booking enquiry form to the static site."
- "Improve SEO titles and descriptions for TLMK Studio."
- "Help build the image admin panel."
- "Check why the lightbox is broken."
- "Optimise gallery images without changing the originals."
- "Review the TLMK site before I deploy."
- "Create a Git branch for this TLMK website fix."
- "Make the booking workflow easier on mobile."

For a narrow content request, make only that content change and verify no unrelated content or design changed.

For a bug fix, reproduce or inspect the bug, patch the smallest affected area, and test the affected workflow.

For image admin planning, compare simple static-friendly or Git-backed options before proposing custom infrastructure.

## Actions Requiring Approval Examples

Ask before doing things like:

- "Install Netlify CMS, Decap CMS, Cloudinary, Firebase, Supabase, or another dependency or service."
- "Change the domain, hosting, DNS, redirects, or deployment target."
- "Create production API keys or connect a third-party account."
- "Change package prices, booking deposit terms, delivery timelines, or cancellation policies."
- "Delete old gallery images or replace originals with compressed versions."
- "Rename production image folders or public asset paths."
- "Commit these changes."
- "Push this branch."
- "Deploy to production."
- "Change Meta Pixel, Google Analytics, or conversion event setup."
