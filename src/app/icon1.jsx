import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function LargeIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          fontSize: 340,
          fontWeight: 900,
          letterSpacing: '-0.05em',
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}
