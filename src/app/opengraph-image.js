import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { path, viewBox } from "@/lib/pixelName";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// CSS variables aren't available here, so the colors are repeated.
const name = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="960" height="340">
  <defs>
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="47" y2="16">
      <stop offset="0" stop-color="#bd93f9"/>
      <stop offset=".55" stop-color="#ff79c6"/>
      <stop offset="1" stop-color="#8be9fd"/>
    </linearGradient>
  </defs>
  <path d="${path}" fill="url(#g)"/>
</svg>`;

const nameSrc = `data:image/svg+xml;base64,${Buffer.from(name).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#282a36",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't work here */}
        <img src={nameSrc} width={960} height={340} alt="" />
        <div style={{ marginTop: 40, fontSize: 40, color: "#f8f8f2" }}>
          Backend systems and terminal tools in Go
        </div>
      </div>
      <div
        style={{
          display: "flex",
          background: "#21222c",
          color: "#a9b1d1",
          fontSize: 28,
        }}
      >
        <div
          style={{
            background: "#bd93f9",
            color: "#21222c",
            padding: "16px 32px",
          }}
        >
          NORMAL
        </div>
        <div style={{ padding: "16px 32px" }}>anthonywinchell.dev</div>
      </div>
    </div>,
    size,
  );
}
