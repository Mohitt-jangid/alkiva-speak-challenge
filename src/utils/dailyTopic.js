// ============================================================
// Daily Topic & Challenge Selection — Deterministic, IST
// ============================================================

// ---- 30 Speaking Topics ----
const SPEAKING_TOPICS = [
  "Is alcohol more harmful than beneficial?",
  "What is your favorite movie and why?",
  "Why is mob lynching a serious threat to society?",
  "Is casteism still a major problem in India?",
  "How does going to the gym benefit our lives?",
  "Does religion unite people or divide them?",
  "Why is corruption a major problem in our country?",
  "Which is more important — sports or education?",
  "Which is more valuable — knowledge or money?",
  "Is failure necessary for achieving success?",
  "Why is it so difficult to leave our comfort zone?",
  "Is overthinking useful or harmful?",
  "What is more important — motivation or discipline?",
  "Can failure actually make a person successful?",
  "What would you do if you became invisible for one day?",
  "What would happen if everyone told the truth for 24 hours?",
  "What would you do if you could travel back in time?",
  "Should everyone learn how to manage money?",
  "Is having many friends better than having a few close friends?",
  "What makes a person truly successful?",
  "What does success really mean?",
  "What is one lesson you learned the hard way?",
  "What is more important — talent or hard work?",
  "Should we follow our passion or choose a stable career?",
  "What is your biggest fear, and how can people overcome fear?",
  "What would your ideal life look like?",
  "What is one habit that can change a person's life?",
  "Is being busy the same as being productive?",
  "How do small daily decisions shape our future?",
  "What would you tell your younger self?",
];

