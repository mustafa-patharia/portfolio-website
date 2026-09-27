/**
 * Built-but-unreleased parts of the Promax Global site. Each flag hides its
 * sections, bento tiles, role points and stack chips on the case study, and the
 * extra line in the case-study card and AI context. Flip to `true` the day that
 * part goes live on the client's site — nothing else needs editing.
 *
 *   cms    — Payload CMS for the Insights blog (branch feature/cms)
 *   arabic — English + Arabic with full RTL (branch feat/i18n-en-ar-rtl)
 */
export const RELEASES = {
  cms: false,
  arabic: false,
} as const;

export type Release = keyof typeof RELEASES;
