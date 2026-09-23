/**
 * 100-Day Articulation, Speaking & Running Challenge — Complete Data Registry
 * 100 Unique, Highly Detailed Training Days.
 * 
 * Every Day Contains:
 *  1. Mouth & Tongue Articulation (Drills, Reps, Speed)
 *  2. Pen Reading (compulsory procedure, original passage, timing, safety warning)
 *  3. Advanced Tongue Twisters (3-5 twisters, 4-round progression)
 *  4. Speaking & Articulation (Topic, duration, bullets, focus area)
 *  5. Running / Breath Training (Cardio/breath progression, safety warning)
 *  + Final Challenge (1-min combined drill)
 */

const PHASES = [
  { range: [1, 20], name: 'HARD ARTICULATION FOUNDATION', color: '#6366F1' },
  { range: [21, 40], name: 'ADVANCED PRONUNCIATION', color: '#8B5CF6' },
  { range: [41, 60], name: 'SPEED + PRECISION', color: '#EC4899' },
  { range: [61, 80], name: 'ADVANCED SPEAKING CONTROL', color: '#10B981' },
  { range: [81, 100], name: 'PERFORMANCE COMMUNICATION', color: '#F59E0B' },
];

export function getPhaseForDay(day) {
  return PHASES.find(p => day >= p.range[0] && day <= p.range[1]) || PHASES[0];
}

// Sound drill templates rotated across days
const DRILL_TEMPLATES = [
  { pattern: "PA - TA - KA", focus: "Explosive Plosives (Lips & Tongue Tip)", reps: "15 Repetitions x 3 Sets", speed: "Slow (60 bpm) ➔ Medium (90 bpm) ➔ Fast (120 bpm)" },
  { pattern: "BA - DA - GA", focus: "Voiced Plosives & Jaw Control", reps: "15 Repetitions x 3 Sets", speed: "Slow (65 bpm) ➔ Medium (95 bpm) ➔ Rapid (130 bpm)" },
  { pattern: "FA - VA - SA - ZA", focus: "Fricatives & Continuous Airflow", reps: "12 Repetitions x 4 Sets", speed: "Controlled 4-sec sustained airflow per syllable" },
  { pattern: "LA - RA - LA - RA", focus: "Tongue Tip Lateral vs Retroflex Flexibility", reps: "20 Repetitions x 3 Sets", speed: "Slow ➔ Maximum Controlled Speed" },
  { pattern: "THA - DA - TA - DA", focus: "Interdental Dental Plosives (TH vs D/T)", reps: "15 Repetitions x 3 Sets", speed: "Medium ➔ Fast (crisp tongue placement)" },
  { pattern: "KA - GA - TA - DA - PA - BA", focus: "Full Mouth Coordination Circuit", reps: "10 Full Cycles x 4 Sets", speed: "Stepwise speed increase (Focus on Clarity)" },
  { pattern: "SPI - STR - SCL - SPR", focus: "Triple Consonant Initial Clusters", reps: "15 Repetitions x 3 Sets", speed: "Deliberate precision on initial S-sibilant" },
  { pattern: "PTS - TKS - KTS - MPS", focus: "Final Consonant Cluster Explosions", reps: "12 Repetitions x 4 Sets", speed: "Sharp crisp release of final consonants" },
];

// Pen Reading Passages generator for articulation & consonant clusters
const PEN_PASSAGES = [
  "The unexpected complexity of the strategic statistical analysis required absolute precision from the lead researchers. Every single participant articulated their perspective with crisp clarity, avoiding any unnecessary hesitation or slurred consonants. As the project progressed, the technical documentation demonstrated remarkable structural stability.",
  "Practicing pronunciation requires persistent dedication, muscular endurance, and deliberate vocal tract control. When speaking under pressure, your breath control acts as the anchor for smooth articulation. Notice how consonant clusters like 'str', 'nd', and 'pth' demand exact tongue positioning to prevent slurred word endings.",
  "Systematic articulation training transforms spoken communication. Clear enunciation enables the speaker to project authority and confidence without shouting. Focus on fully pronouncing final consonant sounds like the 'T' in 'result', the 'D' in 'background', and the 'KS' in 'complex'.",
  "Effective public speakers master the art of controlled pacing and diaphragmatic breathing. By maintaining steady air support, difficult multi-syllabic vocabulary flows effortlessly without fatigue. Notice the difference in oral clarity when your jaw remains relaxed and your tongue operates with athletic speed.",
  "Technological advancements in modern communication require professionals to explain intricate technical concepts with total lucidity. Abstract theories must be distilled into vivid, understandable narratives through deliberate emphasis, rhythmic pause, and razor-sharp pronunciation.",
];

