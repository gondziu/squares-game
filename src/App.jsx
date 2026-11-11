import { useCallback, useEffect, useState } from 'react'
import GameBoard from './components/GameBoard.jsx'
import GameModal from './components/GameModal.jsx'
import GameStatus from './components/GameStatus.jsx'

const INITIAL_LIFES = 3;
const INITIAL_TIME_LIMIT = 5;
const TIME_DECREMENT_PER_TILE = 0.1;
const MIN_TIME_LIMIT = 1.5;
const MOBILE_LANDSCAPE_QUERY =
  '(orientation: landscape) and (pointer: coarse) and (max-height: 600px)';
const COLORS = [
  '#4287f5',
  '#42f587',
  '#f5a742',
  '#f56642',
];
const POSITIONS = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
const BOARD_SIDES = ['top', 'right', 'bottom', 'left'];
const TILE_OPTIONS = COLORS.flatMap((color) =>
  POSITIONS.map((position) => ({ color, position })),
);

function createRandomTile(boards, seed) {
  const availableTiles = TILE_OPTIONS.filter(({ position: [row, column] }) =>
    BOARD_SIDES.some((side) => boards[side][row][column] === null),
  );

  if (availableTiles.length === 0) {
    throw new Error('Cannot draw a tile: every position is occupied on every board.');
  }

  let nextSeed = seed;
  nextSeed ^= nextSeed << 13;
  nextSeed ^= nextSeed >>> 17;
  nextSeed ^= nextSeed << 5;
  nextSeed >>>= 0;

  const randomIndex = Math.floor((nextSeed / 0x100000000) * availableTiles.length);
  const tile = availableTiles[randomIndex];

  return {
    tile: {
      color: tile.color,
      position: [...tile.position],
    },
    seed: nextSeed,
  };
}

function createEmptyBoard() {
  return Array.from({ length: 2 }, () => Array(2).fill(null));
}

function getNextTimeLimit(currentTimeLimit) {
  return Math.max(
    MIN_TIME_LIMIT,
    Math.round((currentTimeLimit - TIME_DECREMENT_PER_TILE) * 10) / 10,
  );
}

function createInitialGameState() {
  const boards = Object.fromEntries(
    BOARD_SIDES.map((side) => [side, createEmptyBoard()]),
  );
  const seed = Math.floor(Math.random() * 0xffffffff) || 1;
  const { tile, seed: nextSeed } = createRandomTile(boards, seed);

  return {
    currentTile: tile,
    boards,
    score: 0,
    lives: INITIAL_LIFES,
    timeLimit: INITIAL_TIME_LIMIT,
    timeRemaining: INITIAL_TIME_LIMIT,
    isGameOver: false,
    isGameStarted: false,
    randomSeed: nextSeed,
  };
}

