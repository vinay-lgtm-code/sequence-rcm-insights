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

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // URL animation
  const urlOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const urlY = interpolate(frame, [40, 70], [20, 0], { extrapolateRight: "clamp" });

  // Button animation
  const buttonOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const buttonScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Button pulse
  const buttonPulse = 1 + Math.sin(frame * 0.1) * 0.03;

  // Tagline
  const taglineOpacity = interpolate(frame, [130, 160], [0, 1], { extrapolateRight: "clamp" });

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
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "15%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(0,165,168,0.1)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 30,
        }}
      >
        <h1
          style={{
            fontSize: 100,
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

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          marginBottom: 40,
        }}
      >
        <p
          style={{
            fontSize: 42,
            color: "rgba(255,255,255,0.9)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            margin: 0,
          }}
        >
          sequence-ai.com
        </p>
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${Math.max(0, buttonScale) * buttonPulse})`,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            color: NAVY,
            fontSize: 32,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            padding: "24px 64px",
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          Your First Analysis is Free
        </div>
      </div>

      {/* Tagline */}
      <div style={{ opacity: taglineOpacity, marginTop: 40 }}>
        <p
          style={{
            fontSize: 28,
            color: TEAL,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Stop leaving money on the table.
        </p>
      </div>
    </AbsoluteFill>
  );
};
