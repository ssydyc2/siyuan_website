import { useEffect, useMemo, useReducer, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  MAX_LEVEL,
  MIN_LEVEL,
  buildBoardCells,
  createIdleState,
  dropIntervalMs,
  getPieceCells,
  tetrisReducer,
  type DisplayCell,
  type PieceId,
} from './engine';

const DAS_DELAY_MS = 160;
const ARR_MS = 45;
const SOFT_DROP_MS = 50;
const TAP_MAX_PX = 16;
const SWIPE_AXIS_PX = 24;
const HARD_DROP_VY = 0.55;

const MOVE_CODES = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD']);
const DOWN_CODES = new Set(['ArrowDown', 'KeyS']);
const ROTATE_CODES = new Set(['ArrowUp', 'KeyW', 'KeyX']);
const HARD_DROP_CODES = new Set(['Space']);
const PAUSE_CODES = new Set(['KeyP']);
const START_CODES = new Set(['Enter']);

interface BoardGesture {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  accumX: number;
  startTime: number;
  cell: number;
  movedCells: number;
  soft: boolean;
}

function formatStat(value: number, digits = 6): string {
  return value.toString().padStart(digits, '0');
}

function cellClassName(cell: DisplayCell): string {
  if (cell.kind === 'empty' || !cell.piece) {
    return 'tetris-cell tetris-cell--empty';
  }

  return `tetris-cell tetris-cell--${cell.kind} tetris-cell--${cell.piece}`;
}

function NextPreview({ piece }: { piece: PieceId | null }) {
  const occupied = useMemo(() => {
    if (!piece) {
      return new Set<string>();
    }

    return new Set(
      getPieceCells({ id: piece, rotation: 0, x: 0, y: 0 }).map((cell) => `${cell.x},${cell.y}`),
    );
  }, [piece]);

  return (
    <div className="tetris-next" aria-hidden={piece === null}>
      {Array.from({ length: 16 }, (_, index) => {
        const x = index % 4;
        const y = Math.floor(index / 4);
        const on = occupied.has(`${x},${y}`);

        return (
          <div
            key={index}
            className={on && piece ? `tetris-cell tetris-cell--filled tetris-cell--${piece}` : 'tetris-cell tetris-cell--empty'}
          />
        );
      })}
    </div>
  );
}

function NextPanel({ piece }: { piece: PieceId | null }) {
  return (
    <>
      <p className="tetris-next-panel__label font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">Next</p>
      <NextPreview piece={piece} />
    </>
  );
}

