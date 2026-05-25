import { Composer } from "./Composer";
import { PostCard, type Post } from "./PostCard";
import avatar1 from "@/assets/avatar1.jpg";
import avatar2 from "@/assets/avatar2.jpg";
import avatar3 from "@/assets/avatar3.jpg";
import post1 from "@/assets/post1.jpg";
import post2 from "@/assets/post2.jpg";
import post3 from "@/assets/post3.jpg";

const posts: Post[] = [
  { id: 1, avatar: avatar1, name: "nova.exe", handle: "@nova", time: "2m", verified: true,
    text: "rendered my dreams in 4d today ✶\nthis platform changes how I see the timeline forever.", image: post1,
    likes: "12.4k", reposts: "2.1k", replies: "894" },
  { id: 2, avatar: avatar2, name: "kairo.city", handle: "@kairo", time: "14m",
    text: "midnight in neo-tokyo hits different when your feed tilts with you 🌃", image: post2,
    likes: "8.9k", reposts: "1.3k", replies: "421" },
  { id: 3, avatar: avatar3, name: "lux.wave", handle: "@luxwave", time: "1h", verified: true,
    text: "chrome flows • new drop friday\nfirst 100 mints free for loopers", image: post3,
    likes: "21.2k", reposts: "4.7k", replies: "1.2k" },
  { id: 4, avatar: avatar2, name: "synth.404", handle: "@synth", time: "3h",
    text: "unpopular opinion: vertical feeds are over. spatial scroll is the future.",
    likes: "5.7k", reposts: "892", replies: "2.4k" },
  { id: 5, avatar: avatar1, name: "echo.byte", handle: "@echo", time: "5h",
    text: "got lost in the grid again. send help (or coffee) ☕️", image: post1,
    likes: "9.3k", reposts: "1.1k", replies: "612" },
  { id: 6, avatar: avatar3, name: "lux.wave", handle: "@luxwave", time: "8h", verified: true,
    text: "soft bubbles, hard beats 🪩 dropping a new visualizer tonight at 9pm UTC.", image: post3,
    likes: "15.8k", reposts: "3.2k", replies: "987" },
];

export function Feed() {
  return (
    <main className="min-w-0 flex-1 border-x border-border/50">
      <header className="sticky top-0 z-30 glass border-b border-border/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-[Syne] text-xl font-bold">Home</h1>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">live feed</div>
        </div>
        <div className="mt-3 flex gap-1 text-sm">
          {["For you", "Following", "Spaces", "Drops"].map((t, i) => (
            <button
              key={t}
              className={`relative rounded-full px-4 py-1.5 transition-colors ${
                i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {i === 0 && <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[var(--neon-pink)]" />}
            </button>
          ))}
        </div>
      </header>

      <div className="perspective-deep px-4 py-6">
        <Composer />
        <div className="mt-6 space-y-8">
          {posts.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </div>
        <div className="py-12 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          end of loop — drift deeper soon
        </div>
      </div>
    </main>
  );
}