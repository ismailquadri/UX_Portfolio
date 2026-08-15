export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    role: "user",
    content:
      "Hey Quadri, I came across your profile, your design work looks solid! Could you tell me more about the services you offer?",
    timestamp: "2 Mins Ago",
  },
  {
    id: "seed-2",
    role: "assistant",
    content:
      "Hey! Thanks a lot, I appreciate that. I focus on product design, mainly UI/UX for web and mobile apps. I also help with user flow optimization, design systems, and clickable prototypes.",
    timestamp: "2 Mins Ago",
  },
  {
    id: "seed-3",
    role: "user",
    content: "What's your usual process if we start a project?",
    timestamp: "Just Now",
  },
];
