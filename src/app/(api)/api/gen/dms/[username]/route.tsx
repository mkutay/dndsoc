/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getWithImage } from "@/lib/storage";
import { getDMByUsername, getDMs } from "@/lib/dms";

export const dynamic = "force-static";
export const revalidate = 1800;

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const result = await getDMByUsername({ username }).andThen(getWithImage);
  if (result.isErr()) {
    return new Response(JSON.stringify({ error: result.error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: dm, url } = result.value;

  const headingsFont = readFile(join(process.cwd(), "src/fonts/mr-eaves/Mr Eaves Small Caps.otf"));
  const bodyFont = readFile(join(process.cwd(), "src/fonts/bookinsanity/Bookinsanity.otf"));
  const quotesFont = readFile(join(process.cwd(), "src/fonts/zatanna-misdirection/Zatanna Misdirection.otf"));

  const achievementsCount = dm.received_achievements_dm.length;
  const partyCount = dm.dm_party.length;

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
              alt={`${dm.users.name}'s profile`}
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
              {dm.users.name}
            </h2>
            <p
              style={{
                fontSize: "18px",
                // color: "rgb(100, 116, 139)",
                fontFamily: "'Zatanna Misdirection'",
                margin: "0 0 16px 0",
              }}
            >
              Level {dm.level}
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
              {dm.about}
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

          {partyCount > 0 && (
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
                  <path
                    d="M462.9 19.12c-9.6 0-17.2 7.59-17.2 17.19 0 9.61 7.6 17.19 17.2 17.19s17.2-7.58 17.2-17.19c0-9.6-7.6-17.19-17.2-17.19zm-80.3 21.82c-160.3.8-218.1 217.46-362.93 96.26 3.25 36.8 88.43 78.4 88.43 78.4-26.03 20-34.78 24.7-71.99 25.5 104.09 86.7 338.69-99.8 408.39 40.1l-2.3-38.4-45.4-46.5 42.7.6-.6-10.2-50.7-32.2 48.4-7.2-.7-11.1-50-27.3 47.9-8.8-.6-10.69L381 66.66l50.5-5.85-.8-13.9c-17.1-4.2-33-6.05-48.1-5.97zm70.8 29.97 20.2 423.99 18.7-.9-20.2-423c-6.3 1.54-12.7 1.5-18.7-.1zM360 292.9l-43.6 70 21.3 25L322 493h18.9l15.2-102.3 28-20.2c-8.1-25.9-16.1-51.8-24.1-77.6zm-156.7 17.9-28.8 69.8 20.5 20.2 2.2 92.2h18.7l-2.2-93 19.6-19.9-30-69.3zm-158.16 5-16.4 61.9 17.65 13.2L61.24 493h18.87L64.89 388.3l13.22-17.6-32.93-54.9zm85.96 7.4-28.2 57.5 15.1 17-6.7 95.3H130l6.8-95.3 15.9-14.2-21.6-60.3zM268 355.5l-19.5 68.4 19.4 15.2 5.8 53.9h18.9l-5.9-54.3 16.8-21.6c-11.9-20.5-23.7-41-35.5-61.6zm143.6.1-18.9 68.6 20.3 15.5 6.2 53.3H438l-6.4-55.2 16-20.9z"
                    fill-opacity="1"
                  ></path>
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
                  {partyCount} {achievementsCount !== 1 ? "Parties" : "Party"}
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
  const dms = await getDMs();
  if (dms.isErr()) {
    return [];
  }
  return dms.value.map((dm) => ({
    username: dm.users.username,
  }));
}
