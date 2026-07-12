import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from './useSettings'
import { reset } from './settingsStore'
import { BACKGROUND_PRESETS, LIMITS } from './types'
import { CATEGORY_COLORS } from '../../shared/theme'
import { Button, Card, Eyebrow, TextInput } from '../../shared/ui'

/** Downscale a picked image to a small square JPEG data URL (~256px, cover). */
async function fileToAvatar(file: File, size = 256): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('bad image'))
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const scale = Math.max(size / img.width, size / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function SettingsPage() {
  const { settings, update } = useSettings()
  const fileInput = useRef<HTMLInputElement>(null)

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      update({ avatarDataUrl: await fileToAvatar(file) })
    } catch {
      /* ignore unreadable files */
    }
    e.target.value = ''
  }

  return (
    <div
      className="mx-auto flex w-full max-w-[640px] flex-col gap-8 px-5"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 40px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          to="/home"
          aria-label="Назад"
          className="-ml-2 flex h-11 w-11 flex-none items-center justify-center rounded-ctl text-muted hover:bg-black/[.04]"
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
        <h1 className="t-display text-ink">Настройки</h1>
      </div>

      {/* Profile: avatar + vault name */}
      <section>
        <Eyebrow>Профиль</Eyebrow>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInput.current?.click()}
              aria-label="Загрузить фото"
              className="flex-none"
            >
              {settings.avatarDataUrl ? (
                <img
                  src={settings.avatarDataUrl}
                  alt=""
                  className="h-16 w-16 rounded-full border border-hairline object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint text-2xl font-extrabold text-accent">
                  {(settings.assistantName || 'e').charAt(0).toUpperCase()}
                </span>
              )}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <TextInput
                value={settings.assistantName}
                onChange={(e) => update({ assistantName: e.target.value })}
                placeholder="enough"
                aria-label="Название"
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  className="px-3 py-2 text-[13px] text-ink"
                  onClick={() => fileInput.current?.click()}
                >
                  Загрузить фото
                </Button>
                {settings.avatarDataUrl && (
                  <Button
                    variant="ghost"
                    className="px-3 py-2 text-[13px]"
                    onClick={() => update({ avatarDataUrl: null })}
                  >
                    Убрать
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={onPickAvatar}
              className="hidden"
            />
          </div>
        </Card>
      </section>

      {/* Background presets */}
      <section>
        <Eyebrow>Фон</Eyebrow>
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            {BACKGROUND_PRESETS.map((p) => {
              const active =
                settings.background.toLowerCase() === p.value.toLowerCase()
              return (
                <button
                  key={p.value}
                  onClick={() => update({ background: p.value })}
                  aria-label={p.name}
                  className={`h-11 w-11 rounded-full border transition-transform ${
                    active ? 'scale-110 border-2 border-accent' : 'border-hairline'
                  }`}
                  style={{ background: p.value }}
                />
              )
            })}
          </div>
        </Card>
      </section>

      {/* Floating-bar translucency */}
      <section>
        <Eyebrow>Прозрачность панелей</Eyebrow>
        <Card className="flex flex-col gap-4 p-4">
          <div className="relative overflow-hidden rounded-ctl">
            {/* colorful strip so the blur has something to work on */}
            <div className="flex h-20">
              {CATEGORY_COLORS.map((c) => (
                <div key={c.solid} className="flex-1" style={{ background: c.solid }} />
              ))}
            </div>
            <div className="frost absolute inset-x-4 bottom-3 flex items-center justify-center rounded-ctl py-3 t-label text-ink">
              Пример панели
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
        </Card>
      </section>

      {/* UI scale */}
      <section>
        <Eyebrow>Масштаб интерфейса</Eyebrow>
        <Card className="flex flex-col gap-3 p-4">
          <Slider
            label="Масштаб"
            value={settings.scale}
            {...LIMITS.scale}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update({ scale: v })}
          />
          <div className="text-[13px] font-medium leading-snug text-muted">
            Масштаб зафиксирован — жест «щепоткой» отключён, чтобы вид не сбивался.
          </div>
        </Card>
      </section>

      <Button variant="ghost" className="self-start text-ink" onClick={() => reset()}>
        Сбросить к стандартным
      </Button>
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
      <div className="flex items-center justify-between">
        <span className="t-body text-ink">{label}</span>
        <span className="t-caption tnum text-muted">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer"
      />
    </div>
  )
}
