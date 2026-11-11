import Board from './Board.jsx';
import CurrentTile from './CurrentTile.jsx';

function GameBoard({
  boards,
  currentTile,
  positions,
  timeLimit,
  onSelectBoard,
  disabled,
}) {
  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center gap-7">
      <Board
        side="top"
        cells={boards.top}
        onSelect={onSelectBoard}
        disabled={disabled}
      />

      <div className="flex w-full items-center justify-center gap-2 sm:gap-8">
        <Board
          side="left"
          cells={boards.left}
          onSelect={onSelectBoard}
          disabled={disabled}
        />
        <CurrentTile
          tile={currentTile}
          positions={positions}
          timeLimit={timeLimit}
        />
        <Board
          side="right"
          cells={boards.right}
          onSelect={onSelectBoard}
          disabled={disabled}
        />
      </div>

      <Board
        side="bottom"
        cells={boards.bottom}
        onSelect={onSelectBoard}
        disabled={disabled}
      />
    </div>
  );
}

export default GameBoard;
