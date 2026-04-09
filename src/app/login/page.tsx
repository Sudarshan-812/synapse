'use client'

import React, { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Database,
  BrainCircuit,
  Command
} from 'lucide-react' 

import SoftAurora from "@/components/SoftAurora"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleEmailAuth = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsLoading(true)
      setError(null)
      
      try {
        if (isSignUp) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            // options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })
          if (signUpError) throw signUpError
          // If auto-confirm is on or successful, route to dashboard
          router.push('/dashboard') 
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          })
          if (signInError) throw signInError
          router.push('/dashboard')
        }
      } catch (err: any) {
        setError(err.message || "Authentication failed")
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, isSignUp, router, supabase]
  )

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err: any) {
      setError("Google login failed. Ensure OAuth is configured.")
      setIsLoading(false)
    }
  }, [supabase])

  return (
    <div className="grid h-screen w-screen overflow-hidden bg-white lg:grid-cols-2 selection:bg-fuchsia-200">
      
      {/* ─── LEFT PANEL: THE CORTEX ARCHITECTURE ─── */}
      <div className="relative hidden h-full flex-col border-r border-zinc-200/80 bg-zinc-50 p-10 lg:flex overflow-hidden">
        
        {/* WebGL Aurora Background confined to left panel */}
        <div className="absolute inset-0 z-0">
          <SoftAurora
            speed={0.4}
            scale={1.2}
            brightness={0.8}
            color1="#f8fafc"
            color2="#c026d3" // Fuchsia Cortex branding
            noiseFrequency={2.0}
            noiseAmplitude={0.7}
            bandHeight={0.5}
            bandSpread={1.2}
            octaveDecay={0.2}
            layerOffset={0.1}
            colorSpeed={0.5}
            enableMouseInteraction
            mouseInfluence={0.1}
          />
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
        
        {/* Technical Header Info */}
        <div className="relative z-10 flex items-center justify-between opacity-50">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-900 font-bold">Cortex.Auth.v2</span>
              <div className="h-px w-12 bg-zinc-400"></div>
              <div className="flex items-center gap-1.5">
                 <Database size={10} className="text-zinc-900" />
                 <span className="text-[10px] font-mono uppercase tracking-tight text-zinc-900 font-bold">pgvector-active</span>
              </div>
           </div>
           <Command size={14} className="text-zinc-900" />
        </div>

        {/* Main Content Group */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
                <h1 className="text-5xl font-bold text-zinc-950 leading-[1.05] tracking-[-0.03em]">
                    Engineering the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-950 to-zinc-500">Perfect Handshake.</span>
                </h1>
                <p className="text-zinc-700 leading-relaxed text-base max-w-sm font-medium">
                    Access the enterprise infrastructure used to turn static PDFs into an interactive, lightning-fast knowledge base.
                </p>
            </div>

            {/* Platform Status Box (Replaces the Lottie with a sleek native UI element) */}
            <div className="relative w-full rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-zinc-100">
                      <BrainCircuit className="size-4 text-zinc-950" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-950">Gemini Reasoning Engine</p>
                      <p className="text-xs text-zinc-500 font-medium">Re-ranking & Agentic Search</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-600">
                  <div className="flex items-center gap-1.5">
                     <ShieldCheck size={14} className="text-emerald-600" />
                     <span>RRF Merged</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Database size={14} className="text-blue-600" />
                     <span>768-dim Embedded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta Info */}
        <div className="relative z-10 mt-auto pt-10 flex items-center justify-between border-t border-zinc-300/50">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">© 2026 // Cortex Intelligence Platform</span>
            <div className="flex items-center gap-3 opacity-40">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
            </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: THE AUTH FORM ─── */}
      <div className="relative flex h-full items-center justify-center p-6 sm:p-12 bg-white">
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
          ← Back to site
        </Link>

        <div className="w-full max-w-[380px] space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mb-2">
              {isSignUp ? "Create your workspace" : "Welcome back"}
            </h2>
            <p className="text-sm font-medium text-zinc-500">
              {isSignUp ? "Enter your details to initialize your knowledge base." : "Access your enterprise documents and chats."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-semibold text-[14px] text-zinc-700 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg className="size-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                <path d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="mx-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">OR</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-600 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-[14px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-600">Password</label>
                {!isSignUp && (
                  <Link href="#" className="text-[12px] font-bold text-zinc-500 hover:text-zinc-950 transition-colors">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-[14px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-950 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-[13px] font-medium text-red-600 text-center mt-2">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-11 mt-2 flex items-center justify-center gap-2 bg-zinc-950 text-white rounded-xl font-bold text-[14px] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSignUp ? "Create Workspace" : "Sign In to Cortex")}
              {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-[13px] font-medium text-zinc-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp((prev) => !prev)
                setError(null)
              }}
              className="font-bold text-zinc-950 hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}