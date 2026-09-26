import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'chat_db.json');

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    senderId: 'Mohit',
    senderName: 'Mohit Jangid',
    text: "Welcome to the Talkiva Group Chat! 🚀 Let's practice our daily speaking prompts together.",
    timestamp: '09:30 AM',
    reactions: { '🔥': ['Aashish', 'Ajay'] },
  },
  {
    id: 'msg-2',
    senderId: 'Aashish',
    senderName: 'Aashish',
    text: "Hey everyone! Ready for today's speaking challenge.",
    timestamp: '09:33 AM',
    reactions: { '❤️': ['Mohit'] },
  },
  {
    id: 'msg-3',
    senderId: 'Ajay',
    senderName: 'Ajay Choudhary',
    text: "Recorded a 2-minute voice note on today's prompt. Sounds much smoother than yesterday!",
    timestamp: '10:03 AM',
    reactions: { '👏': ['Mohit', 'Aashish'] },
  }
];

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      messages: INITIAL_MESSAGES
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export function getChatMessages() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data.messages || [];
  } catch (err) {
    console.error('Error reading Chat DB:', err);
    ensureDb();
    return INITIAL_MESSAGES;
  }
}

export function saveChatMessages(messages) {
  ensureDb();
  try {
    const data = { messages };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing Chat DB:', err);
  }
}

export function addChatMessage(newMessage) {
  const messages = getChatMessages();
  messages.push(newMessage);
  saveChatMessages(messages);
  return messages;
}

export function toggleChatReaction(messageId, emoji, userId) {
  const messages = getChatMessages();
  const msg = messages.find((m) => m.id === messageId);
  if (msg) {
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const userList = msg.reactions[emoji];
    const index = userList.indexOf(userId);
    if (index > -1) {
      userList.splice(index, 1);
      if (userList.length === 0) delete msg.reactions[emoji];
    } else {
      userList.push(userId);
    }
    saveChatMessages(messages);
  }
  return messages;
}

export function deleteChatMessage(messageId) {
  let messages = getChatMessages();
  messages = messages.filter((m) => m.id !== messageId);
  saveChatMessages(messages);
  return messages;
}
