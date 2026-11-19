export const SPEEDS = [0.5, 1, 2, 4] as const;
export const BASE_DELAY_MS = 520;

export interface PlayerState {
  index: number;
  playing: boolean;
  speed: number;
  total: number;
}

export type PlayerAction =
  | { type: 'reset' }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'seek'; index: number }
  | { type: 'setSpeed'; speed: number }
  | { type: 'setTotal'; total: number };

export function createPlayerState(total: number): PlayerState {
  return { index: 0, playing: false, speed: 1, total: Math.max(1, total) };
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Pure, framework-independent playback state machine. Keeping it separate from
 * the React hook makes every transition unit-testable without a DOM.
 */
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  const last = Math.max(0, state.total - 1);
  switch (action.type) {
    case 'reset':
      return { ...state, index: 0, playing: false };
    case 'play':
      return { ...state, index: state.index >= last ? 0 : state.index, playing: true };
    case 'pause':
      return { ...state, playing: false };
    case 'toggle':
      return state.playing
        ? { ...state, playing: false }
        : { ...state, index: state.index >= last ? 0 : state.index, playing: true };
    case 'next': {
      const index = clamp(state.index + 1, 0, last);
      return { ...state, index, playing: index < last && state.playing };
    }
    case 'prev':
      return { ...state, index: clamp(state.index - 1, 0, last), playing: false };
    case 'seek':
      return { ...state, index: clamp(Math.round(action.index), 0, last) };
    case 'setSpeed':
      return { ...state, speed: clamp(action.speed, SPEEDS[0], SPEEDS[SPEEDS.length - 1]) };
    case 'setTotal':
      return createPlayerState(action.total);
    default:
      return state;
  }
}