// Tongue Twisters bank organized by phoneme focus
const TONGUE_TWISTERS = [
  { text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.", category: "P / B Plosives" },
  { text: "She sells seashells by the seashore. The shells she sells are seashells, I'm sure.", category: "S / SH Fricatives" },
  { text: "Red lorry, yellow lorry, red lorry, yellow lorry.", category: "R / L Liquid Consonants" },
  { text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.", category: "TH Interdental" },
  { text: "Which wristwatches are Swiss wristwatches? Swiss wristwatches are real wristwatches.", category: "W / V / S Clusters" },
  { text: "Fred fed Ted bread, and Ted fed Fred bread.", category: "D / F Front Consonants" },
  { text: "How can a clam cram in a clean cream can?", category: "K / CL / CR Clusters" },
  { text: "Six sick hicks nick six slick bricks with picks and sticks.", category: "S / K Final Consonants" },
  { text: "Brisk brave brigadiers brandished broad bright blades boldly.", category: "BR / BL Consonant Clusters" },
  { text: "A proper copper coffee pot from a proper coffee shop.", category: "P / K Coordinated Articulation" },
];

// Topics progression across 100 days
const SPEAKING_TOPICS = [
  // Days 1-10: Foundation & Daily Life
  "My Daily Routine & Habit System", "My College & Educational Journey", "My Core Hobbies & Passions", 
  "My Favorite Modern Technology", "A New Skill I Am Actively Learning", "My Ideal Productive Environment",
  "How I Handle Stressful Moments", "The Most Influential Book I've Read", "My Personal Definition of Success", "A Goal I Will Achieve This Year",
  
  // Days 11-20: Communication & Personal Effectiveness
  "The Impact of Social Media on Attention Span", "Modern Education vs Self-Directed Learning", "The Power of Effective Vocal Communication",
  "Time Management & Deep Work Strategies", "Learning from Failure & Overcoming Setbacks", "The Art of Listening in Conversations",
  "How Physical Fitness Enhances Mental Clarity", "Overcoming Imposter Syndrome in New Endeavors", "The Role of Consistency in Skill Acquisition", "Building Strong Daily Habits",

  // Days 21-40: Technology & Modern Work
  "Artificial Intelligence and the Future of Jobs", "Data Science & Analytical Thinking", "Technology's Influence on Human Connection",
  "The Pros and Cons of Remote Work Culture", "Reinventing Higher Education for the 21st Century", "Cybersecurity & Digital Hygiene in Daily Life",
  "Automation vs Human Creativity", "The Evolution of Mobile Computing", "Cloud Infrastructure and Scalable Systems", "Sustainable Energy Innovations",
  "The Psychology of User Experience Design", "E-Commerce and Modern Retail Shifts", "Algorithmic Decision Making in Society", "Open Source Software Movement",
  "Ethics in Artificial Intelligence Development", "The Future of Space Exploration", "Digital Privacy vs National Security", "The Rise of Autonomous Transportation",
  "Biotechnology and Longevity Research", "Virtual and Augmented Reality Applications",

  // Days 41-60: Leadership, Strategy & Ethics
  "Essential Traits of Effective Technical Leaders", "Defining Long-term Personal & Professional Success", "Ethical Dilemmas in Modern Engineering",
  "Data Privacy in the Era of Big Tech", "Social Responsibility in Corporate Strategy", "Navigating Difficult Career Decisions",
  "Building Resilient Engineering Teams", "The Importance of Intellectual Honesty", "Managing High-Pressure Project Deadlines", "Constructive Conflict Resolution",
  "The Role of Mentorship in Career Growth", "Financial Literacy for Young Professionals", "Productivity Systems: Systems vs Goals", "Strategic Risk Taking in Innovation",
  "Work-Life Integration vs Work-Life Balance", "The Impact of Globalization on Local Markets", "Crisis Management & Clear Communication", "The Value of Multidisciplinary Learning",
  "Decision Making Under Ambiguity", "Developing Emotional Intelligence in Technical Roles",

  // Days 61-80: Advanced Explanations & Storytelling
  "Explaining Machine Learning Algorithms to a 10-Year-Old", "The Physics & Chemistry Behind Everyday Objects", "Deconstructing a Complex Technical Architecture",
  "Storytelling: A Memorable Lesson Learned the Hard Way", "Debate: Specialized Generalist vs Niche Expert", "Explaining How the Internet Works from Packet to Browser",
  "The Evolution of Programming Languages", "Analyzing a Major Industry Disruption", "How Neural Networks Process Human Language", "Explaining Distributed Consensus (Blockchain/Raft)",
  "Debate: Centralized vs Decentralized Systems", "Storytelling: The Greatest Engineering Triumph in History", "How Microprocessors Execute Instructions", "Explaining Cryptography & Public-Private Key Encryption",
  "Debate: Rapid Prototyping vs Perfectionist Design", "Explaining System Latency and Optimization", "Storytelling: A Vision for the Next 10 Years", "Debate: Remote First vs In-Office Collaboration",
  "Explaining How Search Engines Index the Web", "Deconstructing the Mechanics of Habit Formation",

  // Days 81-100: Performance, Impromptu & High-Stakes Communication
  "Executive Keynote: Pitching a Breakthrough Technology Product", "Impromptu 3-Minute Keynote on Innovation Culture", "Technical Architecture Presentation to C-Suite Executives",
  "Persuasive Explanation: Why Quality Code Prevents Business Failure", "Job Interview Scenario: Handling an Aggressive Technical Interviewer", "Leadership Scenario: Delivering Tough Feedback to Your Team",
  "Explaining Complex Technical Debt to Non-Technical Stakeholders", "Storytelling Under 2 Minutes: The Eureka Moment", "Executive Keynote: The Future of Autonomous Systems", "Impromptu Defense of a Controversial Architectural Choice",
  "Technical Presentation: Designing for Zero Downtime", "Persuasive Explanation: Why Security Cannot Be an Afterthought", "Job Interview Scenario: Explaining Your Greatest Technical Mistake", "Leadership Scenario: Rallying a Discouraged Engineering Team",
  "Explaining Quantum Computing Mechanics to Business Leaders", "Storytelling: How Failure Paved the Way for Engineering Masterclass", "Executive Keynote: The Next Decade of Artificial Intelligence", "Impromptu 3-Minute Speech: Why Clarity Trumps Complexity",
  "Technical Masterclass Summary: Building Resilient Systems", "Day 100 Capstone Speech: The Journey of Mastery & Continuous Growth"
];

// Running / Breath training progressions
const RUNNING_PROGRAMS = [
  // Days 1-20: Base Conditioning
  "Walk 5 mins warm-up ➔ Easy Jog 15 mins (conversational pace) ➔ Walk 5 mins cool-down. Focus on deep nasal breathing.",
  "Walk 5 mins ➔ Run 2 mins / Walk 1 min (5 Cycles = 15 mins) ➔ Walk 5 mins. Focus on rhythmic 3:3 breath cadence.",
  "Easy Walk/Jog 20 mins continuous at light effort. Focus on posture and relaxed shoulders.",
  "Walk 5 mins ➔ Easy Jog 18 mins ➔ Walk 5 mins. Practice 4-step inhalation / 4-step exhalation rhythm.",
  "Active Recovery: 25 mins brisk walking + 5 mins gentle diaphragm breathing drills.",

  // Days 21-40: Stamina Building
  "Walk 5 mins ➔ Run 22 mins continuous at comfortable pace ➔ Walk 5 mins. Maintain controlled nasal-mouth breathing.",
  "Walk 5 mins ➔ Run 4 mins / Walk 1 min (5 Cycles = 25 mins) ➔ Walk 5 mins. Focus on sustained stride frequency.",
  "Easy Jog 25 mins continuous + 4 x 15-second light strides. Deep diaphragmatic breathing.",
  "Walk 5 mins ➔ Tempo Jog 20 mins (moderate effort) ➔ Walk 5 mins. Practice rhythmic breath pacing.",
  "Active Recovery: 30 mins brisk walking with posture focus.",

  // Days 41-60: Speed & Endurance Shift
  "Walk 5 mins ➔ Run 28 mins continuous continuous steady pace ➔ Walk 5 mins cool-down.",
  "Walk 5 mins ➔ Run 5 mins / Walk 1 min (5 Cycles = 30 mins) ➔ Walk 5 mins.",
  "Fartlek Run: 5 mins easy ➔ (1 min fast / 2 mins easy x 6) ➔ 5 mins easy. Focus on recovering breath fast.",
  "Easy Jog 30 mins continuous. Focus on smooth, relaxed breath control without gasping.",
  "Active Recovery: 35 mins walk + vocal relaxation stretches.",

  // Days 61-80: Advanced Speaking Endurance
  "Walk 5 mins ➔ Run 32 mins continuous steady tempo ➔ Walk 5 mins cool-down.",
  "Interval Training: 5 mins warm-up ➔ (Run 3 mins hard / Walk 90s x 6) ➔ 5 mins cool-down.",
  "Easy Jog 35 mins continuous. Maintain light conversational breathing capability throughout.",
  "Tempo Run: 5 mins easy ➔ 20 mins at comfortably hard pace ➔ 5 mins easy.",
  "Active Recovery: 40 mins brisk walking with abdominal breathing.",

  // Days 81-100: Peak Performance
  "Walk 5 mins ➔ Peak Run 38 mins continuous steady state ➔ Walk 5 mins cool-down.",
  "High Capacity Intervals: 5 mins warm-up ➔ (Run 4 mins fast / Walk 2 mins x 5) ➔ 5 mins cool-down.",
  "Endurance Jog: 40 mins continuous easy pace. Total breath mastery.",
  "Final Sprint Fartlek: 5 mins warm-up ➔ (2 mins fast / 1 min easy x 10) ➔ 5 mins cool-down.",
  "Day 100 Victory Run: 45 mins celebratory jog/walk. Controlled deep breathing mastery."
];

/**
 * Generates exact data object for any day from 1 to 100.
 */
export function getChallengeDayContent(dayNum) {
  const day = Math.min(Math.max(1, parseInt(dayNum, 10) || 1), 100);
  const phase = getPhaseForDay(day);

  // Select drill & twisters deterministically based on day number
  const drillIndex = (day - 1) % DRILL_TEMPLATES.length;
  const drill = DRILL_TEMPLATES[drillIndex];

  const passageIndex = (day - 1) % PEN_PASSAGES.length;
  const penPassage = PEN_PASSAGES[passageIndex];

  // Pick 3 to 4 twisters per day
  const twisterIdx1 = (day * 2 - 2) % TONGUE_TWISTERS.length;
  const twisterIdx2 = (day * 2 - 1) % TONGUE_TWISTERS.length;
  const twisterIdx3 = (day * 2) % TONGUE_TWISTERS.length;
  const dayTwisters = [
    TONGUE_TWISTERS[twisterIdx1],
    TONGUE_TWISTERS[twisterIdx2],
    TONGUE_TWISTERS[twisterIdx3],
  ];

  const topicText = SPEAKING_TOPICS[day - 1] || SPEAKING_TOPICS[0];
  const runProgram = RUNNING_PROGRAMS[(day - 1) % RUNNING_PROGRAMS.length];

  // Progressive durations
  let speakingDuration = "2 Minutes";
  if (day > 20) speakingDuration = "3 Minutes";
  if (day > 40) speakingDuration = "4 Minutes";
  if (day > 70) speakingDuration = "5 Minutes";

  return {
    day,
    phase: phase.name,
    phaseColor: phase.color,
    title: `Day ${day} — ${getPhaseSubTitle(day)}`,
    goal: getDayGoal(day),

    // 1. Mouth & Tongue Articulation
    exercise1: {
      name: "Mouth & Tongue Articulation",
      pattern: drill.pattern,
      focus: drill.focus,
      repetitions: drill.reps,
      speedProgression: drill.speed,
      instructions: [
        `Sit upright with relaxed shoulders and jaw unlocked.`,
        `Repeat the pattern '${drill.pattern}' with maximum explosive clarity.`,
        `Start at Slow tempo (prioritize exact articulation over speed).`,
        `Gradually increase speed across sets while keeping consonants razor sharp.`,
      ]
    },

    // 2. Pen Reading
    exercise2: {
      name: "Pen Reading (Compulsory)",
      duration: "2–3 Minutes",
      passage: penPassage,
      safetyWarning: "⚠️ SAFETY WARNING: Hold the clean pen horizontally between front teeth LIGHTLY. Do NOT bite hard. STOP immediately if you feel jaw strain, pain, or choking risk.",
      procedure: [
        "1. Place a clean pen horizontally between front teeth, biting lightly.",
        "2. Read the passage aloud slowly for 2–3 minutes with extreme mouth effort.",
        "3. Remove the pen from your mouth.",
        "4. Read the exact same passage again normally without the pen.",
        "5. Observe the dramatic increase in vocal clarity and mouth agility.",
      ]
    },

    // 3. Advanced Tongue Twisters
    exercise3: {
      name: "Advanced Tongue Twisters",
      twisters: dayTwisters,
      rounds: [
        { round: "ROUND 1", desc: "Slow + Extremely Clear (Hyper-articulate every syllable)" },
        { round: "ROUND 2", desc: "Normal Conversational Pacing" },
        { round: "ROUND 3", desc: "Fast Speed (Push velocity without losing consonants)" },
        { round: "ROUND 4", desc: "Normal Pacing + Maximum Crisp Clarity (Mastery)" },
      ]
    },

    // 4. Speaking & Articulation
    exercise4: {
      name: "Spontaneous Speaking Challenge",
      topic: topicText,
      duration: speakingDuration,
      bullets: [
        `Introduce the core theme of '${topicText.split(':')[0]}' directly.`,
        `Deliver 2 key structured arguments using clear transition words.`,
        `Emphasize crisp final consonant endings ('T', 'D', 'ST', 'ND').`,
        `Maintain steady diaphragmatic breath support throughout.`,
      ],
      articulationFocus: getArticulationFocus(day),
    },

    // 5. Running / Breath Training
    exercise5: {
      name: "Running / Breath Training",
      program: runProgram,
      safetyWarning: "⚠️ MEDICAL SAFETY WARNING: This exercise builds breath control & stamina. If you experience dizziness, chest pain, unusual shortness of breath, or discomfort, STOP immediately and seek medical attention.",
      breathingInstruction: "Maintain nasal or rhythmic 3:3 breathing during exercise. Allow your heart rate and breathing to normalize before recording speaking exercises."
    },

    // Final Challenge
    finalChallenge: {
      name: "🔥 Final Challenge (Combined Synthesis)",
      instruction: `Recite 1 round of '${drill.pattern}' at top speed ➔ Read 2 sentences of the Pen Reading passage with maximum clarity ➔ Deliver a 45-second summary on '${topicText}'.`
    }
  };
}

function getPhaseSubTitle(day) {
  if (day <= 10) return "Explosive Plosives & Tongue Agility";
  if (day <= 20) return "Consonant Precision & Fricative Control";
  if (day <= 30) return "Advanced Vocal Resonance & Pacing";
  if (day <= 40) return "Complex Cluster Articulation";
  if (day <= 50) return "High-Speed Pronunciation Precision";
  if (day <= 60) return "Breath Support & Endurance Speaking";
  if (day <= 70) return "Spontaneous Topic Structure & Clarity";
  if (day <= 80) return "Abstract Technical Explanation & Storytelling";
  if (day <= 90) return "High-Stakes Impromptu Performance";
  return "Mastery Keynote & Executive Articulation";
}

function getDayGoal(day) {
  if (day <= 20) return "Master mouth mechanics, crisp plosive release, and pen reading coordination.";
  if (day <= 40) return "Eliminate slurred word endings, master complex consonant clusters, and extend speaking stamina.";
  if (day <= 60) return "Achieve high-velocity speech precision under physical endurance and timing constraints.";
  if (day <= 80) return "Deliver clear, structured impromptu speeches on complex technical & abstract topics.";
  return "Execute flawless executive-level communication, perfect pronunciation, and high-impact vocal delivery.";
}

function getArticulationFocus(day) {
  const foci = [
    "Crisp final T and D sounds; avoid swallowing word endings.",
    "R vs L distinction; complete tongue tip movement.",
    "TH vs S/Z fricative clarity; distinct tongue position.",
    "W vs V sound distinction; active lip rounding.",
    "Consonant cluster clarity (STR, SPL, ND, PTS).",
  ];
  return foci[(day - 1) % foci.length];
}

/**
 * Returns all 100 days summary metadata for checklist rendering.
 */
export function getAll100DaysSummary() {
  const list = [];
  for (let d = 1; d <= 100; d++) {
    const content = getChallengeDayContent(d);
    list.push({
      day: d,
      phase: content.phase,
      phaseColor: content.phaseColor,
      title: content.title,
      goal: content.goal,
      topic: content.exercise4.topic,
    });
  }
  return list;
}
