import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const NAVY = "#1A365D";
const RED = "#DC2626";
const GRAY = "#718096";

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animations
  const line1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });

  // Denial stamp animation
  const stampRotation = interpolate(frame, [120, 150], [-15, 0], { extrapolateRight: "clamp" });
  const stampScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const stampOpacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" });

  // Clock animation
  const clockOpacity = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: "clamp" });
  const clockRotation = frame * 2; // Spinning hands

  // Spreadsheet overwhelm
  const spreadsheetOpacity = interpolate(frame, [200, 220], [0, 1], { extrapolateRight: "clamp" });
  const spreadsheetShake = Math.sin(frame * 0.5) * 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F7FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      {/* Problem text */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <p
          style={{
            fontSize: 48,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            opacity: line1Opacity,
            marginBottom: 20,
          }}
        >
          But right now, it&apos;s buried in spreadsheets.
        </p>
        <p
          style={{
            fontSize: 42,
            color: GRAY,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            opacity: line2Opacity,
            marginBottom: 20,
          }}
        >
          Denied claims pile up. Payers drag their feet.
        </p>
        <p
          style={{
            fontSize: 42,
            color: RED,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            opacity: line3Opacity,
          }}
        >
          And your AR keeps aging.
        </p>
      </div>

      {/* Visual elements */}
      <div
        style={{
          display: "flex",
          gap: 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Denied stamp */}
        <div
          style={{
            opacity: stampOpacity,
            transform: `rotate(${stampRotation}deg) scale(${Math.max(0, stampScale)})`,
          }}
        >
          <div
            style={{
              border: `6px solid ${RED}`,
              borderRadius: 8,
              padding: "20px 40px",
              color: RED,
              fontSize: 36,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              transform: "rotate(-5deg)",
            }}
          >
            DENIED
          </div>
        </div>

        {/* Clock */}
        <div style={{ opacity: clockOpacity }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={NAVY} strokeWidth="2" />
            <path
              d="M12 6v6l4 2"
              stroke={NAVY}
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                transformOrigin: "12px 12px",
                transform: `rotate(${clockRotation}deg)`,
              }}
            />
          </svg>
        </div>

        {/* Spreadsheet */}
        <div
          style={{
            opacity: spreadsheetOpacity,
            transform: `translateX(${spreadsheetShake}px)`,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
