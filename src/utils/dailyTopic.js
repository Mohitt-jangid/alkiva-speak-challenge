// ============================================================
// Daily Topic & Challenge Selection — 21 Structured Topics
// One Day = One Topic (Cycles through Psychology, Science, Productivity, Tech)
// ============================================================

export const DAILY_TOPICS = [
  // 🧠 Psychology and Mind
  {
    id: 1,
    title: "Cognitive Biases",
    category: "Psychology and Mind",
    prompt: "Explain how subconscious cognitive shortcuts like confirmation bias or availability heuristic affect human decision making, and how to stay objective.",
  },
  {
    id: 2,
    title: "Dopamine Detox",
    category: "Psychology and Mind",
    prompt: "Discuss how constant digital stimulation impacts focus and motivation, and why resetting your baseline dopamine receptors builds deep focus.",
  },
  {
    id: 3,
    title: "Flow State",
    category: "Psychology and Mind",
    prompt: "Describe the psychological phenomenon of peak immersion and effortless focus, and how individuals can design their routine to enter flow regularly.",
  },
  {
    id: 4,
    title: "Imposter Syndrome",
    category: "Psychology and Mind",
    prompt: "Analyze why high achievers often doubt their accomplishments and feel like frauds, and discuss practical strategies to overcome this mindset.",
  },
  {
    id: 5,
    title: "Habits and Behavior Change",
    category: "Psychology and Mind",
    prompt: "Break down the habit loop (cue, craving, response, reward) and explain how small 1% daily changes compound into major long-term transformations.",
  },

  // 🚀 Science and Space
  {
    id: 6,
    title: "The Fermi Paradox",
    category: "Science and Space",
    prompt: "If billions of Earth-like planets exist, where is everybody? Explain the contradiction between high extraterrestrial probability and lack of evidence.",
  },
  {
    id: 7,
    title: "Quantum Entanglement",
    category: "Science and Space",
    prompt: "Explain Einstein's 'spooky action at a distance' where entangled particles instantaneously affect each other regardless of physical separation distance.",
  },
  {
    id: 8,
    title: "Time Dilation",
    category: "Science and Space",
    prompt: "Discuss how speed and gravitational fields slow down time according to relativity theory, and what this implies for space exploration.",
  },
  {
    id: 9,
    title: "Dark Matter and Dark Energy",
    category: "Science and Space",
    prompt: "Explain the mysterious forces that make up 95% of the universe's mass-energy budget while remaining invisible to modern telescopes.",
  },
  {
    id: 10,
    title: "CRISPR and Gene Editing",
    category: "Science and Space",
    prompt: "Discuss the revolutionary gene-editing technology, its medical potential for curing genetic diseases, and the ethical boundaries humanity must set.",
  },

  // ⚡ Productivity and Life Skills
  {
    id: 11,
    title: "The Pomodoro Technique",
    category: "Productivity and Life Skills",
    prompt: "Break down the 25-minute sprint strategy for maintaining intense focus, preventing mental burnout, and boosting daily output.",
  },
  {
    id: 12,
    title: "Minimalism",
    category: "Productivity and Life Skills",
    prompt: "Explore how intentionally eliminating physical, mental, and digital clutter creates freedom, clarity, and intentional living.",
  },
  {
    id: 13,
    title: "Compound Effect",
    category: "Productivity and Life Skills",
    prompt: "Explain how small, smart choices executed consistently over long periods yield massive exponential returns in health, wealth, and skills.",
  },
  {
    id: 14,
    title: "Stoicism",
    category: "Productivity and Life Skills",
    prompt: "Discuss the ancient philosophy of controlling what you can, accepting what you cannot, and transforming adversity into fuel for personal growth.",
  },
  {
    id: 15,
    title: "Speed Reading",
    category: "Productivity and Life Skills",
    prompt: "Explain the techniques for increasing reading speed and comprehension through visual pacing, eliminating subvocalization, and active scanning.",
  },

  // 🤖 Technology and Future
  {
    id: 16,
    title: "Artificial Intelligence and Ethics",
    category: "Technology and Future",
    prompt: "Debate the societal impact of generative AI, algorithmic bias, job displacement, and the responsibility of developers to align AI with human values.",
  },
  {
    id: 17,
    title: "Deepfakes and Digital Trust",
    category: "Technology and Future",
    prompt: "Analyze the rise of synthetic media, hyper-realistic voice and video clones, and how society can protect truth and security in the digital age.",
  },
  {
    id: 18,
    title: "Neuralink and Brain-Computer Interfaces",
    category: "Technology and Future",
    prompt: "Explore direct communication between the human brain and external computers, its medical potential, and future human augmentation implications.",
  },
  {
    id: 19,
    title: "Blockchain Beyond Cryptocurrency",
    category: "Technology and Future",
    prompt: "Examine how decentralized, tamper-proof digital ledgers can transform supply chains, voting integrity, digital identity, and smart contracts.",
  },
  {
    id: 20,
    title: "Cryptocurrency",
    category: "Technology and Future",
    prompt: "Discuss decentralized digital currencies, peer-to-peer financial systems, inflation hedges, and the global economic implications of crypto adoption.",
  },
  {
    id: 21,
    title: "The Metaverse",
    category: "Technology and Future",
    prompt: "Describe persistent, interconnected 3D virtual spaces and evaluate whether immersive spatial computing will replace traditional 2D web interfaces.",
  },
];

// Array of simple topic titles for quick index access
export const SPEAKING_TOPICS = DAILY_TOPICS.map(t => t.title);

// ---- IST Date Calculation ----
function getISTDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;
  return { year: +year, month: +month, day: +day };
}

// ---- Calculate Day Index (1 Topic Per Day) ----
function getDayOfYear(year, month, day) {
  const start = new Date(year, 0, 0);
  const current = new Date(year, month - 1, day);
  const diff = current - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// ---- Public API ----

export function getDailyTopic() {
  const { year, month, day } = getISTDate();
  const dayOfYear = getDayOfYear(year, month, day);
  // Exactly 1 topic per day, rotating through the 21 topics
  const index = (dayOfYear - 1) % DAILY_TOPICS.length;
  const item = DAILY_TOPICS[index];
  return {
    topic: item.title,
    category: item.category,
    prompt: item.prompt,
    id: item.id,
    date: { year, month, day },
    index,
  };
}

export function formatDisplayDate() {
  const { year, month, day } = getISTDate();
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];
  return `${day} ${months[month - 1]} ${year}`;
}
