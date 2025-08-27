/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getPlayerByUsername } from "@/lib/players";
import { getWithImage } from "@/lib/storage";
import { truncateText } from "@/utils/formatting";

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const result = await getPlayerByUsername({ username }).andThen(getWithImage);
  if (result.isErr()) {
    return new Response(JSON.stringify({ error: result.error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: player, url } = result.value;

  const headingsFont = readFile(join(process.cwd(), "src/fonts/mr-eaves/Mr Eaves Small Caps.otf"));
  const bodyFont = readFile(join(process.cwd(), "src/fonts/bookinsanity/Bookinsanity.otf"));
  const quotesFont = readFile(join(process.cwd(), "src/fonts/zatanna-misdirection/Zatanna Misdirection.otf"));

  const achievementsCount = player.received_achievements_player.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(3, 7, 18)",
          color: "white",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h1
            style={{
              fontSize: "24px",
              fontFamily: "'Mr Eaves'",
              margin: "0",
            }}
          >
            Player Profile
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          {/* Profile Image */}
          {url ? (
            <img
              src={url}
              alt={`${player.users.name}'s profile`}
              style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
                border: "3px solid rgb(30, 41, 59)",
                flexShrink: 0,
                float: "inline-start",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "rgb(30, 41, 59)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgb(30, 41, 59)",
                flexShrink: 0,
                float: "inline-start",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(100, 116, 139)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}

          {/* Profile Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontFamily: "'Mr Eaves'",
                margin: "0 0 8px 0",
              }}
            >
              {player.users.name}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgb(100, 116, 139)",
                fontFamily: "'Zatanna Misdirection'",
                margin: "0 0 16px 0",
              }}
            >
              Level {player.level}
            </p>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "'Book Insanity'",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              {truncateText(player.about, 250)}
            </p>
          </div>
        </div>

        {/* Achievements */}
        {achievementsCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              padding: "16px 20px",
              borderRadius: "8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(234, 179, 8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <p
                style={{
                  fontSize: "16px",
                  fontFamily: "'Zatanna Misdirection'",
                  color: "rgb(234, 179, 8)",
                  margin: "0",
                  textTransform: "uppercase",
                }}
              >
                {achievementsCount} Achievement{achievementsCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Mr Eaves",
          data: await headingsFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Book Insanity",
          data: await bodyFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Zatanna Misdirection",
          data: await quotesFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
