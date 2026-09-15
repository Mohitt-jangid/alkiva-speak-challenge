import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TONGUE_TWISTERS = [
  {
    id: 'sibilants-1',
    category: 'Sibilants & Fricatives (/s/, /z/, /ʃ/)',
    difficulty: 'C2 Extreme',
    text: 'The specific sibilance caused seamless schisms across the subterranean philosophical sanctuary, surprising soft-spoken scholars.',
    targetPhonemes: '/s/ /z/ /ʃ/',
    tip: 'Keep your tongue tip raised close to the alveolar ridge without touching it. Maintain steady airflow on sibilants.',
  },
  {
    id: 'dentals-1',
    category: 'Dental Fricatives (/θ/, /ð/)',
    difficulty: 'C2 Master',
    text: 'Thirty-three thousand unthinking theorists thoroughly thought through therapeutic thermodynamic theories throughout Thursday.',
    targetPhonemes: '/θ/ /ð/',
    tip: 'Place the tip of your tongue gently between your front teeth. Do not substitute /f/ or /t/ for the /θ/ sound.',
  },
  {
    id: 'liquids-1',
    category: 'Liquids & Rhoticity (/r/, /l/)',
    difficulty: 'C2 Extreme',
    text: 'Literary realism requires rare rhetorical resonance, reflecting truly remarkable linguistic dexterity and cerebral rigor.',
    targetPhonemes: '/r/ /l/',
    tip: 'Curler your tongue back for /r/ without touching the roof of the mouth. Touch the alveolar ridge cleanly for /l/.',
  },
  {
    id: 'plosives-1',
    category: 'Plosives & Bilabials (/p/, /b/, /k/, /g/)',
    difficulty: 'C2 Master',
    text: 'Perspicacious politicians propose pragmatic paradigms, avoiding perplexing paradoxes and problematic public polemics.',
    targetPhonemes: '/p/ /b/ /k/',
    tip: 'Focus on crisp release of air on voiceless plosives /p/ and /k/. Avoid slurring bilabials.',
  },
];

export default function TongueTwisterSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const currentTwister = TONGUE_TWISTERS[currentIndex];

  const speakTwister = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(currentTwister.text);
    utt.rate = 0.85;
    utt.lang = 'en-US';
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utt);
  };

  const startRecording = async () => {
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
    } catch (e) {
      alert('Microphone access is required for recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <motion.section
      id="tongue-twisters"
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
            background: 'rgba(255, 0, 127, 0.1)',
            border: '1px solid rgba(255, 0, 127, 0.4)',
            borderRadius: '20px',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(255, 0, 127, 0.25)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF007F', letterSpacing: '0.15em' }}>
            👅 PHONEME & TONGUE TWISTER GYM
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #FFFFFF 40%, #FF007F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          C2 Vocal Articulation Workouts
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Master difficult English phoneme transitions, sibilants, and plosives to build unshakeable oral dexterity.
        </p>
      </div>

      {/* Main Pitch Black Card */}
      <div className="pure-black-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-prism-cyan)', letterSpacing: '0.1em' }}>
              CATEGORY: {currentTwister.category}
            </span>
            <div style={{ fontSize: '0.8rem', color: '#FFB703', fontWeight: 700 }}>
              Target Phonemes: {currentTwister.targetPhonemes}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {TONGUE_TWISTERS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setRecordedUrl(null);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: currentIndex === idx ? '1px solid #FF007F' : '1px solid rgba(255,255,255,0.2)',
                  background: currentIndex === idx ? 'rgba(255,0,127,0.2)' : 'rgba(255,255,255,0.05)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Twister Text Box */}
        <div
          style={{
            fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#FFFFFF',
            background: 'rgba(0,0,0,0.6)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          "{currentTwister.text}"
        </div>

        {/* Tip Box */}
        <div style={{ background: 'rgba(0, 242, 254, 0.08)', borderLeft: '3px solid #00f2fe', padding: '0.8rem 1.2rem', borderRadius: '4px', marginBottom: '2rem', fontSize: '0.85rem', color: '#D4D4D8' }}>
          <strong>💡 Vocal Tip:</strong> {currentTwister.tip}
        </div>

        {/* Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={speakTwister}
            style={{
              padding: '0.7rem 1.5rem',
              background: 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.8rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            }}
          >
            🔊 LISTEN TO AUDIO
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              style={{
                padding: '0.7rem 1.5rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🎙️ RECORD YOURSELF
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{
                padding: '0.7rem 1.5rem',
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

        {recordedUrl && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Your Vocal Recording:</div>
            <audio controls src={recordedUrl} style={{ height: '38px' }} />
          </div>
        )}
      </div>
    </motion.section>
  );
}
