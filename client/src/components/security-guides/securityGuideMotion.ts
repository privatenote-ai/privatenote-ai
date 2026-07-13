export const SECURITY_GUIDE_REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;
