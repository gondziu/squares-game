function GameModal({
  isGameOver,
  score,
  initialTimeLimit,
  timeDecrementPerTile,
  minTimeLimit,
  onStart,
  onRematch,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/85 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8">
      <section
        aria-labelledby={isGameOver ? 'game-over-title' : 'game-start-title'}
        aria-modal="true"
        className="my-auto w-full max-w-md shrink-0 rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl sm:p-8"
        role="dialog"
      >
        {isGameOver ? (
          <>
            <h1 className="text-3xl font-bold text-white" id="game-over-title">
              Koniec gry
            </h1>
            <p className="mt-3 text-slate-300">Twój wynik</p>
            <p className="mt-1 text-5xl font-bold tabular-nums text-indigo-300">
              {score}
            </p>
            <button
              className="mt-8 w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              onClick={onRematch}
              type="button"
            >
              Rematch
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white" id="game-start-title">
              Kwadraty
            </h1>
            <p className="mt-3 text-slate-300">
              Układaj elementy na jednej z czterech plansz 2×2 i zdobądź jak najwięcej punktów.
            </p>
            <ul className="mt-6 space-y-3 text-left text-sm text-slate-300">
              <li>• Strzałki lub WASD wybierają planszę; na telefonie stuknij wybraną planszę.</li>
              <li>
                • Umieść element w jego oznaczonym polu. Limit zaczyna się od{' '}
                {initialTimeLimit.toFixed(1)} s i skraca o{' '}
                {timeDecrementPerTile.toFixed(1)} s po każdym zużytym elemencie
                (ruchu, błędzie lub timeoutcie), do minimum {minTimeLimit.toFixed(1)} s.
              </li>
              <li>• Pełna plansza daje 100 punktów za jeden kolor albo 10 za różne kolory.</li>
              <li>• Błędny ruch lub koniec czasu odbiera życie. Masz 3 życia.</li>
            </ul>
            <button
              autoFocus
              className="mt-8 w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              onClick={onStart}
              type="button"
            >
              START
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default GameModal;
