import { Link } from 'react-router-dom'
import { useSettings } from './useSettings'
import { reset } from './settingsStore'
import { BACKGROUND_PRESETS, LIMITS } from './types'

export default function SettingsPage() {
  const { settings, update } = useSettings()

  return (
    <div
      className="mx-auto flex w-full max-w-[640px] flex-col gap-7 px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 40px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/home"
          aria-label="Назад"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-black/5 text-ink active:bg-black/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="text-2xl font-extrabold text-ink">Настройки</div>
      </div>

      {/* Background presets */}
      <Section title="Фон">
        <div className="flex flex-wrap gap-3">
          {BACKGROUND_PRESETS.map((p) => {
            const active = settings.background.toLowerCase() === p.value.toLowerCase()
            return (
              <button
                key={p.value}
                onClick={() => update({ background: p.value })}
                aria-label={p.name}
                className={`h-12 w-12 rounded-full border-2 transition-transform ${
                  active ? 'scale-110 border-ink' : 'border-black/10'
                }`}
                style={{ background: p.value }}
              />
            )
          })}
        </div>
      </Section>

      {/* Live glass preview */}
      <Section title="Стекло">
        <div className="relative overflow-hidden rounded-2xl">
          {/* colorful strip so the blur has something to work on */}
          <div className="flex h-20">
            <div className="flex-1 bg-[#ffd23f]" />
            <div className="flex-1 bg-[#ff9a7a]" />
            <div className="flex-1 bg-[#8ee6b0]" />
            <div className="flex-1 bg-[#b7c9ff]" />
            <div className="flex-1 bg-[#ff8fd0]" />
          </div>
          <div className="glass absolute inset-x-4 bottom-3 flex items-center justify-center rounded-full py-3 text-[13px] font-bold text-ink">
            Пример стекла
          </div>
        </div>

        <Slider
          label="Прозрачность"
          value={settings.glassOpacity}
          {...LIMITS.glassOpacity}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => update({ glassOpacity: v })}
        />
        <Slider
          label="Размытие"
          value={settings.glassBlur}
          {...LIMITS.glassBlur}
          format={(v) => `${Math.round(v)}px`}
          onChange={(v) => update({ glassBlur: v })}
        />
      </Section>

      {/* UI scale */}
      <Section title="Масштаб интерфейса">
        <Slider
          label="Масштаб"
          value={settings.scale}
          {...LIMITS.scale}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => update({ scale: v })}
        />
        <div className="text-[12px] font-medium text-black/40">
          Масштаб зафиксирован — жест «щепоткой» отключён, чтобы вид не сбивался.
        </div>
      </Section>

      <button
        onClick={() => reset()}
        className="mt-1 self-start rounded-full bg-black/5 px-5 py-2.5 text-[14px] font-bold text-ink active:bg-black/10"
      >
        Сбросить к стандартным
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[13px] font-bold uppercase tracking-wide text-black/45">
        {title}
      </div>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[14px] font-bold text-ink">
        <span>{label}</span>
        <span className="text-black/45">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-[#ff5fa2]"
      />
    </div>
  )
}
