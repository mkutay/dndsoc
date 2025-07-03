import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageUrl: string }> }
) {
  try {
    const { imageUrl } = await params;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl parameter is required" },
        { status: 400 }
      );
    }

    // Validate that the imageUrl is a valid URL
    try {
      new URL(imageUrl);
    } catch (urlError) {
      console.error("Invalid imageUrl:", imageUrl, urlError);
      return NextResponse.json(
        { error: "Invalid imageUrl provided" },
        { status: 400 }
      );
    }

    // Fetch the image and convert to buffer
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Generate placeholder using getPlaiceholder
    const placeholder = await getPlaiceholder(buffer);

    // Return the base64 blur data URL
    return NextResponse.json({
      base64: placeholder.base64,
      width: placeholder.metadata.width,
      height: placeholder.metadata.height,
    });

  } catch (error) {
    console.error("Error generating blur-sm placeholder:", error);
    return NextResponse.json(
      { error: "Internal server error while generating blur-sm placeholder" },
      { status: 500 }
    );
  }
}