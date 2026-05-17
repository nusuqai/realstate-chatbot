import type { IconName } from '../types/agent'

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      {name === 'agent' ? (
        <>
          <path d="M12 3.5a2 2 0 0 1 2 2v1h2.5A3.5 3.5 0 0 1 20 10v5a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 15v-5a3.5 3.5 0 0 1 3.5-3.5H10v-1a2 2 0 0 1 2-2Z" />
          <path d="M8.5 12h.01M15.5 12h.01M9 16c1.6 1 4.4 1 6 0" />
        </>
      ) : null}
      {name === 'balance' ? (
        <>
          <path d="M12 4v16M5 7h14M7 7l-4 7h8zm10 0-4 7h8z" />
          <path d="M9 20h6" />
        </>
      ) : null}
      {name === 'building' ? (
        <>
          <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10" />
          <path d="M9 7h3M9 11h3M9 15h3M4 21h17" />
        </>
      ) : null}
      {name === 'chart' ? (
        <>
          <path d="M4 19h16M7 16V9M12 16V5M17 16v-3" />
          <path d="m6 10 4-4 4 4 5-6" />
        </>
      ) : null}
      {name === 'check' ? <path d="m5 12 4 4L19 6" /> : null}
      {name === 'code' ? (
        <>
          <path d="m8 9-4 3 4 3M16 9l4 3-4 3" />
          <path d="m14 5-4 14" />
        </>
      ) : null}
      {name === 'database' ? (
        <>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </>
      ) : null}
      {name === 'link' ? (
        <>
          <path d="M10 13a5 5 0 0 0 7.1.2l2.1-2.1a5 5 0 0 0-7.1-7.1L11 5.1" />
          <path d="M14 11a5 5 0 0 0-7.1-.2l-2.1 2.1a5 5 0 0 0 7.1 7.1L13 18.9" />
        </>
      ) : null}
      {name === 'memory' ? (
        <>
          <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6M9 12h6M9 16h3M3 8h2M3 12h2M3 16h2M19 8h2M19 12h2M19 16h2" />
        </>
      ) : null}
      {name === 'plus' ? <path d="M12 5v14M5 12h14" /> : null}
      {name === 'send' ? <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /> : null}
      {name === 'shield' ? (
        <>
          <path d="M12 3 19 6v5c0 4.6-2.8 8.6-7 10-4.2-1.4-7-5.4-7-10V6z" />
          <path d="m9 12 2 2 4-5" />
        </>
      ) : null}
      {name === 'spark' ? (
        <>
          <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
          <path d="m12 8 1.4 2.6L16 12l-2.6 1.4L12 16l-1.4-2.6L8 12l2.6-1.4z" />
        </>
      ) : null}
      {name === 'star' ? (
        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
      ) : null}
      {name === 'truck' ? (
        <>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </>
      ) : null}
    </svg>
  )
}
