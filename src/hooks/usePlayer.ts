import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Dispatch } from 'react';
import { BASE_DELAY_MS, createPlayerState, playerReducer } from '../core/player';
import type { PlayerAction } from '../core/player';
import type { AlgorithmMeta, Frame } from '../algorithms/types';

export interface PlayerControls {
  frames: Frame[];
  frame: Frame;
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  progress: number;
  dispatch: Dispatch<PlayerAction>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  seek: (index: number) => void;
  setSpeed: (speed: number) => void;
}

/** Allows sharing a specific execution step via `?frame=42`. */
function readInitialFrame(total: number): number {
  if (typeof window === 'undefined') return 0;
  const param = new URLSearchParams(window.location.search).get('frame');
  if (param === null) return 0;
  const value = Number(param);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, Math.floor(value)), Math.max(0, total - 1));
}

export function usePlayer(meta: AlgorithmMeta, input: number[], target: number): PlayerControls {
  // Materializing the generator once per (algorithm, data) pair gives us O(1)
  // random access to any step — that is what makes backward stepping possible.
  const frames = useMemo(() => Array.from(meta.run(input, target)), [meta, input, target]);
  const [state, dispatch] = useReducer(playerReducer, frames.length, (total) => {
    const initial = createPlayerState(total);
    return { ...initial, index: readInitialFrame(initial.total) };
  });

  // Skip the first run: the reducer already seeded the initial index from the URL.
  const previousFrames = useRef(frames);
  useEffect(() => {
    if (previousFrames.current === frames) return;
    previousFrames.current = frames;
    dispatch({ type: 'setTotal', total: frames.length });
  }, [frames]);

  useEffect(() => {
    if (!state.playing || state.total <= 1) return;
    const timer = window.setInterval(() => dispatch({ type: 'next' }), BASE_DELAY_MS / state.speed);
    return () => window.clearInterval(timer);
  }, [state.playing, state.speed, state.total]);

  const frame = frames[Math.min(state.index, frames.length - 1)] ?? frames[0];
  const index = Math.min(state.index, Math.max(0, frames.length - 1));

  const play = useCallback(() => dispatch({ type: 'play' }), []);
  const pause = useCallback(() => dispatch({ type: 'pause' }), []);
  const toggle = useCallback(() => dispatch({ type: 'toggle' }), []);
  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const prev = useCallback(() => dispatch({ type: 'prev' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);
  const seek = useCallback((value: number) => dispatch({ type: 'seek', index: value }), []);
  const setSpeed = useCallback((value: number) => dispatch({ type: 'setSpeed', speed: value }), []);

  return {
    frames,
    frame,
    index,
    total: frames.length,
    playing: state.playing,
    speed: state.speed,
    progress: frames.length > 1 ? index / (frames.length - 1) : 0,
    dispatch,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    seek,
    setSpeed,
  };
}
