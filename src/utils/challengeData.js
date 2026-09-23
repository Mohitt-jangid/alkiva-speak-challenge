/**
 * challengeData.js — 100-Day English Speaking Challenge Content
 *
 * Structured per the master prompt:
 * Days 1-20: Speaking Automaticity
 * Days 21-40: Fluency + Pronunciation
 * Days 41-60: Thinking in English
 * Days 61-80: Advanced Communication
 * Days 81-100: Advanced Spontaneous Speaking
 *
 * Each day has 5 core challenges + metadata.
 */

export const PHASES = [
  { range: [1, 20], label: 'Speaking Automaticity', goal: 'Stop freezing. Start speaking.', icon: '🗣️' },
  { range: [21, 40], label: 'Fluency + Pronunciation', goal: 'Speak more smoothly and clearly.', icon: '🎯' },
  { range: [41, 60], label: 'Thinking in English', goal: 'Reduce mental translation.', icon: '🧠' },
  { range: [61, 80], label: 'Advanced Communication', goal: 'Organized, intelligent communication.', icon: '💎' },
  { range: [81, 100], label: 'Advanced Spontaneous Speaking', goal: 'Think and communicate under pressure.', icon: '⚡' },
];

export function getPhaseForDay(day) {
  return PHASES.find((p) => day >= p.range[0] && day <= p.range[1]) || PHASES[0];
}

export const RESCUE_PHRASES = [
  "Let me think for a second.",
  "What I mean is…",
  "The first thing that comes to mind is…",
  "There are a few things I would say about that.",
  "I'm not sure how to explain it, but…",
  "Let me put it another way.",
  "What I'm trying to say is…",
  "That's an interesting question. Let me think about it.",
  "I think…",
  "The main reason is…",
  "For example…",
  "So overall…",
];

/**
 * Day challenges. Each day has:
 * - title: Day theme
 * - duration: Suggested total time
 * - challenges: Array of 5 core challenges
 * - warmup: Quick warmup exercise
 * - tip: Speaking tip for the day
 */
