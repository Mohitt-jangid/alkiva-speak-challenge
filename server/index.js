import express from 'express';
import cors from 'cors';
import {
  getOverviewData,
  submitInstagramLink,
  addUserToDb,
  removeUserFromDb,
  getDb
} from './instagramDb.js';
import {
  getChatMessages,
  addChatMessage,
  toggleChatReaction,
  deleteChatMessage
} from './chatDb.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes for Instagram Challenge

/**
 * GET /api/instagram/overview
 * Returns streaks, today submission status, and submission count for all users
 */
app.get('/api/instagram/overview', (req, res) => {
  try {
    const data = getOverviewData();
    res.json({ success: true, overview: data });
  } catch (err) {
    console.error('Error fetching Instagram overview:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/instagram/add-user
 * Registers a new user account in DB (Requires PIN 2707)
 */
app.post('/api/instagram/add-user', (req, res) => {
  try {
    const { userId, adminPin } = req.body;
    if (adminPin !== '2707') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Invalid 4-digit PIN.' });
    }
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'User ID is required.' });
    }
    const overview = addUserToDb(userId.trim());
    res.json({ success: true, message: `User ${userId} added successfully to backend DB.`, overview });
  } catch (err) {
    console.error('Error adding user to DB:', err);
    res.status(500).json({ success: false, error: 'Failed to add user to database' });
  }
});

/**
 * POST /api/instagram/remove-user
 * Removes a user account from DB (Requires PIN 2707)
 */
app.post('/api/instagram/remove-user', (req, res) => {
  try {
    const { userId, adminPin } = req.body;
    if (adminPin !== '2707') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Invalid 4-digit PIN.' });
    }
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'User ID is required.' });
    }
    const overview = removeUserFromDb(userId.trim());
    res.json({ success: true, message: `User ${userId} removed successfully from backend DB.`, overview });
  } catch (err) {
    console.error('Error removing user from DB:', err);
    res.status(500).json({ success: false, error: 'Failed to remove user from database' });
  }
});

/**
 * POST /api/instagram/submit
 * Enforces database logic for daily limits, duplicate links, streak increment/reset
 */
app.post('/api/instagram/submit', (req, res) => {
  try {
    const { userId, link } = req.body;
    
    // Auth header or request body
    const authUser = req.headers['x-user-id'] || userId;

    if (!authUser) {
      return res.status(401).json({ success: false, error: 'User ID is required for authentication.' });
    }

    const result = submitInstagramLink(authUser, link);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (err) {
    console.error('Error in Instagram submission endpoint:', err);
    res.status(500).json({ success: false, error: 'Failed to process submission' });
  }
});

/**
 * GET /api/instagram/history/:userId
 * Returns full submission history for a user
 */
app.get('/api/instagram/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    const userData = db.users[userId];
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({
      success: true,
      userId,
      submissions: userData.submissions || []
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── CHAT API ENDPOINTS ──────────────────────────────────────

app.get('/api/chat/messages', (req, res) => {
  try {
    const messages = getChatMessages();
    res.json({ success: true, messages });
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

app.post('/api/chat/send', (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.text && !message.audioUrl && !message.isPromptShare) {
      return res.status(400).json({ success: false, error: 'Invalid message payload' });
    }
    const updated = addChatMessage(message);
    res.json({ success: true, messages: updated });
  } catch (err) {
    console.error('Error sending chat message:', err);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

app.post('/api/chat/react', (req, res) => {
  try {
    const { messageId, emoji, userId } = req.body;
    const updated = toggleChatReaction(messageId, emoji, userId);
    res.json({ success: true, messages: updated });
  } catch (err) {
    console.error('Error updating reaction:', err);
    res.status(500).json({ success: false, error: 'Failed to update reaction' });
  }
});

app.post('/api/chat/delete', (req, res) => {
  try {
    const { messageId } = req.body;
    const updated = deleteChatMessage(messageId);
    res.json({ success: true, messages: updated });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
});

export default app;

// Standalone runner when executing `node server/index.js`
const isMain = process.argv[1] && (process.argv[1].endsWith('server/index.js') || process.argv[1].endsWith('server\\index.js') || process.argv[1].includes('index.js'));
if (isMain) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Instagram Challenge API server listening on http://localhost:${PORT}`);
  });
}

