import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'instagram_db.json');

const INITIAL_USERS = ['Mohit', 'Aashish', 'Ajay'];

// Ensure directory and file exist
function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: {}
    };
    INITIAL_USERS.forEach((userId) => {
      initialData.users[userId] = {
        userId,
        streak: 0,
        lastSubmissionDate: null,
        submissions: []
      };
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

// Read database
export function getDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    
    // Ensure all 3 required users exist in DB
    let modified = false;
    INITIAL_USERS.forEach((userId) => {
      if (!data.users[userId]) {
        data.users[userId] = {
          userId,
          streak: 0,
          lastSubmissionDate: null,
          submissions: []
        };
        modified = true;
      }
    });
    if (modified) {
      saveDb(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading Instagram DB:', err);
    ensureDb();
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  }
}

// Save database atomically
export function saveDb(data) {
  ensureDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing Instagram DB:', err);
  }
}

// Format date as YYYY-MM-DD in local time
export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate days difference between two YYYY-MM-DD strings
export function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Normalize Instagram URL for exact duplicate detection
export function normalizeInstagramUrl(rawUrl) {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  // Strip query parameters and hash
  cleaned = cleaned.split('?')[0].split('#')[0];
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  // Normalize protocol & www
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  return cleaned.toLowerCase();
}

// Validate Instagram URL format
export function isValidInstagramUrl(url) {
  if (!url) return false;
  const normalized = normalizeInstagramUrl(url);
  return (
    normalized.includes('instagram.com/p/') ||
    normalized.includes('instagram.com/reel/') ||
    normalized.includes('instagram.com/reels/') ||
    normalized.includes('instagram.com/tv/') ||
    normalized.includes('instagr.am/p/') ||
    normalized.includes('instagr.am/reel/')
  );
}

/**
 * Calculates current effective user state (evaluating missed days)
 */
export function getEffectiveUserState(user, todayStr = getTodayString()) {
  if (!user) return null;

  const { lastSubmissionDate, streak, submissions } = user;
  
  let currentStreak = streak || 0;
  let hasSubmittedToday = false;

  if (lastSubmissionDate) {
    const diff = getDaysDifference(lastSubmissionDate, todayStr);
    if (diff === 0) {
      hasSubmittedToday = true;
    } else if (diff === 1) {
      // Submitted yesterday, streak is active
      hasSubmittedToday = false;
    } else if (diff > 1) {
      // Missed at least 1 day -> streak becomes 0
      currentStreak = 0;
      hasSubmittedToday = false;
    }
  } else {
    currentStreak = 0;
    hasSubmittedToday = false;
  }

  return {
    userId: user.userId,
    streak: currentStreak,
    lastSubmissionDate,
    hasSubmittedToday,
    totalSubmissions: submissions ? submissions.length : 0,
    submissions: submissions || []
  };
}

/**
 * Adds a new user to the backend DB if not present
 */
export function addUserToDb(userId) {
  const db = getDb();
  if (!db.users[userId]) {
    db.users[userId] = {
      userId,
      streak: 0,
      lastSubmissionDate: null,
      submissions: []
    };
    saveDb(db);
  }
  return getOverviewData();
}

/**
 * Removes a user from the backend DB
 */
export function removeUserFromDb(userId) {
  const db = getDb();
  if (db.users[userId]) {
    delete db.users[userId];
    saveDb(db);
  }
  return getOverviewData();
}

/**
 * Main Database function: Get all users' current streaks & status
 */
export function getOverviewData() {
  const db = getDb();
  const todayStr = getTodayString();
  const overview = {};

  const allUserIds = Object.keys(db.users);
  allUserIds.forEach((userId) => {
    const userData = db.users[userId];

    // Check if streak reset is needed in DB due to missed days
    const effective = getEffectiveUserState(userData, todayStr);
    
    // If DB stored streak differed from effective streak due to missed days, update DB
    if (userData.streak !== effective.streak && userData.lastSubmissionDate && getDaysDifference(userData.lastSubmissionDate, todayStr) > 1) {
      userData.streak = 0;
      db.users[userId] = userData;
      saveDb(db);
    }

    overview[userId] = effective;
  });

  return overview;
}

/**
 * Main Database function: Process a new submission with full constraint enforcement
 */
export function submitInstagramLink(userId, rawLink) {
  const db = getDb();
  const todayStr = getTodayString();

  // 1. Verify User
  const targetUser = db.users[userId];
  if (!targetUser) {
    return { success: false, error: 'Invalid or unauthorized user.' };
  }

  // 2. Validate Instagram Link format
  if (!rawLink || typeof rawLink !== 'string') {
    return { success: false, error: 'Please enter a valid Instagram link.' };
  }

  const trimmedLink = rawLink.trim();
  if (!isValidInstagramUrl(trimmedLink)) {
    return {
      success: false,
      error: 'Invalid Instagram link format. Link must be a valid Instagram post or reel URL (e.g. https://www.instagram.com/reel/...).'
    };
  }

  const normalizedInput = normalizeInstagramUrl(trimmedLink);

  // 3. Database Rule: One submission per user per day
  if (targetUser.lastSubmissionDate) {
    const daysDiff = getDaysDifference(targetUser.lastSubmissionDate, todayStr);
    if (daysDiff === 0) {
      return {
        success: false,
        error: 'You have already submitted an Instagram link today. Only 1 submission per calendar day is allowed.'
      };
    }
  }

  // 4. Database Rule: Link cannot be reused by the same user (Duplicate check)
  const existingSubmissions = targetUser.submissions || [];
  const isDuplicate = existingSubmissions.some(
    (sub) => normalizeInstagramUrl(sub.link) === normalizedInput
  );

  if (isDuplicate) {
    return {
      success: false,
      error: 'You have already submitted this exact Instagram post/reel previously! The Instagram link must be unique for your account.'
    };
  }

  // 5. Calculate New Streak
  // - If last submission was yesterday (daysDiff === 1): streak = currentStreak + 1
  // - If last submission was missing (> 1 day ago) or never submitted (null): streak starts at 1
  let newStreak = 1;
  if (targetUser.lastSubmissionDate) {
    const diff = getDaysDifference(targetUser.lastSubmissionDate, todayStr);
    if (diff === 1) {
      newStreak = (targetUser.streak || 0) + 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // 6. Create Submission Record
  const newSubmission = {
    id: 'ig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId,
    link: trimmedLink,
    normalizedLink: normalizedInput,
    date: todayStr,
    timestamp: new Date().toISOString()
  };

  // 7. Update User Record in Database
  targetUser.streak = newStreak;
  targetUser.lastSubmissionDate = todayStr;
  targetUser.submissions.unshift(newSubmission); // newest first

  db.users[userId] = targetUser;
  saveDb(db);

  return {
    success: true,
    message: `Submission successful! 🔥 Your streak is now ${newStreak} day${newStreak > 1 ? 's' : ''}.`,
    data: {
      userId,
      newStreak,
      submission: newSubmission,
      overview: getOverviewData()
    }
  };
}
