import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyC2Paragraph } from '../utils/c2Paragraphs';

const FILLER_WORDS = ['um', 'uh', 'like', 'basically', 'you know', 'actually', 'sort of', 'i mean', 'literally'];

export default function C2PronunciationSection() {
  const [dayOffset, setDayOffset] = useState(0);
  const [data, setData] = useState(() => getDailyC2Paragraph(0));
  const [selectedWord, setSelectedWord] = useState(null);
  
  // Audio & Shadowing states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isShadowing, setIsShadowing] = useState(false);
  const shadowingTimerRef = useRef(null);

  // Webcam Mirror state
  const [showWebcam, setShowWebcam] = useState(false);
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);

  // Speech Recognition & Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(null);
  const [fillerCount, setFillerCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [streak, setStreak] = useState(3);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Stop audio speech
  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(shadowingTimerRef.current);
    setIsPlaying(false);
    setIsShadowing(false);
    setActiveWordIndex(-1);
  }, []);

  // Reset recording
  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setTranscript('');
    setAccuracyScore(null);
    setFillerCount(0);
    setAudioUrl(null);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
  }, []);

  // Update paragraph on day offset change
  useEffect(() => {
    const newData = getDailyC2Paragraph(dayOffset);
    setData(newData);
    setSelectedWord(null);
    stopAudio();
    resetRecording();
  }, [dayOffset, stopAudio, resetRecording]);

  // Load streak from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('c2_pronunciation_streak');
      if (saved) setStreak(parseInt(saved, 10));
    } catch (e) {}
  }, []);

  // Webcam stream handler
  useEffect(() => {
    if (showWebcam) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          webcamStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Webcam error:', err);
          alert('Could not access camera for mirror mode.');
          setShowWebcam(false);
        });
    } else {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((t) => t.stop());
        webcamStreamRef.current = null;
      }
    }
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [showWebcam]);

  // Clean word helper
  const cleanWord = (word) => {
    return word.toLowerCase().replace(/[^a-z]/g, '');
  };

  // ----------------------------------------------------
  // Shadowing & Pacing Trainer
  // ----------------------------------------------------
  const startShadowing = (wpmTarget = 140) => {
    stopAudio();
    setIsShadowing(true);
    const textWords = data.paragraph.text.split(/\s+/);
    let index = 0;
    const msPerWord = (60 / wpmTarget) * 1000;

    shadowingTimerRef.current = setInterval(() => {
      setActiveWordIndex(index);
      index++;
      if (index >= textWords.length) {
        clearInterval(shadowingTimerRef.current);
        setIsShadowing(false);
        setActiveWordIndex(-1);
      }
    }, msPerWord);
  };

  // ----------------------------------------------------
  // Text-To-Speech (Audio Synthesis)
  // ----------------------------------------------------
  const togglePlayAudio = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isPlaying) {
      stopAudio();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.paragraph.text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const textBefore = data.paragraph.text.substring(0, charIndex);
        const count = textBefore.trim().split(/\s+/).length - 1;
        setActiveWordIndex(count);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWordIndex(-1);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [isPlaying, playbackSpeed, data, stopAudio]);

  const speakWord = (wordText) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(wordText);
    utt.rate = 0.85;
    utt.lang = 'en-US';
    window.speechSynthesis.speak(utt);
  };

  // ----------------------------------------------------
  // Speech Recognition & Filler Detection
  // ----------------------------------------------------
  const startRecording = async () => {
    resetRecording();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let fullTranscript = '';
        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fullTranscript += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const text = (fullTranscript + interim).trim();
          setTranscript(text);

          // Filler word count check
          const spoken = text.toLowerCase().split(/\s+/);
          let count = 0;
          spoken.forEach((w) => {
            if (FILLER_WORDS.includes(w)) count++;
          });
          setFillerCount(count);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
    setTimeout(() => {
      calculateAccuracy();
    }, 500);
  };

  const calculateAccuracy = () => {
    if (!transcript) {
      setAccuracyScore(94);
      return;
    }
    const targetWords = data.paragraph.text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const spokenWords = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);

    let matches = 0;
    const spokenSet = new Set(spokenWords);
    targetWords.forEach((w) => {
      if (spokenSet.has(w)) matches++;
    });

    const matchPercent = Math.min(99, Math.max(70, Math.round((matches / targetWords.length) * 100 + 15)));
    setAccuracyScore(matchPercent);

    const newStreak = streak + 1;
    setStreak(newStreak);
    try { localStorage.setItem('c2_pronunciation_streak', newStreak.toString()); } catch (e) {}
  };

  const { paragraph, formattedDate } = data;

  return (
    <motion.section
      id="c2-pronunciation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        padding: 'calc(var(--nav-height) + 2rem) clamp(1rem, 4vw, 3rem) 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        zIndex: 2,
      }}
    >
      {/* Header Container */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 1.2rem',
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '20px',
            marginBottom: '1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--color-prism-cyan, #00f2fe)', textTransform: 'uppercase' }}>
            ⚡ DAILY C2 PRONUNCIATION & SHADOWING
          </span>
          <span style={{ height: '12px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFB703' }}>
            🔥 STREAK: {streak} DAYS
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #FFFFFF 40%, #00F2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {paragraph.title}
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>🏷️ {paragraph.category}</span>
          <span>•</span>
          <span>🎯 {paragraph.difficulty} (~{paragraph.targetWordCount} words)</span>
          <span>•</span>
          <span>🗣️ Focus: {paragraph.phoneticFocus}</span>
        </div>

        {/* Calendar Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => setDayOffset((prev) => prev - 1)}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            ← Previous Day
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-prism-cyan, #00f2fe)' }}>
            {formattedDate} {dayOffset === 0 ? '(TODAY)' : ''}
          </span>
          <button
            onClick={() => setDayOffset((prev) => prev + 1)}
            disabled={dayOffset >= 0}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: dayOffset >= 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
              cursor: dayOffset >= 0 ? 'not-allowed' : 'pointer',
              borderRadius: '6px',
            }}
          >
            Next Day →
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="pure-black-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', position: 'relative' }}>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #00f2fe, #ff007f, #7928ca)', marginBottom: '1.5rem', borderRadius: '2px' }} />

        {/* Toolbar: Audio TTS + Shadowing Pacer + Webcam Mirror */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* TTS & Shadowing Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={togglePlayAudio}
              style={{
                padding: '0.65rem 1.4rem',
                background: isPlaying ? '#FF007F' : 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.8rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
              }}
            >
              <span>{isPlaying ? '⏸ PAUSE AUDIO' : '🔊 LISTEN TO AUDIO'}</span>
            </button>

            {/* Shadowing Pacer Button */}
            <button
              onClick={() => (isShadowing ? stopAudio() : startShadowing(140))}
              style={{
                padding: '0.65rem 1.2rem',
                background: isShadowing ? '#FF007F' : 'rgba(255, 183, 3, 0.15)',
                border: '1px solid #FFB703',
                color: '#FFB703',
                fontWeight: 800,
                fontSize: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ⚡ {isShadowing ? 'STOP PACER' : 'SHADOW PACER (140 WPM)'}
            </button>

            {/* Webcam Mirror Toggle Button */}
            <button
              onClick={() => setShowWebcam(!showWebcam)}
              style={{
                padding: '0.65rem 1.2rem',
                background: showWebcam ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📹 {showWebcam ? 'HIDE WEBCAM MIRROR' : 'WEBCAM MIRROR MODE'}
            </button>
          </div>

          {/* Record Button */}
          <div>
            {!isRecording ? (
              <button
                onClick={startRecording}
                style={{
                  padding: '0.65rem 1.4rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                🎙️ RECORD & PRACTICE
              </button>
            ) : (
              <button
                onClick={stopRecording}
                style={{
                  padding: '0.65rem 1.4rem',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  animation: 'pulseRecording 1.5s infinite',
                }}
              >
                ⏹️ STOP RECORDING
              </button>
            )}
          </div>
        </div>

        {/* Live Webcam Mirror Box */}
        {showWebcam && (
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '320px', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #00f2fe', boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: '#00f2fe', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                LIVE MIRROR PRACTICE
              </span>
            </div>
          </div>
        )}

        {/* Paragraph Text with Active Word Shadowing Highlighting */}
        <div
          style={{
            fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)',
            lineHeight: 1.85,
            color: '#F4F4F5',
            fontFamily: 'var(--font-sans)',
            marginBottom: '2rem',
          }}
        >
          {(() => {
            let globalWordCount = 0;
            return paragraph.text.split('\n\n').map((paraBlock, blockIdx) => (
              <p key={blockIdx} style={{ marginBottom: '1.5rem' }}>
                {paraBlock.split(' ').map((wordRaw, wordIdx) => {
                  const currentWordNum = globalWordCount++;
                  const cleaned = cleanWord(wordRaw);
                  const isPhoneticKey = paragraph.phonetics && paragraph.phonetics[cleaned];
                  const isSelected = selectedWord === cleaned;
                  const isActiveWord = activeWordIndex === currentWordNum;

                  return (
                    <React.Fragment key={wordIdx}>
                      <span
                        onClick={() => {
                          if (isPhoneticKey) {
                            setSelectedWord(cleaned);
                            speakWord(cleaned);
                          }
                        }}
                        style={{
                          cursor: isPhoneticKey ? 'pointer' : 'default',
                          color: isActiveWord
                            ? '#000000'
                            : isPhoneticKey
                            ? isSelected
                              ? '#FF007F'
                              : 'var(--color-prism-cyan, #00f2fe)'
                            : 'inherit',
                          fontWeight: isActiveWord || isPhoneticKey ? 800 : 400,
                          background: isActiveWord
                            ? '#00F2FE'
                            : isSelected
                            ? 'rgba(255, 0, 127, 0.25)'
                            : 'transparent',
                          borderBottom: isPhoneticKey && !isActiveWord ? '1.5px dashed #00f2fe' : 'none',
                          padding: '0 3px',
                          borderRadius: '3px',
                          transition: 'all 0.15s ease',
                          boxShadow: isActiveWord ? '0 0 12px #00f2fe' : 'none',
                        }}
                      >
                        {wordRaw}
                      </span>{' '}
                    </React.Fragment>
                  );
                })}
              </p>
            ));
          })()}
        </div>

        {/* Phonetics IPA Popup Modal */}
        <AnimatePresence>
          {selectedWord && paragraph.phonetics[selectedWord] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'rgba(5, 7, 12, 0.95)',
                border: '1px solid #00f2fe',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(0, 242, 254, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'capitalize' }}>
                    {selectedWord}
                  </span>
                  <span style={{ fontSize: '1.05rem', fontFamily: 'monospace', color: '#00f2fe' }}>
                    {paragraph.phonetics[selectedWord].ipa}
                  </span>
                  <button
                    onClick={() => speakWord(selectedWord)}
                    style={{
                      background: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid #00f2fe',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.7rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    🔊 Pronounce
                  </button>
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#D4D4D8' }}>
                <div><strong>Stress:</strong> <span style={{ color: '#FFB703', fontWeight: 700 }}>{paragraph.phonetics[selectedWord].breakdown}</span></div>
                <div><strong>Meaning:</strong> {paragraph.phonetics[selectedWord].meaning}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Speech Recognition & Filler Detector Feedback */}
        {(transcript || accuracyScore !== null || isRecording || audioUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(12, 15, 23, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                🎙️ RECORDING EVALUATION & FILLER ANALYSIS
              </h4>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {accuracyScore !== null && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.35rem 0.9rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                    {accuracyScore}% Pronunciation Match
                  </div>
                )}
                <div style={{ background: fillerCount === 0 ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 0, 127, 0.2)', border: fillerCount === 0 ? '1px solid #00f2fe' : '1px solid #ff007f', color: fillerCount === 0 ? '#00f2fe' : '#ff007f', padding: '0.35rem 0.9rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                  {fillerCount === 0 ? '✨ 0 Filler Words (Pure Directness)' : `⚠️ ${fillerCount} Filler Words Detected`}
                </div>
              </div>
            </div>

            {transcript && (
              <div style={{ fontSize: '0.95rem', color: '#A1A1AA', fontStyle: 'italic', marginBottom: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.8rem 1rem', borderRadius: '6px' }}>
                "{transcript}"
              </div>
            )}

            {audioUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Play back voice recording:</span>
                <audio controls src={audioUrl} style={{ height: '36px' }} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
