/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const COLOR_MAP = {
  emerald: { glow: 'rgba(52,211,153,0.30)',  fg: '#a7f3d0' },
  indigo:  { glow: 'rgba(99,102,241,0.32)',  fg: '#c7d2fe' },
  amber:   { glow: 'rgba(245,158,11,0.30)',  fg: '#fde68a' },
  sky:     { glow: 'rgba(56,189,248,0.30)',  fg: '#bae6fd' },
  rose:    { glow: 'rgba(244,63,94,0.30)',   fg: '#fecdd3' },
};

export function renderToolOgImage(tool) {
  const palette = COLOR_MAP[tool.color] || COLOR_MAP.indigo;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0e1015',
          backgroundImage: `radial-gradient(ellipse 70% 55% at 50% -10%, ${palette.glow} 0%, transparent 70%)`,
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 12,
                color: 'white',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '-0.04em',
              }}
            >
              P
            </div>
            <div
              style={{
                color: 'white',
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              PinMyBusiness
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              border: `1px solid ${palette.fg}55`,
              borderRadius: 999,
              color: palette.fg,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
            }}
          >
            {tool.category.toUpperCase()} · FREE
          </div>
        </div>

        {/* Center */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: '#9ca3af',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Free tool
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              marginBottom: 18,
              maxWidth: 1000,
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              color: '#9ca3af',
              fontSize: 26,
              fontWeight: 400,
              maxWidth: 980,
              lineHeight: 1.4,
            }}
          >
            {tool.tagline}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            color: '#6b7280',
            fontSize: 16,
            fontWeight: 500,
            paddingTop: 18,
            borderTop: '1px solid #232733',
          }}
        >
          <div style={{ display: 'flex' }}>pinmybusiness.com{tool.href}</div>
          <div style={{ display: 'flex' }}>No signup · Always free · Private</div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