export const DAY_CHALLENGES = {
  1: {
    title: 'Your First Words',
    duration: '15–20 min',
    warmup: 'Take 5 deep breaths. Say "I am going to speak English today" out loud 3 times.',
    tip: "Don't try to be perfect. Just start. Mistakes are part of the process.",
    challenges: [
      {
        id: 1,
        type: 'Speaking',
        title: 'Introduce Yourself',
        description: 'Speak for 30 seconds: "My name is… I am from… I currently… I want to improve my English because… My biggest problem when speaking English is…"',
        duration: '30 sec',
        icon: '🗣️',
      },
      {
        id: 2,
        type: 'Speaking',
        title: 'Your Future Self',
        description: 'Speak for 30 seconds: "What kind of person do I want to become?"',
        duration: '30 sec',
        icon: '💭',
      },
      {
        id: 3,
        type: 'Speaking',
        title: 'English & Your Life',
        description: 'Speak for 30 seconds: "What would change in my life if I became confident in English?"',
        duration: '30 sec',
        icon: '🌟',
      },
      {
        id: 4,
        type: 'Rescue Phrases',
        title: 'Use Rescue Phrases',
        description: 'Practice speaking about any topic. When you feel stuck, use at least 3 rescue phrases: "Let me think for a second…", "What I mean is…", "The first thing that comes to mind is…"',
        duration: '2 min',
        icon: '🛟',
      },
      {
        id: 5,
        type: 'Articulation',
        title: 'Read Aloud',
        description: 'Read this paragraph aloud slowly and clearly, focusing on every word ending: "Every morning, I wake up and think about my goals. I want to speak English clearly and confidently. Today is the first day of my challenge. I will not give up."',
        duration: '2 min',
        icon: '📖',
      },
    ],
  },
  2: {
    title: 'Describing Your World',
    duration: '15–20 min',
    warmup: 'Look around your room. Name 10 objects in English out loud as fast as you can.',
    tip: 'If you don\'t know a word, describe it: "It\'s the thing that…"',
    challenges: [
      {
        id: 1,
        type: 'Speaking',
        title: 'Describe Your Room',
        description: 'Speak for 45 seconds describing your room. What do you see? What colors? What objects? Use sentences, not just words.',
        duration: '45 sec',
        icon: '🏠',
      },
      {
        id: 2,
        type: 'Speaking',
        title: 'Your Morning Routine',
        description: 'Speak for 45 seconds about what you do every morning. Step by step. "First I wake up. Then I…"',
        duration: '45 sec',
        icon: '☀️',
      },
      {
        id: 3,
        type: 'Speaking',
        title: 'Your Favorite Food',
        description: 'Speak for 30 seconds: Describe your favorite food. What does it look like? How does it taste? Why do you like it?',
        duration: '30 sec',
        icon: '🍕',
      },
      {
        id: 4,
        type: 'Rescue Phrases',
        title: 'Thinking Out Loud',
        description: 'Pick any object near you. Speak about it for 1 minute. Every time you pause, use a rescue phrase to continue: "What I\'m trying to say is…", "Let me put it another way…"',
        duration: '1 min',
        icon: '🛟',
      },
      {
        id: 5,
        type: 'Pronunciation',
        title: 'TH Sound Practice',
        description: 'Practice the TH sound. Tongue tip between teeth! Repeat 5 times each: "Think, Thank, Three, Through, Thursday, The, This, That, There, They"',
        duration: '3 min',
        icon: '👅',
      },
    ],
  },
  3: {
    title: 'Telling Simple Stories',
    duration: '15–20 min',
    warmup: 'Say 5 sentences about what you did yesterday. Speak naturally — don\'t write first.',
    tip: 'Use past tense: "I went, I ate, I saw." Don\'t worry about mistakes yet.',
    challenges: [
      {
        id: 1,
        type: 'Speaking',
        title: 'Yesterday\'s Story',
        description: 'Speak for 1 minute about what you did yesterday. Start with "Yesterday, I woke up and…" Try to tell it like a story.',
        duration: '1 min',
        icon: '📅',
      },
      {
        id: 2,
        type: 'Speaking',
        title: 'A Childhood Memory',
        description: 'Speak for 45 seconds about one memory from your childhood. Keep it simple. "When I was young…"',
        duration: '45 sec',
        icon: '👶',
      },
      {
        id: 3,
        type: 'Speaking',
        title: 'If I Had a Superpower',
        description: 'Speak for 45 seconds: "If I could have any superpower, I would choose… because…"',
        duration: '45 sec',
        icon: '🦸',
      },
      {
        id: 4,
        type: 'Vocabulary',
        title: 'Chunks Practice',
        description: 'Learn and use these chunks in sentences: "I had the opportunity to…", "The reason I like it is…", "What surprised me was…". Create 2 sentences with each chunk and say them aloud.',
        duration: '3 min',
        icon: '📚',
      },
      {
        id: 5,
        type: 'Articulation',
        title: 'Word Endings',
        description: 'Read aloud clearly, emphasizing every word ENDING: "I walked to the market and talked to my friend. We discussed different topics and learned many things."',
        duration: '2 min',
        icon: '🔤',
      },
    ],
  },
  4: {
    title: 'Personal Opinions',
    duration: '15–25 min',
    warmup: 'Complete these sentences aloud: "I think… I believe… In my opinion…" (3 different topics)',
    tip: 'Structure: "I think [opinion] because [reason]. For example, [example]."',
    challenges: [
      {
        id: 1,
        type: 'Speaking',
        title: 'Morning vs Night',
        description: 'Speak for 1 minute: "Are you a morning person or a night person? Why?" Give your opinion with at least one reason and one example.',
        duration: '1 min',
        icon: '🌅',
      },
      {
        id: 2,
        type: 'Speaking',
        title: 'Best Day of the Week',
        description: 'Speak for 1 minute: "What is your favorite day of the week and why?" Explain what you usually do on that day.',
        duration: '1 min',
        icon: '📆',
      },
      {
        id: 3,
        type: 'Speaking',
        title: 'Phone vs Books',
        description: 'Speak for 45 seconds: "Do you prefer reading on your phone or reading physical books? Why?"',
        duration: '45 sec',
        icon: '📱',
      },
      {
        id: 4,
        type: 'Pronunciation',
        title: 'V and W Sounds',
        description: 'V = upper teeth on lower lip. W = round lips. Repeat 5x: "Very Well, Vine Wine, Vest West, Veil Whale, Vet Wet." Then say: "The very wet weather was a valid worry."',
        duration: '3 min',
        icon: '👄',
      },
      {
        id: 5,
        type: 'Rescue Phrases',
        title: 'Emergency Framework',
        description: 'Practice the emergency structure: Step 1: "That\'s a good question…" Step 2: "I think…" Step 3: "The reason is…" Step 4: "For example…" Step 5: "So overall…" Answer: "Is social media good or bad?"',
        duration: '3 min',
        icon: '🛟',
      },
    ],
  },
  5: {
    title: 'Explain Like I\'m 5',
    duration: '15–25 min',
    warmup: 'Explain what a "phone" is to someone who has never seen one. Use simple words only.',
    tip: 'When you don\'t know a word, use circumlocution: "It\'s something that…", "It\'s like a…"',
    challenges: [
      {
        id: 1,
        type: 'Speaking',
        title: 'Explain Your Job/Studies',
        description: 'Speak for 1 minute: Explain what you do (job or studies) as simply as possible. Imagine explaining to a child.',
        duration: '1 min',
        icon: '💼',
      },
      {
        id: 2,
        type: 'Speaking',
        title: 'Explain a Sport',
        description: 'Speak for 1 minute: Pick any sport you know. Explain the rules to someone who has never seen it.',
        duration: '1 min',
        icon: '⚽',
      },
      {
        id: 3,
        type: 'Speaking',
        title: 'How to Make Tea/Coffee',
        description: 'Speak for 1.5 minutes: Explain step by step how to make your favorite drink. Use sequence words: "First… Then… After that… Finally…"',
        duration: '1.5 min',
        icon: '☕',
      },
      {
        id: 4,
        type: 'Shadowing',
        title: 'Shadow This Passage',
        description: 'Read aloud and then immediately repeat from memory: "Learning English is not about being perfect. It is about progress. Every day you speak, you get a little better. The key is consistency."',
        duration: '3 min',
        icon: '🎧',
      },
      {
        id: 5,
        type: 'Vocabulary',
        title: 'Describing Without the Word',
        description: 'Describe these words WITHOUT using the word itself: 1) "Hospital" 2) "Teacher" 3) "Airport". Speak your descriptions aloud.',
        duration: '3 min',
        icon: '🔍',
      },
    ],
  },
  6: {
    title: 'Daily Routines Deep Dive',
    duration: '20–25 min',
    warmup: 'Count from 1 to 20 in English as clearly and slowly as possible. Focus on each number.',
    tip: 'Use time markers: "In the morning…", "After lunch…", "By the evening…"',
    challenges: [
      {
        id: 1, type: 'Speaking', title: 'Your Evening Routine', icon: '🌙',
        description: 'Speak for 1.5 minutes about what you do every evening after work/study. Include details about dinner, relaxation, and when you sleep.',
        duration: '1.5 min',
      },
      {
        id: 2, type: 'Speaking', title: 'Weekend vs Weekday', icon: '📊',
        description: 'Speak for 1 minute: How is your weekend different from your weekday? Compare the two.',
        duration: '1 min',
      },
      {
        id: 3, type: 'Speaking', title: 'Your Ideal Day', icon: '✨',
        description: 'Speak for 1 minute: Describe your perfect ideal day from morning to night. What would you do?',
        duration: '1 min',
      },
      {
        id: 4, type: 'Pronunciation', title: 'S vs Z Sounds', icon: '👅',
        description: 'S = voiceless (hiss). Z = voiced (buzz). Repeat: "Bus Buzz, Rice Rise, Price Prize, Peace Peas, Ice Eyes." Say: "She sees the seas and seizes the breeze."',
        duration: '3 min',
      },
      {
        id: 5, type: 'Articulation', title: 'Speed Control', icon: '🔤',
        description: 'Read this sentence 3 times: slow, normal, then fast — but ALWAYS clear: "I regularly go to the grocery store to buy fresh fruits and vegetables for my family."',
        duration: '3 min',
      },
    ],
  },
  7: {
    title: '🏆 Week 1 Review',
    duration: '25–30 min',
    warmup: 'Without thinking, answer: "How are you today?" — speak for 30 seconds without stopping.',
    tip: 'This is your first weekly checkpoint. Be honest about your progress.',
    challenges: [
      {
        id: 1, type: 'Speaking', title: 'Week 1 Reflection', icon: '📝',
        description: 'Speak for 2 minutes: What did you learn this week? What was the hardest challenge? What surprised you about your English?',
        duration: '2 min',
      },
      {
        id: 2, type: 'Speaking', title: 'Teach Someone', icon: '🎓',
        description: 'Speak for 1.5 minutes: Pretend you\'re teaching a friend what "rescue phrases" are. Explain what they are and give 3 examples.',
        duration: '1.5 min',
      },
      {
        id: 3, type: 'Speaking', title: 'Impromptu Answer', icon: '⏱️',
        description: 'No preparation. Answer immediately: "What is the most important thing in life and why?" Speak for 1 minute.',
        duration: '1 min',
      },
      {
        id: 4, type: 'Vocabulary', title: 'Use This Week\'s Chunks', icon: '📚',
        description: 'Use ALL of these in one story: "I had the opportunity to…", "What surprised me was…", "The reason I like it is…", "In my opinion…". Tell a story using all 4.',
        duration: '3 min',
      },
      {
        id: 5, type: 'Pronunciation', title: 'Record & Compare', icon: '🎙️',
        description: 'Record yourself reading: "I am on day seven of my English speaking challenge. Every day I practice, I become a little bit more confident." Listen back. Notice your pronunciation.',
        duration: '3 min',
      },
    ],
  },
};

