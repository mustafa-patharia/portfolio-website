/**
 * Resume region mapping — each entry maps an ISO country code to a region-specific PDF.
 * Add new PDFs to /public/resumes/ and register them here.
 */
export const RESUME_MAP: Record<string, { label: string; file: string }> = {
  IN: { label: "India", file: "/resumes/resume-india.pdf" },
  AE: { label: "UAE", file: "/resumes/resume-uae.pdf" },
  AU: { label: "Australia", file: "/resumes/resume-au.pdf" },
  NZ: { label: "New Zealand", file: "/resumes/resume-nz.pdf" },
  SG: { label: "Singapore", file: "/resumes/resume-sg.pdf" },
  MY: { label: "Malaysia", file: "/resumes/resume-my.pdf" },
};

export const DEFAULT_RESUME = {
  label: "International",
  file: "/resumes/resume-international.pdf",
};
