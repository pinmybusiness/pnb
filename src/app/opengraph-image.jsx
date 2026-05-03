import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'PinMyBusiness - Free Business Tools for Modern Entrepreneurs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #7c3aed 100%)',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top row: logo + badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                background: 'white',
                borderRadius: 16,
                color: '#4f46e5',
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: '-0.05em',
              }}
            >
              P
            </div>
            <div
              style={{
                color: 'white',
                fontSize: 30,
                fontWeight: 700,
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
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 999,
              color: 'white',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            100% FREE · NO SIGNUP
          </div>
        </div>

        {/* Center: headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Free Business Tools
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 32,
              opacity: 0.85,
            }}
          >
            That Just Work.
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: 30,
              fontWeight: 500,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            WhatsApp links · QR codes · Invoices · Email signatures · Passwords
          </div>
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          <div style={{ display: 'flex' }}>pinmybusiness.com</div>
          <div style={{ display: 'flex' }}>5 tools · 0 fees · 0 accounts</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
