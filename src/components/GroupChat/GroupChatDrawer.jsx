import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getDailyTopic } from '../../utils/dailyTopic';
import './GroupChatDrawer.css';

const USERS_LIST = [
  { id: 'Mohit', name: 'Mohit', role: 'Host', color: '#6366F1', avatar: '👨‍💻' },
  { id: 'Aashish', name: 'Aashish', role: 'Speaker', color: '#10B981', avatar: '🎙️' },
  { id: 'Ajay', name: 'Ajay', role: 'Learner', color: '#F59E0B', avatar: '🚀' },
];

const EMOJI_REACTIONS = ['❤️', '🔥', '👍', '👏', '💡'];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    senderId: 'Mohit',
    senderName: 'Mohit',
    text: 'Welcome to the Talkiva Group Chat! 🚀 Let\'s practice our daily speaking prompts together.',
    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: { '🔥': ['Aashish', 'Ajay'] },
  },
  {
    id: 'msg-2',
    senderId: 'Aashish',
    senderName: 'Aashish',
    text: 'Hey everyone! Ready for today\'s speaking challenge.',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: { '❤️': ['Mohit'] },
  },
  {
    id: 'msg-3',
    senderId: 'Ajay',
    senderName: 'Ajay',
    text: 'Recorded a 2-minute voice note on today\'s prompt. Sounds much smoother than yesterday!',
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: { '👏': ['Mohit', 'Aashish'] },
  }
];

