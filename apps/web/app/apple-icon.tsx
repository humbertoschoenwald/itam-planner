import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

const appIconSvg = readFileSync(
  join(process.cwd(), "public", "app-icon.svg"),
  "utf8",
);

const appIconDataUrl = `data:image/svg+xml;base64,${Buffer.from(appIconSvg).toString("base64")}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          color: "#f4fbf8",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${appIconDataUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
          }}
        />
      </div>
    ),
    size,
  );
}
