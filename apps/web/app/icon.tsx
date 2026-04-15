import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.9), transparent 35%), linear-gradient(180deg, #1f4d3f 0%, #17392f 100%)",
          color: "#f4fbf8",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "12px solid rgba(255,255,255,0.22)",
            borderRadius: "96px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ITAM
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Planner
          </div>
        </div>
      </div>
    ),
    size,
  );
}
