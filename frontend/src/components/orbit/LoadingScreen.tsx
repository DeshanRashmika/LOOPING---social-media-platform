import { useEffect, useState } from "react";
import { Orbit, Sparkles } from "lucide-react";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const interval = 40;
    let val = 0;
    const timer = setInterval(() => {
      val += Math.random() * 8 + 2;
      if (val >= 100) {
        val = 100;
        clearInterval(timer);
        setTimeout(() => setExit(true), 800);
        setTimeout(() => onDone(), 1500);
      }
      setProgress(val);
    }, interval);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ${
        exit ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute h-24 w-24 animate-spin-slow rounded-full border-2 border-dashed border-[var(--neon-cyan)]/30" />
        {/* Middle ring */}
        <div
          className="absolute h-16 w-16 rounded-full border-2 border-[var(--neon-pink)]/50"
          style={{ animation: "spin-slow 8s linear infinite reverse" }}
        />
        {/* Core icon */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center">
          <Orbit className="h-10 w-10 text-[var(--neon-pink)]" strokeWidth={1.5} />
        </div>
        {/* Glow */}
        <div className="absolute h-32 w-32 rounded-full bg-[var(--neon-pink)] opacity-20 blur-2xl" />
      </div>

      <div className="mt-10 flex items-center gap-2 font-[Syne] text-2xl font-bold">
        <Sparkles className="h-5 w-5 text-[var(--neon-cyan)] animate-pulse" />
        <span className="text-gradient">LOOPING</span>
      </div>

      <div className="mt-6 w-56">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-cyan)] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {Math.floor(progress)}%
        </div>
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
        initializing spatial feed
      </div>
    </div>
  );
}