/**
 * Get the challenge for a specific day number.
 * For days not explicitly defined, generates a dynamic challenge.
 */
export function getDayChallenge(dayNumber) {
  if (DAY_CHALLENGES[dayNumber]) {
    return DAY_CHALLENGES[dayNumber];
  }

  // Generate dynamic challenges for days 8+
  const phase = getPhaseForDay(dayNumber);
  const dayInPhase = dayNumber - phase.range[0] + 1;
  const totalInPhase = phase.range[1] - phase.range[0] + 1;
  const isWeeklyReview = dayNumber % 7 === 0;

  if (isWeeklyReview) {
    const weekNum = Math.floor(dayNumber / 7);
    return {
      title: `🏆 Week ${weekNum} Review`,
      duration: '25–30 min',
      warmup: 'Without any preparation, speak for 1 minute about anything that comes to mind. Don\'t stop.',
      tip: `Week ${weekNum} checkpoint. Reflect honestly on your progress.`,
      challenges: [
        {
          id: 1, type: 'Speaking', title: `Week ${weekNum} Reflection`, icon: '📝',
          description: `Speak for ${Math.min(2 + weekNum, 5)} minutes: What improved this week? What\'s still difficult? What will you focus on next week?`,
          duration: `${Math.min(2 + weekNum, 5)} min`,
        },
        {
          id: 2, type: 'Speaking', title: 'Impromptu Test', icon: '⏱️',
          description: `No preparation. Speak for ${Math.min(1 + Math.floor(dayNumber / 10), 5)} minutes about a topic you\'ve never discussed before: "${getRandomTopic(dayNumber)}"`,
          duration: `${Math.min(1 + Math.floor(dayNumber / 10), 5)} min`,
        },
        {
          id: 3, type: 'Pronunciation', title: 'Clarity Check', icon: '🎙️',
          description: 'Record yourself speaking for 1 minute about your day. Listen back. Rate your own clarity from 1-10.',
          duration: '3 min',
        },
        {
          id: 4, type: 'Vocabulary', title: 'Chunk Review', icon: '📚',
          description: 'Use 5 phrases/chunks you learned this week in new sentences. Say them aloud.',
          duration: '3 min',
        },
        {
          id: 5, type: 'Confidence', title: 'Longest Speaking', icon: '💪',
          description: `Try to speak for ${Math.min(3 + Math.floor(dayNumber / 7), 10)} minutes straight about "${getRandomTopic(dayNumber + 50)}". Don\'t stop. Use rescue phrases when stuck.`,
          duration: `${Math.min(3 + Math.floor(dayNumber / 7), 10)} min`,
        },
      ],
    };
  }

  // Regular day
  const speakingDuration = Math.min(30 + dayNumber * 3, 300); // 30s up to 5min
  const speakingLabel = speakingDuration >= 60
    ? `${Math.round(speakingDuration / 60 * 10) / 10} min`
    : `${speakingDuration} sec`;

  const topics = getDayTopics(dayNumber);

  return {
    title: `Day ${dayNumber} — ${phase.label}`,
    duration: `${Math.min(15 + dayNumber, 45)}–${Math.min(25 + dayNumber, 60)} min`,
    warmup: getWarmup(dayNumber),
    tip: getTip(dayNumber),
    challenges: [
      {
        id: 1, type: 'Speaking', title: topics[0].title, icon: '🗣️',
        description: topics[0].description,
        duration: speakingLabel,
      },
      {
        id: 2, type: 'Speaking', title: topics[1].title, icon: '💬',
        description: topics[1].description,
        duration: speakingLabel,
      },
      {
        id: 3, type: topics[2].type, title: topics[2].title, icon: topics[2].icon,
        description: topics[2].description,
        duration: '3 min',
      },
      {
        id: 4, type: 'Pronunciation', title: getPronunciationDrill(dayNumber).title, icon: '👄',
        description: getPronunciationDrill(dayNumber).description,
        duration: '3 min',
      },
      {
        id: 5, type: 'Vocabulary', title: 'Chunks & Phrases', icon: '📖',
        description: getVocabChallenge(dayNumber),
        duration: '3 min',
      },
    ],
  };
}

