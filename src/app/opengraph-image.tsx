import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Giulia — Principal Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Giulia
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            fontWeight: 400,
          }}
        >
          Principal Software Engineer
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
