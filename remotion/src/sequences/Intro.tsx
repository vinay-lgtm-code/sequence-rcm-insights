import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

// Brand colors
const PRIMARY = "#0066CC";
const TEAL = "#00A5A8";
const NAVY = "#1A365D";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tagline animation
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Chart icon animation
  const chartOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  const chartScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // Money icons floating
  const moneyOffset = Math.sin(frame * 0.05) * 10;

  // Background gradient pulse
  const gradientOpacity = interpolate(frame, [0, 120, 240], [0.3, 0.5, 0.3], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${PRIMARY} 50%, ${TEAL} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
          opacity: gradientOpacity,
          transform: `translateY(${moneyOffset}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "20%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "rgba(0,165,168,0.2)",
          opacity: gradientOpacity,
          transform: `translateY(${-moneyOffset}px)`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "white",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          Sequence
        </h1>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        <p
          style={{
            fontSize: 42,
            color: "rgba(255,255,255,0.95)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Your claims data holds the key to your revenue.
        </p>
      </div>

      {/* Chart icon */}
      <div
        style={{
          opacity: chartOpacity,
          transform: `scale(${Math.max(0, chartScale)})`,
          marginTop: 60,
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        >
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
          <circle cx="7" cy="16" r="1" fill="white" />
          <circle cx="11" cy="12" r="1" fill="white" />
          <circle cx="15" cy="16" r="1" fill="white" />
          <circle cx="20" cy="10" r="1" fill="white" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
