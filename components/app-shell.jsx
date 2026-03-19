"use client";

import { createContext, useContext, useRef, useState } from "react";

const MusicPlayerContext = createContext(null);

export function AppShell({ children }) {
  const audioRef = useRef(null);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const startMusic = async () => {
    const player = audioRef.current;
    if (!player) {
      return false;
    }

    try {
      await player.play();
      setMusicEnabled(true);
      return true;
    } catch {
      setMusicEnabled(false);
      return false;
    }
  };

  const toggleMusic = async () => {
    const player = audioRef.current;
    if (!player) {
      return;
    }

    if (musicEnabled) {
      player.pause();
      setMusicEnabled(false);
      return;
    }

    await startMusic();
  };

  return (
    <MusicPlayerContext.Provider value={{ musicEnabled, startMusic, toggleMusic }}>
      {children}
      <audio ref={audioRef} src="/audio/paulyudin-wedding-485932.mp3" loop preload="auto" />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error("useMusicPlayer must be used inside AppShell.");
  }

  return context;
}
