import { AbsoluteFill, Sequence } from "remotion";
import { Intro } from "./sequences/Intro";
import { Problem } from "./sequences/Problem";
import { Solution } from "./sequences/Solution";
import { Metrics } from "./sequences/Metrics";
import { Value } from "./sequences/Value";
import { CTA } from "./sequences/CTA";

// Video structure (60 seconds = 1800 frames at 30fps)
// 0:00-0:08 (0-240): Intro/Hook
// 0:08-0:18 (240-540): Problem
// 0:18-0:28 (540-840): Solution
// 0:28-0:45 (840-1350): Metrics Demo
// 0:45-0:52 (1350-1560): Value Prop
// 0:52-1:00 (1560-1800): CTA

export const SequenceVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <Sequence from={0} durationInFrames={240}>
        <Intro />
      </Sequence>

      <Sequence from={240} durationInFrames={300}>
        <Problem />
      </Sequence>

      <Sequence from={540} durationInFrames={300}>
        <Solution />
      </Sequence>

      <Sequence from={840} durationInFrames={510}>
        <Metrics />
      </Sequence>

      <Sequence from={1350} durationInFrames={210}>
        <Value />
      </Sequence>

      <Sequence from={1560} durationInFrames={240}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
