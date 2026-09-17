export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

export type PieceId = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Rotation = 0 | 1 | 2 | 3;
export type Cell = PieceId | null;
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface ActivePiece {
  id: PieceId;
  rotation: Rotation;
  x: number;
  y: number;
}

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 15;

export interface GameState {
  board: Cell[][];
  active: ActivePiece | null;
  next: PieceId | null;
  bag: PieceId[];
  score: number;
  lines: number;
  level: number;
  startLevel: number;
  progressLines: number;
  status: GameStatus;
}

export type TetrisAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESTART' }
  | { type: 'SET_LEVEL'; level: number }
  | { type: 'MOVE'; dx: number }
  | { type: 'ROTATE' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'GRAVITY' };

export interface DisplayCell {
  kind: 'empty' | 'filled' | 'ghost';
  piece?: PieceId;
}

type CellOffset = readonly [number, number];

const PIECES: PieceId[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const SHAPES: Record<PieceId, readonly (readonly CellOffset[])[]> = {
  I: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
  ],
  O: [
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
  ],
  T: [
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  S: [
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  Z: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [2, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  ],
  J: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 2],
      [1, 2],
    ],
  ],
  L: [
    [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  ],
};

// SRS kicks converted from guideline (y-up) to this board (y-down).
const JLSTZ_KICKS: Record<string, readonly CellOffset[]> = {
  '0-1': [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  '1-0': [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  '1-2': [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  '2-1': [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  '2-3': [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  '3-2': [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  '3-0': [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  '0-3': [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
};

const I_KICKS: Record<string, readonly CellOffset[]> = {
  '0-1': [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2],
  ],
  '1-0': [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2],
  ],
  '1-2': [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1],
  ],
  '2-1': [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1],
  ],
  '2-3': [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2],
  ],
  '3-2': [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2],
  ],
  '3-0': [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1],
  ],
  '0-3': [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1],
  ],
};

const LINE_SCORES = [0, 100, 300, 500, 800];

function emptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null));
}

function shuffleBag(): PieceId[] {
  const bag = [...PIECES];

  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = bag[i];
    const swap = bag[j];
    if (current === undefined || swap === undefined) {
      continue;
    }
    bag[i] = swap;
    bag[j] = current;
  }

  return bag;
}

function takeFromBag(bag: PieceId[]): { piece: PieceId; bag: PieceId[] } {
  const nextBag = bag.length > 0 ? bag : shuffleBag();
  const piece = nextBag[0];

  if (piece === undefined) {
    throw new Error('Tetris bag was empty after refill');
  }

  return { piece, bag: nextBag.slice(1) };
}

export function clampLevel(level: number): number {
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
}

function levelFromProgress(startLevel: number, progressLines: number): number {
  return clampLevel(startLevel + Math.floor(progressLines / 10));
}

export function createIdleState(): GameState {
  return {
    board: emptyBoard(),
    active: null,
    next: null,
    bag: [],
    score: 0,
    lines: 0,
    level: MIN_LEVEL,
    startLevel: MIN_LEVEL,
    progressLines: 0,
    status: 'idle',
  };
}

function spawnActive(id: PieceId): ActivePiece {
  return {
    id,
    rotation: 0,
    x: 3,
    y: id === 'I' ? -1 : 0,
  };
}

function createPlayingState(startLevel: number): GameState {
  const first = takeFromBag([]);
  const second = takeFromBag(first.bag);
  const active = spawnActive(first.piece);
  const board = emptyBoard();
  const blocked = collides(board, active);
  const level = clampLevel(startLevel);

  return {
    board,
    active,
    next: second.piece,
    bag: second.bag,
    score: 0,
    lines: 0,
    level,
    startLevel: level,
    progressLines: 0,
    status: blocked ? 'gameover' : 'playing',
  };
}

export function getPieceCells(piece: ActivePiece): Array<{ x: number; y: number }> {
  const shape = SHAPES[piece.id][piece.rotation] ?? [];

  return shape.map(([dx, dy]) => ({
    x: piece.x + dx,
    y: piece.y + dy,
  }));
}

function collides(board: Cell[][], piece: ActivePiece): boolean {
  return getPieceCells(piece).some(({ x, y }) => {
    if (x < 0 || x >= BOARD_COLS || y >= BOARD_ROWS) {
      return true;
    }

    if (y >= 0 && board[y]?.[x]) {
      return true;
    }

    return false;
  });
}

function canShift(board: Cell[][], piece: ActivePiece, dx: number, dy: number): boolean {
  return !collides(board, { ...piece, x: piece.x + dx, y: piece.y + dy });
}

function rotateClockwise(rotation: Rotation): Rotation {
  return ((rotation + 1) % 4) as Rotation;
}

function kicksFor(id: PieceId, from: Rotation, to: Rotation): readonly CellOffset[] {
  if (id === 'O') {
    return [[0, 0]];
  }

  const table = id === 'I' ? I_KICKS : JLSTZ_KICKS;
  return table[`${from}-${to}`] ?? [[0, 0]];
}

function tryRotate(state: GameState): GameState {
  const { active, board } = state;
  if (!active) {
    return state;
  }

  const nextRotation = rotateClockwise(active.rotation);

  for (const [dx, dy] of kicksFor(active.id, active.rotation, nextRotation)) {
    const candidate: ActivePiece = {
      ...active,
      rotation: nextRotation,
      x: active.x + dx,
      y: active.y + dy,
    };

    if (!collides(board, candidate)) {
      return { ...state, active: candidate };
    }
  }

  return state;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_ROWS - remaining.length;

  if (cleared === 0) {
    return { board, cleared: 0 };
  }

  const pad = Array.from({ length: cleared }, () => Array<Cell>(BOARD_COLS).fill(null));
  return { board: [...pad, ...remaining.map((row) => row.slice())], cleared };
}

