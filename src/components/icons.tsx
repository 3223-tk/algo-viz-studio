import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function PlayIcon(props: Props) {
  return (
    <svg {...common} fill="currentColor" stroke="none" {...props}>
      <path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2Z" />
    </svg>
  );
}

export function PauseIcon(props: Props) {
  return (
    <svg {...common} fill="currentColor" stroke="none" {...props}>
      <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
      <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
    </svg>
  );
}

export function PrevIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="M18 5 8 12l10 7V5Z" fill="currentColor" stroke="none" />
      <path d="M5 5v14" />
    </svg>
  );
}

export function NextIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="m6 5 10 7L6 19V5Z" fill="currentColor" stroke="none" />
      <path d="M19 5v14" />
    </svg>
  );
}

export function ResetIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function EndIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="m5 5 9 7-9 7V5Z" fill="currentColor" stroke="none" />
      <path d="M18 5v14" />
    </svg>
  );
}

export function ShuffleIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

export function GithubIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function SparkIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}

export function AlertIcon(props: Props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