// ─── HELPER GENERATORS ─────────────────────────────────

const TOPICS_POOL = [
  // Personal (Days 1-20)
  { title: 'Describe Your Best Friend', description: 'Describe your best friend. What do they look like? What is their personality? Why are you friends?' },
  { title: 'Your Hometown', description: 'Describe your hometown. What is it famous for? What do you like and dislike about it?' },
  { title: 'A Difficult Decision', description: 'Talk about a time you had to make a difficult decision. What did you decide? Why?' },
  { title: 'Your Biggest Fear', description: 'What is something you are afraid of? Why? How do you handle this fear?' },
  { title: 'Dream Vacation', description: 'Describe your dream vacation. Where would you go? What would you do? Who would you take?' },
  { title: 'Technology in Your Life', description: 'How has technology changed your daily life? Give specific examples.' },
  { title: 'A Person You Admire', description: 'Talk about someone you admire. Who are they? What qualities do they have? Why do you look up to them?' },
  { title: 'Your Learning Style', description: 'How do you learn best? Do you prefer reading, watching, listening, or doing? Give examples.' },
  { title: 'A Mistake That Taught You', description: 'Describe a mistake you made that taught you an important lesson. What happened? What did you learn?' },
  { title: 'Your Happiest Memory', description: 'What is one of the happiest memories of your life? Describe it in detail.' },
  // Opinions (Days 20-40)
  { title: 'Social Media: Good or Bad?', description: 'Is social media mostly good or mostly bad for society? Give your opinion with reasons and examples.' },
  { title: 'Working From Home', description: 'Do you prefer working/studying from home or going to an office/school? Explain why.' },
  { title: 'City vs Village Life', description: 'Which is better: living in a big city or a small village? Compare and give your preference.' },
  { title: 'Money and Happiness', description: 'Can money buy happiness? Share your honest opinion with examples from real life.' },
  { title: 'Traditional vs Modern', description: 'Should we keep traditional values or embrace modern changes? Discuss with examples.' },
  // Abstract (Days 40-60)
  { title: 'Explain Kindness', description: 'What does "kindness" mean to you? Give examples of kindness you have seen or experienced.' },
  { title: 'Success Definition', description: 'How do you define success? Is it money, happiness, helping others, or something else?' },
  { title: 'Time Travel', description: 'If you could travel to any time period, past or future, where would you go and what would you do?' },
  { title: 'Change One Law', description: 'If you could change one law in your country, what would it be and why?' },
  { title: 'Advice to Your Younger Self', description: 'What advice would you give to your 15-year-old self? Explain why this advice matters.' },
  // Advanced (Days 60-80)
  { title: 'Education System Reform', description: 'What is wrong with the current education system? How would you improve it? Give specific proposals.' },
  { title: 'AI and the Future', description: 'How will artificial intelligence change our lives in the next 10 years? What excites and worries you?' },
  { title: 'Climate Change Solutions', description: 'What can individuals do to fight climate change? Are individual actions enough, or do we need government action?' },
  { title: 'Cultural Identity', description: 'How does your culture shape who you are? What traditions are important to you and why?' },
  { title: 'Leadership Qualities', description: 'What makes a great leader? Give examples of leaders you admire and explain what makes them effective.' },
  // Spontaneous (Days 80-100)
  { title: 'Defend an Unpopular Opinion', description: 'Choose an unpopular opinion and defend it with structured arguments. Point → Reason → Example → Conclusion.' },
  { title: 'Explain a Complex Idea Simply', description: 'Pick any complex concept (economics, psychology, science) and explain it so a 10-year-old could understand.' },
  { title: 'Impromptu Presentation', description: 'Give a 3-minute presentation on a topic you just thought of. Structure it: Introduction → 3 points → Conclusion.' },
  { title: 'Persuade Someone', description: 'Convince someone to try something new (a book, a habit, a food, a place). Be persuasive and use examples.' },
  { title: 'Debate Both Sides', description: 'Pick any controversial topic. First, argue FOR it for 1 minute. Then argue AGAINST it for 1 minute.' },
];

