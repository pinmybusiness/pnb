export default function WaveDivider({ fromColor = "#ffffff", toColor = "#f9fafb" }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block w-full"
      style={{ height: "80px", display: "block" }}
    >
      {/* Fill entire bg with fromColor — no outer div needed */}
      <rect width="1440" height="80" fill={fromColor} />

      {/* Back wave — subtle depth */}
      <path
        d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
        fill={toColor}
        opacity="0.4"
      />

      {/* Front wave — solid transition */}
      <path
        d="M0,50 C240,20 480,70 720,45 C960,20 1200,65 1440,50 L1440,80 L0,80 Z"
        fill={toColor}
      />
    </svg>
  );
}
