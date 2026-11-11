function GameStatus({ lives, initialLives, score }) {
  return (
    <header className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between border-0 bg-transparent px-3 py-2 shadow-none md:static md:rounded-2xl md:border md:border-slate-800 md:bg-slate-900 md:px-5 md:py-4 md:shadow-lg sm:px-8">
      <div
        aria-label={`Pozostało żyć: ${lives}`}
        aria-live="polite"
        className="flex flex-col gap-2"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Lifes
        </span>
        <div aria-hidden="true" className="flex gap-2">
          {Array.from({ length: initialLives }, (_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${
                index < lives
                  ? 'bg-rose-400 shadow-sm shadow-rose-400/50'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-300">
          {lives}/{initialLives}
        </span>
      </div>

      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Result
        </span>
        <p aria-live="polite" className="text-2xl font-bold tabular-nums">
          {score}
        </p>
      </div>
    </header>
  );
}

export default GameStatus;
