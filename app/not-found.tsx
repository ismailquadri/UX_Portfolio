import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="relative flex w-full flex-1 items-center justify-center overflow-hidden py-[120px]">
        <Image
          src="/images/404-bg.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex w-[801px] max-w-[calc(100%-48px)] flex-col items-center justify-center gap-2.5 rounded-md border-[1.5px] border-border-subtle bg-[rgba(250,250,250,0.6)] px-8 py-20 text-center backdrop-blur-sm md:px-[200px]">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-body text-[18px] font-medium tracking-[-0.18px] text-ink">
                [ Oops! Page Not Found ]
              </span>
              <h1 className="font-body text-[80px] font-medium leading-none tracking-[-1.28px] text-accent md:text-[128px]">
                404
              </h1>
              <p className="font-heading text-[40px] leading-normal tracking-[-0.72px] text-accent md:text-[72px]">
                The page you&rsquo;re looking for doesn&rsquo;t exist
              </p>
            </div>
            <Link
              href="/"
              className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-white bg-black px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-paper shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.25),0px_0px_0px_2px_rgba(0,0,0,0.15)]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 8.3px 3.6px at 50% 0%, rgba(255,255,255,0.3) 11.881%, rgba(255,255,255,0) 100%)",
              }}
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
