# Security Policy

Thank you for helping keep `repo-vitals` and its users safe.

## Supported versions

`repo-vitals` is pre-1.0; we support **only the latest minor** on `main`.
Once we ship 1.0 we will maintain the latest minor of the current major plus
the previous major.

| Version | Supported |
| ------- | :-------: |
| 0.1.x   |    ✅     |
| < 0.1   |    ❌     |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository instead:

1. Go to https://github.com/ikereliasvivar2026-pixel/repo-vitals/security
2. Click **Report a vulnerability**.
3. Include reproduction steps, the affected version, and the impact.

We aim to acknowledge new reports within **48 hours** and to ship a fix
within **30 days** of confirmation. Coordinated disclosure timelines are
negotiable when the impact is limited.

## Threat model

`repo-vitals` is a developer tool that runs locally against your repo. It
never makes network requests at scan time, never reads files outside the
target repo, and never executes user-provided code. The `fix` pipeline only
writes templated files we ship in the source tree — see
`src/fix/templates.ts`.
