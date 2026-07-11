/** Temporary stand-in for features not built yet (notes, finances). */
export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-10 text-center text-slate-500">
      <p className="text-lg text-slate-300">{title}</p>
      <p className="text-sm">Скоро здесь что-то появится.</p>
    </div>
  )
}
