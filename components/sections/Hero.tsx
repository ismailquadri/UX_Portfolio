import ChatWidget from "@/components/ChatWidget";

// Original abstract gradient, not a reproduction of any Apple wallpaper —
// soft, blurred color blobs over a dark base in the visual spirit of macOS
// default wallpapers (Monterey/Sonoma-style mesh gradients), kept dark at
// the bottom so the white caption text underneath stays legible.
const HERO_BACKGROUND = {
  backgroundImage: [
    "radial-gradient(120% 120% at 15% 18%, #6ea8ff 0%, rgba(110,168,255,0) 55%)",
    "radial-gradient(100% 100% at 85% 12%, #a78bfa 0%, rgba(167,139,250,0) 55%)",
    "radial-gradient(90% 90% at 30% 85%, #ff9a76 0%, rgba(255,154,118,0) 50%)",
    "radial-gradient(100% 90% at 80% 90%, #4fd1c5 0%, rgba(79,209,197,0) 50%)",
    "linear-gradient(180deg, #0b1020 0%, #141428 45%, #05070d 100%)",
  ].join(", "),
};

export default function Hero() {
  return (
    <section className="flex w-full flex-col items-start">
      <div className="flex w-full flex-col items-start gap-6 px-6 pb-8 pt-10 md:pb-10">
        <div className="flex w-full items-end justify-between gap-6">
          <h1 className="relative max-w-[720px] font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
            <span className="block">Turning complex problems</span>
            <span className="relative z-10 block">
              <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[380px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
              into products people understand.
            </span>
          </h1>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ PRODUCT DESIGNER ]
          </p>
        </div>
        <p className="max-w-[560px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
          I&rsquo;m Quadri, a product designer working across FinTech, AI-native, and GovTech — helping teams move from uncertain to shipped.
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col items-end">
        <div className="flex h-[814px] w-full items-center justify-center overflow-clip px-6 py-3">
          <div
            className="relative h-full w-full overflow-clip rounded-lg"
            style={HERO_BACKGROUND}
          >
            <ChatWidget />

            <div className="absolute left-1/2 top-[714px] w-[calc(100%_-_24px)] max-w-[337px] -translate-x-1/2 text-center font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-paper">
              <p>
                You can send me a message via this popup with the tag{" "}
                <span className="rounded-[8px] border border-white/10 bg-white/20 px-1.5 py-0.5 text-[14px] tracking-[-0.14px] opacity-70">
                  @quadri
                </span>{" "}
                or ask anything about my service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