function App() {
  const [gameState, setGameState] = useState(createInitialGameState);
  const [isMobileLandscape, setIsMobileLandscape] = useState(
    () => window.matchMedia(MOBILE_LANDSCAPE_QUERY).matches,
  );
  const timerProgress = gameState.timeRemaining / gameState.timeLimit;
  const timerColor =
    timerProgress <= 0.3
      ? '#f87171'
      : timerProgress <= 0.6
        ? '#fbbf24'
        : '#34d399';

  const placeCurrentTile = useCallback((side) => {
    setGameState((currentState) => {
      if (
        isMobileLandscape ||
        !currentState.isGameStarted ||
        currentState.isGameOver ||
        currentState.timeRemaining <= 0
      ) {
        return currentState;
      }

      const [row, column] = currentState.currentTile.position;
      const targetBoard = currentState.boards[side];
      const nextTimeLimit = getNextTimeLimit(currentState.timeLimit);

      if (targetBoard[row][column] !== null) {
        const lives = currentState.lives - 1;
        const { tile, seed } = createRandomTile(
          currentState.boards,
          currentState.randomSeed,
        );

        return {
          ...currentState,
          currentTile: tile,
          lives,
          timeLimit: nextTimeLimit,
          timeRemaining: nextTimeLimit,
          isGameOver: lives <= 0,
          randomSeed: seed,
        };
      }

      const updatedBoard = targetBoard.map((boardRow) => [...boardRow]);
      updatedBoard[row][column] = currentState.currentTile.color;
      const updatedBoards = {
        ...currentState.boards,
        [side]: updatedBoard,
      };
      const isBoardComplete = updatedBoard.every((boardRow) =>
        boardRow.every((cell) => cell !== null),
      );
      const isMonochromatic =
        isBoardComplete &&
        updatedBoard.flat().every((color) => color === updatedBoard[0][0]);

      if (isBoardComplete) {
        updatedBoards[side] = createEmptyBoard();
      }

      const { tile, seed } = createRandomTile(
        updatedBoards,
        currentState.randomSeed,
      );

      return {
        ...currentState,
        currentTile: tile,
        boards: updatedBoards,
        score: currentState.score + (isBoardComplete ? (isMonochromatic ? 100 : 10) : 0),
        timeLimit: nextTimeLimit,
        timeRemaining: nextTimeLimit,
        randomSeed: seed,
      };
    });
  }, [isMobileLandscape]);

  useEffect(() => {
    const orientationQuery = window.matchMedia(MOBILE_LANDSCAPE_QUERY);
    const updateOrientation = () => setIsMobileLandscape(orientationQuery.matches);

    updateOrientation();
    orientationQuery.addEventListener('change', updateOrientation);
    return () => orientationQuery.removeEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    if (
      !gameState.isGameStarted ||
      gameState.isGameOver ||
      isMobileLandscape
    ) {
      return undefined;
    }

    let lastUpdatedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastUpdatedAt) / 1000;
      lastUpdatedAt = now;

      setGameState((currentState) => {
        if (currentState.isGameOver) {
          return currentState;
        }

        const timeRemaining = Math.max(0, currentState.timeRemaining - elapsed);
        if (timeRemaining === 0) {
          if (currentState.timeRemaining <= 0) {
            return currentState;
          }

          const lives = currentState.lives - 1;
          const nextTimeLimit = getNextTimeLimit(currentState.timeLimit);
          if (lives <= 0) {
            return {
              ...currentState,
              lives: 0,
              timeLimit: nextTimeLimit,
              timeRemaining: 0,
              isGameOver: true,
            };
          }

          const { tile, seed } = createRandomTile(
            currentState.boards,
            currentState.randomSeed,
          );

          return {
            ...currentState,
            currentTile: tile,
            lives,
            timeLimit: nextTimeLimit,
            timeRemaining: nextTimeLimit,
            randomSeed: seed,
          };
        }

        return {
          ...currentState,
          timeRemaining,
        };
      });
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [
    gameState.currentTile,
    gameState.isGameOver,
    gameState.isGameStarted,
    gameState.timeLimit,
    isMobileLandscape,
  ]);

  useEffect(() => {
    if (
      !gameState.isGameStarted ||
      gameState.isGameOver ||
      isMobileLandscape
    ) {
      return undefined;
    }

    const directions = {
      arrowup: 'top',
      w: 'top',
      arrowright: 'right',
      d: 'right',
      arrowdown: 'bottom',
      s: 'bottom',
      arrowleft: 'left',
      a: 'left',
    };

    function handleKeyDown(event) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select'))
      ) {
        return;
      }

      const side = directions[event.key.toLowerCase()];
      if (!side || event.repeat) {
        return;
      }

      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
      }
      placeCurrentTile(side);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState.isGameOver,
    gameState.isGameStarted,
    isMobileLandscape,
    placeCurrentTile,
  ]);

  const currentTile = {
    ...gameState.currentTile,
    timeRemaining: gameState.timeRemaining,
    timerColor,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <GameStatus
          lives={gameState.lives}
          initialLives={INITIAL_LIFES}
          score={gameState.score}
        />
        <GameBoard
          boards={gameState.boards}
          currentTile={currentTile}
          positions={POSITIONS}
          timeLimit={gameState.timeLimit}
          onSelectBoard={placeCurrentTile}
          disabled={
            !gameState.isGameStarted ||
            gameState.isGameOver ||
            isMobileLandscape
          }
        />
      </div>

      {isMobileLandscape ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-8 backdrop-blur-sm">
          <section
            aria-labelledby="orientation-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl sm:p-8"
            role="dialog"
          >
            <h1 className="text-2xl font-bold text-white" id="orientation-title">
              Obróć telefon
            </h1>
            <p className="mt-4 text-slate-300">
              Nie można grać w orientacji poziomej. Obróć telefon do pozycji
              pionowej, aby kontynuować.
            </p>
          </section>
        </div>
      ) : (!gameState.isGameStarted || gameState.isGameOver) && (
        <GameModal
          isGameOver={gameState.isGameOver}
          score={gameState.score}
          initialTimeLimit={INITIAL_TIME_LIMIT}
          timeDecrementPerTile={TIME_DECREMENT_PER_TILE}
          minTimeLimit={MIN_TIME_LIMIT}
          onStart={() => setGameState((currentState) => ({
            ...currentState,
            isGameStarted: true,
          }))}
          onRematch={() => setGameState({
            ...createInitialGameState(),
            isGameStarted: true,
          })}
        />
      )}
    </main>
  );
}

export default App;
