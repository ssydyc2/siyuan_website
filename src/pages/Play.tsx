import TetrisGame from '../components/tetris/TetrisGame';

export default function Play() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="rpg-page-title font-hand text-3xl font-normal text-[var(--ink)]">Play</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
          A pocket Tetris dungeon. Clear lines, raise the level, and keep the stack below the sky.
        </p>
      </header>
      <TetrisGame />
    </div>
  );
}
