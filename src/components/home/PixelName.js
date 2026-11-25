import { path, viewBox } from "@/lib/pixelName";

export default function PixelName() {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      className="w-full max-w-2xl"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient
          id="name-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="47"
          y2="16"
        >
          <stop offset="0" stopColor="var(--color-purple)" />
          <stop offset="0.55" stopColor="var(--color-pink)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        transform="translate(.4 .4)"
        fill="var(--color-line)"
        opacity=".6"
      />
      <path d={path} fill="url(#name-gradient)" />
    </svg>
  );
}
