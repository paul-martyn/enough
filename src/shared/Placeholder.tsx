/** Temporary stand-in for features not built yet (Заметки, Ещё, Скоро). */
export default function Placeholder({ title }: { title: string }) {
  return (
    <div
      className="mx-auto flex w-full max-w-[640px] flex-col items-center justify-center gap-3 px-5 text-center"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 35vh)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)',
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-card bg-accent-tint text-accent">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12h.01M12 12h.01M19 12h.01"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="t-title text-ink">{title}</div>
      <div className="t-body font-medium text-muted">Этот раздел ещё в работе.</div>
    </div>
  )
}