function getDayTopics(dayNumber) {
  const phase = getPhaseForDay(dayNumber);
  const seed = dayNumber * 7;
  const pool = TOPICS_POOL;

  const idx1 = seed % pool.length;
  const idx2 = (seed + 3) % pool.length;

  const speakDuration = Math.min(30 + dayNumber * 3, 300);
  const durLabel = speakDuration >= 60 ? `${Math.round(speakDuration / 60 * 10) / 10} min` : `${speakDuration} sec`;

  const topic1 = { ...pool[idx1], description: `Speak for ${durLabel}: ${pool[idx1].description}` };
  const topic2 = { ...pool[idx2], description: `Speak for ${durLabel}: ${pool[idx2].description}` };

  // Third challenge varies by phase
  let topic3;
  if (dayNumber <= 20) {
    topic3 = { type: 'Rescue Phrases', title: 'Use Rescue Phrases', icon: '🛟', description: `Practice rescue phrases while answering: "${getRandomTopic(dayNumber)}". Use at least 3 different phrases to keep going.` };
  } else if (dayNumber <= 40) {
    topic3 = { type: 'Shadowing', title: 'Shadow & Imitate', icon: '🎧', description: 'Find a 30-second English video/audio clip. Listen once. Then repeat exactly what you heard, copying the rhythm, stress, and intonation. Do this 3 times.' };
  } else if (dayNumber <= 60) {
    topic3 = { type: 'Thinking', title: 'Think Aloud in English', icon: '🧠', description: 'For 3 minutes, narrate everything you are thinking in English. Don\'t translate. If you don\'t know a word, describe it: "It\'s the thing that…"' };
  } else if (dayNumber <= 80) {
    topic3 = { type: 'Debate', title: 'Point-Reason-Example', icon: '⚖️', description: `Give a structured argument on: "${getRandomTopic(dayNumber + 20)}". Follow: Point → Reason → Example → Conclusion.` };
  } else {
    topic3 = { type: 'Spontaneous', title: 'Unprepared Speaking', icon: '⚡', description: `No preparation. Speak for ${Math.min(3 + Math.floor(dayNumber / 20), 8)} minutes on: "${getRandomTopic(dayNumber + 30)}". Use the emergency framework if stuck.` };
  }

  return [topic1, topic2, topic3];
}

