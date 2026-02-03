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

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animation
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });

  // Upload animation
  const uploadProgress = interpolate(frame, [60, 120], [0, 100], { extrapolateRight: "clamp" });
  const uploadOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  // AI processing sparkles
  const sparkle1 = spring({ frame: frame - 130, fps, config: { damping: 10 } });
  const sparkle2 = spring({ frame: frame - 145, fps, config: { damping: 10 } });
  const sparkle3 = spring({ frame: frame - 160, fps, config: { damping: 10 } });
  const sparkleOpacity = interpolate(frame, [130, 150], [0, 1], { extrapolateRight: "clamp" });

  // Steps animation
  const step1Opacity = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: "clamp" });
  const step2Opacity = interpolate(frame, [210, 230], [0, 1], { extrapolateRight: "clamp" });
  const step3Opacity = interpolate(frame, [240, 260], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #FFFFFF 0%, #E6F7F7 100%)`,
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
            fontSize: 64,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            margin: 0,
          }}
        >
          <span style={{ color: PRIMARY }}>Sequence</span> changes that.
        </h2>
      </div>

      {/* Upload visualization */}
      <div
        style={{
          opacity: uploadOpacity,
          display: "flex",
          alignItems: "center",
          gap: 40,
          marginBottom: 60,
        }}
      >
        {/* File icon */}
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h8" />
        </svg>

        {/* Progress bar */}
        <div
          style={{
            width: 300,
            height: 12,
            backgroundColor: "#E2E8F0",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${uploadProgress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${PRIMARY} 0%, ${TEAL} 100%)`,
              borderRadius: 6,
            }}
          />
        </div>

        {/* AI icon with sparkles */}
        <div style={{ position: "relative" }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="3" fill={TEAL} opacity="0.3" />
          </svg>

          {/* Sparkles */}
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              opacity: sparkleOpacity,
              transform: `scale(${Math.max(0, sparkle1)})`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={TEAL}>
              <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -15,
              opacity: sparkleOpacity,
              transform: `scale(${Math.max(0, sparkle2)})`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={PRIMARY}>
              <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -5,
              right: -15,
              opacity: sparkleOpacity,
              transform: `scale(${Math.max(0, sparkle3)})`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={TEAL}>
              <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Three steps */}
      <div
        style={{
          display: "flex",
          gap: 60,
          alignItems: "center",
        }}
      >
        <div style={{ opacity: step1Opacity, textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>1</span>
          </div>
          <p style={{ fontSize: 28, color: NAVY, fontWeight: 600, margin: 0 }}>Upload</p>
        </div>

        <div style={{ opacity: step2Opacity, textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: TEAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>2</span>
          </div>
          <p style={{ fontSize: 28, color: NAVY, fontWeight: 600, margin: 0 }}>Analyze</p>
        </div>

        <div style={{ opacity: step3Opacity, textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>3</span>
          </div>
          <p style={{ fontSize: 28, color: NAVY, fontWeight: 600, margin: 0 }}>Act</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
