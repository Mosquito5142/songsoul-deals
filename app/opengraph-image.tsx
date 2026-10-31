import { ImageResponse } from "next/og";

export const alt = "Song Soul Deals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f6f3ee",
          color: "#1f1a17",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#0f6e6b" }}>Song Soul</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>Song Soul Deals</div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 32, color: "#4f493f" }}>
            Game gear and trading card deals
          </div>
        </div>
      </div>
    ),
    size,
  );
}
