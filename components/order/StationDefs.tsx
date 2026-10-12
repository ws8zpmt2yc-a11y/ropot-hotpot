import { FoodDefs } from "@/components/food/FoodDefs";
import { ArmDefs } from "./RobotArm";
import { ARMS } from "@/lib/geometry";

/** Every gradient, filter and clip the bird's-eye stage needs. */
export function StationDefs() {
  return (
    <>
      <FoodDefs />
      <defs>
        {/* Tints the room warm without hiding it. */}
        <radialGradient id="station-floor" cx="50%" cy="42%" r="80%">
          <stop offset="0%" stopColor="#5A1113" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#3B0B0D" stopOpacity="0.55" />
          <stop offset="82%" stopColor="#1C0708" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#120405" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="station-spot" cx="50%" cy="46%" r="46%">
          <stop offset="0%" stopColor="#FF9A3D" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#FF6A32" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plinth" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor="#2A2320" />
          <stop offset="26%" stopColor="#4A413B" />
          <stop offset="52%" stopColor="#332B27" />
          <stop offset="78%" stopColor="#463D37" />
          <stop offset="100%" stopColor="#231D1B" />
        </linearGradient>
        <radialGradient id="tray-light" cx="34%" cy="24%" r="76%">
          <stop offset="0%" stopColor="#FFD7A0" stopOpacity="0.24" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
        </radialGradient>
        {/* Depth of field. The bench falls off, the bowl and the arms stay
            sharp, and whatever you point at pulls into focus. */}
        <filter id="dof-bench" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <filter id="dof-ring" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="0.85" />
        </filter>
        <filter id="dof-near" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="0.55" />
        </filter>
        <filter id="dof-floor" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* Highlight bloom, so the warm lights spill the way they do on a
            sensor rather than stopping at the edge of the shape. */}
        <filter id="bloom" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {ARMS.map((arm) => (
          <ArmDefs key={arm.id} id={arm.id} />
        ))}
      </defs>
    </>
  );
}
