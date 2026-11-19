import { AUTHOR, REPO_URL } from '../config';
import { GithubIcon } from './icons';

export function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <i style={{ height: '42%' }} />
      <i style={{ height: '66%' }} />
      <i style={{ height: '90%' }} />
      <i style={{ height: '58%' }} />
    </span>
  );
}

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <Logo />
          <div>
            <h1>
              AlgoViz Studio <span className="brand-badge">v1.0</span>
            </h1>
            <p>交互式算法可视化实验室 · 把每一步都看得见</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="header-hint">
            <kbd>空格</kbd> 播放 / 暂停 <kbd>←</kbd> <kbd>→</kbd> 单步 <kbd>R</kbd> 重置
          </span>
          <a className="github-link" href={REPO_URL} target="_blank" rel="noreferrer">
            <GithubIcon width={16} height={16} />
            GitHub
          </a>
          <span className="author-tag">{AUTHOR}</span>
        </div>
      </div>
    </header>
  );
}
