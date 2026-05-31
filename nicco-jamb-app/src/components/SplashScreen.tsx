import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

const SplashScreen = ({ onFinish, duration = 2500 }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 400);
    const finishTimer = setTimeout(() => onFinish(), duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading Nicco JAMB Practice App"
    >
      {/* Logo */}
      <div className="relative mb-6 animate-[pulse_2s_ease-in-out_infinite]">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-150" />
        <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-3xl bg-white shadow-2xl">
          <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-br from-green-600 to-emerald-700 bg-clip-text text-transparent">
            N
          </span>
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-center px-6">
        Nicco JAMB Practice
      </h1>
      <p className="mt-2 text-sm sm:text-base text-green-100 font-medium text-center px-6">
        Your AI Study Buddy for JAMB Success
      </p>

      {/* Loader */}
      <div className="mt-10 flex gap-2">
        <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-white animate-bounce" />
      </div>

      {/* Version footer */}
      <div className="absolute bottom-6 text-xs text-green-100/80">
        v1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;
