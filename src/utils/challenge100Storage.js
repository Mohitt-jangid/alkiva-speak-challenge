/**
 * 100-Day Challenge Persistent Storage & Verification Manager
 * Keyed strictly for user 'mohit'. Stores progress in localStorage and updates lock state.
 */

const STORAGE_KEY = 'mohit_100day_challenge_v2';

// Helper to get initial fresh state
function getInitialState() {
  const days = {};
  for (let d = 1; d <= 100; d++) {
    days[d] = {
      day: d,
      status: d === 1 ? 'NOT_STARTED' : 'LOCKED', // Day 1 unlocked by default
      exerciseCompletion: {
        ex1: false,
        ex2: false,
        ex3: false,
        ex4: false,
        ex5: false,
        final: false,
      },
      evidence: null, // { type: 'audio' | 'transcript', content: '...', submittedAt: '...' }
      review: null,   // { scores: {...}, biggestProblem: '', nextFocus: '', feedback: '', reviewedAt: '' }
      completedAt: null,
      verifiedAt: null,
    };
  }
  return {
    days,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Loads the current 100-day state from storage.
 */
export function getChallenge100State() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveChallenge100State(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.days) {
      const initial = getInitialState();
      saveChallenge100State(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading 100-day state", err);
    return getInitialState();
  }
}

/**
 * Saves state to localStorage.
 */
export function saveChallenge100State(state) {
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Error saving 100-day state", err);
  }
}

/**
 * Updates exercise completion checkbox state for a day.
 */
export function toggleExerciseAttempt(dayNum, exKey) {
  const state = getChallenge100State();
  const dayObj = state.days[dayNum];
  if (!dayObj || dayObj.status === 'LOCKED') return state;

  dayObj.exerciseCompletion[exKey] = !dayObj.exerciseCompletion[exKey];

  if (dayObj.status === 'NOT_STARTED' || dayObj.status === 'REPEAT_REQUIRED') {
    dayObj.status = 'IN_PROGRESS';
  }

  saveChallenge100State(state);
  return state;
}

/**
 * Submits evidence for a day and changes status to AWAITING_VERIFICATION.
 */
export function submitDayForVerification(dayNum, evidenceData) {
  const state = getChallenge100State();
  const dayObj = state.days[dayNum];
  if (!dayObj || dayObj.status === 'LOCKED') return state;

  dayObj.status = 'AWAITING_VERIFICATION';
  dayObj.evidence = {
    ...evidenceData,
    submittedAt: new Date().toISOString(),
  };
  dayObj.completedAt = new Date().toISOString();

  saveChallenge100State(state);
  return state;
}

/**
 * Coach / Owner review of a day submission.
 */
export function coachReviewDay(dayNum, { verified, scores, biggestProblem, nextFocus, feedback }) {
  const state = getChallenge100State();
  const dayObj = state.days[dayNum];
  if (!dayObj) return state;

  const now = new Date().toISOString();

  dayObj.review = {
    scores: scores || {
      articulation: 8, pronunciation: 8, clarity: 8, speedControl: 8,
      fluency: 8, wordEndings: 8, confidence: 8,
    },
    biggestProblem: biggestProblem || 'None',
    nextFocus: nextFocus || 'Keep maintaining clarity',
    feedback: feedback || '',
    reviewedAt: now,
  };

  if (verified) {
    dayObj.status = 'VERIFIED';
    dayObj.verifiedAt = now;

    // UNLOCK NEXT DAY (Day X+1)
    const nextDayNum = parseInt(dayNum, 10) + 1;
    if (nextDayNum <= 100 && state.days[nextDayNum]) {
      if (state.days[nextDayNum].status === 'LOCKED') {
        state.days[nextDayNum].status = 'NOT_STARTED';
      }
    }
  } else {
    // REPEAT REQUIRED
    dayObj.status = 'REPEAT_REQUIRED';
  }

  saveChallenge100State(state);
  return state;
}

/**
 * Calculates current stats (streaks, percentage, count).
 */
export function getChallenge100Stats() {
  const state = getChallenge100State();
  const days = state.days;

  let totalVerified = 0;
  let totalAttempted = 0;
  let currentUnlockedDay = 1;

  for (let d = 1; d <= 100; d++) {
    const dayObj = days[d];
    if (dayObj.status === 'VERIFIED') {
      totalVerified++;
    }
    if (dayObj.status !== 'LOCKED' && dayObj.status !== 'NOT_STARTED') {
      totalAttempted++;
    }
    if (dayObj.status !== 'LOCKED') {
      currentUnlockedDay = Math.max(currentUnlockedDay, d);
    }
  }

  // Calculate Verified Streak
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  for (let d = 1; d <= 100; d++) {
    if (days[d].status === 'VERIFIED') {
      runningStreak++;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  // Current active streak working backwards from current unlocked day
  let streakCheck = currentUnlockedDay - 1;
  while (streakCheck >= 1 && days[streakCheck]?.status === 'VERIFIED') {
    currentStreak++;
    streakCheck--;
  }

  const completionPercentage = Math.round((totalVerified / 100) * 100);

  return {
    totalVerified,
    totalAttempted,
    remainingDays: 100 - totalVerified,
    currentStreak,
    longestStreak,
    completionPercentage,
    currentUnlockedDay,
  };
}
