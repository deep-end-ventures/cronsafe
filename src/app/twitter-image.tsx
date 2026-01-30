import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CronSafe — Cron Job Monitoring Made Dead Simple';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 8, display: 'flex' }}>⏱</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          CronSafe
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            maxWidth: 700,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Cron Job Monitoring Made Dead Simple
        </div>
      </div>
    ),
    { ...size }
  );
}
