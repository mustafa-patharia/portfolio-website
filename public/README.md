# Image drop folder

Drop files in with these **exact names**. Anything you don't add falls back
automatically to the generated gradient art — nothing breaks, no code changes.

`.jpg`, `.png`, and `.webp` all work: the card tries `.jpg` → `.png` → `.webp`
→ generated art, in that order.

## `public/projects/` — client work cards

Wide cards. Best around **1600×1100** (4:3-ish). The `n8n-po-workflow` card is
the full-width banner, so give it something wide — **1920×560**.

| File | Card |
|---|---|
| `infithra` | Infithra — HRMS Platform |
| `smartscan` | SmartScan |
| `promax-global` | Promax Global |
| `odoo-netsuite-pos` | Odoo–NetSuite POS |
| `n8n-po-workflow` | n8n PO Workflow (wide banner) |

## `public/personal/` — personal project rows

Small circular thumbnails. **400×400 square**, subject centered.

| File | Row |
|---|---|
| `rift` | Rift Music Player |
| `proofhub-task-timer` | ProofHub Task Timer |
| `mattergrid` | MatterGrid |

## `public/` — root

| File | Used for |
|---|---|
| `profile` | Your photo. Not wired into the page yet — say the word and I'll place it. |
| `og.png` | Social share preview, 1200×630. Also not wired yet. |

## Notes

- Screenshots read better on these dark cards with a little breathing room —
  a full-bleed browser screenshot tends to look cramped. Padding around the UI
  helps.
- Cards darken and blur on hover to show the description, so fine detail in the
  screenshot doesn't need to survive the hover state.
