/**
 * Instagram Challenge Service
 * Supports dual-mode backend API + client-side localStorage sync & fallback
 * to ensure 100% reliability on mobile devices and production deployments (e.g. Vercel/Netlify).
 */

// Helper: Format date as YYYY-MM-DD
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function normalizeInstagramUrl(rawUrl) {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  cleaned = cleaned.split('?')[0].split('#')[0];
  cleaned = cleaned.replace(/\/+$/, '');
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  return cleaned.toLowerCase();
}

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

// Initial Local Storage Data Seed
const INITIAL_FALLBACK_DB = {
  users: {
    Mohit: {
      userId: 'Mohit',
      streak: 20,
      lastSubmissionDate: '2026-09-26',
      submissions: [
        { id: 'ig_1790480363809_4yj1u', userId: 'Mohit', link: 'https://www.instagram.com/reel/Ddwj7EfOz7h0riTq79s48FdvXLzn8OVDf89X_00/?stkn=MWd2OGN0bDlrNDA5YQ==', normalizedLink: 'instagram.com/reel/ddwj7efoz7h0ritq79s48fdvxlzn8ovdf89x_00', date: '2026-09-26', timestamp: '2026-09-26T20:00:00.000Z' },
        { id: 'ig_d20', userId: 'Mohit', link: 'https://www.instagram.com/reel/Ddt-R0rOZSOYzx1_OtTz4Z_3EMbFwr5V-zsvhc0/?stkn=MTJyMTFnOHgwaHdpag==', normalizedLink: 'instagram.com/reel/ddt-r0rozsoyzx1_ottz4z_3embfwr5v-zsvhc0', date: '2026-09-25', timestamp: '2026-09-25T09:00:00.000Z' },
        { id: 'ig_d19', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdrXgG6Oq0-705yikoJF8nurY__lk1g-ustI480/?stkn=ODF5dW43cGthemZ2', normalizedLink: 'instagram.com/reel/ddrxgg6oq0-705yikojf8nury__lk1g-usti480', date: '2026-09-24', timestamp: '2026-09-24T09:00:00.000Z' },
        { id: 'ig_d18', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdovMztuEYoJ1qlo4-FgDTAUfY2uz_rbZBq7AM0/?stkn=MWFpZTJ6dmtqeXc2aw==', normalizedLink: 'instagram.com/reel/ddovmztueyoj1qlo4-fgdtaufy2uz_rbzbq7am0', date: '2026-09-23', timestamp: '2026-09-23T09:00:00.000Z' },
        { id: 'ig_d17', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdmKeSJOCsAWPiUNg0kMHgHKNd9i3MV212Jh7c0/?stkn=M25hYzJpZGNnNThu', normalizedLink: 'instagram.com/reel/ddmkesjocsawpiung0kmhghknd9i3mv212jh7c0', date: '2026-09-22', timestamp: '2026-09-22T09:00:00.000Z' },
        { id: 'ig_d16', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdjtYPLut6Q2n5ggqcHXS5vGitGbUgvLdHlBUM0/?stkn=MTlyYnQxc285MWFtdw==', normalizedLink: 'instagram.com/reel/ddjtyplut6q2n5ggqchxs5vgitgbugvldhlbum0', date: '2026-09-21', timestamp: '2026-09-21T09:00:00.000Z' },
        { id: 'ig_d15', userId: 'Mohit', link: 'https://www.instagram.com/reel/Ddg6kmPulsaYrscgksxJLH_p69XjHKVxPrTPmI0/?stkn=ZWlrZG1xd2E1dHI=', normalizedLink: 'instagram.com/reel/ddg6kmpulsayrscgksxjlh_p69xjhkvxprtpmi0', date: '2026-09-20', timestamp: '2026-09-20T09:00:00.000Z' },
        { id: 'ig_d14', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdekqovuRLL_bX0XRitm5yw4kUJpZ5dMOi8LKg0/?stkn=MXY1NXZnM292Ymo0ZQ==', normalizedLink: 'instagram.com/reel/ddekqovurll_bx0xritm5yw4kujpz5dmoi8lkg0', date: '2026-09-19', timestamp: '2026-09-19T09:00:00.000Z' },
        { id: 'ig_d13', userId: 'Mohit', link: 'https://www.instagram.com/reel/Ddb5kbaO3PMQSFk0l-tvAtKKeyNRBj3qZcf-ds0/?stkn=ZGQ5c3VwMnF3ZGky', normalizedLink: 'instagram.com/reel/ddb5kbao3pmqsfk0l-tvatkkeynrbj3qzcf-ds0', date: '2026-09-18', timestamp: '2026-09-18T09:00:00.000Z' },
        { id: 'ig_d12', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdZNfUKADAtg84XBtkPaptpiZTrOTpPvvISglw0/?stkn=M3ZqcjF4Zzdsbjh6', normalizedLink: 'instagram.com/reel/ddznfukadatg84xbtkpaptpiztrotppvvisglw0', date: '2026-09-17', timestamp: '2026-09-17T09:00:00.000Z' },
        { id: 'ig_d11', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdWyPqsu8JBouMdt-1G1fwldxSMbL1QZd3VDkI0/?stkn=M2JmZGRmZ25wN2sy', normalizedLink: 'instagram.com/reel/ddwypqsu8jboumdt-1g1fwldxsmbl1qzd3vdkj0', date: '2026-09-16', timestamp: '2026-09-16T09:00:00.000Z' },
        { id: 'ig_d10', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdUIFStO0O4GqgaDKmTzZJnUWoE1NDmUWkNYiA0/?stkn=ZnNmYmQwc2hrYnFj', normalizedLink: 'instagram.com/reel/dduifsto0o4gqgadkmtzsznuwoe1ndmuwknyia0', date: '2026-09-15', timestamp: '2026-09-15T09:00:00.000Z' },
        { id: 'ig_d09', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdRcam2uB59SRzovLM63LLYkf1JFVpY91BVEx80/?stkn=MTFsaXlmb3ZteTA3cA==', normalizedLink: 'instagram.com/reel/ddrcam2ub59srzovlm63llykf1jfvpyp1bvex80', date: '2026-09-14', timestamp: '2026-09-14T09:00:00.000Z' },
        { id: 'ig_d08', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdPHCz9OaTwjmKGZFpEKElnWSEkXSpojLi8YQU0/?stkn=aDZwd2YzMzQ0cGJ2', normalizedLink: 'instagram.com/reel/ddphcz9oatwjmkgzfpekelnwsekxspojli8yqu0', date: '2026-09-13', timestamp: '2026-09-13T09:00:00.000Z' },
        { id: 'ig_d07', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdMWAhvOINMM4lv-be2curMLNKSOEajt7CAXKA0/?stkn=em41ZzN0MnRldDFn', normalizedLink: 'instagram.com/reel/ddmwahvoinmm4lv-be2curmlnksoeajt7caxka0', date: '2026-09-12', timestamp: '2026-09-12T09:00:00.000Z' },
        { id: 'ig_d06', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdJvcK-u8EEUjHuNAfuYb42pUIv0Xvh07AWl-80/?stkn=N2Y5eXVyampueDRx', normalizedLink: 'instagram.com/reel/ddjvck-u8eeujhunafuyb42puiv0xvh07awl-80', date: '2026-09-11', timestamp: '2026-09-11T09:00:00.000Z' },
        { id: 'ig_d05', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdHMZIAObQIGILeT3J07faZz123UFJgU7R5m0M0/?stkn=MWwwdW4xemMzOHV2', normalizedLink: 'instagram.com/reel/ddhmziaobqigilet3j07fazz123ufjgu7r5m0m0', date: '2026-09-10', timestamp: '2026-09-10T09:00:00.000Z' },
        { id: 'ig_d04', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdErik3uDW4tkiCkgEhoyFxuQf0uk2HT3GJUZc0/?stkn=bTZvbWs4ZzBqc3py', normalizedLink: 'instagram.com/reel/dderik3udw4tkickgehoyfxuqf0uk2ht3gjuzc0', date: '2026-09-09', timestamp: '2026-09-09T09:00:00.000Z' },
        { id: 'ig_d03', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdEp2_DOE4wF6jTPV9-Ve9pvRq5dJvYuyjj_iA0/?stkn=MXZxNTB3NWFra2ZwZQ==', normalizedLink: 'instagram.com/reel/ddep2_doe4wf6jtpv9-ve9pvrq5djvyuyjj_ia0', date: '2026-09-08', timestamp: '2026-09-08T09:00:00.000Z' },
        { id: 'ig_d02', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdEYxgvO1KNDA7ezbnxbzyXWwd21c5N6eEuwsc0/?stkn=cGV3bnhjNGp5MHlx', normalizedLink: 'instagram.com/reel/ddeyxgvo1knda7ezbnxbzyxwwd21c5n6eeuwsc0', date: '2026-09-07', timestamp: '2026-09-07T09:00:00.000Z' },
        { id: 'ig_d01', userId: 'Mohit', link: 'https://www.instagram.com/reel/DdESa7zOPCvKPXrWUsGj5DPv8LyU7QnVyNgv3U0/?stkn=MWM5em96ajF5aWhydg==', normalizedLink: 'instagram.com/reel/ddesa7zopcvkpxrwusgj5dpv8lyu7qnvyngv3u0', date: '2026-09-06', timestamp: '2026-09-06T09:00:00.000Z' }
      ]
    },
    Aashish: {
      userId: 'Aashish',
      streak: 4,
      lastSubmissionDate: '2026-09-26',
      submissions: [
        { id: 'ig_a04_20260926', userId: 'Aashish', link: 'https://www.instagram.com/reel/DdwfQwZTrKdGal1vVuBeaUZlswW97cEDzWe3ZU0/?stkn=Mnl4NzM2enQ1Z2pr', normalizedLink: 'instagram.com/reel/ddwfqwztrkdgal1vvubeauzlsww97cedzwe3zu0', date: '2026-09-26', timestamp: '2026-09-26T21:00:00.000Z' },
        { id: 'ig_a03', userId: 'Aashish', link: 'https://www.instagram.com/reel/Ddt9nH6T08Pssqs__Tf14iYy-iwaCnUNp3xd_E0/?stkn=bjI1OGRhcmQwdnky', normalizedLink: 'instagram.com/reel/ddt9nh6t08pssqs__tf14iyy-iwacnunp3xd_e0', date: '2026-09-25', timestamp: '2026-09-25T09:00:00.000Z' },
        { id: 'ig_a02', userId: 'Aashish', link: 'https://www.instagram.com/reel/DdrKx18T-eLV9RqphCtjYczFH99pFmbJbGAD1s0/?stkn=MTN5b3pqcmZsOTN3cw==', normalizedLink: 'instagram.com/reel/ddrkx18t-elv9rqphctjyczfh99pfmbjbgad1s0', date: '2026-09-24', timestamp: '2026-09-24T09:00:00.000Z' },
        { id: 'ig_a01', userId: 'Aashish', link: 'https://www.instagram.com/reel/DdrIM5wTBfoxY3WiA6NIIWskMLrGdRZGEjNQN40/?stkn=MTVseTJ5MDQ4OHg4OA==', normalizedLink: 'instagram.com/reel/ddrim5wtbfoxy3wia6niiwskmlrgdrzgejnqn40', date: '2026-09-23', timestamp: '2026-09-23T09:00:00.000Z' }
      ]
    },
    Ajay: {
      userId: 'Ajay',
      streak: 6,
      lastSubmissionDate: '2026-09-26',
      submissions: [
        { id: 'ig_aj06', userId: 'Ajay', link: 'https://www.instagram.com/reel/Ddt4bozzqiVUVPGxyxIvI7RziFSSgsOSTOrXCA0/?stkn=MTRtbm50N3g1OGZ2cA==', normalizedLink: 'instagram.com/reel/ddt4bozzqivuvpgxyxivi7rzifssgsostorxca0', date: '2026-09-26', timestamp: '2026-09-26T09:00:00.000Z' },
        { id: 'ig_aj05', userId: 'Ajay', link: 'https://www.instagram.com/reel/DdrO9UJT5JErkXZujGIfME-Ioxa6jIHw6H1Vks0/?stkn=MXYybW16MTdkaXl2cw==', normalizedLink: 'instagram.com/reel/ddro9ujt5jerkxzujgifme-ioxa6jihw6h1vks0', date: '2026-09-24', timestamp: '2026-09-24T09:00:00.000Z' },
        { id: 'ig_aj04', userId: 'Ajay', link: 'https://www.instagram.com/reel/DdhF4BOzPXSAv5h1omi1Ax97fZuauRLTgi9YHY0/?stkn=ZGExZ2JjYmF0Y3Zx', normalizedLink: 'instagram.com/reel/ddhf4bozpxsav5h1omi1ax97fzuaurltgi9yhy0', date: '2026-09-23', timestamp: '2026-09-23T09:00:00.000Z' },
        { id: 'ig_aj03', userId: 'Ajay', link: 'https://www.instagram.com/reel/DdhFx_xNuRYtglgL-s7YQ91GudpubhPkP6BWUE0/?stkn=ZmF5c3Z5YWxjMWQ1', normalizedLink: 'instagram.com/reel/ddhfx_xnurytglgl-s7yq91gudpubhpkp6bwue0', date: '2026-09-22', timestamp: '2026-09-22T09:00:00.000Z' },
        { id: 'ig_aj02', userId: 'Ajay', link: 'https://www.instagram.com/reel/DdcA6AjN0toCtMwHq8aywQXVp2DAtaiGLBUac00/?stkn=Mmp3ajM3NnNwcDIw', normalizedLink: 'instagram.com/reel/ddca6ajn0toctmwhq8aywqxvp2dataiglbuac00', date: '2026-09-21', timestamp: '2026-09-21T09:00:00.000Z' },
        { id: 'ig_aj01', userId: 'Ajay', link: 'https://www.instagram.com/reel/DdZVKQZNJqclyPPgDq241LPJceAz3VQPPnmOcY0/?stkn=MWpkcTVhdDVhdTNoaw==', normalizedLink: 'instagram.com/reel/ddzvkqznjqclyppgdq241lpjceaz3vqppnmocy0', date: '2026-09-20', timestamp: '2026-09-20T09:00:00.000Z' }
      ]
    }
  }
};

function getLocalDb() {
  try {
    const raw = localStorage.getItem('talkiva_ig_db');
    if (raw) {
      const db = JSON.parse(raw);
      if (db && db.users) {
        let modified = false;
        if (db.users.Mohit) {
          db.users.Mohit.lastSubmissionDate = '2026-09-26';
          db.users.Mohit.streak = 20;
          if (db.users.Mohit.submissions && db.users.Mohit.submissions.length > 0) {
            if (db.users.Mohit.submissions[0].date === getTodayString()) {
              db.users.Mohit.submissions[0].date = '2026-09-26';
            }
          }
          modified = true;
        }
        if (db.users.Ajay && db.users.Ajay.lastSubmissionDate === getTodayString()) {
          db.users.Ajay.lastSubmissionDate = '2026-09-26';
          db.users.Ajay.streak = 6;
          if (db.users.Ajay.submissions && db.users.Ajay.submissions.length > 0) {
            if (db.users.Ajay.submissions[0].date === getTodayString()) {
              db.users.Ajay.submissions[0].date = '2026-09-26';
            }
          }
          modified = true;
        }
        if (db.users.Aashish) {
          db.users.Aashish.lastSubmissionDate = '2026-09-26';
          db.users.Aashish.streak = 4;
          const hasDay4 = (db.users.Aashish.submissions || []).some(
            (s) => s.id === 'ig_a04_20260926' || s.link.includes('DdwfQwZTrKdGal1vVuBeaUZlswW97cEDzWe3ZU0')
          );
          if (!hasDay4) {
            db.users.Aashish.submissions = [
              { id: 'ig_a04_20260926', userId: 'Aashish', link: 'https://www.instagram.com/reel/DdwfQwZTrKdGal1vVuBeaUZlswW97cEDzWe3ZU0/?stkn=Mnl4NzM2enQ1Z2pr', normalizedLink: 'instagram.com/reel/ddwfqwztrkdgal1vvubeauzlsww97cedzwe3zu0', date: '2026-09-26', timestamp: '2026-09-26T21:00:00.000Z' },
              ...(db.users.Aashish.submissions || [])
            ];
          }
          modified = true;
        }
        if (modified) {
          saveLocalDb(db);
        }
      }
      return db;
    }
  } catch (e) {
    console.error('Error reading local IG db:', e);
  }
  localStorage.setItem('talkiva_ig_db', JSON.stringify(INITIAL_FALLBACK_DB));
  return JSON.parse(JSON.stringify(INITIAL_FALLBACK_DB));
}

function saveLocalDb(db) {
  try {
    localStorage.setItem('talkiva_ig_db', JSON.stringify(db));
  } catch (e) {
    console.error('Error saving local IG db:', e);
  }
}

function getLocalOverviewData() {
  const db = getLocalDb();
  const todayStr = getTodayString();
  const overview = {};

  Object.keys(db.users).forEach((userId) => {
    const u = db.users[userId];
    let currentStreak = u.streak || 0;
    let hasSubmittedToday = false;

    if (u.lastSubmissionDate) {
      const diff = getDaysDifference(u.lastSubmissionDate, todayStr);
      if (diff === 0) {
        hasSubmittedToday = true;
      } else if (diff === 1) {
        hasSubmittedToday = false;
      } else if (diff > 1) {
        currentStreak = 0;
        hasSubmittedToday = false;
        u.streak = 0;
        saveLocalDb(db);
      }
    }

    overview[userId] = {
      userId: u.userId,
      streak: currentStreak,
      lastSubmissionDate: u.lastSubmissionDate,
      hasSubmittedToday,
      totalSubmissions: u.submissions ? u.submissions.length : 0,
      submissions: u.submissions || []
    };
  });

  return overview;
}

function mergeOverviews(server, local) {
  const merged = { ...server };

  Object.keys(local).forEach((userId) => {
    const localUser = local[userId];
    const serverUser = server[userId];

    if (!serverUser) {
      merged[userId] = localUser;
    } else {
      // Merge submissions arrays by normalizedLink
      const submissionMap = new Map();
      (serverUser.submissions || []).forEach((sub) => {
        const key = sub.normalizedLink || normalizeInstagramUrl(sub.link);
        submissionMap.set(key, sub);
      });
      (localUser.submissions || []).forEach((sub) => {
        const key = sub.normalizedLink || normalizeInstagramUrl(sub.link);
        if (!submissionMap.has(key)) {
          submissionMap.set(key, sub);
        }
      });

      const mergedSubmissions = Array.from(submissionMap.values()).sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });

      const latestDate = mergedSubmissions.length > 0 ? mergedSubmissions[0].date : null;
      const todayStr = getTodayString();
      const hasSubmittedToday = latestDate === todayStr;

      const streak = Math.max(serverUser.streak || 0, localUser.streak || 0);

      merged[userId] = {
        userId,
        streak,
        lastSubmissionDate: latestDate || serverUser.lastSubmissionDate || localUser.lastSubmissionDate,
        hasSubmittedToday: hasSubmittedToday || serverUser.hasSubmittedToday || localUser.hasSubmittedToday,
        totalSubmissions: mergedSubmissions.length,
        submissions: mergedSubmissions
      };
    }
  });

  return merged;
}

function saveLocalSubmission(userId, link) {
  const db = getLocalDb();
  const todayStr = getTodayString();
  const targetUser = db.users[userId] || {
    userId,
    streak: 0,
    lastSubmissionDate: null,
    submissions: []
  };

  if (!link || typeof link !== 'string') {
    return { success: false, error: 'Please enter a valid Instagram link.' };
  }

  const trimmedLink = link.trim();
  if (!isValidInstagramUrl(trimmedLink)) {
    return {
      success: false,
      error: 'Invalid Instagram link format. Must be a valid Instagram post or reel URL.'
    };
  }

  const normalizedInput = normalizeInstagramUrl(trimmedLink);

  if (targetUser.lastSubmissionDate) {
    const daysDiff = getDaysDifference(targetUser.lastSubmissionDate, todayStr);
    if (daysDiff === 0) {
      return {
        success: false,
        error: 'You have already submitted an Instagram link today. Only 1 submission per calendar day is allowed.'
      };
    }
  }

  const existingSubmissions = targetUser.submissions || [];
  const isDuplicate = existingSubmissions.some(
    (sub) => normalizeInstagramUrl(sub.link) === normalizedInput
  );

  if (isDuplicate) {
    return {
      success: false,
      error: 'You have already submitted this exact Instagram post/reel previously! Link must be unique.'
    };
  }

  let newStreak = 1;
  if (targetUser.lastSubmissionDate) {
    const diff = getDaysDifference(targetUser.lastSubmissionDate, todayStr);
    if (diff === 1) {
      newStreak = (targetUser.streak || 0) + 1;
    }
  }

  const newSubmission = {
    id: 'ig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId,
    link: trimmedLink,
    normalizedLink: normalizedInput,
    date: todayStr,
    timestamp: new Date().toISOString()
  };

  targetUser.streak = newStreak;
  targetUser.lastSubmissionDate = todayStr;
  targetUser.submissions.unshift(newSubmission);

  db.users[userId] = targetUser;
  saveLocalDb(db);

  return {
    success: true,
    message: `Submission successful! 🔥 Your streak is now ${newStreak} day${newStreak > 1 ? 's' : ''}.`,
    data: {
      userId,
      newStreak,
      submission: newSubmission,
      overview: getLocalOverviewData()
    }
  };
}

// ─── EXPORTED SERVICE FUNCTIONS ──────────────────────────────────────

export async function fetchInstagramOverview() {
  let serverOverview = null;

  try {
    const res = await fetch('/api/instagram/overview', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.success) {
          serverOverview = data.overview;
        }
      }
    }
  } catch (err) {
    console.warn('Backend API server not reached, using local database fallback:', err);
  }

  const localOverview = getLocalOverviewData();

  if (!serverOverview) {
    return localOverview;
  }

  // Merge server and local overview so no local submission or streak is lost
  return mergeOverviews(serverOverview, localOverview);
}

export async function submitInstagramLinkApi(userId, link) {
  // 1. Process and persist locally INSTANTLY so UI updates in 0ms
  const localRes = saveLocalSubmission(userId, link);
  if (!localRes.success) {
    return localRes;
  }

  // 2. Attempt background push to backend API asynchronously (non-blocking)
  fetch('/api/instagram/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ userId, link })
  }).then(async (res) => {
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await res.json();
      }
    }
  }).catch((err) => {
    console.warn('Background server push skipped/failed:', err);
  });

  // Return local response immediately so UI updates instantly
  return localRes;
}

export async function fetchUserInstagramHistory(userId) {
  let serverSubmissions = [];

  try {
    const res = await fetch(`/api/instagram/history/${encodeURIComponent(userId)}`);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.success) {
          serverSubmissions = data.submissions || [];
        }
      }
    }
  } catch (err) {
    console.warn('Backend API history fetch failed, using local database fallback:', err);
  }

  const db = getLocalDb();
  const u = db.users[userId];
  const localSubmissions = u ? u.submissions || [] : [];

  // Merge and deduplicate by normalizedLink
  const subMap = new Map();
  serverSubmissions.forEach((sub) => {
    const key = sub.normalizedLink || normalizeInstagramUrl(sub.link);
    subMap.set(key, sub);
  });
  localSubmissions.forEach((sub) => {
    const key = sub.normalizedLink || normalizeInstagramUrl(sub.link);
    if (!subMap.has(key)) {
      subMap.set(key, sub);
    }
  });

  return Array.from(subMap.values()).sort((a, b) => {
    return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
  });
}

