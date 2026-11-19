import { describe, expect, it } from 'vitest';
import { createPlayerState, playerReducer, SPEEDS } from './player';

describe('播放器状态机', () => {
  it('初始状态停在第 0 帧且未播放', () => {
    const state = createPlayerState(10);
    expect(state).toEqual({ index: 0, playing: false, speed: 1, total: 10 });
  });

  it('空帧序列也能安全工作（total 至少为 1）', () => {
    expect(createPlayerState(0).total).toBe(1);
    expect(playerReducer(createPlayerState(0), { type: 'next' }).index).toBe(0);
  });

  it('next 不越界，且到达末帧自动停止播放', () => {
    let state = { ...createPlayerState(3), playing: true };
    state = playerReducer(state, { type: 'next' });
    expect(state.index).toBe(1);
    expect(state.playing).toBe(true);
    state = playerReducer(state, { type: 'next' });
    expect(state.index).toBe(2);
    expect(state.playing).toBe(false);
    state = playerReducer(state, { type: 'next' });
    expect(state.index).toBe(2);
  });

  it('prev 不越界且会暂停', () => {
    const state = { ...createPlayerState(5), index: 0, playing: true };
    const result = playerReducer(state, { type: 'prev' });
    expect(result.index).toBe(0);
    expect(result.playing).toBe(false);
  });

  it('在末帧点播放会从头重播', () => {
    const state = { ...createPlayerState(4), index: 3 };
    const result = playerReducer(state, { type: 'play' });
    expect(result.index).toBe(0);
    expect(result.playing).toBe(true);
  });

  it('toggle 可反复切换', () => {
    const state = createPlayerState(4);
    expect(playerReducer(state, { type: 'toggle' }).playing).toBe(true);
    expect(
      playerReducer(playerReducer(state, { type: 'toggle' }), { type: 'toggle' }).playing,
    ).toBe(false);
  });

  it('seek 会把下标限制在合法范围', () => {
    const state = createPlayerState(8);
    expect(playerReducer(state, { type: 'seek', index: -5 }).index).toBe(0);
    expect(playerReducer(state, { type: 'seek', index: 999 }).index).toBe(7);
    expect(playerReducer(state, { type: 'seek', index: 3.6 }).index).toBe(4);
  });

  it('setSpeed 会限制在预设档位范围内', () => {
    const state = createPlayerState(8);
    expect(playerReducer(state, { type: 'setSpeed', speed: 0 }).speed).toBe(SPEEDS[0]);
    expect(playerReducer(state, { type: 'setSpeed', speed: 99 }).speed).toBe(
      SPEEDS[SPEEDS.length - 1],
    );
  });

  it('切换算法（setTotal）会重置进度与播放状态', () => {
    const state = { ...createPlayerState(20), index: 12, playing: true, speed: 4 };
    const result = playerReducer(state, { type: 'setTotal', total: 30 });
    expect(result).toEqual({ index: 0, playing: false, speed: 1, total: 30 });
  });

  it('reset 回到起点但保留速度', () => {
    const state = { ...createPlayerState(20), index: 12, playing: true, speed: 2 };
    const result = playerReducer(state, { type: 'reset' });
    expect(result).toEqual({ index: 0, playing: false, speed: 2, total: 20 });
  });
});
