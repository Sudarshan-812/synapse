import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white py-12 px-6">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/CortexLogo.png" alt="Cortex" className="h-6 w-auto object-contain" />
          <span className="text-[15px] font-semibold text-zinc-900">Cortex</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          <Link href="#features" className="text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors">
            How it works
          </Link>
          <Link href="/dashboard" className="text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors">
            Dashboard
          </Link>
          <Link href="/login" className="text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors">
            Sign in
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-[12px] text-zinc-400">
          &copy; {new Date().getFullYear()} Cortex. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
