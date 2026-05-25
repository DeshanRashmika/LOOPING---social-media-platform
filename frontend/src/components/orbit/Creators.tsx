import { Image as ImageIcon, Smile, Sparkles, MapPin } from "lucide-react";
import avatar1 from "@/assets/avatar1.jpg";

export function Composer() {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex gap-3">
        <img src={avatar1} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 flex-shrink-0 rounded-full object-cover ring-2 ring-[var(--neon-pink)]/50" />
        <div className="flex-1">
          <textarea
            rows={2}
            placeholder="What's happening in your loop?"
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1 text-[var(--neon-pink)]">
              {[ImageIcon, Smile, Sparkles, MapPin].map((Icon, i) => (
                <button key={i} className="rounded-full p-2 transition-colors hover:bg-[var(--neon-pink)]/10">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button className="rounded-full bg-[var(--neon-pink)] px-5 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
              Drop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}