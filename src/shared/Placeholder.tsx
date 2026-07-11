/** Temporary stand-in for features not built yet (Заметки, Ещё, Скоро). */
export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="h-16 w-16 rounded-full bg-[#b7c9ff]" />
      <div className="text-base font-bold text-ink">{title}</div>
      <div className="text-[13px] font-medium text-black/45">
        Скоро здесь появится функциональность
      </div>
    </div>
  )
}