function getRandomTopic(seed) {
  const topics = [
    'Why do people travel?', 'Is homework useful?', 'What makes a good teacher?',
    'Should animals be kept in zoos?', 'What is the most important invention?',
    'Is competition healthy?', 'What does freedom mean?', 'Is it better to be rich or happy?',
    'Should children have smartphones?', 'What makes a good friend?',
    'Is online education as good as in-person?', 'What is your biggest achievement?',
    'Should we explore space?', 'What is the meaning of success?',
    'How can we reduce pollution?', 'What makes a city great?',
    'Is reading books still important?', 'What would you change about the world?',
    'How do you handle stress?', 'What is the role of art in society?',
  ];
  return topics[seed % topics.length];
}

const PRONUNCIATION_DRILLS = [
  { title: 'TH Sounds', description: 'Practice TH: tongue tip between teeth. "Think, Thank, Through, Thursday, Thirty" (voiceless). "The, This, That, There, They" (voiced). Say: "I think that the weather there is better than this."' },
  { title: 'R vs L', description: 'R: tongue curled back. L: tongue touches roof. Repeat: "Right Light, Read Lead, Rain Lane, Rock Lock, Correct Collect." Say: "The really long road leads to the royal library."' },
  { title: 'V vs W', description: 'V: upper teeth on lower lip. W: round lips. "Very Well, Vine Wine, Vest West, Vow Wow." Say: "The very wet weather was a valid worry for the village."' },
  { title: 'P vs B', description: 'P: burst of air (voiceless). B: vibration (voiced). "Pat Bat, Pie Buy, Park Bark, Pet Bet." Say: "The boy bought a big bag of perfectly baked bread."' },
  { title: 'SH vs CH', description: 'SH: lips pushed out. CH: tongue touches roof then releases. "Ship Chip, Share Chair, Shop Chop, Shoe Choose." Say: "She chose to share the chocolate chips with the children."' },
  { title: 'Word Stress', description: 'Stress the CAPITALIZED syllable: "im-POR-tant, a-BIL-i-ty, com-mu-ni-CA-tion, pro-NUN-ci-a-tion, vo-CAB-u-la-ry." Create a sentence using 3 of these words.' },
  { title: 'Sentence Stress', description: 'The same sentence changes meaning with stress: "I didn\'t say HE stole the money" (someone else did). "I didn\'t say he STOLE the money" (he borrowed it). Practice shifting stress.' },
  { title: 'Linking Sounds', description: 'Words connect in natural speech: "Turn_it_off" → "Tur-ni-toff". Practice: "Pick_it_up, Look_at_it, Think_about_it, Come_on_in." Say each phrase 3 times, linking the words.' },
  { title: 'Intonation', description: 'Questions rise ↗, statements fall ↘. Practice: "Are you coming?" (↗) "I am coming." (↘) "Do you like it?" (↗) "I really like it." (↘) Exaggerate the intonation.' },
  { title: 'Reductions', description: 'Natural speech reduces sounds: "going to" → "gonna", "want to" → "wanna", "have to" → "hafta". Practice: "I\'m gonna hafta think about what I wanna do."' },
];

