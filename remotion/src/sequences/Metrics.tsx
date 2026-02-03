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
const RED = "#DC2626";
const GREEN = "#059669";

interface MetricCardProps {
  title: string;
  value: number;
  suffix: string;
  target: string;
  color: string;
  startFrame: number;
  frame: number;
  fps: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  suffix,
  target,
  color,
  startFrame,
  frame,
  fps,
}) => {
  const cardOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardScale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const counterValue = interpolate(
    frame,
    [startFrame + 20, startFrame + 80],
    [0, value],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `scale(${Math.max(0, cardScale)})`,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 32,
        width: 320,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        border: `3px solid ${color}`,
      }}
    >
      <p
        style={{
          fontSize: 20,
          color: NAVY,
          fontWeight: 600,
          margin: "0 0 16px 0",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 56,
          color: color,
          fontWeight: 700,
          margin: "0 0 8px 0",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {counterValue.toFixed(suffix === "%" ? 1 : 0)}
        {suffix}
      </p>
      <p
        style={{
          fontSize: 16,
          color: "#718096",
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Target: {target}
      </p>
    </div>
  );
};

export const Metrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animation
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });

  // Subtext animation
  const subtextOpacity = interpolate(frame, [300, 330], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F7FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            margin: 0,
          }}
        >
          We find what&apos;s costing you money
        </h2>
      </div>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 32,
          marginBottom: 40,
        }}
      >
        <MetricCard
          title="Days in A/R"
          value={28}
          suffix=" days"
          target="<30 days"
          color={GREEN}
          startFrame={40}
          frame={frame}
          fps={fps}
        />
        <MetricCard
          title="Denial Rate"
          value={8.5}
          suffix="%"
          target="<5%"
          color={RED}
          startFrame={80}
          frame={frame}
          fps={fps}
        />
        <MetricCard
          title="Clean Claim Rate"
          value={91.2}
          suffix="%"
          target=">95%"
          color={TEAL}
          startFrame={120}
          frame={frame}
          fps={fps}
        />
        <MetricCard
          title="Collection Rate"
          value={68.5}
          suffix="%"
          target="varies"
          color={PRIMARY}
          startFrame={160}
          frame={frame}
          fps={fps}
        />
      </div>

      {/* Subtext */}
      <div style={{ opacity: subtextOpacity, textAlign: "center" }}>
        <p
          style={{
            fontSize: 36,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            margin: 0,
          }}
        >
          And tell you <span style={{ color: TEAL }}>exactly how to fix it</span>.
        </p>
      </div>
    </AbsoluteFill>
  );
};
