import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(180deg, #1f4d3f 0%, #17392f 100%)",
          borderRadius: "42px",
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
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ITAM
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Horario
        </div>
      </div>
    ),
    size,
  );
}
