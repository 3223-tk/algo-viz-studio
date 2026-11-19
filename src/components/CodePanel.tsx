import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface Props {
  code: string[];
  line: number;
  accent: string;
}

const KEYWORDS = new Set([
  'function',
  'const',
  'let',
  'if',
  'else',
  'for',
  'while',
  'return',
  'break',
  'void',
  'number',
  'true',
  'false',
  'new',
]);

function tokenClass(token: string): string {
  if (/^\s+$/.test(token)) return '';
  if (KEYWORDS.has(token)) return 'tok-keyword';
  if (/^\d+$/.test(token)) return 'tok-num';
  if (/^[A-Za-z_]\w*$/.test(token)) return 'tok-ident';
  if (/^[<>=!+\-*/;:,().[\]{}]+$/.test(token)) return 'tok-op';
  return '';
}

/** A tiny, dependency-free tokenizer — enough to make the source panel readable. */
function highlight(line: string) {
  const commentAt = line.indexOf('//');
  const head = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const tail = commentAt >= 0 ? line.slice(commentAt) : '';
  const tokens = head.match(/\s+|[A-Za-z_]\w*|\d+|[^\s]/g) ?? [];
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={tokenClass(token)}>
          {token}
        </span>
      ))}
      {tail && <span className="tok-comment">{tail}</span>}
    </>
  );
}

export function CodePanel({ code, line, accent }: Props) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [line, code]);

  return (
    <section className="code-panel card" style={{ '--accent': accent } as CSSProperties}>
      <div className="panel-head">
        <div>
          <h2>源码追踪</h2>
          <span className="panel-sub">高亮行 = 产生当前帧的语句</span>
        </div>
        <span className="line-badge">L{line}</span>
      </div>

      <div className="code-scroll">
        {code.map((text, i) => {
          const isActive = i + 1 === line;
          return (
            <div
              key={i}
              ref={isActive ? activeRef : undefined}
              className={`code-line${isActive ? ' is-active' : ''}`}
            >
              <span className="line-no">{String(i + 1).padStart(2, '0')}</span>
              <code>{highlight(text)}</code>
            </div>
          );
        })}
      </div>

      <div className="panel-foot">
        <span className="dot dot-indigo" /> 当前执行行
        <span className="dot dot-comment" /> 注释
      </div>
    </section>
  );
}
