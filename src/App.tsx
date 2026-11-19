import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { algorithms, getAlgorithm } from './algorithms';
import { AlgorithmSidebar } from './components/AlgorithmSidebar';
import { ArrayCanvas } from './components/ArrayCanvas';
import { CodePanel } from './components/CodePanel';
import { ControlBar } from './components/ControlBar';
import { DataToolbar } from './components/DataToolbar';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import {
  effectiveInput,
  MAX_SIZE,
  MAX_VALUE,
  MIN_SIZE,
  parseInput,
  randomArray,
  toInputString,
} from './core/utils';
import { usePlayer } from './hooks/usePlayer';

const FIRST = algorithms[0];

export default function App() {
  const [algorithmId, setAlgorithmId] = useState(FIRST.id);
  const meta = getAlgorithm(algorithmId);

  const [input, setInput] = useState<number[]>(FIRST.defaultInput);
  const [raw, setRaw] = useState(toInputString(FIRST.defaultInput));
  const [size, setSize] = useState(FIRST.defaultInput.length);
  const [target, setTarget] = useState(FIRST.defaultTarget);
  const [error, setError] = useState('');

  const isSearch = meta.category === '查找';
  const activeInput = useMemo(() => effectiveInput(input, meta.category), [input, meta.category]);
  const player = usePlayer(meta, activeInput, target);
  const { toggle, prev, next, reset } = player;

  const applyRaw = useCallback(() => {
    const parsed = parseInput(raw);
    if (!parsed) {
      setError(`请输入 ${MIN_SIZE}–${MAX_SIZE} 个 1–${MAX_VALUE} 的整数，用逗号或空格分隔`);
      return;
    }
    setError('');
    setInput(parsed);
    setSize(parsed.length);
  }, [raw]);

  const randomize = useCallback(() => {
    const values = randomArray(size);
    setInput(values);
    setRaw(toInputString(values));
    setError('');
  }, [size]);

  const selectAlgorithm = useCallback((id: string) => {
    setAlgorithmId(id);
    setTarget(getAlgorithm(id).defaultTarget);
    setError('');
  }, []);

  const changeTarget = useCallback((value: number) => {
    if (!Number.isFinite(value)) return;
    setTarget(Math.max(1, Math.min(MAX_VALUE, Math.round(value))));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) return;
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggle();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case 'KeyR':
          reset();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle, prev, next, reset]);

  return (
    <div className="app" style={{ '--accent': meta.accent } as CSSProperties}>
      <Header />

      <main className="layout">
        <AlgorithmSidebar active={meta} onSelect={selectAlgorithm} />

        <div className="main-column">
          <DataToolbar
            raw={raw}
            onRawChange={setRaw}
            onApply={applyRaw}
            onRandom={randomize}
            size={size}
            onSizeChange={setSize}
            error={error}
            category={meta.category}
            target={target}
            onTargetChange={changeTarget}
            autoSorted={isSearch}
          />

          <ArrayCanvas
            frame={player.frame}
            accent={meta.accent}
            category={meta.category}
            index={player.index}
            total={player.total}
          />

          <ControlBar player={player} />
        </div>

        <div className="side-column">
          <CodePanel code={meta.code} line={player.frame.line} accent={meta.accent} />
          <StatsPanel meta={meta} frame={player.frame} />
        </div>
      </main>

      <footer className="footer">
        <span>AlgoViz Studio · React + TypeScript + Vite 从零构建</span>
        <span>生成器录制执行帧 · 纯前端 · 零后端依赖</span>
      </footer>
    </div>
  );
}
