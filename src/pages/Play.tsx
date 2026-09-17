import TetrisGame from '../components/tetris/TetrisGame';

export default function Play() {
  return (
    <div className="space-y-6">
      <header className="flex justify-center">
        <h1 className="rpg-page-title font-hand text-3xl font-normal text-[var(--ink)]">Play</h1>
      </header>
      <TetrisGame />
    </div>
  );
}
