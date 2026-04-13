import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

const links = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#features" },
    { label: "Docs", href: "/docs" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-200/60 bg-white/30 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <Image src="/CortexLogo.png" alt="Cortex logo" width={26} height={26} className="object-contain" />
              <span className="text-[17px] font-semibold tracking-tight text-zinc-950">Cortex</span>
            </Link>
            <p className="text-[13.5px] text-zinc-500 leading-relaxed max-w-[240px]">
              Turn your documents into a smart, conversational knowledge base powered by enterprise RAG.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-8 w-8 rounded-xl flex items-center justify-center border border-zinc-200/70 bg-white/60 text-zinc-500 hover:text-zinc-950 hover:bg-white transition-colors"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="h-8 w-8 rounded-xl flex items-center justify-center border border-zinc-200/70 bg-white/60 text-zinc-500 hover:text-zinc-950 hover:bg-white transition-colors"
              >
                <Twitter className="size-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Product</p>
            {links.product.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13.5px] text-zinc-500 hover:text-zinc-950 transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Legal</p>
            {links.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13.5px] text-zinc-500 hover:text-zinc-950 transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-zinc-400">
            &copy; {new Date().getFullYear()} Cortex. All rights reserved.
          </p>
          <p className="text-[12px] text-zinc-400">
            Built with Next.js, Supabase &amp; Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
}
