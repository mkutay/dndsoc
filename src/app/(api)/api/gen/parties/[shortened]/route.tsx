/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getWithImage } from "@/lib/storage";
import { getParties, getPartyByShortened } from "@/lib/parties";

export const dynamic = "force-static";
export const revalidate = 1800;

export async function GET(request: Request, { params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await getPartyByShortened({ shortened }).andThen(getWithImage);
  if (result.isErr()) {
    return new Response(JSON.stringify({ error: result.error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: party, url } = result.value;

  const headingsFont = readFile(join(process.cwd(), "src/fonts/mr-eaves/Mr Eaves Small Caps.otf"));
  const bodyFont = readFile(join(process.cwd(), "src/fonts/bookinsanity/Bookinsanity.otf"));
  const quotesFont = readFile(join(process.cwd(), "src/fonts/zatanna-misdirection/Zatanna Misdirection.otf"));
  const dropCapsFont = readFile(join(process.cwd(), "src/fonts/solbera-imitation/Solbera Imitation.otf"));

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const characterCount = party.character_party.length;
  const campaignCount = party.party_campaigns.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "hsl(44, 42.86%, 93.14%)",
          position: "relative",
        }}
      >
        {/* Left Side - Party Image */}
        <div
          style={{
            width: "500px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            position: "relative",
          }}
        >
          {url ? (
            <img
              src={url}
              alt={`${party.name} party`}
              style={{
                width: "420px",
                height: "420px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "420px",
                height: "420px",
                borderRadius: "8px",
                backgroundColor: "hsl(41, 34.83%, 82.55%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="160"
                width="160"
                fill="hsl(29, 18.71%, 30.39%)"
                style={{ display: "block" }}
              >
                <path d="M462.9 19.12c-9.6 0-17.2 7.59-17.2 17.19 0 9.61 7.6 17.19 17.2 17.19s17.2-7.58 17.2-17.19c0-9.6-7.6-17.19-17.2-17.19zm-80.3 21.82c-160.3.8-218.1 217.46-362.93 96.26 3.25 36.8 88.43 78.4 88.43 78.4-26.03 20-34.78 24.7-71.99 25.5 104.09 86.7 338.69-99.8 408.39 40.1l-2.3-38.4-45.4-46.5 42.7.6-.6-10.2-50.7-32.2 48.4-7.2-.7-11.1-50-27.3 47.9-8.8-.6-10.69L381 66.66l50.5-5.85-.8-13.9c-17.1-4.2-33-6.05-48.1-5.97zm70.8 29.97 20.2 423.99 18.7-.9-20.2-423c-6.3 1.54-12.7 1.5-18.7-.1zM360 292.9l-43.6 70 21.3 25L322 493h18.9l15.2-102.3 28-20.2c-8.1-25.9-16.1-51.8-24.1-77.6zm-156.7 17.9-28.8 69.8 20.5 20.2 2.2 92.2h18.7l-2.2-93 19.6-19.9-30-69.3zm-158.16 5-16.4 61.9 17.65 13.2L61.24 493h18.87L64.89 388.3l13.22-17.6-32.93-54.9zm85.96 7.4-28.2 57.5 15.1 17-6.7 95.3H130l6.8-95.3 15.9-14.2-21.6-60.3zM268 355.5l-19.5 68.4 19.4 15.2 5.8 53.9h18.9l-5.9-54.3 16.8-21.6c-11.9-20.5-23.7-41-35.5-61.6zm143.6.1-18.9 68.6 20.3 15.5 6.2 53.3H438l-6.4-55.2 16-20.9z" />
              </svg>
            </div>
          )}
        </div>

        {/* Right Side - Party Information */}
        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "40px 40px 40px 20px",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Header Section */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Party Name with Enhanced Drop Cap */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  marginRight: "6px",
                  marginTop: "12px",
                  display: "flex",
                }}
              >
                <span
                  style={{
                    fontSize: "100px",
                    fontFamily: "Solbera Imitation",
                    color: "hsl(29, 16.54%, 24.90%)",
                    lineHeight: "0.8",
                    display: "block",
                  }}
                >
                  {party.name[0]}
                </span>
              </div>
              <div style={{ flex: 1, paddingTop: "8px", display: "flex", flexDirection: "column" }}>
                <h1
                  style={{
                    fontSize: "52px",
                    fontFamily: "Mr Eaves Small Caps",
                    color: "hsl(29, 16.54%, 24.90%)",
                    margin: 0,
                    lineHeight: "1.1",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontWeight: "normal",
                    display: "block",
                  }}
                >
                  {party.name.slice(1)}
                </h1>
              </div>
            </div>

            {/* Level Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "hsl(30, 33.87%, 48.63%)",
                borderRadius: "8px",
                padding: "12px 24px",
                marginBottom: "32px",
                marginTop: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontFamily: "Zatanna Misdirection",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                Level {party.level}
              </span>
            </div>

            {/* DM Info */}
            {dmedBy.length > 0 ? (
              <div
                style={{
                  marginBottom: "32px",
                  padding: "16px 24px",
                  backgroundColor: "hsla(30, 33.87%, 48.63%, 0.1)",
                  borderRadius: "0 8px 8px 0",
                  borderLeft: "4px solid hsl(30, 33.87%, 48.63%)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span
                    style={{
                      fontSize: "22px",
                      fontFamily: "Bookinsanity",
                      color: "hsl(30, 33.87%, 48.63%)",
                      fontWeight: "bold",
                      display: "block",
                    }}
                  >
                    DM&apos;d by:
                  </span>
                  <span
                    style={{
                      fontSize: "22px",
                      fontFamily: "Bookinsanity",
                      color: "hsl(29, 16.54%, 30%)",
                      fontWeight: "normal",
                      display: "block",
                    }}
                  >
                    {dmedBy.map((dm) => dm.users.name).join(", ")}
                  </span>
                </div>
              </div>
            ) : null}

            {/* About Section */}
            {party.about && party.about.length > 0 ? (
              <div style={{ display: "flex", marginBottom: "40px" }}>
                <p
                  style={{
                    fontSize: "24px",
                    fontFamily: "Bookinsanity",
                    color: "hsl(29, 16.54%, 24.90%)",
                    margin: 0,
                    lineHeight: "1.5",
                    display: "block",
                    lineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontWeight: "normal",
                  }}
                >
                  {party.about}
                </p>
              </div>
            ) : null}
          </div>

          {/* Enhanced Stats Section */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "flex-start",
            }}
          >
            {characterCount > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "linear-gradient(135deg, hsl(30, 33.87%, 48.63%) 0%, hsl(30, 33.87%, 42%) 100%)",
                  borderRadius: "8px",
                  padding: "28px 24px",
                  minWidth: "140px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: "56px",
                    fontFamily: "Zatanna Misdirection",
                    color: "white",
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                    lineHeight: "1",
                    display: "block",
                  }}
                >
                  {characterCount}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontFamily: "Bookinsanity",
                    color: "hsla(0, 0%, 100%, 0.9)",
                    margin: 0,
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "normal",
                    display: "block",
                  }}
                >
                  Character{characterCount !== 1 ? "s" : ""}
                </span>
              </div>
            ) : null}

            {campaignCount > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "linear-gradient(135deg, hsl(30, 33.87%, 48.63%) 0%, hsl(30, 33.87%, 42%) 100%)",
                  borderRadius: "8px",
                  padding: "28px 24px",
                  minWidth: "140px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: "56px",
                    fontFamily: "Zatanna Misdirection",
                    color: "white",
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                    lineHeight: "1",
                    display: "block",
                  }}
                >
                  {campaignCount}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontFamily: "Bookinsanity",
                    color: "hsla(0, 0%, 100%, 0.9)",
                    margin: 0,
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "normal",
                    display: "block",
                  }}
                >
                  Campaign{campaignCount !== 1 ? "s" : ""}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
      fonts: [
        {
          name: "Mr Eaves Small Caps",
          data: await headingsFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Bookinsanity",
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
        {
          name: "Solbera Imitation",
          data: await dropCapsFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}

export async function generateStaticParams() {
  const parties = await getParties();
  if (parties.isErr()) {
    return [];
  }
  return parties.value.map((party) => ({
    shortened: party.shortened,
  }));
}
