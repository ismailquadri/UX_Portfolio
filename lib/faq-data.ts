// "general" shows everywhere; "client" and "recruiter" let a page ask for
// just the subset most relevant to who's actually reading it (e.g. the
// contact page can lean client-focused, a case study page can lean
// recruiter-focused) once there's enough content to make that worth doing.
export type FaqAudience = "general" | "client" | "recruiter";

export type FaqItem = {
  question: string;
  answer: string;
  audience?: FaqAudience;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question:
      "How do you usually approach a new design project from start to finish?",
    answer:
      "Every project begins with clarity understanding your goals, target users, and the problem you’re solving. From there, I move into UX flow mapping, wireframing, and high-fidelity UI design. Once the concept feels right, I prototype interactions and collaborate with your team until everything aligns perfectly.",
    audience: "general",
  },
  {
    question: "Are you open to full-time roles, contract, or both right now?",
    answer:
      "Both — I evaluate opportunities on fit, not format. If the scope lets me own real product decisions and the trajectory makes sense, I'm open to full-time, contract, or fractional work.",
    audience: "recruiter",
  },
  {
    question:
      "What's your visa/work-authorization situation, and are you open to relocation?",
    answer:
      "I'm open to relocation, including roles that require visa sponsorship or a physical move, as long as the opportunity justifies it.",
    audience: "recruiter",
  },
  {
    question:
      "What seniority level and type of role are you targeting (IC, lead, head of design)?",
    answer:
      "Individual contributor. Right now I'm focused on hands-on product design — owning problems end-to-end — rather than a people-management track.",
    audience: "recruiter",
  },
  {
    question: "What's your notice period or earliest start date?",
    answer: "Two weeks.",
    audience: "recruiter",
  },
  {
    question: "What salary/rate range are you targeting?",
    answer:
      "It depends on the specifics of the role. Scope and level of ownership, company stage, industry, and whether compensation is structured as base-only or base plus equity/bonus all move the number meaningfully. Share the role details and I'll come back with a range that reflects the actual scope rather than a generic anchor.",
    audience: "recruiter",
  },
  {
    question:
      "Which industries or product types do you have the deepest experience in?",
    answer:
      "Fintech is where I've spent the most time and built the strongest track record. That said, I work well in any industry, including AI-enabled products — the core skill of turning ambiguity into a clear, usable product transfers across domains.",
    audience: "recruiter",
  },
];