function getPronunciationDrill(dayNumber) {
  return PRONUNCIATION_DRILLS[dayNumber % PRONUNCIATION_DRILLS.length];
}

function getWarmup(dayNumber) {
  const warmups = [
    'Speak for 30 seconds about the first thing you see when you look up.',
    'Name 15 objects in English as fast as you can.',
    'Describe today\'s weather in 3 full sentences.',
    'Say 5 things you are grateful for today.',
    'Complete: "Today I feel ___ because ___" — say 3 versions.',
    'Count backwards from 30 to 1 while saying each number clearly.',
    'Describe what you ate today in detail.',
    'Say the English alphabet, then say a word starting with each of the first 10 letters.',
    'Describe a person near you (or someone you know) in 5 sentences.',
    'Answer without thinking: "What is the most interesting thing about you?"',
  ];
  return warmups[dayNumber % warmups.length];
}

function getTip(dayNumber) {
  const tips = [
    'Don\'t translate. Think in English, even if it\'s slow.',
    'A mistake is not a reason to stop speaking. Keep going.',
    'Record yourself. Listen back. You\'ll notice improvement.',
    'Use "I think…" and "In my opinion…" to start sentences when unsure.',
    'If you forget a word, describe it. That IS communication.',
    'Speak slowly and clearly rather than fast and mumbled.',
    'Use the emergency framework when your mind goes blank.',
    'Don\'t wait to feel ready. Speaking is how you become ready.',
    'Every pause is normal. Even native speakers pause.',
    'Focus on communicating your idea, not on perfect grammar.',
  ];
  return tips[dayNumber % tips.length];
}

function getVocabChallenge(dayNumber) {
  const chunks = [
    ['I had the opportunity to…', 'What surprised me was…', 'The reason I decided to…'],
    ['As far as I know…', 'It turned out that…', 'I came to realize that…'],
    ['On the other hand…', 'What I mean by that is…', 'To put it simply…'],
    ['I strongly believe that…', 'The main advantage of…', 'One thing I noticed is…'],
    ['From my perspective…', 'It depends on…', 'Generally speaking…'],
    ['What really matters is…', 'I used to think… but now…', 'Looking back on it…'],
    ['The key takeaway is…', 'If I had to choose…', 'What stands out to me is…'],
    ['In terms of…', 'Compared to…', 'Based on my experience…'],
    ['The bottom line is…', 'When it comes to…', 'I\'d go so far as to say…'],
    ['Without a doubt…', 'That being said…', 'All things considered…'],
  ];

  const set = chunks[dayNumber % chunks.length];
  return `Learn these chunks and use each in a spoken sentence:\n• "${set[0]}"\n• "${set[1]}"\n• "${set[2]}"\nSay each sentence aloud 2 times. Then combine all 3 in a short story.`;
}
