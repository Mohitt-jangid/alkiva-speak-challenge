import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PROMPTS = [
  "Why is failure a far more effective teacher than immediate success?",
  "Defend why artificial intelligence will elevate human creativity rather than replace it.",
  "What is the single most important habit that shapes a person's character?",
  "Should school curriculums prioritize financial intelligence over theoretical academics?",
  "Why is comfort zone the biggest enemy of personal growth?",
  "Is overthinking a protective mechanism or a destructive mental trap?",
  "If you had 60 seconds to convince someone to read your favorite book, what would you say?",
  "What is the difference between being busy and being truly productive?",
];

export default function ImpromptuSpeechSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(null);
  const [speakSeconds, setSpeakSeconds] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [wpm, setWpm] = useState(null);

  const prepTimerRef = useRef(null);
  const speakTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const nextPrompt = () => {
    resetAll();
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  };

  const resetAll = () => {
    clearInterval(prepTimerRef.current);
    clearInterval(speakTimerRef.current);
    setPrepSeconds(null);
    setSpeakSeconds(null);
    setIsRecording(false);
    setTranscript('');
    setRecordedUrl(null);
    setWpm(null);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
  };

  const startChallenge = () => {
    resetAll();
    setPrepSeconds(5);
  };

  // Prep Countdown
  useEffect(() => {
    if (prepSeconds === null) return;
    if (prepSeconds > 0) {
      prepTimerRef.current = setTimeout(() => {
        setPrepSeconds((prev) => prev - 1);
      }, 1000);
    } else if (prepSeconds === 0) {
      setPrepSeconds(null);
      start60sRecording();
    }
    return () => clearTimeout(prepTimerRef.current);
  }, [prepSeconds]);

  // Speak 60s Countdown
  useEffect(() => {
    if (speakSeconds === null) return;
    if (speakSeconds > 0) {
      speakTimerRef.current = setTimeout(() => {
        setSpeakSeconds((prev) => prev - 1);
      }, 1000);
    } else if (speakSeconds === 0) {
      stopRecording();
    }
    return () => clearTimeout(speakTimerRef.current);
  }, [speakSeconds]);

  const start60sRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setSpeakSeconds(60);

      // Web Speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        let full = '';
        rec.onresult = (e) => {
          let interim = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) full += e.results[i][0].transcript + ' ';
            else interim += e.results[i][0].transcript;
          }
          const text = (full + interim).trim();
          setTranscript(text);

          // Calculate WPM
          const words = text.split(/\s+/).filter(Boolean).length;
          const elapsedSec = 60 - (speakSeconds || 60);
          if (elapsedSec > 3) {
            setWpm(Math.round((words / elapsedSec) * 60));
          }
        };
        rec.start();
        recognitionRef.current = rec;
      }
    } catch (e) {
      alert('Microphone access is required for the challenge.');
    }
  };

  const stopRecording = () => {
    clearInterval(speakTimerRef.current);
    setSpeakSeconds(null);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
  };

  return (
    <motion.section
      id="impromptu-speech"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: 'calc(var(--nav-height) + 2rem) clamp(1rem, 4vw, 3rem) 4rem',
        maxWidth: '1100px',
        margin: '0 auto',
        zIndex: 2,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1.2rem',
            background: 'rgba(255, 183, 3, 0.1)',
            border: '1px solid rgba(255, 183, 3, 0.4)',
            borderRadius: '20px',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(255, 183, 3, 0.25)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFB703', letterSpacing: '0.15em' }}>
            ⏱️ 60-SECOND IMPROMPTU PITCH CHALLENGE
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #FFFFFF 40%, #FFB703 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Think Fast. Speak Confidently.
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Get a random topic, take 5 seconds to gather your thoughts, and record a 60-second unscripted pitch!
        </p>
      </div>

      <div className="pure-black-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center' }}>
        {/* Topic Display Box */}
        <div
          style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
            fontWeight: 800,
            lineHeight: 1.5,
            color: '#FFFFFF',
            background: 'rgba(0,0,0,0.6)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '2rem',
          }}
        >
          "{PROMPTS[promptIndex]}"
        </div>

        {/* Timers & Status */}
        {prepSeconds !== null && (
          <div style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#00F2FE' }}>
            GET READY... {prepSeconds}s
          </div>
        )}

        {speakSeconds !== null && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FF007F' }}>
              ⏱️ {speakSeconds}s
            </span>
            {wpm !== null && (
              <span style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid #00f2fe', color: '#00f2fe', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 800 }}>
                Pacing: {wpm} WPM
              </span>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {prepSeconds === null && speakSeconds === null && !isRecording && (
            <button
              onClick={startChallenge}
              style={{
                padding: '0.8rem 2rem',
                background: 'linear-gradient(135deg, #FFB703 0%, #FF007F 100%)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(255, 183, 3, 0.4)',
              }}
            >
              🚀 START 60S PITCH CHALLENGE
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              style={{
                padding: '0.8rem 2rem',
                background: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                animation: 'pulseRecording 1.5s infinite',
              }}
            >
              ⏹️ FINISH PITCH EARLY
            </button>
          )}

          <button
            onClick={nextPrompt}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🎲 NEW PROMPT
          </button>
        </div>

        {/* Live Transcript & Recording Playback */}
        {transcript && (
          <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <strong style={{ color: '#00F2FE' }}>Spoken Transcript:</strong>
            <p style={{ fontStyle: 'italic', color: '#D4D4D8', marginTop: '0.4rem' }}>"{transcript}"</p>
          </div>
        )}

        {recordedUrl && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Listen back to your pitch:</div>
            <audio controls src={recordedUrl} style={{ height: '38px' }} />
          </div>
        )}
      </div>
    </motion.section>
  );
}
