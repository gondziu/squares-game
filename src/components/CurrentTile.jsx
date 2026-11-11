function CurrentTile({ tile, positions, timeLimit }) {
  const [row, column] = tile.position;

  return (
    <section
      aria-label={`Wylosowany element: wiersz ${row + 1}, kolumna ${column + 1}, kolor ${tile.color}`}
      className="flex items-center justify-center"
    >
      <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
        <svg
          aria-label="Czas na ruch"
          aria-valuemin={0}
          aria-valuemax={timeLimit}
          aria-valuenow={timeLimit - tile.timeRemaining}
          aria-valuetext={`Upłynęło ${(timeLimit - tile.timeRemaining).toFixed(1)} z ${timeLimit} sekund`}
          className="absolute inset-0 h-full w-full"
          role="progressbar"
          viewBox="0 0 100 100"
        >
          <path
            d="M50 4 H82 Q96 4 96 18 V82 Q96 96 82 96 H18 Q4 96 4 82 V18 Q4 4 18 4 H50"
            fill="none"
            pathLength="1000"
            stroke="#1e293b"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M50 4 H82 Q96 4 96 18 V82 Q96 96 82 96 H18 Q4 96 4 82 V18 Q4 4 18 4 H50"
            fill="none"
            pathLength="1000"
            stroke={tile.timerColor}
            strokeDasharray="1000"
            strokeDashoffset={1000 * (tile.timeRemaining / timeLimit)}
            strokeLinecap="round"
            strokeWidth="4"
            style={{ transition: 'stroke-dashoffset 50ms linear, stroke 250ms linear' }}
          />
        </svg>
        <div
          aria-hidden="true"
          className="grid aspect-square w-20 grid-cols-2 grid-rows-2 gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1.5 shadow-lg shadow-indigo-950/50 sm:w-24"
        >
          {positions.map(([cellRow, cellColumn]) => {
            const isCurrentPosition = row === cellRow && column === cellColumn;

            return (
              <div
                key={`${cellRow}-${cellColumn}`}
                className="rounded-md border border-slate-600 bg-slate-900"
                style={isCurrentPosition ? { backgroundColor: tile.color } : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CurrentTile;
