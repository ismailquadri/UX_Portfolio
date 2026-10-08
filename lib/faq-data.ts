export type FaqAudience = "general" | "client" | "recruiter";

export type FaqItem = {
  question: string;
  answer: string;
  audience?: FaqAudience;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do you approach a complex product problem?",
    answer:
      "I start by learning how the product is used, what the team needs to change, and what constraints shape the work. Then I focus on the workflow that matters most, explore options, and make the next decision clear.",
    audience: "general",
  },
  {
    question: "What product design problems can you help with?",
    answer:
      "I work on complex workflows, operational tools, role-based systems, and early products that need a clear first release. Depending on the need, that can include research, UX audits, product design, or prototyping.",
    audience: "client",
  },
  {
    question: "Can you work with an existing product team?",
    answer:
      "Yes. I work alongside product and engineering teams, making design decisions and handoffs clear as the work moves from problem framing to implementation.",
    audience: "client",
  },
  {
    question: "Are you open to full-time and contract roles?",
    answer:
      "Yes. I’m open to full-time, contract, and fractional opportunities. I’m most interested in hands-on product design where I can work through complex problems with a product team.",
    audience: "recruiter",
  },
  {
    question: "What kind of role are you looking for?",
    answer:
      "I’m looking for a hands-on product design role where I can take responsibility for product work and collaborate closely with product and engineering.",
    audience: "recruiter",
  },
  {
    question: "Are you open to relocation or visa sponsorship?",
    answer:
      "I’m based in Lagos, Nigeria, and open to relocation, including roles that require visa sponsorship, for the right opportunity.",
    audience: "recruiter",
  },
  {
    question: "When could you start?",
    answer: "My current notice period is two weeks.",
    audience: "recruiter",
  },
  {
    question: "What compensation are you looking for?",
    answer:
      "I consider compensation in context: role scope, location, and the total package. If you share the role’s range and details, I can confirm whether it fits.",
    audience: "recruiter",
  },
  {
    question: "Which industries do you know best?",
    answer:
      "FinTech is where I have the deepest experience. My portfolio also focuses on AI-native products, GovTech, and enterprise SaaS.",
    audience: "recruiter",
  },
];
