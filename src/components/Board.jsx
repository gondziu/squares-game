const BOARD_LABELS = {
  top: 'Góra',
  right: 'Prawo',
  bottom: 'Dół',
  left: 'Lewo',
};

function Board({ side, cells, onSelect, disabled }) {
  return (
    <section
      aria-label={`Plansza: ${BOARD_LABELS[side]}`}
      className="flex flex-col items-center gap-2"
    >
      <button
        type="button"
        aria-label={`Umieść element na planszy: ${BOARD_LABELS[side]}`}
        onClick={() => onSelect(side)}
        disabled={disabled}
        className="rounded-xl transition enabled:cursor-pointer enabled:hover:ring-2 enabled:hover:ring-indigo-400 enabled:focus-visible:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div
          aria-hidden="true"
          className="grid aspect-square w-24 grid-cols-2 grid-rows-2 gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1.5 sm:w-28"
        >
          {cells.flatMap((row, rowIndex) =>
            row.map((color, columnIndex) => (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className="rounded-md border border-slate-600 bg-slate-900"
                style={color ? { backgroundColor: color } : undefined}
              />
            )),
          )}
        </div>
      </button>
    </section>
  );
}

export default Board;
