import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Elias Elloumi — Full-Stack Developer · Data Engineering & AI. A portfolio that reads like an illustrated book.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [fraunces, grotesk, avatar] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Fraunces-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Medium.ttf")),
    readFile(join(process.cwd(), "public/story/avatar-hero.jpg")),
  ]);
  const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#08060f",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 18% 0%, rgba(109,40,217,0.42), transparent 70%), radial-gradient(ellipse 45% 45% at 92% 100%, rgba(245,158,11,0.25), transparent 70%)",
          position: "relative",
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Left column — copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 60px 0 72px",
            width: 780,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#a78bfa",
              fontSize: 22,
              letterSpacing: 7,
            }}
          >
            ELIAS ELLOUMI
            <div
              style={{
                width: 44,
                height: 2,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
            />
            <span style={{ color: "#9d97b5", letterSpacing: 5 }}>
              PORTFOLIO
            </span>
          </div>

          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: 62,
              lineHeight: 1.14,
              color: "#f5f0e4",
              marginTop: 28,
              letterSpacing: -1,
            }}
          >
            From a Minecraft kid to a Full-Stack Developer.
          </div>

          <div
            style={{
              fontSize: 25,
              color: "#9d97b5",
              marginTop: 26,
              lineHeight: 1.5,
            }}
          >
            Nokia · 3geeks · EFREI Paris — a story that reads like an illustrated
            book, one scroll at a time.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 40,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: "#34d399",
              }}
            />
            <div style={{ fontSize: 21, color: "#e9e3d3" }}>
              elias-elloumi.com
            </div>
          </div>
        </div>

        {/* Right column — avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 340,
              height: 340,
              borderRadius: 999,
              overflow: "hidden",
              border: "5px solid rgba(167,139,250,0.55)",
              boxShadow: "0 0 110px rgba(167,139,250,0.4)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt=""
              width={340}
              height={340}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Space Grotesk", data: grotesk, weight: 500, style: "normal" },
      ],
    }
  );
}
