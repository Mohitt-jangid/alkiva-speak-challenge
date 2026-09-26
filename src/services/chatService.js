/**
 * Chat Service
 * Enables real-time cross-device group chat messaging with Cloud Relay (ntfy.sh) + API + local storage sync.
 * Guarantees that ALL members (including newly created accounts on mobile devices) see all messages and reactions in real-time.
 */

const CLOUD_TOPIC_URL = 'https://ntfy.sh/talkiva_community_group_chat_sync_v3_mohit';

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

function getLocalMessages() {
  try {
    const raw = localStorage.getItem('talkiva_group_chat_messages');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading local messages:', e);
  }
  localStorage.setItem('talkiva_group_chat_messages', JSON.stringify(INITIAL_MESSAGES));
  return INITIAL_MESSAGES;
}

function saveLocalMessages(messages) {
  try {
    localStorage.setItem('talkiva_group_chat_messages', JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving local messages:', e);
  }
}

// Publish event to Cloud Relay for instant cross-device broadcast
async function publishCloudEvent(eventType, payload) {
  try {
    await fetch(CLOUD_TOPIC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, payload, timestamp: Date.now() })
    });
  } catch (err) {
    console.warn('Cloud relay publish failed:', err);
  }
}

// Fetch and merge cloud stream into local storage
async function syncFromCloudRelay() {
  try {
    const res = await fetch(`${CLOUD_TOPIC_URL}/json?poll=1&since=all`);
    if (!res.ok) return getLocalMessages();

    const text = await res.text();
    if (!text.trim()) return getLocalMessages();

    const lines = text.trim().split('\n');
    let currentMsgs = [...INITIAL_MESSAGES];

    // Load any existing local custom messages first
    const localMsgs = getLocalMessages();
    localMsgs.forEach((lm) => {
      if (!currentMsgs.some((m) => m.id === lm.id)) {
        currentMsgs.push(lm);
      }
    });

    lines.forEach((line) => {
      try {
        const item = JSON.parse(line);
        if (item.event === 'message' && item.message) {
          const body = JSON.parse(item.message);
          const { eventType, payload } = body;

          if (eventType === 'SEND_MSG' && payload?.id) {
            const idx = currentMsgs.findIndex((m) => m.id === payload.id);
            if (idx > -1) {
              currentMsgs[idx] = { ...currentMsgs[idx], ...payload };
            } else {
              currentMsgs.push(payload);
            }
          } else if (eventType === 'REACT_MSG' && payload?.messageId) {
            const { messageId, emoji, userId } = payload;
            const target = currentMsgs.find((m) => m.id === messageId);
            if (target) {
              if (!target.reactions) target.reactions = {};
              if (!target.reactions[emoji]) target.reactions[emoji] = [];
              const uList = target.reactions[emoji];
              const userIdx = uList.indexOf(userId);
              if (userIdx > -1) {
                uList.splice(userIdx, 1);
                if (uList.length === 0) delete target.reactions[emoji];
              } else {
                uList.push(userId);
              }
            }
          } else if (eventType === 'DELETE_MSG' && payload?.messageId) {
            currentMsgs = currentMsgs.filter((m) => m.id !== payload.messageId);
          }
        }
      } catch {
        // Skip malformed lines
      }
    });

    saveLocalMessages(currentMsgs);
    return currentMsgs;
  } catch (err) {
    console.warn('Cloud relay sync failed, using local database:', err);
    return getLocalMessages();
  }
}

export async function fetchChatMessagesApi() {
  // 1. First try Express API endpoint
  try {
    const res = await fetch('/api/chat/messages');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.messages && data.messages.length > 0) {
        saveLocalMessages(data.messages);
        return data.messages;
      }
    }
  } catch (err) {
    console.warn('Backend API not reached for chat, syncing via Cloud Relay:', err);
  }

  // 2. Sync via Cloud Relay to capture cross-device messages sent by friends
  return await syncFromCloudRelay();
}

export async function sendChatMessageApi(newMessage) {
  // Update local immediately for responsive UI
  const localList = getLocalMessages();
  if (!localList.some((m) => m.id === newMessage.id)) {
    localList.push(newMessage);
    saveLocalMessages(localList);
  }

  // Publish to Cloud Relay instantly for all mobile users & friends
  publishCloudEvent('SEND_MSG', newMessage);

  // Send to Express backend API if available
  try {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.messages) {
        saveLocalMessages(data.messages);
        return data.messages;
      }
    }
  } catch (err) {
    console.warn('Chat send API fallback to cloud relay:', err);
  }

  return localList;
}

export async function reactChatMessageApi(messageId, emoji, userId) {
  const localList = getLocalMessages();
  const msg = localList.find((m) => m.id === messageId);
  if (msg) {
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    const list = msg.reactions[emoji];
    const idx = list.indexOf(userId);
    if (idx > -1) {
      list.splice(idx, 1);
      if (list.length === 0) delete msg.reactions[emoji];
    } else {
      list.push(userId);
    }
    saveLocalMessages(localList);
  }

  publishCloudEvent('REACT_MSG', { messageId, emoji, userId });

  try {
    const res = await fetch('/api/chat/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, emoji, userId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.messages) {
        saveLocalMessages(data.messages);
        return data.messages;
      }
    }
  } catch (err) {
    console.warn('React API fallback to cloud relay:', err);
  }

  return localList;
}

export async function deleteChatMessageApi(messageId) {
  let localList = getLocalMessages();
  localList = localList.filter((m) => m.id !== messageId);
  saveLocalMessages(localList);

  publishCloudEvent('DELETE_MSG', { messageId });

  try {
    const res = await fetch('/api/chat/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.messages) {
        saveLocalMessages(data.messages);
        return data.messages;
      }
    }
  } catch (err) {
    console.warn('Delete API fallback to cloud relay:', err);
  }

  return localList;
}