function lockPiece(state: GameState): GameState {
  const { active } = state;
  if (!active) {
    return state;
  }

  const cells = getPieceCells(active);
  if (cells.some((cell) => cell.y < 0)) {
    return { ...state, active: null, status: 'gameover' };
  }

  const board = state.board.map((row) => row.slice());
  for (const { x, y } of cells) {
    const row = board[y];
    if (row) {
      row[x] = active.id;
    }
  }

  const { board: clearedBoard, cleared } = clearLines(board);
  const lines = state.lines + cleared;
  const progressLines = state.progressLines + cleared;
  const scored = state.score + (LINE_SCORES[cleared] ?? 0) * state.level;
  const level = levelFromProgress(state.startLevel, progressLines);

  return spawnNext({
    ...state,
    board: clearedBoard,
    active: null,
    score: scored,
    lines,
    level,
    progressLines,
  });
}

function spawnNext(state: GameState): GameState {
  if (state.next === null) {
    return { ...state, status: 'gameover' };
  }

  const taken = takeFromBag(state.bag);
  const active = spawnActive(state.next);

  if (collides(state.board, active)) {
    return {
      ...state,
      active,
      next: taken.piece,
      bag: taken.bag,
      status: 'gameover',
    };
  }

  return {
    ...state,
    active,
    next: taken.piece,
    bag: taken.bag,
  };
}

function ghostPiece(board: Cell[][], piece: ActivePiece): ActivePiece {
  let ghost = piece;

  while (canShift(board, ghost, 0, 1)) {
    ghost = { ...ghost, y: ghost.y + 1 };
  }

  return ghost;
}

export function dropIntervalMs(level: number): number {
  const table = [800, 720, 640, 550, 470, 380, 300, 220, 160, 120, 100, 85, 70, 60, 50];
  const index = clampLevel(level) - 1;
  return table[index] ?? 50;
}

export function buildBoardCells(state: GameState): DisplayCell[] {
  const cells: DisplayCell[] = [];

  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const filled = state.board[y]?.[x] ?? null;
      cells.push(filled ? { kind: 'filled', piece: filled } : { kind: 'empty' });
    }
  }

  if (!state.active) {
    return cells;
  }

  const ghost = ghostPiece(state.board, state.active);
  for (const { x, y } of getPieceCells(ghost)) {
    if (y >= 0 && y < BOARD_ROWS && x >= 0 && x < BOARD_COLS) {
      const index = y * BOARD_COLS + x;
      if (cells[index]?.kind === 'empty') {
        cells[index] = { kind: 'ghost', piece: state.active.id };
      }
    }
  }

  for (const { x, y } of getPieceCells(state.active)) {
    if (y >= 0 && y < BOARD_ROWS && x >= 0 && x < BOARD_COLS) {
      cells[y * BOARD_COLS + x] = { kind: 'filled', piece: state.active.id };
    }
  }

  return cells;
}

export function tetrisReducer(state: GameState, action: TetrisAction): GameState {
  switch (action.type) {
    case 'START':
      if (state.status === 'paused') {
        return { ...state, status: 'playing' };
      }
      if (state.status === 'idle' || state.status === 'gameover') {
        return createPlayingState(state.startLevel);
      }
      return state;
    case 'PAUSE':
      if (state.status === 'playing') {
        return { ...state, status: 'paused' };
      }
      if (state.status === 'paused') {
        return { ...state, status: 'playing' };
      }
      return state;
    case 'RESTART':
      return createPlayingState(state.startLevel);
    case 'SET_LEVEL': {
      if (state.status === 'playing') {
        return state;
      }

      const startLevel = clampLevel(action.level);
      return {
        ...state,
        startLevel,
        level: startLevel,
        progressLines: 0,
      };
    }
    case 'MOVE': {
      if (state.status !== 'playing' || !state.active) {
        return state;
      }
      if (!canShift(state.board, state.active, action.dx, 0)) {
        return state;
      }
      return { ...state, active: { ...state.active, x: state.active.x + action.dx } };
    }
    case 'ROTATE':
      if (state.status !== 'playing' || !state.active) {
        return state;
      }
      return tryRotate(state);
    case 'SOFT_DROP': {
      if (state.status !== 'playing' || !state.active) {
        return state;
      }
      if (canShift(state.board, state.active, 0, 1)) {
        return {
          ...state,
          active: { ...state.active, y: state.active.y + 1 },
          score: state.score + 1,
        };
      }
      return lockPiece(state);
    }
    case 'HARD_DROP': {
      if (state.status !== 'playing' || !state.active) {
        return state;
      }

      let distance = 0;
      let piece = state.active;
      while (canShift(state.board, piece, 0, 1)) {
        piece = { ...piece, y: piece.y + 1 };
        distance += 1;
      }

      return lockPiece({
        ...state,
        active: piece,
        score: state.score + distance * 2,
      });
    }
    case 'GRAVITY': {
      if (state.status !== 'playing' || !state.active) {
        return state;
      }
      if (canShift(state.board, state.active, 0, 1)) {
        return { ...state, active: { ...state.active, y: state.active.y + 1 } };
      }
      return lockPiece(state);
    }
  }
}