export default function GroupChatDrawer({ isOpen, onClose }) {
  const { currentUser, usersList: authUsersList } = useAuth();

  const dynamicMembers = React.useMemo(() => {
    if (!authUsersList || authUsersList.length === 0) return USERS_LIST;
    return authUsersList.map((u) => {
      const match = USERS_LIST.find((m) => m.id.toLowerCase() === u.id.toLowerCase());
      if (match) return match;
      return {
        id: u.id,
        name: u.id,
        role: 'Challenger',
        color: '#6366F1',
        avatar: '👤'
      };
    });
  }, [authUsersList]);
  
  // Helper: Load saved messages
  const loadStoredMessages = () => {
    try {
      const stored = localStorage.getItem('talkiva_group_chat_messages');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    }
    return INITIAL_MESSAGES;
  };

  const [messages, setMessages] = useState(loadStoredMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const audioElementsRef = useRef({});

  const todayTopic = getDailyTopic();
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Check if today's prompt has already been shared in chat today
  const promptSharedTodayMsg = messages.find((msg) => {
    if (!msg.isPromptShare) return false;
    return msg.shareDate === todayDateStr;
  });

  const isAlreadySharedToday = Boolean(promptSharedTodayMsg);
  const sharedByUserName = promptSharedTodayMsg?.senderName || '';

  // Helper: Save messages
  const saveMessages = (newMsgs) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem('talkiva_group_chat_messages', JSON.stringify(newMsgs));
      if (newMsgs.length > 0 && currentUser) {
        localStorage.setItem('talkiva_last_read_' + currentUser.id, newMsgs[newMsgs.length - 1].id);
      }
    } catch (e) {
      console.error('Failed to save chat messages:', e);
    }
  };

  // Keep last read message ID updated when drawer is open
  useEffect(() => {
    if (isOpen && messages.length > 0 && currentUser) {
      try {
        localStorage.setItem('talkiva_last_read_' + currentUser.id, messages[messages.length - 1].id);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, messages, currentUser]);

  // Broadcast sync setup
  useEffect(() => {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('talkiva_group_chat_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type } = event.data;
        if (type === 'NEW_MESSAGE' || type === 'UPDATE_REACTION' || type === 'DELETE_MESSAGE') {
          const updated = loadStoredMessages();
          setMessages(updated);
        } else if (type === 'TYPING_START') {
          if (event.data.payload?.userId !== currentUser?.id) {
            setTypingUsers((prev) => Array.from(new Set([...prev, event.data.payload.userName])));
          }
        } else if (type === 'TYPING_STOP') {
          setTypingUsers((prev) => prev.filter((u) => u !== event.data.payload.userName));
        }
      };
    }

    const handleStorage = (e) => {
      if (e.key === 'talkiva_group_chat_messages') {
        setMessages(loadStoredMessages());
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [currentUser?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, typingUsers]);

  // Broadcast action helper
  const broadcastAction = (type, payload) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type, payload });
    }
  };

  // Handle Send Text Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    const displayName = currentUser.name || currentUser.id;

    const newMsg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      senderId: currentUser.id,
      senderName: displayName,
      senderAvatar: currentUser.avatar || '',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
    };

    const updated = [...messages, newMsg];
    saveMessages(updated);
    broadcastAction('NEW_MESSAGE', newMsg);
    setInputText('');
    stopTyping();
  };

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  // Share Daily Prompt to Chat (RESTRICTED TO 1 PERSON PER DAY — NO ALERT POPUP)
  const handleSharePrompt = () => {
    if (!currentUser || isAlreadySharedToday) return;

    const newMsg = {
      id: 'msg-prompt-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.id,
      isPromptShare: true,
      topicPrompt: todayTopic,
      shareDate: todayDateStr,
      text: `💡 Shared Today's Speaking Prompt: "${todayTopic.topic}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: { '🔥': [currentUser.id] },
    };

    const updated = [...messages, newMsg];
    saveMessages(updated);
    broadcastAction('NEW_MESSAGE', newMsg);
  };

  const QUICK_OPTIONS = [
    {
      id: 'share_prompt',
      icon: '✨',
      label: isAlreadySharedToday ? `✓ Shared by ${sharedByUserName}` : "Share Today's Prompt",
      disabled: isAlreadySharedToday,
      action: () => handleSharePrompt(),
    },
    {
      id: 'record_voice',
      icon: '🎙️',
      label: isRecording ? "Stop Voice Note" : "Record Voice Note",
      action: () => (isRecording ? stopRecording() : startRecording()),
    },
  ];

  // Audio Voice Note Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          sendVoiceNoteMessage(base64Audio, recordingTime);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record voice notes in chat.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const sendVoiceNoteMessage = (audioUrl, duration) => {
    if (!currentUser) return;
    const newMsg = {
      id: 'msg-audio-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.id,
      audioUrl: audioUrl,
      audioDuration: duration,
      text: '🎙️ Voice Note (' + duration + 's)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
    };

    const updated = [...messages, newMsg];
    saveMessages(updated);
    broadcastAction('NEW_MESSAGE', newMsg);
  };

  // Toggle Reaction on Message
  const handleToggleReaction = (msgId, emoji) => {
    if (!currentUser) return;
    const userName = currentUser.id;

    const updated = messages.map((msg) => {
      if (msg.id !== msgId) return msg;

      const currentReactions = { ...msg.reactions };
      const usersForEmoji = currentReactions[emoji] || [];

      if (usersForEmoji.includes(userName)) {
        // Remove user reaction
        const nextUsers = usersForEmoji.filter((u) => u !== userName);
        if (nextUsers.length === 0) {
          delete currentReactions[emoji];
        } else {
          currentReactions[emoji] = nextUsers;
        }
      } else {
        // Add user reaction
        currentReactions[emoji] = [...usersForEmoji, userName];
      }

      return { ...msg, reactions: currentReactions };
    });

    saveMessages(updated);
    broadcastAction('UPDATE_REACTION', { msgId, emoji, userName });
    setActiveReactionMsgId(null);
  };

  // Delete message
  const handleDeleteMessage = (msgId) => {
    const updated = messages.filter((m) => m.id !== msgId);
    saveMessages(updated);
    broadcastAction('DELETE_MESSAGE', { msgId });
  };

  // Typing broadcasts
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!currentUser) return;

    broadcastAction('TYPING_START', { userId: currentUser.id, userName: currentUser.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (!currentUser) return;
    broadcastAction('TYPING_STOP', { userId: currentUser.id, userName: currentUser.id });
  };

  // Audio Play / Pause handler
  const handlePlayAudio = (msgId, audioUrl) => {
    if (playingAudioId === msgId) {
      audioElementsRef.current[msgId]?.pause();
      setPlayingAudioId(null);
    } else {
      // Pause any currently playing audio
      Object.values(audioElementsRef.current).forEach((a) => a?.pause());
      if (!audioElementsRef.current[msgId]) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudioId(null);
        audioElementsRef.current[msgId] = audio;
      }
      audioElementsRef.current[msgId].play();
      setPlayingAudioId(msgId);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="chat-backdrop" onClick={onClose}>
        <motion.div
          className="chat-drawer glass-panel--solid"
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__title-wrap">
              <span className="chat-header__badge">LIVE GROUP</span>
              <h3 className="chat-header__title">Talkiva Community Chat 💬</h3>
            </div>
            <button className="chat-close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Active Members Bar */}
          <div className="chat-members-bar">
            <span className="chat-members-label">Members:</span>
            <div className="chat-members-list">
              {dynamicMembers.map((u) => {
                const isSelf = currentUser?.id?.toLowerCase() === u.id.toLowerCase();
                return (
                  <div key={u.id} className={`chat-member-chip ${isSelf ? 'chat-member-chip--self' : ''}`}>
                    <span className="chat-member-dot" style={{ background: u.color }} />
                    <span className="chat-member-avatar">{u.avatar}</span>
                    <span className="chat-member-name">{u.name} {isSelf ? '(You)' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message List */}
          <div className="chat-messages-container">
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <span style={{ fontSize: '2rem' }}>💬</span>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelf = currentUser?.id?.toLowerCase() === msg.senderId?.toLowerCase();
                const senderMeta = USERS_LIST.find((u) => u.id.toLowerCase() === msg.senderId?.toLowerCase()) || {
                  avatar: '👤',
                  color: '#6366F1',
                };

                return (
                  <div
                    key={msg.id}
                    className={`chat-message-row ${isSelf ? 'chat-message-row--self' : 'chat-message-row--other'}`}
                  >
                    {!isSelf && (
                      <div className="chat-avatar" style={{ borderColor: senderMeta.color }}>
                        {senderMeta.avatar}
                      </div>
                    )}

                    <div className="chat-bubble-wrap">
                      <div className="chat-sender-info">
                        <span className="chat-sender-name">{msg.senderName}</span>
                        <span className="chat-timestamp">{msg.timestamp}</span>
                      </div>

                      {/* Prompt Share Card */}
                      {msg.isPromptShare ? (
                        <div className="chat-prompt-share-card">
                          <div className="chat-prompt-share-header">
                            📌 <strong>Daily Speaking Topic</strong> #{msg.topicPrompt?.id}
                          </div>
                          <h4 className="chat-prompt-share-topic">{msg.topicPrompt?.topic}</h4>
                          <p className="chat-prompt-share-prompt">💡 {msg.topicPrompt?.prompt}</p>
                        </div>
                      ) : msg.audioUrl ? (
                        /* Voice Note Player */
                        <div className="chat-audio-card">
                          <button
                            className="chat-audio-play-btn"
                            onClick={() => handlePlayAudio(msg.id, msg.audioUrl)}
                          >
                            {playingAudioId === msg.id ? '⏸️' : '▶️'}
                          </button>
                          <div className="chat-audio-info">
                            <span className="chat-audio-label">Voice Note</span>
                            <span className="chat-audio-time">{msg.audioDuration || '0'} seconds</span>
                          </div>
                        </div>
                      ) : (
                        /* Text Bubble */
                        <div className={`chat-bubble ${isSelf ? 'chat-bubble--self' : 'chat-bubble--other'}`}>
                          {msg.text}
                        </div>
                      )}

                      {/* Reactions Badges & Picker */}
                      <div className="chat-reactions-row">
                        {msg.reactions &&
                          Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              className={`chat-reaction-badge ${users.includes(currentUser?.id) ? 'chat-reaction-badge--active' : ''}`}
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              title={users.join(', ')}
                            >
                              <span>{emoji}</span>
                              <span className="chat-reaction-count">{users.length}</span>
                            </button>
                          ))}

                        <div className="chat-reaction-trigger-wrap">
                          <button
                            className="chat-add-reaction-btn"
                            onClick={() =>
                              setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)
                            }
                          >
                            + Add Reaction
                          </button>

                          {activeReactionMsgId === msg.id && (
                            <div className="chat-emoji-picker">
                              {EMOJI_REACTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  className="chat-emoji-item"
                                  onClick={() => handleToggleReaction(msg.id, emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Delete button for self */}
                        {isSelf && (
                          <button
                            className="chat-delete-msg-btn"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete Message"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="chat-typing-row">
                <span className="chat-typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="chat-typing-text">
                  {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Active Banner */}
          {isRecording && (
            <div className="chat-recording-banner">
              <span className="chat-recording-pulse">🔴</span>
              <span className="chat-recording-timer">Recording Audio: {recordingTime}s</span>
              <div className="chat-recording-actions">
                <button className="chat-rec-btn chat-rec-btn--cancel" onClick={cancelRecording}>
                  Cancel
                </button>
                <button className="chat-rec-btn chat-rec-btn--send" onClick={stopRecording}>
                  Send Voice Note 🚀
                </button>
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <div className="chat-action-wrap">
              {/* Floating Simple Click Quick Actions Menu */}
              <AnimatePresence>
                {isQuickMenuOpen && (
                  <motion.div
                    className="chat-thumb-popup"
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="chat-thumb-popup__header">
                      <span>✨ Quick Actions</span>
                    </div>
                    <div className="chat-thumb-popup__list">
                      {QUICK_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          className={`chat-thumb-popup__item ${opt.disabled ? 'chat-thumb-popup__item--disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!opt.disabled) {
                              opt.action();
                              setIsQuickMenuOpen(false);
                            }
                          }}
                        >
                          <span className="chat-thumb-popup__icon">{opt.icon}</span>
                          <span className="chat-thumb-popup__label">{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button (✨) - Simple Click Toggle */}
              <button
                type="button"
                className={`chat-action-btn ${isQuickMenuOpen ? 'chat-action-btn--pressed' : ''} ${isAlreadySharedToday ? 'chat-action-btn--shared' : ''}`}
                onClick={() => setIsQuickMenuOpen((prev) => !prev)}
                title="Click to open Quick Actions Menu"
              >
                ✨
              </button>
            </div>

            <input
              type="text"
              className="chat-input-field"
              placeholder="Type your message or practice reflection..."
              value={inputText}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputText.trim()}
            >
              Send 🚀
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
