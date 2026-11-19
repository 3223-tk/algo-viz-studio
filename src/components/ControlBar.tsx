import { SPEEDS } from '../core/player';
import type { PlayerControls } from '../hooks/usePlayer';
import { EndIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, ResetIcon } from './icons';

interface Props {
  player: PlayerControls;
}

export function ControlBar({ player }: Props) {
  const atStart = player.index <= 0;
  const atEnd = player.index >= player.total - 1;

  return (
    <section className="controls card">
      <div className="transport">
        <button type="button" className="icon-btn" title="重置 (R)" onClick={player.reset}>
          <ResetIcon />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="上一步 (←)"
          onClick={player.prev}
          disabled={atStart}
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className="play-btn"
          title={player.playing ? '暂停 (空格)' : '播放 (空格)'}
          onClick={player.toggle}
        >
          {player.playing ? <PauseIcon /> : <PlayIcon />}
          <span>{player.playing ? '暂停' : '播放'}</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          title="下一步 (→)"
          onClick={player.next}
          disabled={atEnd}
        >
          <NextIcon />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="跳到结尾"
          onClick={() => player.seek(player.total - 1)}
          disabled={atEnd}
        >
          <EndIcon />
        </button>
      </div>

      <div className="progress">
        <input
          type="range"
          min={0}
          max={Math.max(0, player.total - 1)}
          value={player.index}
          onChange={(event) => player.seek(Number(event.target.value))}
          aria-label="执行进度"
        />
        <div className="progress-meta">
          <span>
            第 <strong>{player.index + 1}</strong> / {player.total} 帧
          </span>
          <span>{Math.round(player.progress * 100)}%</span>
        </div>
      </div>

      <div className="speed">
        <span className="speed-label">速度</span>
        <div className="speed-buttons">
          {SPEEDS.map((value) => (
            <button
              type="button"
              key={value}
              className={player.speed === value ? 'is-active' : ''}
              onClick={() => player.setSpeed(value)}
            >
              {value}×
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