export default function TetrisGame() {
  const [state, dispatch] = useReducer(tetrisReducer, undefined, createIdleState);
  const stateRef = useRef(state);
  const boardRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<BoardGesture | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const dasTimeoutRef = useRef<number | null>(null);
  const arrIntervalRef = useRef<number | null>(null);
  const softDropIntervalRef = useRef<number | null>(null);
  const moveDirRef = useRef<-1 | 1 | 0>(0);
  const heldRef = useRef({ left: false, right: false, down: false });

  useEffect(() => {
    stateRef.current = state;
  });

  const boardCells = useMemo(() => buildBoardCells(state), [state]);

  const clearHorizontalRepeat = () => {
    if (dasTimeoutRef.current !== null) {
      window.clearTimeout(dasTimeoutRef.current);
      dasTimeoutRef.current = null;
    }
    if (arrIntervalRef.current !== null) {
      window.clearInterval(arrIntervalRef.current);
      arrIntervalRef.current = null;
    }
  };

  const clearSoftDropRepeat = () => {
    if (softDropIntervalRef.current !== null) {
      window.clearInterval(softDropIntervalRef.current);
      softDropIntervalRef.current = null;
    }
  };

  const startHorizontal = (dir: -1 | 1) => {
    moveDirRef.current = dir;
    dispatch({ type: 'MOVE', dx: dir });
    clearHorizontalRepeat();
    dasTimeoutRef.current = window.setTimeout(() => {
      arrIntervalRef.current = window.setInterval(() => {
        if (stateRef.current.status !== 'playing') {
          return;
        }
        dispatch({ type: 'MOVE', dx: dir });
      }, ARR_MS);
    }, DAS_DELAY_MS);
  };

  const releaseHorizontal = (dir: -1 | 1) => {
    if (dir === -1) {
      heldRef.current.left = false;
    } else {
      heldRef.current.right = false;
    }

    if (moveDirRef.current !== dir) {
      return;
    }

    clearHorizontalRepeat();

    if (heldRef.current.left) {
      startHorizontal(-1);
      return;
    }
    if (heldRef.current.right) {
      startHorizontal(1);
      return;
    }

    moveDirRef.current = 0;
  };

  const startSoftDrop = () => {
    if (heldRef.current.down) {
      return;
    }
    heldRef.current.down = true;
    dispatch({ type: 'SOFT_DROP' });
    clearSoftDropRepeat();
    softDropIntervalRef.current = window.setInterval(() => {
      if (stateRef.current.status !== 'playing') {
        return;
      }
      dispatch({ type: 'SOFT_DROP' });
    }, SOFT_DROP_MS);
  };

  const stopSoftDrop = () => {
    heldRef.current.down = false;
    clearSoftDropRepeat();
  };

  const onBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      return;
    }
    if (stateRef.current.status !== 'playing' || gestureRef.current) {
      return;
    }

    const width = event.currentTarget.getBoundingClientRect().width;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore when the browser has no real pointer to capture.
    }
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      accumX: 0,
      startTime: event.timeStamp,
      cell: Math.max(width / 10, 18),
      movedCells: 0,
      soft: false,
    };
  };

  const onBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || event.pointerId !== gesture.pointerId) {
      return;
    }
    if (stateRef.current.status !== 'playing') {
      return;
    }

    gesture.accumX += event.clientX - gesture.lastX;
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;

    while (gesture.accumX >= gesture.cell) {
      dispatch({ type: 'MOVE', dx: 1 });
      gesture.accumX -= gesture.cell;
      gesture.movedCells += 1;
    }
    while (gesture.accumX <= -gesture.cell) {
      dispatch({ type: 'MOVE', dx: -1 });
      gesture.accumX += gesture.cell;
      gesture.movedCells += 1;
    }

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.soft && dy > SWIPE_AXIS_PX && Math.abs(dy) > Math.abs(dx)) {
      gesture.soft = true;
      startSoftDrop();
    } else if (gesture.soft && dy < SWIPE_AXIS_PX / 2) {
      gesture.soft = false;
      stopSoftDrop();
    }
  };

  const onBoardPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || event.pointerId !== gesture.pointerId) {
      return;
    }
    gestureRef.current = null;
    stopSoftDrop();

    if (stateRef.current.status !== 'playing') {
      return;
    }

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    const dt = Math.max(event.timeStamp - gesture.startTime, 1);
    const dist = Math.hypot(dx, dy);

    if (dist < TAP_MAX_PX) {
      dispatch({ type: 'ROTATE' });
      return;
    }

    if (Math.abs(dy) > Math.abs(dx) && dy < -SWIPE_AXIS_PX) {
      dispatch({ type: 'ROTATE' });
      return;
    }

    if (gesture.movedCells === 0 && Math.abs(dx) > SWIPE_AXIS_PX && Math.abs(dx) > Math.abs(dy)) {
      dispatch({ type: 'MOVE', dx: dx > 0 ? 1 : -1 });
      return;
    }

    if (dy > SWIPE_AXIS_PX && dy / dt >= HARD_DROP_VY) {
      dispatch({ type: 'HARD_DROP' });
    }
  };

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let accumulator = 0;

    const loop = (now: number) => {
      const current = stateRef.current;
      const delta = Math.min(now - last, 100);
      last = now;

      if (current.status === 'playing') {
        accumulator += delta;
        const interval = dropIntervalMs(current.level);
        while (accumulator >= interval && stateRef.current.status === 'playing') {
          accumulator -= interval;
          dispatch({ type: 'GRAVITY' });
        }
      } else {
        accumulator = 0;
      }

      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (state.status !== 'playing') {
      clearHorizontalRepeat();
      clearSoftDropRepeat();
      heldRef.current = { left: false, right: false, down: false };
      moveDirRef.current = 0;
      gestureRef.current = null;
    }
  }, [state.status]);

  useEffect(() => {
    const isGameKey = (code: string) =>
      MOVE_CODES.has(code) ||
      DOWN_CODES.has(code) ||
      ROTATE_CODES.has(code) ||
      HARD_DROP_CODES.has(code) ||
      PAUSE_CODES.has(code) ||
      START_CODES.has(code);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGameKey(event.code)) {
        return;
      }

      event.preventDefault();

      if (event.repeat) {
        return;
      }

      if (START_CODES.has(event.code)) {
        if (stateRef.current.status === 'idle' || stateRef.current.status === 'gameover') {
          dispatch({ type: 'START' });
        } else if (stateRef.current.status === 'paused') {
          dispatch({ type: 'PAUSE' });
        }
        return;
      }

      if (PAUSE_CODES.has(event.code)) {
        dispatch({ type: 'PAUSE' });
        return;
      }

      if (stateRef.current.status !== 'playing') {
        return;
      }

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        heldRef.current.left = true;
        startHorizontal(-1);
        return;
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        heldRef.current.right = true;
        startHorizontal(1);
        return;
      }
      if (DOWN_CODES.has(event.code)) {
        startSoftDrop();
        return;
      }
      if (ROTATE_CODES.has(event.code)) {
        dispatch({ type: 'ROTATE' });
        return;
      }
      if (HARD_DROP_CODES.has(event.code)) {
        dispatch({ type: 'HARD_DROP' });
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (HARD_DROP_CODES.has(event.code)) {
        event.preventDefault();
      }

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        releaseHorizontal(-1);
        return;
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        releaseHorizontal(1);
        return;
      }
      if (DOWN_CODES.has(event.code)) {
        stopSoftDrop();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearHorizontalRepeat();
      clearSoftDropRepeat();
    };
    // Repeat helpers close over dispatch and refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayLabel =
    state.status === 'idle'
      ? 'Ready'
      : state.status === 'paused'
        ? 'Paused'
        : state.status === 'gameover'
          ? 'Game Over'
          : null;

  const overlayHint =
    state.status === 'idle'
      ? 'Tap to start'
      : state.status === 'paused'
        ? 'Tap to resume'
        : state.status === 'gameover'
          ? 'Tap to restart'
          : null;

  const canAdjustLevel = state.status !== 'playing';
  const canPause = state.status === 'playing' || state.status === 'paused';

  return (
    <div className="tetris-game">
      <div className="tetris-stage">
        <div className="tetris-well rpg-panel relative border border-[var(--rule)] bg-[var(--paper-elevated)]">
          <div
            ref={boardRef}
            className="tetris-board"
            role="img"
            aria-label="Tetris board, ten columns by twenty rows. On touch screens, swipe to move, tap or swipe up to rotate, swipe down to drop."
            onPointerDown={onBoardPointerDown}
            onPointerMove={onBoardPointerMove}
            onPointerUp={onBoardPointerUp}
            onPointerCancel={onBoardPointerUp}
            onLostPointerCapture={onBoardPointerUp}
            onContextMenu={(event) => event.preventDefault()}
          >
            {boardCells.map((cell, index) => (
              <div key={index} className={cellClassName(cell)} />
            ))}
          </div>
          {overlayLabel ? (
            <button
              type="button"
              className={`tetris-overlay tetris-overlay--interactive ${reduceMotion ? 'tetris-overlay--static' : ''}`}
              aria-live="polite"
              onClick={() => dispatch({ type: 'START' })}
            >
              <p className="font-hand text-3xl text-[var(--ink)]">{overlayLabel}</p>
              {overlayHint ? <p className="tetris-overlay__hint">{overlayHint}</p> : null}
            </button>
          ) : null}
          <div className="tetris-next-dock tetris-next-dock--board">
            <NextPanel piece={state.next} />
          </div>
        </div>
        <p className="tetris-swipe-hint">Swipe ← → to move · Tap or swipe up to rotate · Swipe down to drop</p>
      </div>

      <div className="tetris-rail">
        <aside className="tetris-status rpg-panel border border-[var(--rule)] bg-[var(--paper-elevated)]">
          <p className="tetris-status__label font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">Status</p>
          <dl className="tetris-status__stats mt-3 space-y-3">
            <div className="tetris-stat">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">Score</dt>
              <dd className="font-mono text-lg tabular-nums text-[var(--ink)]">{formatStat(state.score)}</dd>
            </div>
            <div className="tetris-stat">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">Lines</dt>
              <dd className="font-mono text-lg tabular-nums text-[var(--ink)]">{formatStat(state.lines, 3)}</dd>
            </div>
            <div className="tetris-stat tetris-stat--level">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">Level</dt>
              <dd>
                <div className="tetris-level-stepper">
                  <button
                    type="button"
                    className="tetris-level-stepper__btn"
                    aria-label="Decrease level"
                    disabled={!canAdjustLevel || state.level <= MIN_LEVEL}
                    onClick={() => dispatch({ type: 'SET_LEVEL', level: state.level - 1 })}
                  >
                    −
                  </button>
                  <span className="tetris-level-stepper__value" aria-live="polite">
                    {state.level}
                  </span>
                  <button
                    type="button"
                    className="tetris-level-stepper__btn"
                    aria-label="Increase level"
                    disabled={!canAdjustLevel || state.level >= MAX_LEVEL}
                    onClick={() => dispatch({ type: 'SET_LEVEL', level: state.level + 1 })}
                  >
                    +
                  </button>
                </div>
              </dd>
            </div>
          </dl>

          <div className="tetris-next-dock tetris-next-dock--rail mt-4 border-t border-[var(--rule)] pt-3">
            <NextPanel piece={state.next} />
          </div>
        </aside>

        <div className="tetris-actions">
          <button
            type="button"
            className={`tetris-action-btn ${canPause ? 'tetris-action-btn--primary' : ''}`}
            onClick={() => dispatch({ type: 'PAUSE' })}
            disabled={!canPause}
          >
            {state.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            className={`tetris-action-btn ${canPause ? '' : 'tetris-action-btn--primary'}`}
            onClick={() => dispatch({ type: state.status === 'idle' ? 'START' : 'RESTART' })}
          >
            {state.status === 'idle' ? 'Start' : 'Restart'}
          </button>
        </div>
      </div>
    </div>
  );
}
