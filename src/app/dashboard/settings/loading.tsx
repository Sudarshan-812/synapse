export default function SettingsLoading() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: 'var(--cx-paper)', color: 'var(--cx-ink)' }}
    >
      {/* Header skeleton */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(246,245,242,0.88)', borderColor: 'var(--cx-line)' }}
      >
        <div className="max-w-3xl mx-auto px-6 h-[58px] flex items-center gap-4">
          <div className="h-3 w-20 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20 space-y-4">
        {/* Title skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-6 w-28 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
          <div className="h-3 w-64 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
        </div>

        {/* Avatar card skeleton */}
        <div className="cx-panel flex items-center gap-5 p-5">
          <div className="h-14 w-14 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--cx-paper-2)' }} />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-36 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
            <div className="h-3 w-48 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
          </div>
        </div>

        {/* Section skeletons */}
        {[1, 2, 3].map(i => (
          <div key={i} className="cx-panel overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--cx-line)' }}>
              <div className="size-8 rounded-xl animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
                <div className="h-2.5 w-44 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
              </div>
            </div>
            {[1, 2].map(j => (
              <div key={j} className="flex items-center justify-between px-5 py-3.5">
                <div className="h-3 w-24 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
                <div className="h-3 w-32 rounded-full animate-pulse" style={{ background: 'var(--cx-paper-2)' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
