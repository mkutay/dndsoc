/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getPlayerByUsername, getPlayers } from "@/lib/players";
import { getWithImage } from "@/lib/storage";

export const dynamic = "force-static";
export const revalidate = 1800;

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
  const charactersCount = player.characters.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "hsl(44, 42.86%, 93.14%)",
          color: "white",
          padding: "40px",
        }}
      >
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
                // border: "3px solid hsl(40.00, 31.43%, 79.41%)",
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
                backgroundColor: "hsl(41, 34.83%, 82.55%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // border: "3px solid hsl(40.65, 34.83%, 82.55%)",
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
                stroke="hsl(29, 18.71%, 30.39%)"
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
              color: "hsl(29, 16.54%, 24.90%)",
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
                fontSize: "18px",
                // color: "rgb(100, 116, 139)",
                fontFamily: "'Zatanna Misdirection'",
                margin: "0 0 16px 0",
              }}
            >
              Level {player.level}
            </p>
            <p
              style={{
                fontSize: "18px",
                display: "block",
                fontFamily: "'Book Insanity'",
                margin: "0",
                lineHeight: "1.5",
                lineClamp: 4,
              }}
            >
              {player.about}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexGrow: 1,
          }}
        >
          {/* Achievements */}
          {achievementsCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "hsl(30, 33.87%, 48.63%)",
                // width: "100%",
                flex: 1,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="32"
                height="32"
                fill="none"
                stroke="hsl(0, 0%, 100%)"
              >
                <path d="M0 0h512v512H0z"></path>
                <g transform="translate(0,0)" fill="hsl(0, 0%, 100%)">
                  <path d="M256.156 21.625c-45.605 0-86.876 2.852-117.22 7.563-15.17 2.355-27.554 5.11-36.874 8.53-4.66 1.71-8.568 3.515-11.968 6.094-3.238 2.457-6.65 6.36-6.97 11.75h-.75c0 10.08.362 20.022 1.064 29.813H57.53c-.12-7.952.003-15.922.376-23.875l-26.812-6.28C22.55 161.892 64.1 265.716 140.564 339.655l15.655-29.594a250.817 250.817 0 0 1-12.157-10.75 143.483 143.483 0 0 1 19.28-16.843c13.468 13.172 28.182 23.565 43.813 30.655 22.114 17.744 8.053 29.368-23.5 36.25 58.863 10.6 38.948 62.267-14.125 92.313-2.14.27-4.256.523-6.28.812-12.047 1.718-21.876 3.71-29.406 6.25-3.765 1.27-6.958 2.6-9.906 4.656-2.95 2.055-6.626 5.705-6.626 11.406 0 5.702 3.677 9.32 6.626 11.375 2.948 2.055 6.14 3.387 9.906 4.657 7.53 2.54 17.36 4.532 29.406 6.25 24.094 3.436 56.784 5.53 92.906 5.53 36.123 0 68.812-2.094 92.906-5.53 12.048-1.718 21.877-3.71 29.407-6.25 3.764-1.27 6.957-2.602 9.905-4.656 2.948-2.055 6.625-5.674 6.625-11.375 0-5.702-3.677-9.352-6.625-11.407-2.948-2.055-6.14-3.387-9.906-4.656-7.53-2.54-17.36-4.532-29.408-6.25-2.013-.287-4.12-.544-6.25-.813-53.076-30.045-72.99-81.71-14.125-92.312-31.568-6.886-45.63-18.522-23.468-36.28 15.74-7.15 30.547-17.655 44.092-30.97 6.648 4.773 12.84 10.038 18.47 15.72a300.791 300.791 0 0 1-12.72 12.217l16.188 29.594c79.118-71.955 116.195-179.53 110.03-285l-27.342 7.97c.45 7.61.64 15.19.562 22.75h-25.594a416.913 416.913 0 0 0 1.063-29.814h-.75c-.323-5.39-3.763-9.293-7-11.75-3.402-2.58-7.31-4.383-11.97-6.093-9.32-3.422-21.704-6.177-36.875-8.532-30.342-4.71-71.613-7.563-117.22-7.563zm0 18.688c44.822 0 85.426 2.854 114.344 7.343 14.46 2.245 26.06 4.932 33.313 7.594 1.04.382 1.775.75 2.625 1.125-.85.375-1.58.742-2.625 1.125-7.252 2.662-18.854 5.38-33.313 7.625-28.918 4.49-69.522 7.344-114.344 7.344-44.82 0-85.425-2.855-114.344-7.345-14.46-2.245-26.06-4.963-33.312-7.625-1.05-.386-1.77-.748-2.625-1.125.853-.376 1.577-.74 2.625-1.125 7.252-2.662 18.853-5.35 33.313-7.594 28.918-4.49 69.522-7.343 114.343-7.343zm-197.25 71.874H86.25c8.057 57.878 28.23 108.83 56.188 146.25-6.974 5.74-13.407 11.968-19.188 18.688-38.648-46.456-59.042-104.647-64.344-164.938zm367.188 0h27C447.51 171.82 425.336 228.34 388.03 275a158.506 158.506 0 0 0-17.842-16.97c27.81-37.38 47.873-88.175 55.906-145.842z"></path>
                </g>
              </svg>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Zatanna Misdirection'",
                    color: "hsl(0, 0%, 100%)",
                    margin: "0",
                    textTransform: "uppercase",
                  }}
                >
                  {achievementsCount} Achievement{achievementsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {charactersCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "hsl(30, 33.87%, 48.63%)",
                // width: "100%",
                flex: 1,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="32"
                width="32"
                fill="none"
                stroke="hsl(0, 0%, 100%)"
              >
                <path d="M0 0h512v512H0z" fill-opacity="1"></path>
                <g transform="translate(0,0)" fill="hsl(0, 0%, 100%)">
                  <path d="M372.2 20.34c-21.4 1.16-30 25.84-29.7 42.79.3 18.28 10.2 43.97 29.7 42.87 21.4-1.2 30-25.94 29.7-42.87-.3-18.29-10.2-43.85-29.7-42.79zM175.3 72.73c-36.6 49.47-17.2 102.67 7.3 146.47l53.6-71.3c24.1 22.7 51.8 37.3 56.4 36.8 10-.9 29.9-16.4 42.8-35-5.6 22.9-9.2 46.2-21 63.9 9.3 36.5 48.2 85 85.4 64 10.3-38.2 12.3-89.7 6.7-127.6 29.6 14.8 43.7 46.1 49.3 72.4 2.4 11.9 31.4 19.7 22.1-14.6-10.8-39.7-31.1-84.1-73.6-99.6-8.2 9.5-19.5 16.8-32.1 15.8-16.3-1.4-30.2-10.4-37.3-22.8-11.9 7.1-36.6 41.1-45.7 55.5-14.5-11.2-24.2-20.9-35.3-32.4l60.3-80.27c-58.2-19.69-112.6-2.46-138.9 28.7zm107.4-16.67L241.4 111c-22.3-10.8-32.5 6.8-17.8 23.8L185 186c-18.4-34.8-15.1-75.7 4.7-102.33 27.2-30.02 57.5-32.98 93-27.61zm14.4 162.84c-51.3 11.4-105.7 15.9-151.3 28.6-27.5 7.7-35.1 30.8-41 54.5-11.28 61.7-24.24 105.4-40.5 166.3 8.4 6.9 17 13.6 20.31 23.3H108c-2.5-15.4-8.32-19.5-15.98-30.7L118.1 398c27.7-6.5 45.2-26 60.3-45.8 38 23.8 82.1 9.4 126.5-7.2 9.5 42-9.7 77.3-20.4 111.6 8.3 12.9 21.7 22.4 27.9 35h28.2c-5.6-16.9-11.9-21.5-23.4-31.7 20.1-41.4 28.2-84.3 33.7-124.4 22-8 32.9-16.9 41.2-35.9-52.5 8.7-85.3-50.5-95-80.7zM99.19 265c-12.02-.2-27.04 3.5-28.49 15.8-4.1 34.8-3.85 71.5-38.44 85 8.4 14 21.75 24.1 37.47 15.3 12.85-39.9 11.04-81.5 29.46-116.1zM392 335.7c-6.3 6.7-14.8 11.9-25 14.8 0 .1-.1.2-.1.3l15.4 17.2-8.7 25.6-14.5 3.2c-1.7 8.1-3.7 16.3-6 24.3 34.2 7.7 55.7-31.4 60.2-54.9-5.4-12-12.4-23.2-21.3-30.5zm-210.9 42.6c-5.4 6.8-12.1 14.5-20.2 21.2 16.3 31.4 34.6 62.9 57.5 92.2h26.7c-28.9-35.6-47.8-75.2-64-113.4z"></path>
                </g>
              </svg>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Zatanna Misdirection'",
                    color: "hsl(0, 0%, 100%)",
                    margin: "0",
                    textTransform: "uppercase",
                  }}
                >
                  {charactersCount} Character{achievementsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 600,
      height: 340,
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

export async function generateStaticParams() {
  const players = await getPlayers();
  if (players.isErr()) {
    return [];
  }
  return players.value.map((player) => ({
    username: player.users.username,
  }));
}