// ---- 25 Real-Life Challenges ----
export const REAL_LIFE_CHALLENGES = [
  {
    title: "Make a Complete Day Vlog in English",
    description: "Record your day naturally and explain what you are doing, thinking, and experiencing. Capture real moments — not staged perfection.",
    category: "Experience",
    difficulty: "Medium",
    duration: "Full Day",
  },
  {
    title: "Give a Speech in Front of People",
    description: "Speak for 2–5 minutes in front of your friends, family, or classmates about any topic. No slides, no script — just you and your thoughts.",
    category: "Comfort Zone",
    difficulty: "Hard",
    duration: "10–30 Minutes",
  },
  {
    title: "Go Somewhere Alone",
    description: "Visit a new place alone and handle the experience yourself — planning, decisions, and activities. Discover what it feels like to rely only on yourself.",
    category: "Independence",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Spend 24 Hours Without Social Media",
    description: "Disconnect from Instagram, YouTube Shorts, Facebook, and other social media platforms for one day. At the end, reflect on what changed and what you learned.",
    category: "Digital Detox",
    difficulty: "Medium",
    duration: "24 Hours",
  },
  {
    title: "Learn Something Completely New in One Day",
    description: "Choose something you have never done before — a skill, recipe, exercise, creative activity, or practical task. Learn it and achieve something by the end of the day.",
    category: "Learning",
    difficulty: "Medium",
    duration: "One Day",
  },
  {
    title: "Start a Conversation With Someone You Normally Don't Talk To",
    description: "Start a genuine conversation with a classmate, neighbour, acquaintance, or someone already in your environment whom you normally do not talk to.",
    category: "Comfort Zone",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Do Something You've Been Postponing",
    description: "Choose one important task you have been avoiding for a long time. Stop waiting for the perfect time and complete it today.",
    category: "Discipline",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Explore a New Place",
    description: "Choose a safe place or area you have not explored properly. Go there and discover something new about your surroundings.",
    category: "Exploration",
    difficulty: "Easy",
    duration: "Flexible",
  },
  {
    title: "Record One Video Without Preparation or Retakes",
    description: "Choose a topic, press record, and speak without stopping, restarting, editing, or deleting mistakes. Raw, unfiltered, real.",
    category: "Confidence",
    difficulty: "Hard",
    duration: "5–10 Minutes",
  },
  {
    title: "Watch the Sunrise",
    description: "Wake up early enough to watch the sunrise. Avoid using your phone during the experience. Simply observe your surroundings and spend some time thinking.",
    category: "Experience",
    difficulty: "Easy",
    duration: "Morning",
  },
  {
    title: "Change Your Routine for One Day",
    description: "Take a different route, try a new activity, change your schedule, or spend your free time differently. The goal is to break automatic habits.",
    category: "Personal Growth",
    difficulty: "Easy",
    duration: "One Day",
  },
  {
    title: "Finish What You Started",
    description: "Choose an unfinished task, project, book, course, or activity. Make meaningful progress and avoid abandoning it halfway.",
    category: "Discipline",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "The No Excuses Challenge",
    description: "Choose something you usually avoid because you feel lazy, tired, scared, or unmotivated. Do it today without making excuses.",
    category: "Discipline",
    difficulty: "Hard",
    duration: "One Day",
  },
  {
    title: "Learn and Teach",
    description: "Learn something you currently do not understand. Then explain it clearly to a friend, family member, classmate, or the camera. The goal is to understand it well enough to teach it.",
    category: "Learning",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Spend One Day Without Entertainment Content",
    description: "Avoid unnecessary entertainment — scrolling, short videos, binge-watching, and gaming. Use the extra time to do something meaningful.",
    category: "Digital Detox",
    difficulty: "Hard",
    duration: "One Day",
  },
  {
    title: "Create Something From Start to Finish",
    description: "Create something completely from start to finish — a website, drawing, video, presentation, useful tool, or written piece. Start with nothing. Finish with something.",
    category: "Creativity",
    difficulty: "Hard",
    duration: "One Day",
  },
  {
    title: "Go Out Alone Without Constantly Using Your Phone",
    description: "Go outside alone for coffee, food, a walk, or another activity. Avoid spending the entire time scrolling on your phone. Observe your surroundings.",
    category: "Independence",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Spend Meaningful Time With Someone You Know",
    description: "Spend time with a family member or friend. Ask them about an important experience or memory from their life. Listen carefully and reflect on what you learned.",
    category: "Experience",
    difficulty: "Easy",
    duration: "Flexible",
  },
  {
    title: "The Long Walk Exploration Challenge",
    description: "Go for a long walk and explore areas you normally ignore. Do not focus only on reaching a destination. Pay attention to your surroundings.",
    category: "Exploration",
    difficulty: "Easy",
    duration: "Flexible",
  },
  {
    title: "Make One Decision You've Been Avoiding",
    description: "Choose one decision you have been overthinking. Think about it reasonably and then take action instead of waiting for perfect certainty.",
    category: "Comfort Zone",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Start Your Day Without Your Phone",
    description: "Do not check your phone for the first few hours after waking up. Complete your morning routine before consuming any content.",
    category: "Discipline",
    difficulty: "Medium",
    duration: "Morning",
  },
  {
    title: "Deep Focus Session",
    description: "Choose one important task. Work on it with complete focus without checking social media, notifications, or unrelated content for 1–3 hours.",
    category: "Discipline",
    difficulty: "Medium",
    duration: "1–3 Hours",
  },
  {
    title: "Do Something Without Trying to Make It Perfect",
    description: "Choose something you usually overthink or delay because you want it to be perfect. Complete it without constantly correcting or restarting.",
    category: "Comfort Zone",
    difficulty: "Medium",
    duration: "Flexible",
  },
  {
    title: "Become a Creator for One Day",
    description: "Spend one day creating instead of only consuming content. Create something meaningful and finish it before the day ends.",
    category: "Creativity",
    difficulty: "Hard",
    duration: "One Day",
  },
  {
    title: "Run a Personal Experiment",
    description: "Choose one habit and change it for the day — no phone during meals, no complaining, no unnecessary scrolling, no procrastination. At the end, reflect on what changed.",
    category: "Self-Discovery",
    difficulty: "Medium",
    duration: "One Day",
  },
];

// ---- Hash Function ----
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---- IST Date ----
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

// ---- Public API ----

export function getDailyTopic() {
  const { year, month, day } = getISTDate();
  const dateKey = `${year}-${month}-${day}`;
  const index = hashString(dateKey) % SPEAKING_TOPICS.length;
  return { topic: SPEAKING_TOPICS[index], date: { year, month, day }, index };
}

export function getDailyChallenge() {
  const { year, month, day } = getISTDate();
  const dateKey = `real-life-challenge-${year}-${month}-${day}`;
  const index = hashString(dateKey) % REAL_LIFE_CHALLENGES.length;
  return { challenge: REAL_LIFE_CHALLENGES[index], index };
}

export function formatDisplayDate() {
  const { year, month, day } = getISTDate();
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];
  return `${day} ${months[month - 1]} ${year}`;
}
