import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const imageSchema = z
  .file()
  .max(MAX_FILE_SIZE, {
    error: "File size must be 10MB or less.",
  })
  .mime(ALLOWED_MIME_TYPES, {
    error: "File must be an image.",
  });
