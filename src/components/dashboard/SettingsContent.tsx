'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Shield, Trash2, Building2, LucideIcon } from 'lucide-react'

type Section = {
  icon: LucideIcon
  title: string
  description: string
  items: { label: string; value: string }[]
}

const ICON_MAP: Record<string, LucideIcon> = { User, Building2, Shield, Trash2 }

export function SettingsContent({
  userName,
  email,
  avatarUrl,
  sections,
}: {
  userName: string
  email: string
  avatarUrl?: string
  sections: { iconName: string; title: string; description: string; items: { label: string; value: string }[] }[]
}) {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--cx-paper)', color: 'var(--cx-ink)' }}>

      {/* Minimal sticky header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{ background: 'rgba(246,245,242,0.88)', borderColor: 'var(--cx-line)' }}
      >
        <div className="max-w-3xl mx-auto px-6 h-[58px] flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-colors"
            style={{ color: 'var(--cx-mute-1)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cx-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cx-mute-1)')}
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <span style={{ color: 'var(--cx-line-2)' }}>/</span>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--cx-ink)' }}>Settings</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--cx-ink)' }}>
            Settings
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: 'var(--cx-mute-1)' }}>
            Manage your account and workspace preferences.
          </p>
        </motion.div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="cx-panel flex items-center gap-5 p-5 mb-4"
        >
          <div
            className="h-14 w-14 rounded-full overflow-hidden border flex-shrink-0"
            style={{ borderColor: 'var(--cx-line)' }}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt={userName} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[17px] font-bold"
                style={{ background: 'var(--cx-accent-wash)', color: 'var(--cx-accent)' }}
              >
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-[15px] font-semibold" style={{ color: 'var(--cx-ink)' }}>{userName}</p>
            <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--cx-mute-1)' }}>{email}</p>
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10.5px] font-semibold uppercase tracking-[.12em]"
              style={{ color: 'var(--cx-ok)', background: 'var(--cx-ok-wash)', borderColor: 'rgba(60,110,71,0.2)' }}
            >
              <span className="size-1.5 rounded-full cx-pulse-dot" style={{ background: 'var(--cx-ok)' }} />
              Active
            </div>
          </div>
        </motion.div>

        {/* Settings sections */}
        <div className="space-y-4">
          {sections.map(({ iconName, title, description, items }, sIdx) => {
            const Icon = ICON_MAP[iconName] ?? User
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + sIdx * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="cx-panel overflow-hidden"
              >
                <div className="flex items-start gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--cx-line)' }}>
                  <div
                    className="size-8 rounded-xl flex items-center justify-center flex-shrink-0 border mt-0.5"
                    style={{ background: 'var(--cx-accent-wash)', borderColor: 'var(--cx-accent-line)' }}
                  >
                    <Icon size={14} style={{ color: 'var(--cx-accent)' }} />
                  </div>
                  <div>
                    <h2 className="text-[13.5px] font-semibold" style={{ color: 'var(--cx-ink)' }}>{title}</h2>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--cx-mute-1)' }}>{description}</p>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--cx-line)' }}>
                  {items.map(({ label, value }, iIdx) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + sIdx * 0.08 + iIdx * 0.04 }}
                      className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--cx-paper)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <span className="text-[12.5px] font-medium" style={{ color: 'var(--cx-mute-1)' }}>{label}</span>
                      <span className="text-[12.5px] font-semibold cx-num text-right max-w-[60%] truncate" style={{ color: 'var(--cx-ink)' }}>
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + sections.length * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: 'rgba(166,68,58,0.25)', background: 'var(--cx-surface)' }}
          >
            <div className="flex items-start gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(166,68,58,0.15)' }}>
              <div
                className="size-8 rounded-xl flex items-center justify-center flex-shrink-0 border mt-0.5"
                style={{ background: 'rgba(166,68,58,0.07)', borderColor: 'rgba(166,68,58,0.2)' }}
              >
                <Trash2 size={14} style={{ color: 'var(--cx-err)' }} />
              </div>
              <div>
                <h2 className="text-[13.5px] font-semibold" style={{ color: 'var(--cx-ink)' }}>Danger Zone</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--cx-mute-1)' }}>Irreversible account actions.</p>
              </div>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--cx-ink)' }}>Sign out of all devices</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--cx-mute-1)' }}>Revoke all active sessions immediately.</p>
              </div>
              {/* Uses page-level server action form passed as a slot */}
              <form action="/auth/signout" method="post">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="h-8 px-4 text-[12px] font-semibold rounded-full border transition-colors"
                  style={{ color: 'var(--cx-err)', borderColor: 'rgba(166,68,58,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(166,68,58,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  Sign out everywhere
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
