"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

const links = {
  product: [
    { label: "Features",  href: "#features" },
    { label: "Use Cases", href: "#features" },
    { label: "Docs",      href: "/docs" },
  ],
  legal: [
    { label: "Privacy Policy",   href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 border-t" style={{ background: 'var(--cx-paper-2)', borderColor: 'var(--cx-line)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/CortexLogo.png" alt="Cortex logo" width={18} height={18} className="object-contain" />
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>Cortex</span>
        </Link>

        <div className="flex items-center gap-5">
          {[...links.product, ...links.legal].map(link => (
            <Link key={link.label} href={link.href}
              className="text-[12.5px] transition-colors"
              style={{ color: 'var(--cx-mute-1)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-1)')}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="https://github.com/Sudarshan-812" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="transition-colors" style={{ color: 'var(--cx-mute-2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-2)')}>
            <Github className="size-4" />
          </a>
          <a href="https://x.com/Sudarshan_dev8" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
            className="transition-colors" style={{ color: 'var(--cx-mute-2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-2)')}>
            <Twitter className="size-4" />
          </a>
          <span className="text-[12px] cx-num pl-1" style={{ color: 'var(--cx-mute-2)' }}>
            &copy; {new Date().getFullYear()} Cortex
          </span>
        </div>

      </div>
    </footer>
  );
}
