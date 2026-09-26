/**
 * Chat Service
 * Enables real-time cross-device group chat messaging with API + local storage sync fallback.
 */

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

export async function fetchChatMessagesApi() {
  try {
    const res = await fetch('/api/chat/messages');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.messages) {
        saveLocalMessages(data.messages);
        return data.messages;
      }
    }
  } catch (err) {
    console.warn('Backend API not reached for chat, using local storage fallback:', err);
  }
  return getLocalMessages();
}

export async function sendChatMessageApi(newMessage) {
  // Update local immediately for responsive UI
  const localList = getLocalMessages();
  localList.push(newMessage);
  saveLocalMessages(localList);

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
    console.warn('Chat send fallback to local:', err);
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
    console.warn('React fallback to local:', err);
  }

  return localList;
}

export async function deleteChatMessageApi(messageId) {
  let localList = getLocalMessages();
  localList = localList.filter((m) => m.id !== messageId);
  saveLocalMessages(localList);

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
    console.warn('Delete fallback to local:', err);
  }

  return localList;
}
