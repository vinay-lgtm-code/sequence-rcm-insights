import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const PRIMARY = "#0066CC";
const TEAL = "#00A5A8";
const NAVY = "#1A365D";
const GREEN = "#059669";

export const Value: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animation
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });

  // Email animation
  const emailProgress = interpolate(frame, [40, 100], [0, 1], { extrapolateRight: "clamp" });
  const emailScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Checkmarks
  const check1 = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" });
  const check2 = interpolate(frame, [130, 150], [0, 1], { extrapolateRight: "clamp" });
  const check3 = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${PRIMARY} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      {/* Main text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Get actionable insights
        </h2>
        <p
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.9)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            margin: "16px 0 0 0",
          }}
        >
          delivered to your inbox
        </p>
      </div>

      {/* Email visualization */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* Email icon with animation */}
        <div
          style={{
            transform: `scale(${Math.max(0, emailScale)}) translateX(${-100 + emailProgress * 100}px)`,
            opacity: emailProgress,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: check1 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <span style={{ color: "white", fontSize: 28, fontFamily: "Inter, sans-serif" }}>
              Executive Summary
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: check2 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <span style={{ color: "white", fontSize: 28, fontFamily: "Inter, sans-serif" }}>
              Key Metrics
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: check3 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <span style={{ color: "white", fontSize: 28, fontFamily: "Inter, sans-serif" }}>
              Recommendations
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
